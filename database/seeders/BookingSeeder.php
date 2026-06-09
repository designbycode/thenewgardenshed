<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = Room::all();

        if ($rooms->isEmpty()) {
            return;
        }

        foreach ($rooms as $room) {
            // Future booking
            Booking::create([
                'room_id' => $room->id,
                'name' => 'Future Guest',
                'email' => 'future@example.com',
                'phone' => '0123456789',
                'check_in' => now()->addMonths(1)->format('Y-m-d'),
                'check_out' => now()->addMonths(1)->addDays(3)->format('Y-m-d'),
                'guests' => 2,
                'total_price' => $room->price_per_night * 3,
                'status' => 'confirmed',
            ]);

            // Pending booking
            Booking::create([
                'room_id' => $room->id,
                'name' => 'Pending Guest',
                'email' => 'pending@example.com',
                'phone' => '0987654321',
                'check_in' => now()->addDays(10)->format('Y-m-d'),
                'check_out' => now()->addDays(12)->format('Y-m-d'),
                'guests' => 1,
                'total_price' => $room->price_per_night * 2,
                'status' => 'pending',
            ]);
        }
    }
}
