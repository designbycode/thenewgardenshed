<?php

use App\Models\Amenity;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->withoutVite();
});

test('admin can see rooms index', function () {
    $this->actingAs($this->user)
        ->get(route('admin.rooms.index'))
        ->assertOk();
});

test('admin can create a room', function () {
    $amenity = Amenity::factory()->create();

    $this->actingAs($this->user)
        ->post(route('admin.rooms.store'), [
            'slug' => 'luxury-suite',
            'name' => 'Luxury Suite',
            'type' => 'luxury',
            'description' => 'A very nice room.',
            'short_description' => 'Nice room.',
            'price_per_night' => 250,
            'capacity' => 4,
            'bed_type' => 'King',
            'bathroom_type' => 'Ensuite',
            'amenity_ids' => [$amenity->id],
        ])
        ->assertRedirect(route('admin.rooms.edit', 'luxury-suite'));

    $this->assertDatabaseHas('rooms', ['slug' => 'luxury-suite']);
});

test('admin can update a room', function () {
    $room = Room::factory()->create(['name' => 'Old Name', 'slug' => 'old-slug']);

    $this->actingAs($this->user)
        ->put(route('admin.rooms.update', $room), [
            'slug' => 'new-name',
            'name' => 'New Name',
            'type' => 'standard',
            'description' => 'Updated description.',
            'short_description' => 'Updated short.',
            'price_per_night' => 150,
            'capacity' => 2,
            'bed_type' => 'Queen',
            'bathroom_type' => 'Private',
        ])
        ->assertRedirect(route('admin.rooms.edit', 'new-name'));

    $this->assertDatabaseHas('rooms', ['name' => 'New Name', 'slug' => 'new-name']);
});

test('admin can delete a room', function () {
    $room = Room::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('admin.rooms.destroy', $room))
        ->assertRedirect(route('admin.rooms.index'));

    $this->assertDatabaseMissing('rooms', ['id' => $room->id]);
});
