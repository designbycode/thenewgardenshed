<?php

namespace App\Http\Controllers\GuestBook;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GuestBookIndexController extends Controller
{
    public function __invoke(Request $request)
    {
        $stats = Review::approved()
            ->select(
                DB::raw('COUNT(*) as total'),
                DB::raw('ROUND(AVG(overall_rating), 1) as avg_overall'),
                DB::raw('ROUND(AVG(cleanliness_rating), 1) as avg_cleanliness'),
                DB::raw('ROUND(AVG(comfort_rating), 1) as avg_comfort'),
                DB::raw('ROUND(AVG(service_rating), 1) as avg_service'),
                DB::raw('ROUND(AVG(location_rating), 1) as avg_location'),
                DB::raw('ROUND(AVG(value_rating), 1) as avg_value'),
                DB::raw('ROUND(AVG(would_recommend) * 100) as recommend_pct'),
            )
            ->first();

        return Inertia::render('guest-book/index', [
            'reviews' => Inertia::scroll(fn() => Review::approved()
                ->recent()
                ->paginate(9)
                ->through(fn($review) => [
                    'id' => $review->id,
                    'name' => $review->name,
                    'country' => $review->country,
                    'roomNumber' => $review->room_number,
                    'stayDate' => $review->stay_date->format('M Y'),
                    'overallRating' => $review->overall_rating,
                    'cleanlinessRating' => $review->cleanliness_rating,
                    'comfortRating' => $review->comfort_rating,
                    'serviceRating' => $review->service_rating,
                    'locationRating' => $review->location_rating,
                    'valueRating' => $review->value_rating,
                    'review' => $review->review,
                    'suggestions' => $review->suggestions,
                    'wouldRecommend' => $review->would_recommend,
                    'createdAt' => $review->created_at->diffForHumans(),
                ])),
            'stats' => $stats,
        ]);
    }
}
