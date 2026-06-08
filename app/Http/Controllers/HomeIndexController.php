<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeIndexController extends Controller
{
    public function __invoke(Request $request)
    {
        $reviews = Review::approved()
            ->inRandomOrder()
            ->take(10)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'name' => $review->name,
                    'country' => $review->country,
                    'roomNumber' => $review->room_number,
                    'stayDate' => $review->stay_date->format('M Y'),
                    'overallRating' => $review->overall_rating,
                    'review' => $review->review,
                    'wouldRecommend' => $review->would_recommend,
                    'createdAt' => $review->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('home', [
            'reviews' => $reviews,
        ]);
    }
}
