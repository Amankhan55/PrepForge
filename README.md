# PrepForge

A daily-use platform to help engineers prepare for technical interviews across Angular, JavaScript, System Design, and more.

PrepForge is an Nx monorepo containing a full-stack interview prep platform with an Angular client and a NestJS server backend.

## Overview

- **Client:** `apps/client` — Angular 21 standalone application with lazy-loaded routes, modern signal-based state, and secure cookie-based session management.
- **Server:** `apps/server` — NestJS 11 API server with role-based authorization, MongoDB persistence, and secure cookie-based JWT authentication.
- **Authentication:** Email/password registration and login with secure `httpOnly` Access + Refresh JWT cookies.
- **Features:** Dashboard, questions browser, notes, mock tests with intelligent grading, analytics, and role-restricted admin question management.

## Repository Structure

- `apps/client` — Angular application source, routes, guards, and services.
- `apps/server` — NestJS API implementation, modules, controllers, services, and schemas.
- `package.json` — Workspace scripts and dependencies.
- `nx.json` — Nx workspace config and target defaults.

## Security & Architecture

### Secure Cookie Authentication
To protect the platform against Cross-Site Scripting (XSS) attacks, tokens are stored in the browser as secure, `httpOnly` cookies:
- **`access_token`**: Extracted by the backend Passport JWT strategy, valid for 15 minutes.
- **`refresh_token`**: Used to request new token pairs, valid for 7 days.
- Non-sensitive user profile metadata (`id`, `name`, `email`, `role`) is cached in client `localStorage` for responsive UI rendering and is validated against the backend on application startup.

### Concurrent Token Refresh
The frontend `authInterceptor` catches `401 Unauthorized` responses and automatically coordinates a token refresh request:
- Implements **request queuing** via an RxJS `BehaviorSubject` so that multiple simultaneous API failures trigger only a single `/api/auth/refresh` request.
- Once the refresh completes, all queued requests are retried seamlessly without user interruption.
- If the refresh token is expired, the user is logged out silently and redirected to the login page.

### Role-Based Access Control (RBAC)
User access is strictly enforced based on roles (`'user'` or `'admin'`):
- **Backend Protection:** The `QuestionsController` is guarded by a custom `RolesGuard`. Endpoints for creating, editing, and deleting questions (`POST`, `PUT`, `DELETE`) are restricted to users with the `admin` role using the `@Roles('admin')` decorator.
- **Frontend Route Protection:** The `/admin` route is guarded by an `adminGuard` that checks user roles and redirects unauthorized users to the dashboard.
- **Frontend UI Hardening:** The sidebar navigation automatically filters items, hiding the **Admin Panel** link from non-admin users.

---

## Client Features

### Auth
- Login page: `/auth/login`
- Register page: `/auth/register`
- Registers users as `'user'` by default. Assigns `'admin'` automatically if the email is `admin@prepforge.com` or if specified in the payload.
- `AuthService` handles authentication state, computing reactive signals like `isAuthenticated()` and `isAdmin()`.
- `authGuard` protects standard member routes.
- `guestGuard` redirects authenticated users away from auth pages.
- `adminGuard` protects administrative routes.

### Dashboard
- `/dashboard`
- Shows progress summary cards: reviewed, mastered, bookmarked, tests done, average score, and streak.
- Quick links to questions, mock tests, notes, and analytics.

### Questions
- `/questions/:category`
- Categories: `angular`, `javascript`, `system-design`
- Filter/search UI for questions by difficulty, status, and text.
- Question detail route: `/questions/:category/:id`

### Notes
- `/notes`
- Create, edit, delete, and search notes.
- Auto-save updates and search query support.

### Mock Tests
- `/mock-tests`
- Start timed mock tests with selectable category, difficulty, duration, and question count.
- View recent test history.
- Timed test session page (`/mock-tests/:id`) featuring a countdown timer, question navigation, text answer input, and automatic submission.
- Uses an **intelligent keyword-matching grading algorithm** that parses descriptive text answers, matching them against tags and correct answer keywords to determine correctness.

### Analytics
- `/analytics`
- Displays summary cards, heatmap activity, score trend, and topic breakdown using radar charts.

### Admin
- `/admin`
- Restricted to admin users.
- Manage question content: create, edit, and delete.

---

## Server Features

### Auth API
- `POST /api/auth/register` — Registers a new user and sets auth cookies.
- `POST /api/auth/login` — Log in and sets access + refresh cookies.
- `POST /api/auth/refresh` — Refreshes access + refresh cookies using the cookie payload.
- `DELETE /api/auth/logout` — Revokes the refresh token and clears cookies.
- `POST /api/auth/me` — Returns current authenticated user profile.

### Questions API
- `GET /api/questions` — List questions with optional filters.
- `GET /api/questions/topics` — List available topics.
- `GET /api/questions/:id` — Fetch question details.
- `POST /api/questions` — Create new question **(Admin only)**.
- `PUT /api/questions/:id` — Update question **(Admin only)**.
- `DELETE /api/questions/:id` — Delete question **(Admin only)**.

### Notes API
- Standard CRUD endpoints protected with JWT auth.

### Mock Tests API
- `POST /api/mock-tests/start` — Begin a new test session.
- `GET /api/mock-tests/:id` — Fetch a single mock test session (in-progress or completed).
- `PUT /api/mock-tests/:id/submit` — Submit answers and calculate grades.
- `GET /api/mock-tests/history` — Retrieve completed test history.
- `GET /api/mock-tests/score-trend` — Retrieve score trend data.

---

## Technical Notes

- Backend uses `@nestjs/config`, `@nestjs/jwt`, `@nestjs/mongoose`, `mongoose`, and `bcrypt`.
- Cookies are configured with `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`, and `secure: true` in production environments.
- Global validation is enabled with Nest `ValidationPipe`.
- CORS is configured for `http://localhost:4200` with `credentials: true`.
- The client uses Angular standalone components, Signals, and modern router lazy loading.
- Client requests are automatically configured with `withCredentials: true` via a global interceptor.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both the server and client in parallel:
   ```bash
   npm run dev
   ```
   Or start them separately:
   ```bash
   npm run dev:server
   npm run dev:client
   ```

3. Ensure the server has environment variables set in `apps/server/.env`, especially:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `JWT_EXPIRES_IN`
   - `JWT_REFRESH_EXPIRES_IN`

4. Open the client in the browser at `http://localhost:4200`.
