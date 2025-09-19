# Alliance AI

A modern web application that connects companies with AI experts and AI agents in a marketplace format. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **User Profile Creation**: Two main roles - AI Providers and Business Clients
- **Marketplace Dashboard**: Browse AI agents, training, and consulting services
- **Provider Profiles**: Detailed provider pages with services, portfolio, and reviews
- **Communication System**: In-app messaging between providers and clients
- **Booking System**: Secure service booking and payment processing
- **Provider Dashboard**: Service management and analytics for AI providers

### User Roles

#### AI Providers
- Create and manage service listings
- Track performance analytics
- Communicate with potential clients
- Manage bookings and projects

#### Business Clients
- Browse and filter AI solutions
- Contact providers directly
- Book services securely
- Track project progress

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── booking/           # Service booking flow
│   ├── dashboard/         # Client marketplace dashboard
│   ├── login/             # Authentication pages
│   ├── messages/          # In-app messaging system
│   ├── onboarding/        # User registration flow
│   ├── provider/          # Provider profile pages
│   ├── provider-dashboard/ # Provider management dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   └── ui/                # Reusable UI components
├── lib/
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Key Pages

### Public Pages
- `/` - Landing page with hero section and featured providers
- `/login` - Authentication (sign in/sign up)
- `/onboarding` - User profile creation flow

### Client Pages
- `/dashboard` - Browse and search AI providers
- `/provider/[id]` - Detailed provider profile
- `/messages` - Communication with providers
- `/booking` - Service booking and payment

### Provider Pages
- `/provider-dashboard` - Manage services and analytics
- `/messages` - Client communications

## Features in Detail

### Onboarding Flow
3-step process for new users:
1. **Role Selection**: Choose between AI Provider or Business Client
2. **Profile Setup**: Basic information and company details
3. **Preferences**: Skills/services (providers) or needs (clients)

### Marketplace Dashboard
- Search and filter providers by category, price, rating
- Save favorite providers
- View detailed provider information
- Direct messaging and booking

### Provider Profiles
- Comprehensive provider information
- Service listings with pricing
- Portfolio showcase
- Client reviews and ratings
- Contact information

### Messaging System
- Real-time chat interface
- Conversation management
- File attachments support
- Online status indicators

### Booking System
- Multi-step booking process
- Project requirements collection
- Secure payment processing
- Booking confirmation and tracking

## Customization

### Adding New Service Categories
1. Update the categories array in relevant components
2. Add category-specific filtering logic
3. Update the database schema (when backend is implemented)

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Component-specific styles are in individual component files

## Future Enhancements

### Backend Integration
- User authentication and authorization
- Database for users, services, and bookings
- Real-time messaging with WebSocket
- Payment processing with Stripe
- File upload and storage

### Additional Features
- Video calling integration (Zoom, Google Meet)
- Calendar scheduling (Calendly integration)
- Advanced search and filtering
- Rating and review system
- Admin panel for platform management
- Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team or create an issue in the repository.

