<?php

namespace Tests\Feature\Admin;

use App\Models\Amenity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AmenityCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_amenities_index(): void
    {
        $admin = User::factory()->create();
        Amenity::factory()->count(3)->create();

        $response = $this->actingAs($admin)->get('/admin/amenities');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/amenities/index')
            ->has('amenities.data', 3)
        );
    }

    public function test_admin_can_create_an_amenity(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->post('/admin/amenities', [
            'name' => 'Free WiFi',
            'slug' => 'free-wifi',
            'description' => 'High speed internet',
            'icon' => 'wifi',
            'display_order' => 1,
        ]);

        $response->assertRedirect('/admin/amenities');
        $this->assertDatabaseHas('amenities', [
            'name' => 'Free WiFi',
            'slug' => 'free-wifi',
        ]);
    }

    public function test_admin_can_update_an_amenity(): void
    {
        $admin = User::factory()->create();
        $amenity = Amenity::factory()->create(['name' => 'Old Name', 'slug' => 'old-name']);

        $response = $this->actingAs($admin)->put("/admin/amenities/{$amenity->slug}", [
            'name' => 'New Name',
            'slug' => 'new-name',
            'description' => 'Updated description',
            'icon' => 'wifi',
            'display_order' => 2,
        ]);

        $response->assertRedirect('/admin/amenities');
        $this->assertDatabaseHas('amenities', [
            'id' => $amenity->id,
            'name' => 'New Name',
            'slug' => 'new-name',
        ]);
    }

    public function test_admin_can_delete_an_amenity(): void
    {
        $admin = User::factory()->create();
        $amenity = Amenity::factory()->create();

        $response = $this->actingAs($admin)->delete("/admin/amenities/{$amenity->slug}");

        $response->assertRedirect('/admin/amenities');
        $this->assertDatabaseMissing('amenities', ['id' => $amenity->id]);
    }
}
