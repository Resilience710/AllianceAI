# Admin Panel Access Instructions

## Overview
The Alliance AI admin panel provides comprehensive platform management capabilities including user management, report moderation, analytics overview, and system settings.

## Accessing the Admin Panel

### Method 1: Direct URL Access
1. Navigate to `/admin` in your browser
2. You must be signed in with an admin account
3. The system will automatically verify your admin privileges

### Method 2: Dashboard Navigation
1. Sign in to your admin account
2. Go to your dashboard at `/dashboard`
3. Look for the "Admin Panel" link in the quick actions section (visible only to admins)

## Admin Account Requirements

### Current Admin Access
Admin access is currently controlled by checking:
- User authentication status
- User role set to 'admin' in the user profile
- Email address verification (if configured)

### Setting Up Admin Access
To grant admin access to a user:
1. Update the user's profile in Firestore
2. Set the `role` field to `'admin'`
3. Ensure the user has completed the authentication process

## Admin Panel Features

### User Management
- View all registered users (clients and providers)
- Filter users by role, status, and registration date
- Suspend or activate user accounts
- View detailed user profiles and activity

### Report Moderation
- Review reported content and users
- Take action on reports (approve, dismiss, escalate)
- Track report resolution status
- Manage platform safety and compliance

### Analytics Overview
- Platform-wide usage statistics
- User engagement metrics
- Revenue and transaction data
- Growth trends and insights

### System Settings
- Platform configuration options
- Feature toggles and permissions
- Notification settings
- Maintenance mode controls

## Security Notes

- Admin access is restricted and requires proper authentication
- All admin actions are logged for audit purposes
- Regular review of admin permissions is recommended
- Use strong passwords and enable 2FA when available

## Troubleshooting

### Cannot Access Admin Panel
1. Verify you are signed in with the correct account
2. Check that your user role is set to 'admin' in the database
3. Clear browser cache and cookies
4. Contact system administrator if issues persist

### Missing Admin Features
- Some features may be role-restricted
- Ensure your admin account has full privileges
- Check for any pending system updates

## Support
For technical issues or questions about admin panel functionality, contact the development team or refer to the system documentation.
