'use client'

import * as React from 'react'
import { format, addDays, startOfWeek, isSameDay, parseISO, addMinutes } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProviderAvailability, AvailableSlot, CalendarEvent } from '@/types/booking'

interface AvailabilityCalendarProps {
  availability: ProviderAvailability
  existingBookings: CalendarEvent[]
  onSlotSelect?: (slot: AvailableSlot) => void
  selectedSlot?: AvailableSlot
  viewMode?: 'week' | 'day'
  clientTimezone?: string
  showPricing?: boolean
  readonly?: boolean
}

export function AvailabilityCalendar({
  availability,
  existingBookings,
  onSlotSelect,
  selectedSlot,
  viewMode = 'week',
  clientTimezone,
  showPricing = false,
  readonly = false
}: AvailabilityCalendarProps) {
  const [currentWeek, setCurrentWeek] = React.useState(new Date())
  const [displayTimezone, setDisplayTimezone] = React.useState(
    clientTimezone || availability.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  )

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7))
  }

  const generateAvailableSlots = (date: Date): AvailableSlot[] => {
    const dayName = format(date, 'EEEE').toLowerCase() as keyof typeof availability.weeklySchedule
    const daySchedule = availability.weeklySchedule[dayName]
    
    if (!daySchedule.enabled) return []

    const slots: AvailableSlot[] = []
    
    daySchedule.slots.forEach(timeSlot => {
      const [startHour, startMinute] = timeSlot.startTime.split(':').map(Number)
      const [endHour, endMinute] = timeSlot.endTime.split(':').map(Number)
      
      let currentTime = new Date(date)
      currentTime.setHours(startHour, startMinute, 0, 0)
      
      const endTime = new Date(date)
      endTime.setHours(endHour, endMinute, 0, 0)
      
      while (currentTime < endTime) {
        const slotEnd = addMinutes(currentTime, timeSlot.slotDuration)
        
        // Check if slot conflicts with existing bookings
        const isBooked = existingBookings.some(booking => {
          const bookingStart = new Date(booking.start)
          const bookingEnd = new Date(booking.end)
          return (
            (currentTime >= bookingStart && currentTime < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (currentTime <= bookingStart && slotEnd >= bookingEnd)
          )
        })
        
        // Check if slot is in the past
        const isPast = currentTime < new Date()
        
        slots.push({
          startTime: new Date(currentTime),
          endTime: new Date(slotEnd),
          duration: timeSlot.slotDuration,
          isAvailable: !isBooked && !isPast
        })
        
        currentTime = addMinutes(currentTime, timeSlot.slotDuration + availability.bufferMinutes)
      }
    })
    
    return slots
  }

  const formatTimeInTimezone = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      hour12: true
    }).format(date)
  }

  const isSlotSelected = (slot: AvailableSlot) => {
    return selectedSlot && 
           slot.startTime.getTime() === selectedSlot.startTime.getTime() &&
           slot.endTime.getTime() === selectedSlot.endTime.getTime()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Available Times
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Times shown in {displayTimezone}
          {clientTimezone && clientTimezone !== availability.timezone && (
            <Badge variant="outline" className="text-xs">
              Provider timezone: {availability.timezone}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, dayIndex) => {
            const availableSlots = generateAvailableSlots(day)
            const isToday = isSameDay(day, new Date())
            
            return (
              <div key={dayIndex} className="space-y-2">
                <div className={cn(
                  "text-center p-2 rounded-lg text-sm font-medium",
                  isToday ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <div>{format(day, 'EEE')}</div>
                  <div className="text-xs">{format(day, 'MMM d')}</div>
                </div>
                
                <div className="space-y-1 min-h-[200px]">
                  {availableSlots.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No availability
                    </div>
                  ) : (
                    availableSlots.map((slot, slotIndex) => (
                      <Button
                        key={slotIndex}
                        variant={isSlotSelected(slot) ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "w-full text-xs h-auto py-1 px-2",
                          !slot.isAvailable && "opacity-50 cursor-not-allowed",
                          isSlotSelected(slot) && "ring-2 ring-primary"
                        )}
                        disabled={!slot.isAvailable || readonly}
                        onClick={() => slot.isAvailable && onSlotSelect?.(slot)}
                      >
                        <div className="flex flex-col items-center">
                          <div>{formatTimeInTimezone(slot.startTime, displayTimezone)}</div>
                          <div className="text-[10px] opacity-75">
                            {slot.duration}min
                          </div>
                          {showPricing && slot.price && (
                            <div className="text-[10px] font-semibold">
                              ${slot.price}
                            </div>
                          )}
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded opacity-50"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
