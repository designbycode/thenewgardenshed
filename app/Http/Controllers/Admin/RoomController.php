<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderImagesRequest;
use App\Http\Requests\Admin\StoreRoomRequest;
use App\Http\Requests\Admin\UpdateRoomRequest;
use App\Http\Requests\Admin\UploadImageRequest;
use App\Models\Amenity;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class RoomController extends Controller
{
    private function mapRoom(Room $room): array
    {
        $room->loadMissing('amenities', 'media');

        return [
            'id' => $room->id,
            'slug' => $room->slug,
            'name' => $room->name,
            'type' => $room->type,
            'description' => $room->description,
            'short_description' => $room->short_description,
            'blockquote' => $room->blockquote,
            'price_per_night' => $room->price_per_night,
            'capacity' => $room->capacity,
            'bed_type' => $room->bed_type,
            'bathroom_type' => $room->bathroom_type,
            'amenity_ids' => $room->amenities->pluck('id'),
        ];
    }

    private function mapMedia(Room $room): array
    {
        return $room->getMedia('images')
            ->map(fn ($m) => [
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
            ->toArray();
    }

    private function mapAmenities(): array
    {
        return Amenity::query()
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(fn ($a) => ['id' => $a->id, 'name' => $a->name, 'icon' => $a->icon])
            ->toArray();
    }

    public function index(Request $request)
    {
        $rooms = Room::query()
            ->with('media')
            ->when($request->search, fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            }))
            ->when($request->type, fn ($q, $type) => $q->where('type', $type))
            ->when($request->capacity, fn ($q, $capacity) => $q->where('capacity', '>=', $capacity))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($room) => [
                'id' => $room->id,
                'slug' => $room->slug,
                'name' => $room->name,
                'type' => $room->type,
                'price_per_night' => $room->price_per_night,
                'capacity' => $room->capacity,
                'bed_type' => $room->bed_type,
                'bathroom_type' => $room->bathroom_type,
                'short_description' => $room->short_description,
                'thumbnail' => $room->getFirstMediaUrl('images', 'thumb'),
                'images_count' => $room->getMedia('images')->count(),
                'created_at' => $room->created_at,
            ]);

        return Inertia::render('admin/rooms/index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search', 'type', 'capacity']),
        ]);
    }

    public function create()
    {
        $amenities = Amenity::query()
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'icon' => $a->icon,
            ]);

        return Inertia::render('admin/rooms/create', [
            'amenities' => $amenities,
        ]);
    }

    public function store(StoreRoomRequest $request)
    {
        $validated = $request->validated();

        $room = Room::create([
            'slug' => $validated['slug'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'description' => $validated['description'],
            'short_description' => $validated['short_description'],
            'blockquote' => $validated['blockquote'] ?? null,
            'price_per_night' => $validated['price_per_night'],
            'capacity' => $validated['capacity'],
            'bed_type' => $validated['bed_type'],
            'bathroom_type' => $validated['bathroom_type'],
        ]);

        if (! empty($validated['amenity_ids'])) {
            $room->amenities()->sync($validated['amenity_ids']);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Room created successfully. Add images below.']);

        return redirect()->route('admin.rooms.edit', $room);
    }

    public function edit(Room $room)
    {
        $room->load('amenities', 'media');

        return Inertia::render('admin/rooms/edit', [
            'room' => $this->mapRoom($room),
            'amenities' => $this->mapAmenities(),
            'media' => $this->mapMedia($room),
        ]);
    }

    public function update(UpdateRoomRequest $request, Room $room)
    {
        $validated = $request->validated();

        $room->update([
            'slug' => $validated['slug'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'description' => $validated['description'],
            'short_description' => $validated['short_description'],
            'blockquote' => $validated['blockquote'] ?? null,
            'price_per_night' => $validated['price_per_night'],
            'capacity' => $validated['capacity'],
            'bed_type' => $validated['bed_type'],
            'bathroom_type' => $validated['bathroom_type'],
        ]);

        $room->amenities()->sync($validated['amenity_ids'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Room updated.']);

        return redirect()->route('admin.rooms.edit', $room->fresh());
    }

    public function destroy(Room $room)
    {
        $room->clearMediaCollection('images');
        $room->amenities()->detach();
        $room->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Room deleted.']);

        return redirect()->route('admin.rooms.index');
    }

    public function uploadImage(UploadImageRequest $request, Room $room)
    {
        $validated = $request->validated();

        $room->addMedia($validated['image'])->toMediaCollection('images');

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Image uploaded.']);

        return redirect()->route('admin.rooms.edit', $room);
    }

    public function reorderImages(ReorderImagesRequest $request, Room $room)
    {
        $validated = $request->validated();

        foreach ($validated['media_ids'] as $index => $mediaId) {
            Media::where('id', $mediaId)->update(['order_column' => $index + 1]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Images reordered.']);

        return redirect()->route('admin.rooms.edit', $room);
    }

    public function deleteImage(Room $room, Media $media)
    {
        $media->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Image deleted.']);

        return redirect()->route('admin.rooms.edit', $room);
    }
}
