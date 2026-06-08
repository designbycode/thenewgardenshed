# Guest Book Create Page

## Overview
Allow non-authenticated users to submit a review via a password-protected form at `/guest-book/create`.

## Flow
1. User visits `/guest-book/create` → page renders with a password Dialog open by default
2. User enters `REVIEW_PAGE_PASSWORD` → POST to same route → server verifies against env, stores `review_authenticated` in session, redirects back with `review_authenticated: true` prop
3. Password Dialog closes, review form is revealed
4. User fills rating fields + text fields → POST to same route
5. Server validates (password + form fields), creates pending review (`is_approved = false`), redirects back with `review_created: true` flash
6. Success Dialog appears ("Thank you for leaving a review!") → user dismisses → page resets to password-gated state

## Backend

### Environment
- Add `REVIEW_PAGE_PASSWORD=lovethegardenshed` to `.env`
- Publish to `config('app.review_page_password')` via `config/app.php`

### Controller: `GuestBookCreateController`
- `__invoke()` (GET): renders `guest-book/create` with no special props; session state handled client-side via Inertia flash/props
- `store()` (POST): accepts `ReviewRequest`, verifies password, creates `Review`, returns redirect back with flash

### FormRequest: `ReviewRequest`
- Validates: `password` (required, string, matches env), `name`, `email`, `country`, `room_number`, `stay_date`, `overall_rating`, `cleanliness_rating`, `comfort_rating`, `service_rating`, `location_rating`, `value_rating`, `review`, `suggestions`, `would_recommend`
- Custom rule for password validation

### Route: `routes/web.php`
- `Route::get('/guest-book/create', ...)->name('guest-book.create')`
- `Route::post('/guest-book/create', ...)->name('guest-book.create')` (uses same route name, controller dispatches based on method)

### Model
- Review already has all fillable fields; `is_approved` defaults to `false` via migration default

## Frontend

### Page: `resources/js/pages/guest-book/create.tsx`
- Layout: `MainLayout` with title, uses `MainWrapper`
- Same HeadingBlock as guest-book index

### States
- `!review_authenticated`: Password Dialog shown
- `review_authenticated`: Form visible
- `review_created` flash: Success Dialog overlay

### Password Dialog
- Uses `@/components/ui/dialog` (Radix-based)
- Single text input for password + submit button
- On submit: Inertia POST with `{password}` as the only field
- Server redirects back with `review_authenticated: true` when correct, or validation error when wrong

### Review Form
- Follows the same pattern as `contact-us/contact-form.tsx`
- Fields: name, email, country, room, stay_date (date picker), star ratings (1-5 radio group for each category), review (textarea), suggestions (textarea), would_recommend (checkbox)
- Submit button with processing state

### Success Dialog
- "Thank you for leaving a review!" message
- Dismiss button → redirects to `/guest-book/create` (reset to password-gated state)

### Wayfinder Routes
- `import { create } from '@/routes/guest-book'` — auto-generated after `npm run build`

## What's NOT Included
- Email notifications on new review
- File uploads (images)
- Rate limiting
- Moderation UI
