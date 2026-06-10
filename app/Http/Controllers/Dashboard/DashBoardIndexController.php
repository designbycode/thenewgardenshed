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

        $dateFormat = DB::getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        $bookingsPerMonth = Booking::select(
            DB::raw("{$dateFormat} as month"),
            DB::raw('COUNT(*) as count'),
            DB::raw("COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as revenue"),
        )
            ->where('created_at', '>=', $lastYear)
            ->groupBy(DB::raw($dateFormat))
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
            DB::raw("{$dateFormat} as month"),
            DB::raw('COUNT(*) as count'),
        )
            ->where('created_at', '>=', $lastYear)
            ->groupBy(DB::raw($dateFormat))
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
