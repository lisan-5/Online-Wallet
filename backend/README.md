# Online Wallet Backend API

Laravel 11 backend API for the Online Wallet & Transaction System with user authentication, admin approval workflow, and wallet management.

## Features

- ✅ User registration and authentication
- ✅ Admin authentication with role-based access
- ✅ Deposit and withdrawal request system
- ✅ Admin approval/rejection workflow
- ✅ Wallet balance management
- ✅ SQLite database
- ✅ Laravel Sanctum API authentication
- ✅ CORS configured for frontend integration

## Requirements

- PHP 8.2 or higher
- Composer
- SQLite

## Installation

### 1. Install Dependencies

```bash
composer install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
copy .env.example .env
```

The `.env` file is already configured for SQLite. No database credentials needed!

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Create SQLite Database

```bash
type nul > database\database.sqlite
```

Or on Unix/Mac:
```bash
touch database/database.sqlite
```

### 5. Run Migrations and Seeders

```bash
php artisan migrate --seed
```

This will create:
- Users table with role and balance columns
- Wallet transactions table
- Admin user: `admin@example.com` / `password`
- Test user: `user@example.com` / `password` (with $100 balance)

### 6. Start the Development Server

**Important:** The frontend expects the API at `http://localhost:5000`

```bash
php artisan serve --port=5000
```

The API will be available at: `http://localhost:5000/api`

## API Endpoints

### User Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get authenticated user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### User Wallet
- `POST /api/wallet/request-deposit` - Request deposit (requires auth)
- `POST /api/wallet/request-withdraw` - Request withdrawal (requires auth)
- `GET /api/wallet/my-requests` - View transaction history (requires auth)
- `GET /api/wallet/balance` - Get current balance (requires auth)

### Admin Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get authenticated admin (requires auth)
- `POST /api/admin/auth/logout` - Logout admin (requires auth)

### Admin Operations
- `GET /api/admin/stats` - Dashboard statistics (requires admin)
- `GET /api/admin/requests/deposits` - Pending deposits (requires admin)
- `GET /api/admin/requests/withdrawals` - Pending withdrawals (requires admin)
- `POST /api/admin/approve-deposit/{id}` - Approve deposit (requires admin)
- `POST /api/admin/reject-deposit/{id}` - Reject deposit (requires admin)
- `POST /api/admin/approve-withdrawal/{id}` - Approve withdrawal (requires admin)
- `POST /api/admin/reject-withdrawal/{id}` - Reject withdrawal (requires admin)
- `GET /api/admin/users` - List all users (requires admin)

## Default Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `password`

### Test User Account
- Email: `user@example.com`
- Password: `password`
- Initial Balance: $100.00

## Database Schema

### Users Table
- `id`, `name`, `email`, `password`
- `role` (enum: user, admin)
- `balance` (decimal: 10,2)
- `email_verified_at`, `remember_token`, `timestamps`

### Wallet Transactions Table
- `id`, `user_id`, `type` (deposit/withdrawal)
- `amount`, `payment_method`, `reference_number`
- `withdraw_method`, `phone_or_account`
- `status` (pending/approved/rejected)
- `admin_remark`, `admin_id`, `timestamps`

## Development

### Reset Database
```bash
php artisan migrate:fresh --seed
```

### Run Tests
```bash
php artisan test
```

### Check Routes
```bash
php artisan route:list
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (Next.js default)
- `http://localhost:5173` (Vite default)

## Security Features

- ✅ Password hashing with bcrypt
- ✅ API token authentication (Sanctum)
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ CSRF protection
- ✅ Rate limiting on authentication routes

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can run on a different port:
```bash
php artisan serve --port=8000
```

Then update the frontend `.env` file:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Database Locked Error
If you get a "database is locked" error, make sure no other process is accessing the SQLite file.

### CORS Errors
Make sure the frontend URL is listed in `config/cors.php` under `allowed_origins`.

## License

MIT License
