<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class RoomsShowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Room $room)
    {
        $room->load(['amenities', 'media']);

        return Inertia::render('rooms/show', [
            'room' => [
                'id' => $room->id,
                'slug' => $room->slug,
                'name' => $room->name,
                'type' => $room->type,
                'description' => $room->description,
                'shortDescription' => $room->short_description,
                'pricePerNight' => (int)$room->price_per_night,
                'capacity' => (int)$room->capacity,
                'bedType' => $room->bed_type,
                'bathroomType' => $room->bathroom_type,
                'imageUrl' => $room->getFirstMediaUrl('images', 'large') ?: null,
                'amenities' => $room->amenities->pluck('name')->toArray(),
                'images_count' => $room->getMedia('images')->count(),
                'media' => $room->getMedia('images')
                    ->map(fn($m) => [
                        'id' => $m->id,
                        'url' => $m->getUrl(),
                        'thumb' => $m->getUrl('thumb'),
                        'preview' => $m->getUrl('card'),
                        'name' => $m->name,
                        'order' => $m->order_column,
                        'size' => $m->size,
                    ])
                    ->sortBy('order')
                    ->values()
                    ->toArray(),
            ],
        ]);
    }
}
