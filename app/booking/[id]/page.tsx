'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  MessageSquare, 
  Video,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/components/auth/AuthProvider'
import { db } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types/booking'

interface BookingMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: any
  type: 'message' | 'system'
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const bookingId = params.id as string
  
  const [booking, setBooking] = React.useState<Booking | null>(null)
  const [messages, setMessages] = React.useState<BookingMessage[]>([])
  const [newMessage, setNewMessage] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [clientProfile, setClientProfile] = React.useState<any>(null)
  const [providerProfile, setProviderProfile] = React.useState<any>(null)

  React.useEffect(() => {
    if (!bookingId || !user) return

    const fetchBooking = async () => {
      try {
        const bookingDoc = await getDoc(doc(db, 'bookings', bookingId))
        if (!bookingDoc.exists()) {
          setError('Booking not found')
          return
        }

        const bookingData = { id: bookingDoc.id, ...bookingDoc.data() } as Booking
        
        // Check if user has access to this booking
        if (bookingData.clientId !== user.uid && bookingData.providerId !== user.uid) {
          setError('You do not have access to this booking')
          return
        }

        setBooking(bookingData)

        // Fetch client and provider profiles
        const [clientDoc, providerDoc] = await Promise.all([
          getDoc(doc(db, 'users', bookingData.clientId)),
          getDoc(doc(db, 'users', bookingData.providerId))
        ])

        if (clientDoc.exists()) {
          setClientProfile({ id: clientDoc.id, ...clientDoc.data() })
        }
        if (providerDoc.exists()) {
          setProviderProfile({ id: providerDoc.id, ...providerDoc.data() })
        }

      } catch (err) {
        console.error('Error fetching booking:', err)
        setError('Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId, user])

  React.useEffect(() => {
    if (!bookingId) return

    // Subscribe to booking messages
    const messagesQuery = query(
      collection(db, 'bookingMessages'),
      where('bookingId', '==', bookingId),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList: BookingMessage[] = []
      snapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() } as BookingMessage)
      })
      setMessages(messageList)
    })

    return () => unsubscribe()
  }, [bookingId])

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
        return <AlertCircle className="h-4 w-4" />
      case 'rescheduled':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !booking) return

    try {
      await addDoc(collection(db, 'bookingMessages'), {
        bookingId: booking.id,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        type: 'message'
      })
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Booking not found'}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const isClient = user?.uid === booking.clientId
  const otherParty = isClient ? providerProfile : clientProfile
  const startTime = booking.startTime.toDate()
  const endTime = booking.endTime.toDate()
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{booking.title}</h1>
          <p className="text-muted-foreground">Booking #{booking.id.slice(-8)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Appointment Details</CardTitle>
                <Badge className={cn('flex items-center gap-1', getStatusColor(booking.status))}>
                  {getStatusIcon(booking.status)}
                  {booking.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{format(startTime, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                    </p>
                    <p className="text-sm text-muted-foreground">{duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">${booking.priceUsd}</p>
                    <p className="text-sm text-muted-foreground">Total amount</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.timezone}</p>
                    <p className="text-sm text-muted-foreground">Timezone</p>
                  </div>
                </div>
              </div>

              {booking.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {booking.description}
                    </p>
                  </div>
                </>
              )}

              {booking.meetingLink && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Video Meeting</p>
                        <p className="text-sm text-muted-foreground">Join the call when it's time</p>
                      </div>
                    </div>
                    <Button asChild>
                      <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                        Join Call
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription>
                Communicate with {isClient ? 'your provider' : 'your client'} about this booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 w-full border rounded-lg p-4 mb-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          message.senderId === user?.uid ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.senderId !== user?.uid && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={otherParty?.avatar} />
                            <AvatarFallback>
                              {otherParty?.displayName?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-3 py-2",
                            message.senderId === user?.uid
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp?.toDate ? 
                              format(message.timestamp.toDate(), 'MMM d, h:mm a') : 
                              'Just now'
                            }
                          </p>
                        </div>
                        {message.senderId === user?.uid && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>
                              {user.displayName?.[0] || user.email?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={2}
                  className="resize-none"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Other Party Info */}
          <Card>
            <CardHeader>
              <CardTitle>{isClient ? 'Provider' : 'Client'} Information</CardTitle>
            </CardHeader>
            <CardContent>
              {otherParty ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherParty.avatar} />
                      <AvatarFallback>
                        {otherParty.displayName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{otherParty.displayName}</p>
                      <p className="text-sm text-muted-foreground">{otherParty.jobTitle}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{otherParty.email}</span>
                    </div>
                    {otherParty.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{otherParty.company}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading profile...</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {booking.status === 'confirmed' && (
                <>
                  <Button variant="outline" className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Call
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Start Voice Call
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              
              {booking.status === 'confirmed' && (
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Reschedule History */}
          {booking.rescheduleHistory && booking.rescheduleHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Reschedule History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {booking.rescheduleHistory.map((entry, index) => (
                    <div key={index} className="text-sm border-l-2 border-muted pl-3">
                      <p className="font-medium">
                        Rescheduled by {entry.requestedBy}
                      </p>
                      <p className="text-muted-foreground">
                        From: {format(entry.originalStartTime.toDate(), 'MMM d, h:mm a')}
                      </p>
                      <p className="text-muted-foreground">
                        To: {format(entry.newStartTime.toDate(), 'MMM d, h:mm a')}
                      </p>
                      {entry.reason && (
                        <p className="text-muted-foreground italic">"{entry.reason}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
