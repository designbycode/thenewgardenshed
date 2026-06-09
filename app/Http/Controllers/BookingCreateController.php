<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingCreateController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $rooms = Room::active()
            ->get()
            ->map(fn ($room) => [
                'id' => $room->id,
                'name' => $room->name,
                'price_per_night' => $room->price_per_night,
                'max_guests' => $room->max_guests,
            ]);

        return Inertia::render('bookings/create', [
            'rooms' => $rooms,
            'selected_room_id' => (int) $request->query('room_id'),
        ]);
    }
}
