import { NextRequest, NextResponse } from 'next/server'
import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createBookingPaymentIntent } from '@/lib/stripe'
import type { BookingRequest } from '@/types/booking'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      serviceId,
      providerId,
      clientId,
      startTime,
      endTime,
      timezone,
      title,
      description,
      priceUsd,
      requiresPayment
    }: BookingRequest & { clientId: string } = body

    // Validate required fields
    if (!providerId || !clientId || !startTime || !endTime || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert string dates to Date objects
    const bookingStart = new Date(startTime)
    const bookingEnd = new Date(endTime)

    // Validate booking time is in the future
    if (bookingStart <= new Date()) {
      return NextResponse.json(
        { error: 'Booking time must be in the future' },
        { status: 400 }
      )
    }

    // Check for conflicts with existing bookings
    const conflictQuery = query(
      collection(db, 'bookings'),
      where('providerId', '==', providerId),
      where('status', 'in', ['confirmed', 'pending_payment'])
    )

    const conflictSnapshot = await getDocs(conflictQuery)
    const hasConflict = conflictSnapshot.docs.some(doc => {
      const booking = doc.data()
      const existingStart = booking.startTime.toDate()
      const existingEnd = booking.endTime.toDate()
      
      // Check for time overlap
      return (
        (bookingStart >= existingStart && bookingStart < existingEnd) ||
        (bookingEnd > existingStart && bookingEnd <= existingEnd) ||
        (bookingStart <= existingStart && bookingEnd >= existingEnd)
      )
    })

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Time slot is no longer available' },
        { status: 409 }
      )
    }

    // Generate booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create booking document
    const bookingData: any = {
      id: bookingId,
      clientId,
      providerId,
      serviceId: serviceId || null,
      serviceTitle: title, // Store service title for quick display
      startTime: bookingStart,
      endTime: bookingEnd,
      status: requiresPayment ? 'pending_payment' : 'confirmed',
      priceUsd: priceUsd || 0,
      timezone,
      title,
      description: description || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    let paymentIntent = null
    let clientSecret = null

    // Create payment intent if payment is required
    if (requiresPayment && priceUsd > 0) {
      try {
        const paymentResult = await createBookingPaymentIntent(
          priceUsd,
          bookingId,
          clientId,
          providerId,
          {
            title,
            serviceId: serviceId || '',
            timezone
          }
        )
        
        paymentIntent = paymentResult.paymentIntent
        clientSecret = paymentIntent.client_secret
        bookingData.paymentIntentId = paymentIntent.id
      } catch (paymentError) {
        console.error('Failed to create payment intent:', paymentError)
        return NextResponse.json(
          { error: 'Failed to initialize payment' },
          { status: 500 }
        )
      }
    }

    // Save booking to database
    await setDoc(doc(db, 'bookings', bookingId), bookingData)

    // Create initial system message
    await setDoc(doc(db, 'bookingMessages', `${bookingId}_welcome`), {
      bookingId,
      senderId: 'system',
      senderName: 'AllianceAI',
      message: `Booking created: ${title}\nScheduled for ${bookingStart.toLocaleString()} (${timezone})`,
      timestamp: serverTimestamp(),
      type: 'system'
    })

    // Send notifications (email, in-app, etc.)
    // This would typically trigger notification services
    
    const response = {
      bookingId,
      status: bookingData.status,
      clientSecret,
      booking: {
        ...bookingData,
        startTime: bookingStart.toISOString(),
        endTime: bookingEnd.toISOString()
      }
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role') // 'client' or 'provider'
    const status = searchParams.get('status')

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing userId or role parameter' },
        { status: 400 }
      )
    }

    // Build query based on role
    let bookingsQuery
    if (role === 'client') {
      bookingsQuery = query(
        collection(db, 'bookings'),
        where('clientId', '==', userId)
      )
    } else {
      bookingsQuery = query(
        collection(db, 'bookings'),
        where('providerId', '==', userId)
      )
    }

    const snapshot = await getDocs(bookingsQuery)
    let bookings = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate?.()?.toISOString() || data.startTime,
        endTime: data.endTime?.toDate?.()?.toISOString() || data.endTime,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      }
    })

    // Filter by status if provided
    if (status) {
      bookings = bookings.filter((booking: any) => booking.status === status)
    }

    // Sort by start time (newest first)
    bookings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
