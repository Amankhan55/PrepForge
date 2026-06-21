# PrepForge
A daily-use platform to help engineers prepare for technical interviews across Angular, JavaScript, System Design, and more.
PrepForge is an Nx monorepo containing a full-stack interview prep platform with an Angular client and a NestJS server backend.

## Overview

- **Client:** `apps/client` — Angular 21 standalone application with lazy-loaded routes and modern signal-based state.
- **Server:** `apps/server` — NestJS 11 API server with JWT auth, MongoDB persistence, and secured REST endpoints.
- **Authentication:** Email/password registration and login with access + refresh JWT tokens.
- **Features:** Dashboard, questions browser, notes, mock tests, analytics, admin question management.

## Repository Structure

- `apps/client` — Angular application source and routing.
- `apps/server` — NestJS API implementation, modules, controllers, services.
- `package.json` — workspace scripts and dependencies.
- `nx.json` — Nx workspace config and target defaults.

## Client Features

### Auth
- Login page: `/auth/login`
- Register page: `/auth/register`
- `AuthService` stores user session in `localStorage` and keeps `access_token`, `refresh_token`, and user metadata.
- `authGuard` protects protected routes.
- `guestGuard` redirects authenticated users away from auth pages.

### Dashboard
- `/dashboard`
- Shows progress summary cards: reviewed, mastered, bookmarked, tests done, average score, streak.
- Quick links into questions, mock tests, notes, analytics.

### Questions
- `/questions/:category`
- Categories: `angular`, `javascript`, `system-design`
- Filter/search UI for questions by difficulty, status, and text.
- Question detail route: `/questions/:category/:id`
- Uses `QuestionsService` to fetch questions and topics from API.

### Notes
- `/notes`
- Create, edit, delete, and search notes.
- Auto-save updates and search query support.
- Uses `NotesApiService` and backend notes endpoints.

### Mock Tests
- `/mock-tests`
- Start timed mock tests with selectable category, difficulty, duration, and question count.
- View recent test history.
- Test session page shows timer, question navigation, answer input, and submission.
- Uses `MockTestsApiService` for starting tests, submitting answers, and loading history.

### Analytics
- `/analytics`
- Displays summary cards, heatmap activity, score trend, and topic breakdown.
- Loads analytics data from backend endpoints.

### Admin
- `/admin`
- Manage question content: create, edit, delete.
- Filter questions by category, difficulty, and search terms.
- Uses admin service backed by the questions API.

## Server Features

### Auth API
- `POST /api/auth/register` — register a new user.
- `POST /api/auth/login` — login and receive access + refresh tokens.
- `POST /api/auth/refresh` — refresh tokens.
- `DELETE /api/auth/logout` — logout and clear stored refresh token.
- `POST /api/auth/me` — get current user info.

### Questions API
- `GET /api/questions` — list questions with optional filters.
- `GET /api/questions/topics` — list available topics.
- `GET /api/questions/:id` — fetch question details.
- `POST /api/questions` — create new question.
- `PUT /api/questions/:id` — update question.
- `DELETE /api/questions/:id` — delete question.

### Notes API
- `GET /api/notes` — list notes with optional search.
- `GET /api/notes/:id` — get a single note.
- `POST /api/notes` — create a note.
- `PUT /api/notes/:id` — update a note.
- `DELETE /api/notes/:id` — delete a note.

### Mock Tests API
- `POST /api/mock-tests/start` — begin a new test session.
- `PUT /api/mock-tests/:id/submit` — submit answers for a test.
- `GET /api/mock-tests/history` — get completed test history.
- `GET /api/mock-tests/score-trend` — retrieve score trend data.

### Progress API
- `GET /api/progress` — retrieve all user progress.
- `GET /api/progress/summary` — fetch progress summary.
- `GET /api/progress/activity` — fetch activity by date.
- `PUT /api/progress/:questionId` — upsert question progress/bookmark state.

### Analytics API
- `GET /api/analytics/summary` — summary metrics.
- `GET /api/analytics/heatmap` — daily activity heatmap.
- `GET /api/analytics/radar` — breakdown of topic coverage.

## Technical Notes

- Backend uses `@nestjs/config`, `@nestjs/jwt`, `@nestjs/mongoose`, `mongoose`, and `bcrypt`.
- Global validation is enabled with Nest `ValidationPipe`.
- CORS is configured for `http://localhost:4200` by default.
- The client uses Angular standalone components, Signals, and modern router lazy loading.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server and client separately:
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

## Notes

- The application currently stores tokens in `localStorage` on the client.
- Most API routes are protected with JWT auth via `JwtAuthGuard`.
- The admin route is not currently role-restricted at the client level; it relies on auth protection and the admin UI.

## Future Improvements

- Add client-side token refresh handling for expired access tokens.
- Harden admin access with role-based authorization.
- Convert localStorage token storage to secure cookies if higher security is required.
- Add Cypress or Playwright end-to-end tests for core flows.
