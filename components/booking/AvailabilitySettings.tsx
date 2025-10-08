'use client'

import * as React from 'react'
import { Clock, Calendar, Settings, Save, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { ProviderAvailability, WeeklySchedule, DaySchedule, TimeSlot } from '@/types/booking'

interface AvailabilitySettingsProps {
  availability: ProviderAvailability | null
  onSave: (availability: Partial<ProviderAvailability>) => Promise<void>
  loading?: boolean
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
] as const

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
]

const SLOT_DURATIONS = [15, 30, 45, 60, 90, 120]

export function AvailabilitySettings({ availability, onSave, loading = false }: AvailabilitySettingsProps) {
  const [settings, setSettings] = React.useState<Partial<ProviderAvailability>>({
    timezone: 'America/New_York',
    bufferMinutes: 15,
    maxBookingsPerDay: 8,
    maxBookingsPerWeek: 40,
    advanceBookingDays: 30,
    cancellationWindowHours: 24,
    autoAccept: true,
    weeklySchedule: {
      monday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00', slotDuration: 60 }] },
      tuesday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00', slotDuration: 60 }] },
      wednesday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00', slotDuration: 60 }] },
      thursday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00', slotDuration: 60 }] },
      friday: { enabled: true, slots: [{ startTime: '09:00', endTime: '17:00', slotDuration: 60 }] },
      saturday: { enabled: false, slots: [] },
      sunday: { enabled: false, slots: [] }
    }
  })

  const [hasChanges, setHasChanges] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (availability) {
      setSettings(availability)
    }
  }, [availability])

  const updateSettings = (updates: Partial<ProviderAvailability>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const updateDaySchedule = (day: keyof WeeklySchedule, schedule: DaySchedule) => {
    setSettings(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: schedule
      } as WeeklySchedule
    }))
    setHasChanges(true)
  }

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    const currentSchedule = settings.weeklySchedule?.[day]
    if (!currentSchedule) return

    const newSlot: TimeSlot = {
      startTime: '09:00',
      endTime: '10:00',
      slotDuration: 60
    }

    updateDaySchedule(day, {
      ...currentSchedule,
      slots: [...currentSchedule.slots, newSlot]
    })
  }

  const removeTimeSlot = (day: keyof WeeklySchedule, slotIndex: number) => {
    const currentSchedule = settings.weeklySchedule?.[day]
    if (!currentSchedule) return

    updateDaySchedule(day, {
      ...currentSchedule,
      slots: currentSchedule.slots.filter((_, index) => index !== slotIndex)
    })
  }

  const updateTimeSlot = (day: keyof WeeklySchedule, slotIndex: number, slot: TimeSlot) => {
    const currentSchedule = settings.weeklySchedule?.[day]
    if (!currentSchedule) return

    const updatedSlots = [...currentSchedule.slots]
    updatedSlots[slotIndex] = slot

    updateDaySchedule(day, {
      ...currentSchedule,
      slots: updatedSlots
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(settings)
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save availability settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const copySchedule = (fromDay: keyof WeeklySchedule, toDay: keyof WeeklySchedule) => {
    const sourceSchedule = settings.weeklySchedule?.[fromDay]
    if (!sourceSchedule) return

    updateDaySchedule(toDay, { ...sourceSchedule })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Availability Settings</h2>
          <p className="text-muted-foreground">
            Configure your availability and booking preferences
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || saving || loading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {hasChanges && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your availability settings.
          </AlertDescription>
        </Alert>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure your timezone and booking preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => updateSettings({ timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bufferMinutes">Buffer Time (minutes)</Label>
              <Input
                id="bufferMinutes"
                type="number"
                min="0"
                max="60"
                value={settings.bufferMinutes || 15}
                onChange={(e) => updateSettings({ bufferMinutes: parseInt(e.target.value) || 15 })}
              />
              <p className="text-xs text-muted-foreground">
                Time between appointments
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBookingsPerDay">Max Bookings per Day</Label>
              <Input
                id="maxBookingsPerDay"
                type="number"
                min="1"
                max="20"
                value={settings.maxBookingsPerDay || 8}
                onChange={(e) => updateSettings({ maxBookingsPerDay: parseInt(e.target.value) || 8 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBookingsPerWeek">Max Bookings per Week</Label>
              <Input
                id="maxBookingsPerWeek"
                type="number"
                min="1"
                max="100"
                value={settings.maxBookingsPerWeek || 40}
                onChange={(e) => updateSettings({ maxBookingsPerWeek: parseInt(e.target.value) || 40 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceBookingDays">Advance Booking (days)</Label>
              <Input
                id="advanceBookingDays"
                type="number"
                min="1"
                max="365"
                value={settings.advanceBookingDays || 30}
                onChange={(e) => updateSettings({ advanceBookingDays: parseInt(e.target.value) || 30 })}
              />
              <p className="text-xs text-muted-foreground">
                How far in advance clients can book
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellationWindowHours">Cancellation Window (hours)</Label>
              <Input
                id="cancellationWindowHours"
                type="number"
                min="1"
                max="168"
                value={settings.cancellationWindowHours || 24}
                onChange={(e) => updateSettings({ cancellationWindowHours: parseInt(e.target.value) || 24 })}
              />
              <p className="text-xs text-muted-foreground">
                Minimum notice required for cancellation
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoAccept">Auto-accept bookings</Label>
              <p className="text-sm text-muted-foreground">
                Automatically confirm bookings without manual approval
              </p>
            </div>
            <Switch
              id="autoAccept"
              checked={settings.autoAccept || false}
              onCheckedChange={(checked) => updateSettings({ autoAccept: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Set your available hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const daySchedule = settings.weeklySchedule?.[key] || { enabled: false, slots: [] }
            
            return (
              <div key={key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={daySchedule.enabled}
                      onCheckedChange={(enabled) => 
                        updateDaySchedule(key, { ...daySchedule, enabled })
                      }
                    />
                    <Label className="text-base font-medium">{label}</Label>
                    {daySchedule.enabled && (
                      <Badge variant="outline">
                        {daySchedule.slots.length} slot{daySchedule.slots.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  
                  {daySchedule.enabled && (
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(fromDay) => copySchedule(fromDay as keyof WeeklySchedule, key)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Copy from..." />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.filter(d => d.key !== key).map(({ key: dayKey, label: dayLabel }) => (
                            <SelectItem key={dayKey} value={dayKey}>
                              {dayLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(key)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {daySchedule.enabled && (
                  <div className="ml-8 space-y-3">
                    {daySchedule.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="grid grid-cols-4 gap-3 flex-1">
                          <div className="space-y-1">
                            <Label className="text-xs">Start Time</Label>
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(key, slotIndex, {
                                ...slot,
                                startTime: e.target.value
                              })}
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs">End Time</Label>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(key, slotIndex, {
                                ...slot,
                                endTime: e.target.value
                              })}
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs">Slot Duration</Label>
                            <Select
                              value={slot.slotDuration.toString()}
                              onValueChange={(value) => updateTimeSlot(key, slotIndex, {
                                ...slot,
                                slotDuration: parseInt(value)
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SLOT_DURATIONS.map((duration) => (
                                  <SelectItem key={duration} value={duration.toString()}>
                                    {duration} min
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(key, slotIndex)}
                              disabled={daySchedule.slots.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {daySchedule.slots.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No time slots configured</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(key)}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Time Slot
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {key !== 'sunday' && <Separator />}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
