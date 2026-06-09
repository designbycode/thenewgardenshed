<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_a_booking(): void
    {
        $room = Room::factory()->create(['price_per_night' => 1000]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '1234567890',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 2,
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('bookings', [
            'room_id' => $room->id,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'total_price' => 2000, // 2 nights * 1000
            'status' => 'pending',
        ]);
    }

    public function test_user_cannot_book_overlapping_dates(): void
    {
        $room = Room::factory()->create();

        Booking::create([
            'room_id' => $room->id,
            'name' => 'Existing Booking',
            'email' => 'existing@example.com',
            'check_in' => now()->addDays(2)->format('Y-m-d'),
            'check_out' => now()->addDays(5)->format('Y-m-d'),
            'guests' => 1,
            'total_price' => 100,
            'status' => 'confirmed',
        ]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'New Guest',
            'email' => 'new@example.com',
            'check_in' => now()->addDays(3)->format('Y-m-d'),
            'check_out' => now()->addDays(4)->format('Y-m-d'),
            'guests' => 1,
        ]);

        $response->assertSessionHasErrors(['check_in']);
        $this->assertDatabaseCount('bookings', 1);
    }

    public function test_admin_can_update_booking_status(): void
    {
        $user = User::factory()->create();
        $booking = Booking::create([
            'room_id' => Room::factory()->create()->id,
            'name' => 'Test Guest',
            'email' => 'test@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(2)->format('Y-m-d'),
            'guests' => 1,
            'total_price' => 100,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->put(route('admin.bookings.update', $booking), [
            'status' => 'confirmed',
        ]);

        $response->assertStatus(302);
        $this->assertEquals('confirmed', $booking->fresh()->status);
    }
}
