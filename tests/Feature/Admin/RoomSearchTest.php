<?php

namespace Tests\Feature\Admin;

use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RoomSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_search_rooms_by_name(): void
    {
        $admin = User::factory()->create();
        Room::factory()->create(['name' => 'Luxury Suite']);
        Room::factory()->create(['name' => 'Standard Room']);

        $response = $this->actingAs($admin)->get('/admin/rooms?search=Luxury');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/rooms/index')
            ->has('rooms.data', 1)
            ->where('rooms.data.0.name', 'Luxury Suite')
        );
    }

    public function test_admin_can_filter_rooms_by_type(): void
    {
        $admin = User::factory()->create();
        Room::factory()->create(['name' => 'Room A', 'type' => 'luxury']);
        Room::factory()->create(['name' => 'Room B', 'type' => 'standard']);

        $response = $this->actingAs($admin)->get('/admin/rooms?type=luxury');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/rooms/index')
            ->has('rooms.data', 1)
            ->where('rooms.data.0.name', 'Room A')
        );
    }
}
