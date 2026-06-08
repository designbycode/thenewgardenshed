<?php

use App\Models\Amenity;
use App\Models\User;

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->withoutVite();
});

test('admin can see amenities index', function () {
    $this->actingAs($this->user)
        ->get(route('admin.amenities.index'))
        ->assertOk();
});

test('admin can create an amenity', function () {
    $this->actingAs($this->user)
        ->post(route('admin.amenities.store'), [
            'slug' => 'high-speed-wifi',
            'name' => 'High Speed WiFi',
            'description' => 'Stay connected.',
            'icon' => 'wifi',
            'display_order' => 1,
        ])
        ->assertRedirect(route('admin.amenities.index'));

    $this->assertDatabaseHas('amenities', ['slug' => 'high-speed-wifi']);
});

test('admin can update an amenity', function () {
    $amenity = Amenity::factory()->create(['name' => 'Old WiFi', 'slug' => 'old-wifi']);

    $this->actingAs($this->user)
        ->put(route('admin.amenities.update', $amenity), [
            'slug' => 'new-wifi',
            'name' => 'New WiFi',
            'icon' => 'wifi-fast',
            'display_order' => 2,
        ])
        ->assertRedirect(route('admin.amenities.index'));

    $this->assertDatabaseHas('amenities', ['name' => 'New WiFi', 'slug' => 'new-wifi']);
});

test('admin can delete an amenity', function () {
    $amenity = Amenity::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('admin.amenities.destroy', $amenity))
        ->assertRedirect(route('admin.amenities.index'));

    $this->assertDatabaseMissing('amenities', ['id' => $amenity->id]);
});
