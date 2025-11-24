# Online Wallet

A simple wallet application with a Laravel backend and a Next.js (TypeScript + Tailwind) frontend. The project supports user registration/login, deposit and withdrawal requests, and an admin panel for approving or rejecting user requests.

## Repository Layout

- `backend/` — Laravel API, models, migrations, and admin utilities.
- `frontend/` — Next.js app (app router), React components, Tailwind UI.

## Key Features

- User authentication (Laravel Sanctum)
- Create deposit / withdrawal requests (user-facing)
- Admin panel to view, approve, or reject requests
- Transaction history and basic summary stats
- Modernized UI (Tailwind, responsive components)

## Getting Started

Prerequisites:

- PHP 8.x, Composer (for backend)
- Node.js 18+ and a package manager (`npm` or `pnpm`) (for frontend)
- SQLite (default) or MySQL/Postgres — configured via `.env`

### Backend (Laravel)

1. Copy environment file and configure:

   ```powershell
   cd backend
   copy .env.example .env
   # Edit .env: set APP_URL, DB_CONNECTION, DB_DATABASE (for sqlite set path), MAIL, etc.
   ```

2. Install PHP dependencies and run migrations:

   ```powershell
   composer install
   php artisan key:generate
   php artisan migrate
   ```

3. (Optional) Create the admin user script is available at `backend/create_admin.php` — run it to create a default admin user (email: `admin@example.com`, password: `password123`) used during development.

4. Start the backend dev server:

   ```powershell
   php artisan serve
   # default: http://127.0.0.1:8000
   ```

Notes:

- Ensure Sanctum is configured correctly for SPA cookie auth and that `cors.php` allows your frontend origin.
- If using SQLite, verify the `database/database.sqlite` file exists and matches `DB_DATABASE` path.

### Frontend (Next.js)

1. Set API base URL in environment:

   - Create `.env.local` in `frontend/` with:

     ```env
     NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
     ```

2. Install dependencies and run dev server:

   ```powershell
   cd frontend
   npm install
   npm run dev
   # or `pnpm install` and `pnpm dev` if using pnpm
   ```

3. Open the app at `http://localhost:3000` (default Next.js dev port).

Notes:

- The frontend uses Tailwind CSS and a small in-memory GET cache (`frontend/lib/api.ts`) to improve perceived loading times.
- Authentication token is handled with an httpOnly cookie (Laravel Sanctum) and the frontend `api` helper sets `withCredentials: true`.

## Useful Endpoints

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — user login
- `POST /api/admin/auth/login` — admin login
- `GET /api/wallet/my-requests` — user's transaction requests
- `POST /api/wallet/request-deposit` — create a deposit request
- `POST /api/wallet/request-withdraw` — create a withdrawal request
- `GET /api/admin/requests/deposits` — admin list deposit requests
- `GET /api/admin/requests/withdrawals` — admin list withdrawal requests

Check `backend/routes/api.php` for the full list of endpoints and middleware.

## Development Notes

- Frontend structure:

  - `frontend/app/` — pages (app router)
  - `frontend/components/` — shared components and UI primitives
  - `frontend/lib/api.ts` — axios instance and a simple `getCached` helper for faster GETs

- UI updates already made:
  - Modernized headers (`components/user-header.tsx`, `components/admin-header.tsx`)
  - Core UI primitives updated (`components/ui/button.tsx`, `card.tsx`, `input.tsx`)
  - Improved request forms (`app/deposit/page.tsx`, `app/withdraw/page.tsx`) and admin dialog (`components/admin-action-dialog.tsx`)

## Recommendations / Next Steps

- Add server-side pagination for transaction lists (backend + frontend) for scale.
- Introduce React Query (TanStack Query) for robust caching and background refresh behavior.
- Add UI icons/logos and brand color tokens for consistent theming.
- Add end-to-end tests and CI for automated checks.

## Troubleshooting

- If frontend cannot reach the backend, confirm `NEXT_PUBLIC_API_BASE_URL` and CORS/HTTP vs HTTPS settings.
- If migrations fail, ensure file permissions and `DB_CONNECTION`/`DB_DATABASE` values are correct.

---

If you'd like, I can also add a short `README-DEV.md` with one-command dev startup scripts or a `docker-compose.yml` for local dev.

\*\*\* End Patch
