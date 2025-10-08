'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Bot, Star, MessageCircle, Calendar, Clock, CheckCircle, Users, Award, Globe, MapPin, Mail, Phone, ArrowLeft, Video, AlertCircle } from 'lucide-react'
import RequireAuth from '@/components/auth/RequireAuth'
import { useAuth } from '@/components/auth/AuthProvider'
import { ReviewSystem } from '@/components/reviews/ReviewSystem'
import { AvailabilityCalendar } from '@/components/booking/AvailabilityCalendar'
import { BookingModal } from '@/components/booking/BookingModal'
import { useParams } from 'next/navigation'
import type { ProviderAvailability, AvailableSlot, BookingRequest, CalendarEvent } from '@/types/booking'

interface ProviderProfile {
  id: string
  uid: string
  displayName: string
  email: string
  role: string
  bio: string
  skills: string[]
  location: string
  profilePicture: string
  verified: boolean
  memberSince: any
  services: any[]
  reviews: any[]
  rating: number
  reviewCount: number
  totalProjects: number
  responseTime: string
  hourlyRate?: number
  availability?: any
  portfolio: any[]
  certifications: any[]
  languages: string[]
  timezone: string
  experience: string
  specializations: string[]
  createdAt: any
  updatedAt: any
}

export default function ProviderProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [provider, setProvider] = useState<ProviderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [availability, setAvailability] = useState<ProviderAvailability | null>(null)
  const [existingBookings, setExistingBookings] = useState<CalendarEvent[]>([])

  // Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      if (!params.id) return
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/providers/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Provider not found')
          } else {
            setError('Failed to load provider profile')
          }
          return
        }
        
        const providerData = await response.json()
        setProvider(providerData)
      } catch (err) {
        console.error('Error fetching provider:', err)
        setError('Failed to load provider profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [params.id])

  const handleBookAppointment = (slot: AvailableSlot) => {
    setSelectedSlot(slot)
    setBookingModalOpen(true)
  }

  const handleBookingConfirm = async (bookingRequest: BookingRequest) => {
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      })

      if (response.ok) {
        setBookingModalOpen(false)
        setSelectedSlot(null)
        // Refresh bookings
        await fetchExistingBookings()
      } else {
        console.error('Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const fetchExistingBookings = async () => {
    if (!provider?.id) return
    
    try {
      const response = await fetch(`/api/bookings/create?providerId=${provider.id}`)
      if (response.ok) {
        const bookings = await response.json()
        setExistingBookings(bookings.map((booking: any) => ({
          id: booking.id,
          title: booking.title,
          start: booking.startTime.toDate(),
          end: booking.endTime.toDate(),
          status: booking.status
        })))
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchAvailability = async () => {
    if (!provider?.id) return
    
    try {
      // This would fetch from your availability API
      // For now, we'll use a default availability
      setAvailability({
        providerId: provider.id,
        weeklySchedule: {
          monday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
          tuesday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
          wednesday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
          thursday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
          friday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
          saturday: { enabled: false, slots: [] },
          sunday: { enabled: false, slots: [] }
        },
        bufferTime: 15,
        maxBookingsPerDay: 8,
        advanceBookingDays: 30,
        cancellationWindow: 24,
        autoAcceptBookings: true
      } as any)
    } catch (error) {
      console.error('Error fetching availability:', error)
    }
  }

  useEffect(() => {
    if (provider) {
      fetchAvailability()
      fetchExistingBookings()
    }
  }, [provider])

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </RequireAuth>
    )
  }

  if (error || !provider) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl text-red-600">Provider Not Found</CardTitle>
              <CardDescription>
                {error || 'This provider profile does not exist or has been removed.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => router.push('/browse')} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Browse
              </Button>
            </CardContent>
          </Card>
        </div>
      </RequireAuth>
    )
  }

  const formatMemberSince = (date: any) => {
    if (!date) return 'Recently joined'
    try {
      if (date.toDate) {
        return `Member since ${date.toDate().getFullYear()}`
      }
      return `Member since ${new Date(date).getFullYear()}`
    } catch {
      return 'Recently joined'
    }
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                {user?.uid !== provider.uid && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/messages?provider=${provider.uid}`)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                    <Button
                      onClick={() => router.push(`/video-call/new?provider=${provider.uid}`)}
                      className="flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Video Call
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Provider Header */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={provider.profilePicture} alt={provider.displayName} />
                      <AvatarFallback className="text-lg">
                        {provider.displayName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">{provider.displayName}</h1>
                        {provider.verified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{provider.rating.toFixed(1)}</span>
                          <span>({provider.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{provider.totalProjects} projects</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{provider.responseTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {provider.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{provider.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatMemberSince(provider.memberSince)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="book">Book Appointment</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* About */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {provider.bio || 'No description available.'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  {provider.skills && provider.skills.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills & Expertise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {provider.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviews & Ratings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                        <p className="text-gray-600">
                          This provider hasn't received any reviews yet.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Services Offered</CardTitle>
                      <CardDescription>
                        Professional services provided by {provider.displayName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {provider.services && provider.services.length > 0 ? (
                        <div className="grid gap-4">
                          {provider.services.map((service, index) => (
                            <Card key={service.id || index} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-lg">{service.title}</h3>
                                  <Badge variant="outline">{service.category}</Badge>
                                </div>
                                <p className="text-gray-600 mb-3">{service.shortDescription}</p>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-lg text-blue-600">
                                    {service.price ? `$${service.price}` : 'Contact for pricing'}
                                  </span>
                                  <Button size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No services listed</h3>
                          <p className="text-gray-600">
                            This provider hasn't added any services yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio</CardTitle>
                      <CardDescription>
                        Previous work and projects by {provider.displayName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {provider.portfolio && provider.portfolio.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                          {provider.portfolio.map((item, index) => (
                            <Card key={index} className="border border-gray-200">
                              <CardContent className="p-4">
                                <h3 className="font-semibold mb-2">{item.name || `Portfolio Item ${index + 1}`}</h3>
                                <p className="text-gray-600 text-sm">
                                  {item.description || 'No description available'}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No portfolio items</h3>
                          <p className="text-gray-600">
                            This provider hasn't uploaded any portfolio items yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="book" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Book an Appointment</CardTitle>
                      <CardDescription>
                        Select an available time slot to book a consultation with {provider.displayName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {availability ? (
                        <AvailabilityCalendar
                          availability={availability}
                          existingBookings={existingBookings}
                          onSlotSelect={handleBookAppointment}
                          selectedSlot={selectedSlot || undefined}
                          clientTimezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                          showPricing={true}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No availability set</h3>
                          <p className="text-muted-foreground">
                            This provider hasn't configured their availability yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{provider.email}</span>
                  </div>
                  {provider.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{provider.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{provider.timezone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              {provider.hourlyRate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        ${provider.hourlyRate}
                      </div>
                      <div className="text-sm text-gray-600">per hour</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {provider.languages && provider.languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {provider.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false)
            setSelectedSlot(null)
          }}
          slot={selectedSlot}
          providerId={provider.uid}
          providerName={provider.displayName}
          basePrice={provider.hourlyRate || 100}
          requiresPayment={true}
          onBookingConfirm={handleBookingConfirm}
        />
      </div>
    </RequireAuth>
  )
}
