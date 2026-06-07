<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            ['slug' => 'air-conditioning', 'name' => 'Air Conditioning', 'icon' => 'Fan', 'display_order' => 1, 'description' => 'Stay comfortable year-round with individually controlled air conditioning.'],
            ['slug' => 'free-wifi', 'name' => 'Free WiFi', 'icon' => 'Wifi', 'display_order' => 2, 'description' => 'High-speed wireless internet access throughout the property.'],
            ['slug' => 'flat-screen-tv', 'name' => 'Flat-Screen TV', 'icon' => 'Tv', 'display_order' => 3, 'description' => 'Large flat-screen television with premium channels.'],
            ['slug' => 'mini-bar', 'name' => 'Mini Bar', 'icon' => 'Wine', 'display_order' => 4, 'description' => 'Fully stocked mini bar with beverages and snacks.'],
            ['slug' => 'tea-coffee-station', 'name' => 'Tea & Coffee Station', 'icon' => 'Coffee', 'display_order' => 5, 'description' => 'In-room tea and coffee making facilities.'],
            ['slug' => 'hairdryer', 'name' => 'Hairdryer', 'icon' => 'Wind', 'display_order' => 6, 'description' => 'Professional-grade hairdryer for your convenience.'],
            ['slug' => 'room-safe', 'name' => 'Room Safe', 'icon' => 'ShieldCheck', 'display_order' => 7, 'description' => 'In-room electronic safe for your valuables.'],
            ['slug' => 'luxury-bath-amenities', 'name' => 'Luxury Bath Amenities', 'icon' => 'Bath', 'display_order' => 8, 'description' => 'Premium toiletries and bath products.'],
            ['slug' => 'garden-view', 'name' => 'Garden View', 'icon' => 'Mountain', 'display_order' => 9, 'description' => 'Beautiful views overlooking our manicured gardens.'],
            ['slug' => 'private-patio', 'name' => 'Private Patio', 'icon' => 'TreePine', 'display_order' => 10, 'description' => 'Private outdoor patio area with seating.'],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create($amenity);
        }
    }
}
