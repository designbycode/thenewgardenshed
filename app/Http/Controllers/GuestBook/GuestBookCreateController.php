<?php

namespace App\Http\Controllers\GuestBook;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuestBook\ReviewRequest;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuestBookCreateController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('guest-book/create', [
            'review_authenticated' => $request->session()->get('review_authenticated', false),
        ]);
    }

    public function store(ReviewRequest $request): RedirectResponse
    {
        if ($request->input('action') === 'verify') {
            $request->session()->put('review_authenticated', true);

            return redirect()->back();
        }

        $data = $request->safe()->except(['password']);

        Review::create([
            ...$data,
            'is_approved' => false,
        ]);

        $request->session()->forget('review_authenticated');

        return redirect()->back()->with('review_created', true);
    }
}
