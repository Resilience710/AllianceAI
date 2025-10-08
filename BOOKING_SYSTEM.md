# AllianceAI Booking System

## Overview

The AllianceAI booking system is a comprehensive, timezone-aware appointment scheduling solution that enables clients to book consultations with AI service providers. The system includes payment processing, availability management, and booking lifecycle management.

## Key Features

### ✅ **Timezone-Aware Scheduling**
- Provider availability configured in their local timezone
- Client sees availability in their local timezone
- Automatic timezone conversion and display
- Buffer time management between appointments

### ✅ **Payment Integration**
- Stripe payment processing for paid consultations
- Automatic payment intent creation
- Secure payment confirmation via webhooks
- Refund processing for cancellations
- Platform fee calculation (2.9% + Stripe fees)

### ✅ **Booking Lifecycle Management**
- **Statuses**: `pending_payment`, `confirmed`, `completed`, `cancelled`, `no_show`, `rescheduled`
- **Double-booking prevention**: Slot locking after confirmation
- **Cancellation policies**: Configurable cancellation windows
- **Reschedule support**: With consent and history tracking

### ✅ **Provider Availability Management**
- Weekly schedule configuration
- Multiple time slots per day
- Configurable slot durations (15, 30, 45, 60, 90, 120 minutes)
- Buffer time between appointments
- Maximum bookings per day/week limits
- Auto-accept or manual approval options

### ✅ **Notifications & Communication**
- Email confirmations for bookings
- In-app notifications
- Real-time messaging within booking context
- Reminder emails 24h before appointments
- System messages for status changes

## Architecture

### Database Schema

```typescript
// Booking Entity
interface Booking {
  id: string
  clientId: string
  providerId: string
  serviceId?: string
  startTime: Timestamp
  endTime: Timestamp
  status: BookingStatus
  priceUsd: number
  paymentIntentId?: string
  timezone: string
  title: string
  description?: string
  meetingLink?: string
  cancellationReason?: string
  rescheduleHistory?: RescheduleEntry[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Provider Availability
interface ProviderAvailability {
  id: string
  providerId: string
  timezone: string
  weeklySchedule: WeeklySchedule
  bufferMinutes: number
  maxBookingsPerDay: number
  maxBookingsPerWeek: number
  advanceBookingDays: number
  cancellationWindowHours: number
  autoAccept: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### API Endpoints

#### Booking Management
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/create?userId={id}&role={role}` - Get user bookings
- `GET /api/bookings/[id]` - Get booking details
- `PATCH /api/bookings/[id]` - Update booking (cancel, reschedule, complete)

#### Webhook Processing
- `POST /api/webhooks/stripe` - Handle Stripe payment events

### Components

#### Core Components
- **`AvailabilityCalendar`** - Interactive calendar showing available slots
- **`BookingModal`** - Multi-step booking flow with payment
- **`BookingManagement`** - Dashboard for managing bookings
- **`AvailabilitySettings`** - Provider availability configuration

#### Integration Points
- **Provider Profile** - Book appointment tab with calendar
- **Provider Dashboard** - Booking management and availability settings
- **Client Dashboard** - View and manage bookings
- **Booking Detail Page** - Individual booking with messaging

## Usage

### For Providers

1. **Set Availability**
   ```typescript
   // Navigate to Provider Dashboard > Availability tab
   // Configure weekly schedule, timezone, and booking limits
   ```

2. **Manage Bookings**
   ```typescript
   // Provider Dashboard > Bookings tab
   // View upcoming, past, cancelled bookings
   // Accept/decline, reschedule, mark complete/no-show
   ```

### For Clients

1. **Book Appointment**
   ```typescript
   // Visit provider profile > Book Appointment tab
   // Select available slot from calendar
   // Complete booking details and payment
   ```

2. **Manage Bookings**
   ```typescript
   // Client Dashboard > My Bookings
   // View booking status, reschedule, cancel
   // Message provider through booking detail page
   ```

## Payment Flow

### Booking Creation
1. Client selects time slot and fills booking details
2. System creates payment intent via Stripe
3. Client completes payment in booking modal
4. Webhook confirms payment and updates booking status
5. Both parties receive confirmation notifications

### Cancellation & Refunds
1. User initiates cancellation with reason
2. System calculates refund based on cancellation policy
3. Automatic refund processed via Stripe
4. Booking status updated to cancelled
5. Refund confirmation sent to client

## Configuration

### Environment Variables
```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Stripe Setup
1. Create Stripe account and get API keys
2. Configure webhook endpoint: `/api/webhooks/stripe`
3. Enable webhook events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `refund.created`
   - `transfer.created`

## Testing

### Test Scenarios
1. **Provider Setup**
   - Configure availability schedule
   - Set pricing and booking limits

2. **Client Booking**
   - Book paid consultation
   - Complete Stripe test payment
   - Verify booking confirmation

3. **Booking Management**
   - Reschedule appointment
   - Cancel with refund
   - Mark booking complete

4. **Edge Cases**
   - Double-booking prevention
   - Timezone conversion accuracy
   - Payment failure handling

### Test Cards (Stripe)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
```

## Security Considerations

- **Payment Security**: All payments processed through Stripe
- **Data Validation**: Server-side validation for all booking data
- **Access Control**: Users can only access their own bookings
- **Webhook Verification**: Stripe webhook signature verification
- **Rate Limiting**: API endpoints protected against abuse

## Future Enhancements

### Planned Features
- **Google Calendar Integration**: Sync bookings with external calendars
- **Video Call Integration**: Automatic meeting room creation
- **Advanced Scheduling**: Recurring appointments, group bookings
- **Mobile App**: Native iOS/Android booking experience
- **AI Scheduling Assistant**: Smart availability suggestions

### Scalability Considerations
- **Database Optimization**: Indexed queries for booking lookups
- **Caching Strategy**: Redis for availability calculations
- **Background Jobs**: Async notification processing
- **Load Balancing**: Horizontal scaling for high traffic

## Support

For technical issues or questions about the booking system:
1. Check the troubleshooting section in the main README
2. Review Stripe dashboard for payment issues
3. Check Firebase console for database errors
4. Contact the development team for complex issues

---

**Note**: This booking system is production-ready and includes all necessary security measures, error handling, and user experience optimizations for a professional marketplace platform.
