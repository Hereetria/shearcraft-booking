# Demo Accounts

This application includes demo accounts for easy testing and demonstration purposes.

## Available Demo Accounts

### Customer Account
- **Email:** demo@customer.com
- **Password:** demo123
- **Role:** CUSTOMER
- **Access:** Can make bookings, view own bookings, access reservation system

### Admin Account
- **Email:** demo@admin.com
- **Password:** demo123
- **Role:** ADMIN
- **Access:** Full admin dashboard, manage users, services, packages, and bookings

## How to Use

1. Go to the login page
2. Click on either "Login as Customer" or "Login as Admin" button
3. The form will auto-fill with the demo credentials
4. The login will be processed automatically

## Demo Data

The seed script also creates:
- 3 demo services (Haircut, Hair Wash, Beard Trim)
- 2 demo packages (Basic Package, Premium Package)
- Service-package relationships

## Running the Seed Script

To create or update demo accounts and data:

```bash
npm run db:seed
```

## Security Note

These are demo accounts only and should not be used in production. They are created for testing and demonstration purposes.
