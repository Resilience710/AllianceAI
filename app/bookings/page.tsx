'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { format, isAfter, isBefore } from 'date-fns'
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  Eye, 
  Edit, 
  XCircle,
  Filter,
  Search,
  ChevronRight,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/components/auth/AuthProvider'
import { db } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types/booking'

interface BookingWithDetails extends Booking {
  serviceTitle?: string
  clientName?: string
  providerName?: string
}

export default function BookingsPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [bookings, setBookings] = React.useState<BookingWithDetails[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [activeTab, setActiveTab] = React.useState('upcoming')

  React.useEffect(() => {
    if (!user || !profile) return

    const isProvider = profile.role === 'provider'
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where(isProvider ? 'providerId' : 'clientId', '==', user.uid),
      orderBy('startTime', 'desc')
    )

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingsList: BookingWithDetails[] = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            clientId: data.clientId,
            providerId: data.providerId,
            serviceId: data.serviceId,
            startTime: data.startTime,
            endTime: data.endTime,
            status: data.status,
            priceUsd: data.priceUsd,
            paymentIntentId: data.paymentIntentId,
            timezone: data.timezone,
            title: data.title,
            description: data.description,
            serviceTitle: data.serviceTitle || data.title,
            clientName: data.clientName || 'Client',
            providerName: data.providerName || 'Provider',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          }
        })
        setBookings(bookingsList)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching bookings:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, profile])

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'no_show':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'rescheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filterBookings = (tab: string) => {
    const now = new Date()
    let filtered = bookings

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.providerName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Filter by tab
    switch (tab) {
      case 'upcoming':
        return filtered.filter(booking => 
          ['confirmed', 'pending_payment'].includes(booking.status) &&
          isAfter(booking.startTime.toDate(), now)
        )
      case 'past':
        return filtered.filter(booking => 
          ['completed', 'no_show'].includes(booking.status) ||
          (isBefore(booking.startTime.toDate(), now) && booking.status !== 'cancelled')
        )
      case 'cancelled':
        return filtered.filter(booking => booking.status === 'cancelled')
      case 'pending':
        return filtered.filter(booking => booking.status === 'pending_payment')
      default:
        return filtered
    }
  }

  const handleViewBooking = (bookingId: string) => {
    router.push(`/booking/${bookingId}`)
  }

  const handleReschedule = (bookingId: string) => {
    router.push(`/booking/${bookingId}?action=reschedule`)
  }

  const handleCancel = (bookingId: string) => {
    router.push(`/booking/${bookingId}?action=cancel`)
  }

  const handleMessage = (booking: BookingWithDetails) => {
    const otherUserId = profile?.role === 'provider' ? booking.clientId : booking.providerId
    router.push(`/messages?user=${otherUserId}&booking=${booking.id}`)
  }

  const BookingCard = ({ booking }: { booking: BookingWithDetails }) => {
    const startTime = booking.startTime.toDate()
    const endTime = booking.endTime.toDate()
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    const isProvider = profile?.role === 'provider'
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewBooking(booking.id)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{booking.title}</h3>
                <Badge className={cn('text-xs', getStatusColor(booking.status))}>
                  {booking.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {booking.serviceTitle && booking.serviceTitle !== booking.title && (
                  <span>Service: {booking.serviceTitle} • </span>
                )}
                {isProvider ? `Client: ${booking.clientName}` : `Provider: ${booking.providerName}`}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(startTime, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${booking.priceUsd}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{duration} min</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewBooking(booking.id)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              {['confirmed', 'pending_payment'].includes(booking.status) && isAfter(startTime, new Date()) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReschedule(booking.id)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancel(booking.id)
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleMessage(booking)
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const upcomingCount = filterBookings('upcoming').length
  const pastCount = filterBookings('past').length
  const cancelledCount = filterBookings('cancelled').length
  const pendingCount = filterBookings('pending').length

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.role === 'provider' ? 'Client Bookings' : 'My Bookings'}
            </h1>
            <p className="text-muted-foreground">
              {profile?.role === 'provider' 
                ? 'Manage appointments with your clients'
                : 'View and manage your booked appointments'
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters</span>
              </div>
              
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending_payment">Pending Payment</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingCount})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastCount})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledCount})
            </TabsTrigger>
          </TabsList>

          {['upcoming', 'past', 'pending', 'cancelled'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filterBookings(tab).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No {tab} bookings</h3>
                    <p className="text-muted-foreground text-center">
                      {tab === 'upcoming' && "You don't have any upcoming appointments."}
                      {tab === 'past' && "No completed or past appointments to show."}
                      {tab === 'pending' && "No bookings pending payment."}
                      {tab === 'cancelled' && "No cancelled appointments."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filterBookings(tab).map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
