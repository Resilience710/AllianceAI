'use client'

import * as React from 'react'
import { format, isAfter, isBefore, addHours } from 'date-fns'
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  AlertTriangle,
  Eye,
  Edit,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types/booking'

interface BookingManagementProps {
  bookings: Booking[]
  userRole: 'client' | 'provider'
  onBookingAction: (bookingId: string, action: BookingAction, data?: any) => Promise<void>
  onReschedule: (bookingId: string, newStartTime: Date, newEndTime: Date, reason?: string) => Promise<void>
  onCancel: (bookingId: string, reason: string) => Promise<void>
  onRefund: (bookingId: string) => Promise<void>
}

type BookingAction = 'accept' | 'decline' | 'complete' | 'no_show' | 'reschedule' | 'cancel'

interface RescheduleModalData {
  bookingId: string
  currentStart: Date
  currentEnd: Date
}

export function BookingManagement({
  bookings,
  userRole,
  onBookingAction,
  onReschedule,
  onCancel,
  onRefund
}: BookingManagementProps) {
  const [selectedTab, setSelectedTab] = React.useState('upcoming')
  const [rescheduleModal, setRescheduleModal] = React.useState<RescheduleModalData | null>(null)
  const [cancelModal, setCancelModal] = React.useState<string | null>(null)
  const [cancelReason, setCancelReason] = React.useState('')
  const [rescheduleData, setRescheduleData] = React.useState({
    newDate: '',
    newTime: '',
    reason: ''
  })

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no_show':
        return 'bg-gray-100 text-gray-800'
      case 'rescheduled':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'pending_payment':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      case 'no_show':
        return <AlertTriangle className="h-4 w-4" />
      case 'rescheduled':
        return <RotateCcw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filterBookings = (status: string) => {
    const now = new Date()
    
    switch (status) {
      case 'upcoming':
        return bookings.filter(booking => 
          ['confirmed', 'pending_payment'].includes(booking.status) &&
          isAfter(booking.startTime.toDate(), now)
        )
      case 'past':
        return bookings.filter(booking => 
          ['completed', 'no_show'].includes(booking.status) ||
          (isBefore(booking.startTime.toDate(), now) && booking.status !== 'cancelled')
        )
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled')
      case 'pending':
        return bookings.filter(booking => booking.status === 'pending_payment')
      default:
        return bookings
    }
  }

  const canCancelBooking = (booking: Booking) => {
    const now = new Date()
    const bookingStart = booking.startTime.toDate()
    const cancellationDeadline = addHours(bookingStart, -24) // 24 hours before
    
    return isAfter(cancellationDeadline, now) && 
           ['confirmed', 'pending_payment'].includes(booking.status)
  }

  const canRescheduleBooking = (booking: Booking) => {
    const now = new Date()
    const bookingStart = booking.startTime.toDate()
    
    return isAfter(bookingStart, now) && 
           ['confirmed', 'pending_payment'].includes(booking.status)
  }

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModal || !rescheduleData.newDate || !rescheduleData.newTime) return
    
    const newDateTime = new Date(`${rescheduleData.newDate}T${rescheduleData.newTime}`)
    const duration = rescheduleModal.currentEnd.getTime() - rescheduleModal.currentStart.getTime()
    const newEndTime = new Date(newDateTime.getTime() + duration)
    
    try {
      await onReschedule(
        rescheduleModal.bookingId,
        newDateTime,
        newEndTime,
        rescheduleData.reason
      )
      setRescheduleModal(null)
      setRescheduleData({ newDate: '', newTime: '', reason: '' })
    } catch (error) {
      console.error('Failed to reschedule booking:', error)
    }
  }

  const handleCancelSubmit = async () => {
    if (!cancelModal || !cancelReason.trim()) return
    
    try {
      await onCancel(cancelModal, cancelReason)
      setCancelModal(null)
      setCancelReason('')
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const startTime = booking.startTime.toDate()
    const endTime = booking.endTime.toDate()
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{booking.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {userRole === 'provider' ? 'Client' : 'Provider'}: 
                {userRole === 'provider' ? booking.clientId : booking.providerId}
              </CardDescription>
            </div>
            <Badge className={cn('flex items-center gap-1', getStatusColor(booking.status))}>
              {getStatusIcon(booking.status)}
              {booking.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
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
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>{duration} minutes</span>
            </div>
          </div>
          
          {booking.description && (
            <div className="text-sm text-muted-foreground">
              <p className="line-clamp-2">{booking.description}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
            
            {canRescheduleBooking(booking) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRescheduleModal({
                  bookingId: booking.id,
                  currentStart: startTime,
                  currentEnd: endTime
                })}
              >
                <Edit className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
            )}
            
            {canCancelBooking(booking) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCancelModal(booking.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
            
            {userRole === 'provider' && booking.status === 'confirmed' && isAfter(new Date(), startTime) && (
              <>
                <Button 
                  size="sm"
                  onClick={() => onBookingAction(booking.id, 'complete')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onBookingAction(booking.id, 'no_show')}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  No Show
                </Button>
              </>
            )}
            
            {booking.status === 'cancelled' && booking.priceUsd > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onRefund(booking.id)}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Process Refund
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Bookings</h2>
          <p className="text-muted-foreground">
            Manage your {userRole === 'provider' ? 'client appointments' : 'booked sessions'}
          </p>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">
            Upcoming ({filterBookings('upcoming').length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({filterBookings('past').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({filterBookings('cancelled').length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filterBookings('pending').length})
          </TabsTrigger>
        </TabsList>
        
        {['upcoming', 'past', 'cancelled', 'pending'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterBookings(tab).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No {tab} bookings</h3>
                  <p className="text-muted-foreground text-center">
                    {tab === 'upcoming' && "You don't have any upcoming appointments."}
                    {tab === 'past' && "No completed or past appointments to show."}
                    {tab === 'cancelled' && "No cancelled appointments."}
                    {tab === 'pending' && "No bookings pending payment."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filterBookings(tab).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Reschedule Modal */}
      <Dialog open={!!rescheduleModal} onOpenChange={() => setRescheduleModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Choose a new date and time for this appointment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newDate">New Date</Label>
                <Input
                  id="newDate"
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, newDate: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newTime">New Time</Label>
                <Input
                  id="newTime"
                  type="time"
                  value={rescheduleData.newTime}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, newTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rescheduleReason">Reason for Rescheduling</Label>
              <Textarea
                id="rescheduleReason"
                value={rescheduleData.reason}
                onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Optional: Explain why you need to reschedule..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRescheduleModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleRescheduleSubmit}>
                Reschedule Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Modal */}
      <Dialog open={!!cancelModal} onOpenChange={() => setCancelModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this appointment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Cancelling within 24 hours may result in cancellation fees. 
                Refunds will be processed according to our cancellation policy.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Reason for Cancellation *</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please explain why you need to cancel..."
                rows={3}
                required
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCancelModal(null)}>
                Keep Appointment
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelSubmit}
                disabled={!cancelReason.trim()}
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
