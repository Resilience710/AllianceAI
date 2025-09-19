'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock service data
const mockService = {
  id: 1,
  title: "Custom AI Agent Development",
  provider: "AI Solutions Pro",
  price: 5000,
  duration: "2-4 weeks",
  description: "Tailored AI agents for your specific business needs",
  features: [
    "Custom AI model development",
    "Integration with existing systems",
    "Comprehensive training & documentation",
    "3 months of support included"
  ]
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    projectDetails: '',
    timeline: '',
    budget: '',
    contactMethod: '',
    preferredDate: '',
    additionalRequirements: ''
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: ''
  })

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleBooking = () => {
    // In a real app, this would process payment and create booking
    console.log('Booking:', { bookingData, paymentData })
    setStep(4) // Success step
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Book Service</h1>
          <p className="text-gray-600">Complete your booking for {mockService.title}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {step} of 3
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Tell us about your project requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="project-details">Project Description</Label>
                    <Textarea
                      id="project-details"
                      placeholder="Describe your project, goals, and specific requirements..."
                      value={bookingData.projectDetails}
                      onChange={(e) => setBookingData({...bookingData, projectDetails: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Preferred Timeline</Label>
                      <Select onValueChange={(value) => setBookingData({...bookingData, timeline: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP</SelectItem>
                          <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                          <SelectItem value="1month">Within 1 month</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select onValueChange={(value) => setBookingData({...bookingData, budget: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k+">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-method">Preferred Contact Method</Label>
                    <Select onValueChange={(value) => setBookingData({...bookingData, contactMethod: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="How would you like to be contacted?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="message">Platform Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional">Additional Requirements</Label>
                    <Textarea
                      id="additional"
                      placeholder="Any specific technologies, integrations, or constraints..."
                      value={bookingData.additionalRequirements}
                      onChange={(e) => setBookingData({...bookingData, additionalRequirements: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleNext} className="w-full" disabled={!bookingData.projectDetails}>
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>Secure payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Secure Payment</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your payment information is encrypted and secure. We use industry-standard security measures.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholder-name">Cardholder Name</Label>
                    <Input
                      id="cardholder-name"
                      placeholder="John Doe"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-address">Billing Address</Label>
                    <Textarea
                      id="billing-address"
                      placeholder="123 Main St, City, State, ZIP"
                      value={paymentData.billingAddress}
                      onChange={(e) => setPaymentData({...paymentData, billingAddress: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleBooking} className="flex-1">
                      Complete Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Your booking has been successfully submitted. The provider will contact you within 24 hours to discuss next steps.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-2">Booking Details</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Service:</strong> {mockService.title}</p>
                      <p><strong>Provider:</strong> {mockService.provider}</p>
                      <p><strong>Amount:</strong> ${mockService.price.toLocaleString()}</p>
                      <p><strong>Booking ID:</strong> #BK-2024-001</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/messages">Message Provider</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{mockService.title}</h3>
                    <p className="text-sm text-gray-600">by {mockService.provider}</p>
                  </div>
                  <p className="text-sm text-gray-600">{mockService.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span>{mockService.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Starting Price:</span>
                      <span className="font-semibold">${mockService.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockService.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about this service? Our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
