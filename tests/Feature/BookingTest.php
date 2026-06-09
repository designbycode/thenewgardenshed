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

    public function test_booking_is_rejected_when_system_disabled(): void
    {
        config(['app.booking_system_enabled' => false]);

        $room = Room::factory()->create(['price_per_night' => 1000]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 2,
        ]);

        $response->assertStatus(403);
    }

    public function test_booking_succeeds_when_system_enabled(): void
    {
        config(['app.booking_system_enabled' => true]);

        $room = Room::factory()->create(['price_per_night' => 1000]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 2,
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('bookings', ['email' => 'jane@example.com']);
    }

    public function test_booking_rejected_when_guests_exceed_capacity(): void
    {
        $room = Room::factory()->create(['price_per_night' => 1000, 'max_guests' => 2]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'Group Booking',
            'email' => 'group@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 5,
        ]);

        $response->assertSessionHasErrors(['guests']);
    }

    public function test_booking_succeeds_when_guests_within_capacity(): void
    {
        $room = Room::factory()->create(['price_per_night' => 1000, 'max_guests' => 4]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'Small Group',
            'email' => 'small@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 4,
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('bookings', ['email' => 'small@example.com']);
    }

    public function test_booking_creation_sends_notification_emails(): void
    {
        $room = Room::factory()->create(['price_per_night' => 1000]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'Mail Test',
            'email' => 'mailtest@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 2,
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('bookings', ['email' => 'mailtest@example.com']);
    }

    public function test_booking_rejects_notes_exceeding_max_length(): void
    {
        $room = Room::factory()->create(['price_per_night' => 1000]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'Notes Test',
            'email' => 'notes@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 2,
            'notes' => str_repeat('a', 1001),
        ]);

        $response->assertSessionHasErrors(['notes']);
    }

    public function test_booking_succeeds_with_valid_notes(): void
    {
        config(['app.booking_system_enabled' => true]);
        $room = Room::factory()->create(['price_per_night' => 1000]);

        $response = $this->post(route('bookings.store'), [
            'room_id' => $room->id,
            'name' => 'Notes Test',
            'email' => 'notes@example.com',
            'check_in' => now()->addDay()->format('Y-m-d'),
            'check_out' => now()->addDays(3)->format('Y-m-d'),
            'guests' => 2,
            'notes' => 'Please provide a hypoallergenic pillow.',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('bookings', [
            'email' => 'notes@example.com',
            'notes' => 'Please provide a hypoallergenic pillow.',
        ]);
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
