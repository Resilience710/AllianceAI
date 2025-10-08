import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createBookingRefund, calculateCancellationRefund } from '@/lib/stripe'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id

    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId))
    
    if (!bookingDoc.exists()) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
      startTime: bookingDoc.data()?.startTime?.toDate?.()?.toISOString(),
      endTime: bookingDoc.data()?.endTime?.toDate?.()?.toISOString(),
      createdAt: bookingDoc.data()?.createdAt?.toDate?.()?.toISOString(),
      updatedAt: bookingDoc.data()?.updatedAt?.toDate?.()?.toISOString()
    }

    return NextResponse.json({ booking })

  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id
    const body = await request.json()
    const { action, ...data } = body

    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId))
    
    if (!bookingDoc.exists()) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingDoc.data()
    const bookingRef = doc(db, 'bookings', bookingId)

    switch (action) {
      case 'cancel':
        return await handleCancelBooking(bookingRef, booking, data)
      
      case 'reschedule':
        return await handleRescheduleBooking(bookingRef, booking, data)
      
      case 'complete':
        return await handleCompleteBooking(bookingRef, booking)
      
      case 'no_show':
        return await handleNoShowBooking(bookingRef, booking)
      
      case 'confirm_payment':
        return await handleConfirmPayment(bookingRef, booking, data)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleCancelBooking(bookingRef: any, booking: any, data: any) {
  const { reason, userId } = data
  
  if (!reason) {
    return NextResponse.json(
      { error: 'Cancellation reason is required' },
      { status: 400 }
    )
  }

  // Calculate refund if applicable
  let refundResult = null
  if (booking.paymentIntentId && booking.priceUsd > 0) {
    const bookingStart = new Date(booking.startTime.toDate())
    const now = new Date()
    const hoursUntilBooking = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    const refundCalculation = calculateCancellationRefund(
      booking.priceUsd,
      hoursUntilBooking,
      'moderate' // Default policy
    )
    
    if (refundCalculation.refundAmount > 0) {
      try {
        refundResult = await createBookingRefund(
          booking.paymentIntentId,
          refundCalculation.refundAmount,
          'requested_by_customer'
        )
      } catch (refundError) {
        console.error('Refund failed:', refundError)
        // Continue with cancellation even if refund fails
      }
    }
  }

  // Update booking status
  await updateDoc(bookingRef, {
    status: 'cancelled',
    cancellationReason: reason,
    cancelledBy: userId,
    cancelledAt: serverTimestamp(),
    refundId: refundResult?.id || null,
    refundAmount: refundResult ? refundResult.amount / 100 : 0,
    updatedAt: serverTimestamp()
  })

  // Add system message
  await addDoc(collection(db, 'bookingMessages'), {
    bookingId: booking.id,
    senderId: 'system',
    senderName: 'AllianceAI',
    message: `Booking cancelled: ${reason}${refundResult ? `\nRefund of $${refundResult.amount / 100} processed.` : ''}`,
    timestamp: serverTimestamp(),
    type: 'system'
  })

  return NextResponse.json({
    success: true,
    status: 'cancelled',
    refund: refundResult ? {
      id: refundResult.id,
      amount: refundResult.amount / 100,
      status: refundResult.status
    } : null
  })
}

async function handleRescheduleBooking(bookingRef: any, booking: any, data: any) {
  const { newStartTime, newEndTime, reason, requestedBy } = data
  
  if (!newStartTime || !newEndTime) {
    return NextResponse.json(
      { error: 'New start and end times are required' },
      { status: 400 }
    )
  }

  const newStart = new Date(newStartTime)
  const newEnd = new Date(newEndTime)
  
  // Validate new time is in the future
  if (newStart <= new Date()) {
    return NextResponse.json(
      { error: 'New booking time must be in the future' },
      { status: 400 }
    )
  }

  // Store reschedule history
  const rescheduleEntry = {
    originalStartTime: booking.startTime,
    originalEndTime: booking.endTime,
    newStartTime: newStart,
    newEndTime: newEnd,
    requestedBy,
    reason: reason || '',
    timestamp: serverTimestamp()
  }

  const currentHistory = booking.rescheduleHistory || []

  // Update booking
  await updateDoc(bookingRef, {
    startTime: newStart,
    endTime: newEnd,
    status: 'confirmed',
    rescheduleHistory: [...currentHistory, rescheduleEntry],
    updatedAt: serverTimestamp()
  })

  // Add system message
  await addDoc(collection(db, 'bookingMessages'), {
    bookingId: booking.id,
    senderId: 'system',
    senderName: 'AllianceAI',
    message: `Booking rescheduled by ${requestedBy}\nNew time: ${newStart.toLocaleString()}${reason ? `\nReason: ${reason}` : ''}`,
    timestamp: serverTimestamp(),
    type: 'system'
  })

  return NextResponse.json({
    success: true,
    status: 'confirmed',
    newStartTime: newStart.toISOString(),
    newEndTime: newEnd.toISOString()
  })
}

async function handleCompleteBooking(bookingRef: any, booking: any) {
  await updateDoc(bookingRef, {
    status: 'completed',
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  // Add system message
  await addDoc(collection(db, 'bookingMessages'), {
    bookingId: booking.id,
    senderId: 'system',
    senderName: 'AllianceAI',
    message: 'Booking marked as completed',
    timestamp: serverTimestamp(),
    type: 'system'
  })

  // TODO: Trigger payout to provider
  // This would typically initiate a Stripe transfer to the provider's account

  return NextResponse.json({
    success: true,
    status: 'completed'
  })
}

async function handleNoShowBooking(bookingRef: any, booking: any) {
  await updateDoc(bookingRef, {
    status: 'no_show',
    noShowAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  // Add system message
  await addDoc(collection(db, 'bookingMessages'), {
    bookingId: booking.id,
    senderId: 'system',
    senderName: 'AllianceAI',
    message: 'Booking marked as no-show',
    timestamp: serverTimestamp(),
    type: 'system'
  })

  return NextResponse.json({
    success: true,
    status: 'no_show'
  })
}

async function handleConfirmPayment(bookingRef: any, booking: any, data: any) {
  const { paymentIntentId } = data
  
  await updateDoc(bookingRef, {
    status: 'confirmed',
    paymentIntentId,
    paymentConfirmedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  // Add system message
  await addDoc(collection(db, 'bookingMessages'), {
    bookingId: booking.id,
    senderId: 'system',
    senderName: 'AllianceAI',
    message: 'Payment confirmed - booking is now confirmed',
    timestamp: serverTimestamp(),
    type: 'system'
  })

  return NextResponse.json({
    success: true,
    status: 'confirmed'
  })
}
