<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ReviewReplyMail;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
            ->when($request->input('status'), function ($query, $status) {
                if ($status === 'approved') {
                    $query->where('is_approved', true);
                } elseif ($status === 'pending') {
                    $query->where('is_approved', false);
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Review $review): Response
    {
        return Inertia::render('admin/reviews/show', [
            'review' => $review,
        ]);
    }

    public function approve(Review $review): RedirectResponse
    {
        $review->is_approved = true;
        $review->save();

        session()->flash('toast', ['type' => 'success', 'message' => 'Review approved successfully.']);

        return redirect()->back();
    }

    public function reject(Review $review): RedirectResponse
    {
        $review->is_approved = false;
        $review->save();

        session()->flash('toast', ['type' => 'success', 'message' => 'Review rejected successfully.']);

        return redirect()->back();
    }

    public function destroy(Review $review): RedirectResponse
    {
        Review::destroy($review->id);

        session()->flash('toast', ['type' => 'success', 'message' => 'Review deleted successfully.']);

        return redirect()->back();
    }

    public function reply(Request $request, Review $review): RedirectResponse
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Mail::to($review->email)->send(new ReviewReplyMail($review, $request->subject, $request->message));

        session()->flash('toast', ['type' => 'success', 'message' => 'Reply email sent successfully.']);

        return redirect()->back();
    }
}
