<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomsIndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $rooms = Room::with(['amenities', 'media'])
            ->get()
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'slug' => $room->slug,
                    'name' => $room->name,
                    'type' => $room->type,
                    'description' => $room->description,
                    'shortDescription' => $room->short_description,
                    'pricePerNight' => (int) $room->price_per_night,
                    'capacity' => (int) $room->capacity,
                    'bedType' => $room->bed_type,
                    'bathroomType' => $room->bathroom_type,
                    'thumbnail' => $room->getFirstMediaUrl('images', 'thumb') ?: null,
                    'cardImage' => $room->getFirstMediaUrl('images', 'card') ?: null,
                    'amenities' => $room->amenities->pluck('name')->toArray(),
                    'images_count' => $room->getMedia('images')->count(),
                ];
            });

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
        ]);
    }
}
