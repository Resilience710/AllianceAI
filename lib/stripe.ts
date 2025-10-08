import Stripe from 'stripe'

// Initialize Stripe with secret key (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  currency: 'usd',
  platformFeePercent: 0.029, // 2.9% platform fee
  stripeFeePercent: 0.029, // Stripe's fee
  fixedFee: 0.30, // Stripe's fixed fee in USD
}

// Calculate fees for a booking
export function calculateBookingFees(amount: number) {
  const platformFee = Math.round(amount * STRIPE_CONFIG.platformFeePercent * 100) / 100
  const stripeFee = Math.round((amount * STRIPE_CONFIG.stripeFeePercent + STRIPE_CONFIG.fixedFee) * 100) / 100
  const totalFees = platformFee + stripeFee
  const netAmount = amount - totalFees
  
  return {
    originalAmount: amount,
    platformFee,
    stripeFee,
    totalFees,
    netAmount,
    totalCharged: amount + platformFee // What client pays
  }
}

// Create payment intent for booking
export async function createBookingPaymentIntent(
  amount: number,
  bookingId: string,
  clientId: string,
  providerId: string,
  metadata?: Record<string, string>
) {
  const fees = calculateBookingFees(amount)
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(fees.totalCharged * 100), // Convert to cents
    currency: STRIPE_CONFIG.currency,
    metadata: {
      bookingId,
      clientId,
      providerId,
      originalAmount: amount.toString(),
      platformFee: fees.platformFee.toString(),
      type: 'booking',
      ...metadata
    },
    automatic_payment_methods: {
      enabled: true,
    },
  })
  
  return {
    paymentIntent,
    fees
  }
}

// Create refund for cancelled booking
export async function createBookingRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount specified
    reason: reason as Stripe.RefundCreateParams.Reason || 'requested_by_customer',
    metadata: {
      type: 'booking_cancellation',
      timestamp: new Date().toISOString()
    }
  })
  
  return refund
}

// Transfer funds to provider (after booking completion)
export async function transferToProvider(
  amount: number,
  providerId: string,
  bookingId: string,
  stripeAccountId: string
) {
  const fees = calculateBookingFees(amount)
  
  const transfer = await stripe.transfers.create({
    amount: Math.round(fees.netAmount * 100), // Provider gets amount minus fees
    currency: STRIPE_CONFIG.currency,
    destination: stripeAccountId,
    metadata: {
      bookingId,
      providerId,
      type: 'booking_payout',
      originalAmount: amount.toString(),
      platformFee: fees.platformFee.toString()
    }
  })
  
  return transfer
}

// Create Stripe Connect account for provider
export async function createProviderAccount(
  email: string,
  country: string = 'US',
  businessType: 'individual' | 'company' = 'individual'
) {
  const account = await stripe.accounts.create({
    type: 'express',
    country,
    email,
    business_type: businessType,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    settings: {
      payouts: {
        schedule: {
          interval: 'weekly',
          weekly_anchor: 'friday'
        }
      }
    }
  })
  
  return account
}

// Create account link for provider onboarding
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })
  
  return accountLink
}

// Get account status
export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId)
  
  return {
    id: account.id,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
    requirements: account.requirements,
    country: account.country,
    defaultCurrency: account.default_currency
  }
}

// Webhook signature verification
export function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`)
  }
}

// Handle booking payment success
export async function handleBookingPaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId, clientId, providerId } = paymentIntent.metadata
  
  // Update booking status in database
  // This would typically update your booking record to 'confirmed'
  return {
    bookingId,
    clientId,
    providerId,
    amount: paymentIntent.amount / 100,
    status: 'confirmed'
  }
}

// Handle booking payment failure
export async function handleBookingPaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId } = paymentIntent.metadata
  
  // Update booking status in database
  // This would typically update your booking record to 'cancelled' or 'payment_failed'
  return {
    bookingId,
    status: 'payment_failed',
    error: paymentIntent.last_payment_error?.message
  }
}

// Calculate cancellation refund amount based on policy
export function calculateCancellationRefund(
  originalAmount: number,
  hoursUntilBooking: number,
  cancellationPolicy: 'flexible' | 'moderate' | 'strict' = 'moderate'
) {
  let refundPercent = 0
  
  switch (cancellationPolicy) {
    case 'flexible':
      if (hoursUntilBooking >= 24) refundPercent = 1.0      // 100% refund
      else if (hoursUntilBooking >= 2) refundPercent = 0.5  // 50% refund
      else refundPercent = 0                                // No refund
      break
      
    case 'moderate':
      if (hoursUntilBooking >= 48) refundPercent = 1.0      // 100% refund
      else if (hoursUntilBooking >= 24) refundPercent = 0.5 // 50% refund
      else refundPercent = 0                                // No refund
      break
      
    case 'strict':
      if (hoursUntilBooking >= 72) refundPercent = 1.0      // 100% refund
      else if (hoursUntilBooking >= 48) refundPercent = 0.5 // 50% refund
      else refundPercent = 0                                // No refund
      break
  }
  
  const refundAmount = originalAmount * refundPercent
  const cancellationFee = originalAmount - refundAmount
  
  return {
    refundAmount,
    cancellationFee,
    refundPercent,
    policy: cancellationPolicy
  }
}
