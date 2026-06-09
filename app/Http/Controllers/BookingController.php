<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingStoreRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Events\BookingCreated;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;

class BookingController extends Controller
{
    public function store(BookingStoreRequest $request): RedirectResponse
    {
        $room = Room::findOrFail($request->validated('room_id'));

        $checkIn = Carbon::parse($request->validated('check_in'));
        $checkOut = Carbon::parse($request->validated('check_out'));
        $nights = $checkIn->diffInDays($checkOut);

        $totalPrice = $nights * $room->price_per_night;

        $booking = Booking::create([
            ...$request->validated(),
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        event(new BookingCreated($booking));

        session()->flash('toast', ['type' => 'success', 'message' => 'Your booking request has been submitted successfully.']);

        return redirect()->back()->with('booking_success', 'Your booking request has been submitted successfully.');
    }
}
