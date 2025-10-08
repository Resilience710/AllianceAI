'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, DollarSign, User, MessageSquare, CreditCard, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/components/auth/AuthProvider'
import type { AvailableSlot, BookingRequest } from '@/types/booking'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  slot: AvailableSlot | null
  providerId: string
  providerName: string
  serviceId?: string
  serviceName?: string
  basePrice?: number
  requiresPayment?: boolean
  onBookingConfirm: (booking: BookingRequest) => Promise<void>
}

export function BookingModal({
  isOpen,
  onClose,
  slot,
  providerId,
  providerName,
  serviceId,
  serviceName,
  basePrice = 0,
  requiresPayment = false,
  onBookingConfirm
}: BookingModalProps) {
  const { user } = useAuth()
  const [step, setStep] = React.useState<'details' | 'payment' | 'confirmation'>('details')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [bookingDetails, setBookingDetails] = React.useState({
    title: serviceName || 'Consultation',
    description: '',
    specialRequests: ''
  })

  const [paymentDetails, setPaymentDetails] = React.useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: ''
  })

  const totalPrice = slot?.price || basePrice
  const platformFee = Math.round(totalPrice * 0.029) // 2.9% platform fee
  const finalAmount = totalPrice + platformFee

  React.useEffect(() => {
    if (isOpen && slot) {
      setStep('details')
      setError(null)
      setBookingDetails(prev => ({
        ...prev,
        title: serviceName || 'Consultation'
      }))
    }
  }, [isOpen, slot, serviceName])

  const handleDetailsSubmit = () => {
    if (!bookingDetails.title.trim()) {
      setError('Please provide a title for your booking')
      return
    }
    
    if (requiresPayment && totalPrice > 0) {
      setStep('payment')
    } else {
      handleBookingSubmit()
    }
  }

  const handlePaymentSubmit = () => {
    // Validate payment details
    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.nameOnCard) {
      setError('Please fill in all payment details')
      return
    }
    
    handleBookingSubmit()
  }

  const handleBookingSubmit = async () => {
    if (!slot || !user) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const bookingRequest: BookingRequest = {
        serviceId,
        providerId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        title: bookingDetails.title,
        description: `${bookingDetails.description}\n\nSpecial requests: ${bookingDetails.specialRequests}`.trim(),
        priceUsd: finalAmount,
        requiresPayment
      }
      
      await onBookingConfirm(bookingRequest)
      setStep('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy \'at\' h:mm a')
  }

  const formatDuration = (start: Date, end: Date) => {
    const duration = (end.getTime() - start.getTime()) / (1000 * 60)
    return `${duration} minutes`
  }

  if (!slot) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'details' && 'Book Appointment'}
            {step === 'payment' && 'Payment Details'}
            {step === 'confirmation' && 'Booking Confirmed!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'details' && 'Provide details for your appointment'}
            {step === 'payment' && 'Complete your payment to confirm the booking'}
            {step === 'confirmation' && 'Your appointment has been successfully booked'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Booking Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{providerName}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDateTime(slot.startTime)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDuration(slot.startTime, slot.endTime)}</span>
            </div>
            
            {serviceName && (
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{serviceName}</span>
              </div>
            )}
            
            {requiresPayment && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Total Amount</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${finalAmount}</div>
                  <div className="text-xs text-muted-foreground">
                    Service: ${totalPrice} + Platform fee: ${platformFee}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step Content */}
        {step === 'details' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Appointment Title *</Label>
              <Input
                id="title"
                value={bookingDetails.title}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., AI Strategy Consultation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bookingDetails.description}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you'd like to discuss or achieve in this session..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                value={bookingDetails.specialRequests}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any specific requirements or preparations needed..."
                rows={2}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleDetailsSubmit}>
                {requiresPayment && totalPrice > 0 ? 'Continue to Payment' : 'Book Appointment'}
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Your payment will be processed securely through Stripe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card *</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentDetails.nameOnCard}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, nameOnCard: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Service Fee</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Platform Fee (2.9%)</span>
                    <span>${platformFee}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>${finalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button onClick={handlePaymentSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : `Pay $${finalAmount}`}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your appointment with {providerName} has been successfully booked.
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-medium">{formatDateTime(slot.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{formatDuration(slot.startTime, slot.endTime)}</span>
                  </div>
                  {requiresPayment && (
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span className="font-medium">${finalAmount}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 Confirmation email sent to your inbox</p>
              <p>📅 Calendar invite will be sent shortly</p>
              <p>💬 You can message the provider anytime</p>
            </div>
            
            <div className="flex justify-center gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => window.open('/dashboard', '_blank')}>
                View in Dashboard
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
