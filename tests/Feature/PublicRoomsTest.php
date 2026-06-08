<?php

use App\Models\Room;

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class);

test('public users can see rooms index', function () {
    Room::factory()->count(3)->create();

    $this->get(route('rooms.index'))
        ->assertOk();
});

test('public users can see room details', function () {
    $room = Room::factory()->create();

    $this->get(route('rooms.show', $room->slug))
        ->assertOk();
});
