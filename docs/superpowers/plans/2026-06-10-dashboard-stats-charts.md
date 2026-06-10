# Dashboard Stats & Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Bookings and Reviews stats/charts to the admin dashboard page.

**Architecture:** Backend controller aggregates stats via Eloquent/DB queries and passes them as Inertia props. Frontend renders stat cards and Recharts area charts using shadcn ChartContainer component.

**Tech Stack:** Laravel 12, React 19, Inertia.js 3, Recharts 3.8.0, shadcn Chart, Tailwind CSS 4

---

### Task 1: Add TypeScript Types

**Files:**
- Modify: `resources/js/types/data.ts`

- [ ] **Step 1: Add MonthlyBooking type after RoomItem**

```typescript
export interface MonthlyBooking {
    month: string;
    count: number;
    revenue: number;
}
```

- [ ] **Step 2: Add MonthlyReview type after MonthlyBooking**

```typescript
export interface MonthlyReview {
    month: string;
    count: number;
}
```

- [ ] **Step 3: Add BookingStats type after MonthlyReview**

```typescript
export interface BookingStats {
    total_bookings: number;
    revenue: number;
    avg_per_booking: number;
    bookings_per_month: MonthlyBooking[];
}
```

- [ ] **Step 4: Add DashboardStats type after BookingStats**

```typescript
export interface DashboardStats {
    bookings: BookingStats;
    reviews: {
        total_reviews: number;
        pending_reviews: number;
        avg_rating: number;
        reviews_per_month: MonthlyReview[];
    };
}
```

- [ ] **Step 5: Commit**

```bash
git add resources/js/types/data.ts
git commit -m "feat: add dashboard stats TypeScript types"
```

---

### Task 2: Update Dashboard Controller

**Files:**
- Modify: `app/Http/Controllers/Dashboard/DashBoardIndexController.php`

- [ ] **Step 1: Add imports to controller**

Replace the existing content with:

```php
<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashBoardIndexController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $lastYear = Carbon::now()->subYear();

        $bookingsPerMonth = Booking::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw('COUNT(*) as count'),
            DB::raw("COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as revenue"),
        )
            ->where('created_at', '>=', $lastYear)
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'count' => (int) $row->count,
                'revenue' => (float) $row->revenue,
            ]);

        $bookingTotals = Booking::select(
            DB::raw('COUNT(*) as total_bookings'),
            DB::raw("COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as revenue"),
            DB::raw("COALESCE(AVG(CASE WHEN status = 'confirmed' THEN total_price ELSE NULL END), 0) as avg_per_booking"),
        )->first();

        $reviewsPerMonth = Review::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw('COUNT(*) as count'),
        )
            ->where('created_at', '>=', $lastYear)
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'count' => (int) $row->count,
            ]);

        $reviewStats = Review::select(
            DB::raw('COUNT(*) as total_reviews'),
            DB::raw('COALESCE(SUM(CASE WHEN is_approved = false THEN 1 ELSE 0 END), 0) as pending_reviews'),
            DB::raw('ROUND(COALESCE(AVG(CASE WHEN is_approved = true THEN overall_rating ELSE NULL END), 0), 1) as avg_rating'),
        )->first();

        return Inertia::render('dashboard', [
            'stats' => [
                'bookings' => [
                    'total_bookings' => (int) $bookingTotals->total_bookings,
                    'revenue' => (float) $bookingTotals->revenue,
                    'avg_per_booking' => round((float) $bookingTotals->avg_per_booking, 2),
                    'bookings_per_month' => $bookingsPerMonth,
                ],
                'reviews' => [
                    'total_reviews' => (int) $reviewStats->total_reviews,
                    'pending_reviews' => (int) $reviewStats->pending_reviews,
                    'avg_rating' => (float) $reviewStats->avg_rating,
                    'reviews_per_month' => $reviewsPerMonth,
                ],
            ],
        ]);
    }
}
```

- [ ] **Step 2: Verify the controller works**

Run: `php artisan route:list --path=dashboard`
Expected: Shows the dashboard route

- [ ] **Step 3: Commit**

```bash
git add app/Http/Controllers/Dashboard/DashBoardIndexController.php
git commit -m "feat: add dashboard stats computation to controller"
```

---

### Task 3: Build Dashboard Page with Stats and Charts

**Files:**
- Modify: `resources/js/pages/dashboard.tsx`

- [ ] **Step 1: Replace dashboard.tsx content with stats and charts**

```tsx
import { Head } from '@inertiajs/react';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { dashboard } from '@/routes';
import type { DashboardStats } from '@/types/data';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface PageProps {
    stats: DashboardStats;
}

function StatCard({ label, value, prefix }: { label: string; value: string | number; prefix?: string }) {
    return (
        <div className="flex flex-col gap-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-2xl font-bold tracking-tight">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </span>
        </div>
    );
}

function BookingChart({ data }: { data: DashboardStats['bookings']['bookings_per_month'] }) {
    const config = {
        bookings: {
            label: 'Bookings',
            color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <h3 className="mb-4 text-sm font-medium">Bookings Over Time</h3>
            <ChartContainer config={config} className="aspect-[2/1] w-full">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-bookings)"
                        fill="var(--color-bookings)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}

function ReviewChart({ data }: { data: DashboardStats['reviews']['reviews_per_month'] }) {
    const config = {
        reviews: {
            label: 'Reviews',
            color: 'hsl(var(--chart-2))',
        },
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <h3 className="mb-4 text-sm font-medium">Reviews Over Time</h3>
            <ChartContainer config={config} className="aspect-[2/1] w-full">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-reviews)"
                        fill="var(--color-reviews)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}

export default function Dashboard({ stats }: PageProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <StatCard label="Total Bookings" value={stats.bookings.total_bookings} />
                    <StatCard label="Revenue" value={stats.bookings.revenue} prefix="$" />
                    <StatCard label="Avg per Booking" value={stats.bookings.avg_per_booking} prefix="$" />
                    <StatCard label="Total Reviews" value={stats.reviews.total_reviews} />
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <BookingChart data={stats.bookings.bookings_per_month} />
                    <ReviewChart data={stats.reviews.reviews_per_month} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
```

- [ ] **Step 2: Verify the page compiles**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add resources/js/pages/dashboard.tsx
git commit -m "feat: add bookings and reviews stats/charts to dashboard"
```


