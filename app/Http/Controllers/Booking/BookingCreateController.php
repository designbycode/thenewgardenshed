<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingCreateController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $rooms = Room::with(['media', 'bookings' => function ($query) {
            $query->whereNotIn('status', ['cancelled', 'rejected']);
        }])->where('is_active', true)->get()->map(fn ($room) => [
            'id' => $room->id,
            'slug' => $room->slug,
            'name' => $room->name,
            'type' => $room->type,
            'pricePerNight' => (int) $room->price_per_night,
            'capacity' => (int) $room->capacity,
            'maxGuests' => (int) $room->max_guests,
            'bedType' => $room->bed_type,
            'thumbnail' => $room->getFirstMediaUrl('images', 'thumb') ?: null,
            'cardImage' => $room->getFirstMediaUrl('images', 'card') ?: null,
            'bookings' => $room->bookings->map(fn ($booking) => [
                'check_in' => $booking->check_in->format('Y-m-d'),
                'check_out' => $booking->check_out->format('Y-m-d'),
            ]),
        ]);

        return Inertia::render('booking/create', [
            'rooms' => $rooms,
            'preselectedRoomId' => $request->query('room_id') ? (int) $request->query('room_id') : null,
        ]);
    }
}
