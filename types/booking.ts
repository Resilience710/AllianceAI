import { Timestamp } from 'firebase/firestore'

export type BookingStatus = 
  | 'pending_payment' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show'
  | 'rescheduled'

export interface Booking {
  id: string
  clientId: string
  providerId: string
  serviceId?: string // Optional for generic consultations
  serviceTitle?: string // Service title for quick display
  startTime: Timestamp
  endTime: Timestamp
  status: BookingStatus
  priceUsd: number
  paymentIntentId?: string // Stripe payment intent ID
  timezone: string
  title: string
  description?: string
  meetingLink?: string
  cancellationReason?: string
  rescheduleHistory?: RescheduleEntry[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface RescheduleEntry {
  originalStartTime: Timestamp
  originalEndTime: Timestamp
  newStartTime: Timestamp
  newEndTime: Timestamp
  requestedBy: 'client' | 'provider'
  reason?: string
  timestamp: Timestamp
}

export interface ProviderAvailability {
  id: string
  providerId: string
  timezone: string
  weeklySchedule: WeeklySchedule
  bufferMinutes: number // Buffer time between appointments
  maxBookingsPerDay: number
  maxBookingsPerWeek: number
  advanceBookingDays: number // How far in advance clients can book
  cancellationWindowHours: number // How many hours before booking can be cancelled
  autoAccept: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface WeeklySchedule {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export interface DaySchedule {
  enabled: boolean
  slots: TimeSlot[]
}

export interface TimeSlot {
  startTime: string // Format: "09:00"
  endTime: string   // Format: "17:00"
  slotDuration: number // Duration in minutes (e.g., 30, 60)
}

export interface BookingRequest {
  serviceId?: string
  providerId: string
  startTime: Date
  endTime: Date
  timezone: string
  title: string
  description?: string
  priceUsd: number
  requiresPayment: boolean
}

export interface AvailableSlot {
  startTime: Date
  endTime: Date
  duration: number // in minutes
  price?: number
  isAvailable: boolean
}

// For calendar display
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  status: BookingStatus
  clientName?: string
  providerName?: string
  price?: number
  type: 'booking' | 'blocked' | 'available'
}
