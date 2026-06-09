<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $reviews = Review::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('review', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'filters' => $request->only(['search']),
        ]);
    }

    public function approve(Review $review): RedirectResponse
    {
        $review->update(['is_approved' => true]);

        session()->flash('toast', ['type' => 'success', 'message' => 'Review approved successfully.']);

        return redirect()->back();
    }

    public function reject(Review $review): RedirectResponse
    {
        $review->update(['is_approved' => false]);

        session()->flash('toast', ['type' => 'success', 'message' => 'Review rejected successfully.']);

        return redirect()->back();
    }

    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        session()->flash('toast', ['type' => 'success', 'message' => 'Review deleted successfully.']);

        return redirect()->back();
    }
}
