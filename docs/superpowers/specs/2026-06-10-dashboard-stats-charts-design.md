# Dashboard Stats & Charts

## Overview

Add Bookings and Reviews stats and charts to the admin dashboard, replacing current placeholder patterns.

## Backend — Controller Changes

**`DashBoardIndexController`** will compute aggregate stats and monthly time-series data:

### Bookings Stats
- `total_bookings` — count of all bookings
- `revenue` — sum of `total_price` for confirmed bookings
- `avg_per_booking` — average `total_price` for confirmed bookings
- `bookings_per_month` — array of `{ month: string, count: int, revenue: float }` grouped by month (last 12 months)

### Reviews Stats
- `total_reviews` — count of approved reviews
- `pending_reviews` — count of unapproved reviews
- `avg_rating` — average `overall_rating` across approved reviews
- `reviews_per_month` — array of `{ month: string, count: int }` grouped by month (last 12 months)

All queries use aggregated SQL via Eloquent/DB facade, consistent with the existing `GuestBookIndexController` pattern.

## Frontend — Page Changes

### New TypeScript Types (`resources/js/types/data.ts`)
- `BookingStats` — `{ total_bookings, revenue, avg_per_booking, bookings_per_month: MonthlyBooking[] }`
- `DashboardStats` — `{ bookings: BookingStats, reviews: { total, pending, avg_rating, reviews_per_month: MonthlyReview[] } }`
- `MonthlyBooking` — `{ month: string, count: number, revenue: number }`
- `MonthlyReview` — `{ month: string, count: number }`

### Component: StatCard
A small reusable card component showing a label, a large number, and optional badge/icon. Used for each stat tile.

### Component: AreaChartCard
A reusable card wrapping `ChartContainer` (shadcn Chart) with an `AreaChart` from Recharts. Accepts `data`, `config`, `title`, `dataKey`, `xKey` props.

### Dashboard Page Layout

**Top row — Stat Cards (grid `md:grid-cols-4`):**
1. Total Bookings
2. Revenue ($)
3. Avg per Booking ($)
4. Total Reviews

**Bottom row — Charts (grid `md:grid-cols-2`):**
1. Bookings Over Time (area chart, monthly count + revenue as secondary axis)
2. Reviews Over Time (area chart, monthly count)

Both charts use shadcn's `ChartContainer` with Recharts `AreaChart`.

## Files Changed

| File | Change |
|------|--------|
| `app/Http/Controllers/Dashboard/DashBoardIndexController.php` | Compute and pass stats to Inertia |
| `resources/js/types/data.ts` | Add booking/dashboard types |
| `resources/js/pages/dashboard.tsx` | Render stats + charts instead of placeholders |

## Implementation Order

1. Add TypeScript types to `data.ts`
2. Build `DashBoardIndexController` backend stats queries
3. Implement `dashboard.tsx` with stat cards and charts
