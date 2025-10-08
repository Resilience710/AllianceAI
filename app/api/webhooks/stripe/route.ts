import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { verifyWebhookSignature, handleBookingPaymentSuccess, handleBookingPaymentFailure } from '@/lib/stripe'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = verifyWebhookSignature(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent)
        break

      case 'refund.created':
        await handleRefundCreated(event.data.object as Stripe.Refund)
        break

      case 'transfer.created':
        await handleTransferCreated(event.data.object as Stripe.Transfer)
        break

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId, clientId, providerId } = paymentIntent.metadata

  if (!bookingId) {
    console.error('No bookingId in payment intent metadata')
    return
  }

  try {
    // Update booking status to confirmed
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'confirmed',
      paymentIntentId: paymentIntent.id,
      paymentConfirmedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Add system message
    await addDoc(collection(db, 'bookingMessages'), {
      bookingId,
      senderId: 'system',
      senderName: 'AllianceAI',
      message: `Payment successful! Your booking is now confirmed.\nAmount: $${paymentIntent.amount / 100}`,
      timestamp: serverTimestamp(),
      type: 'system'
    })

    // Create notification for both client and provider
    const notifications = [
      {
        userId: clientId,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your payment was successful and your booking is now confirmed.',
        bookingId,
        read: false,
        createdAt: serverTimestamp()
      },
      {
        userId: providerId,
        type: 'booking_received',
        title: 'New Booking Received',
        message: 'You have received a new confirmed booking.',
        bookingId,
        read: false,
        createdAt: serverTimestamp()
      }
    ]

    for (const notification of notifications) {
      await addDoc(collection(db, 'notifications'), notification)
    }

    console.log(`Booking ${bookingId} confirmed after successful payment`)

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId } = paymentIntent.metadata

  if (!bookingId) {
    console.error('No bookingId in payment intent metadata')
    return
  }

  try {
    // Update booking status to cancelled
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled',
      cancellationReason: 'Payment failed',
      paymentFailedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Add system message
    await addDoc(collection(db, 'bookingMessages'), {
      bookingId,
      senderId: 'system',
      senderName: 'AllianceAI',
      message: `Payment failed. Booking has been cancelled.\nReason: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
      timestamp: serverTimestamp(),
      type: 'system'
    })

    console.log(`Booking ${bookingId} cancelled due to payment failure`)

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId } = paymentIntent.metadata

  if (!bookingId) {
    console.error('No bookingId in payment intent metadata')
    return
  }

  try {
    // Update booking status to cancelled
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled',
      cancellationReason: 'Payment cancelled by user',
      paymentCancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Add system message
    await addDoc(collection(db, 'bookingMessages'), {
      bookingId,
      senderId: 'system',
      senderName: 'AllianceAI',
      message: 'Payment was cancelled. Booking has been cancelled.',
      timestamp: serverTimestamp(),
      type: 'system'
    })

    console.log(`Booking ${bookingId} cancelled due to payment cancellation`)

  } catch (error) {
    console.error('Error handling payment cancellation:', error)
  }
}

async function handleRefundCreated(refund: Stripe.Refund) {
  const paymentIntent = await stripe.paymentIntents.retrieve(refund.payment_intent as string)
  const { bookingId, clientId } = paymentIntent.metadata

  if (!bookingId) {
    console.error('No bookingId in payment intent metadata')
    return
  }

  try {
    // Update booking with refund information
    await updateDoc(doc(db, 'bookings', bookingId), {
      refundId: refund.id,
      refundAmount: refund.amount / 100,
      refundStatus: refund.status,
      refundedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Add system message
    await addDoc(collection(db, 'bookingMessages'), {
      bookingId,
      senderId: 'system',
      senderName: 'AllianceAI',
      message: `Refund processed: $${refund.amount / 100}\nStatus: ${refund.status}\nReason: ${refund.reason}`,
      timestamp: serverTimestamp(),
      type: 'system'
    })

    // Create notification for client
    await addDoc(collection(db, 'notifications'), {
      userId: clientId,
      type: 'refund_processed',
      title: 'Refund Processed',
      message: `Your refund of $${refund.amount / 100} has been processed.`,
      bookingId,
      read: false,
      createdAt: serverTimestamp()
    })

    console.log(`Refund ${refund.id} processed for booking ${bookingId}`)

  } catch (error) {
    console.error('Error handling refund:', error)
  }
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  const { bookingId, providerId } = transfer.metadata

  if (!bookingId || !providerId) {
    console.error('Missing bookingId or providerId in transfer metadata')
    return
  }

  try {
    // Update booking with payout information
    await updateDoc(doc(db, 'bookings', bookingId), {
      transferId: transfer.id,
      transferAmount: transfer.amount / 100,
      transferStatus: 'completed',
      payoutAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Add system message
    await addDoc(collection(db, 'bookingMessages'), {
      bookingId,
      senderId: 'system',
      senderName: 'AllianceAI',
      message: `Payout processed: $${transfer.amount / 100}\nTransfer ID: ${transfer.id}`,
      timestamp: serverTimestamp(),
      type: 'system'
    })

    // Create notification for provider
    await addDoc(collection(db, 'notifications'), {
      userId: providerId,
      type: 'payout_processed',
      title: 'Payout Processed',
      message: `Your payout of $${transfer.amount / 100} has been processed.`,
      bookingId,
      read: false,
      createdAt: serverTimestamp()
    })

    console.log(`Transfer ${transfer.id} processed for booking ${bookingId}`)

  } catch (error) {
    console.error('Error handling transfer:', error)
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  // This would typically update provider account status in your database
  console.log(`Account ${account.id} updated:`, {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted
  })

  // You could update the provider's Stripe account status in your database here
  // For example, enable/disable their ability to receive bookings based on account status
}

// Handle GET requests (for webhook endpoint verification)
export async function GET() {
  return NextResponse.json({ message: 'Stripe webhook endpoint' })
}
