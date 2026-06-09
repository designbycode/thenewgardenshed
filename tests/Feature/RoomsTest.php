<?php

namespace Tests\Feature;

use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RoomsTest extends TestCase
{
    use RefreshDatabase;

    public function test_rooms_index_page_is_displayed(): void
    {
        Room::factory()->count(3)->create();

        $response = $this->get('/rooms');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('rooms/index')
            ->has('rooms', 3)
        );
    }

    public function test_room_show_page_is_displayed(): void
    {
        $room = Room::factory()->create();

        $response = $this->get("/rooms/{$room->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('rooms/show')
            ->has('room')
            ->where('room.slug', $room->slug)
        );
    }
}
