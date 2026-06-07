<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'slug' => 'protea-suite',
                'name' => 'The Protea Luxury Suite',
                'type' => 'luxury',
                'description' => 'Our premier suite offers an expansive rustic-chic layouts with absolute luxury. It features a private flagstone entrance, a premium king-size bed draped in fine Egyptian cotton, and stunning views of the Cabernet vineyards and mountains. The spacious en-suite bathroom is a sanctuary, featuring a deep freestanding soaking tub, a dual vanity, and a refreshing walk-in glass rain shower.',
                'short_description' => 'Sumptuous king suite with full double bathroom, deep soaking tub, and vineyard patio views.',
                'price_per_night' => 1650,
                'capacity' => 2,
                'bed_type' => 'King Bed',
                'bathroom_type' => 'En-suite Full Bath (Luxury Tub + Rain Shower)',
                'amenity_ids' => [1, 2, 3, 4, 5, 6, 7, 8],
            ],
            [
                'slug' => 'lavender-king',
                'name' => 'The Lavender King Room',
                'type' => 'standard',
                'description' => 'Overlooking our lush blooming lavender walkways, this spacious room features a comfortable king-size bed (convertible to single twin configurations upon request). The private verandah provides the perfect spot to enjoy your morning coffee while taking in the fresh country air. It holds a beautifully designed en-suite bathroom with a spacious walk-in shower.',
                'short_description' => 'Versatile king/twin room with front verandah, lovely garden views, and full amenities.',
                'price_per_night' => 1255,
                'capacity' => 2,
                'bed_type' => 'King or Twin Beds',
                'bathroom_type' => 'En-suite Bathroom (Walk-in Shower)',
                'amenity_ids' => [1, 2, 3, 4, 5, 6, 7, 9],
            ],
            [
                'slug' => 'cabernet-king',
                'name' => 'The Cabernet Vineyard Room',
                'type' => 'standard',
                'description' => 'Bask in a serene environment overlooking the vineyard margins. The Cabernet Room boasts plush, elegant furnishings, a handcrafted King-size bed, a comfortable reading armchair, and a dedicated workspace. A glass door opens onto a cozy private wooden deck close to the vineyard lines.',
                'short_description' => 'Peaceful garden facing room with king-size bed, private entrance, and smart work nook.',
                'price_per_night' => 1255,
                'capacity' => 2,
                'bed_type' => 'King Bed',
                'bathroom_type' => 'En-suite Bathroom (Walk-in Shower)',
                'amenity_ids' => [1, 2, 3, 4, 5, 6, 7, 10],
            ],
            [
                'slug' => 'olive-queen',
                'name' => 'The Olive Blossom Room',
                'type' => 'cozy',
                'description' => 'A delight for solo travelers or cozy couples, the Olive Blossom features a beautiful Queen-size bed, tranquil sage tones, and direct pathway access leading to the communal swimming pool. Highly cozy and well-ventilated, this room represents the perfect balance of budget and high comfort.',
                'short_description' => 'Charming queen room offering absolute quiet, classic styling, and poolside proximity.',
                'price_per_night' => 1050,
                'capacity' => 2,
                'bed_type' => 'Queen Bed',
                'bathroom_type' => 'En-suite Bathroom (Walk-in Shower)',
                'amenity_ids' => [1, 2, 3, 4, 5, 6, 7, 9],
            ],
            [
                'slug' => 'jacaranda-garden',
                'name' => 'The Jacaranda Suite',
                'type' => 'luxury',
                'description' => 'Named after the grand Jacaranda growing right outside, this high-end room is elevated by extra-high wooden ceilings, bespoke historic Cape furniture, and a luxurious en-suite bathroom containing a freestanding vintage clawfoot bathtub as well as a modern tiled shower. Includes a quiet private garden courtyard.',
                'short_description' => 'High-ceilinged luxury suite with beautiful clawfoot bathtub, private courtyard, and work desk.',
                'price_per_night' => 1550,
                'capacity' => 2,
                'bed_type' => 'King Bed',
                'bathroom_type' => 'En-suite Full Bath (Clawfoot Tub + Tiled Shower)',
                'amenity_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 10],
            ],
            [
                'slug' => 'agapanthus-pool',
                'name' => 'The Agapanthus Pool Room',
                'type' => 'standard',
                'description' => 'Wake up and take a refreshing plunge! The Agapanthus Room opens its double double-glazed French doors directly onto the sparkling turquoise swimming pool terrace. Sun loungers are positioned right outside your private threshold. Perfect for sun-loving vineyard holidaymakers.',
                'short_description' => 'Cheerful king room looking directly onto the sparkling swimming pool with poolside loungers.',
                'price_per_night' => 1255,
                'capacity' => 2,
                'bed_type' => 'King Bed',
                'bathroom_type' => 'En-suite Bathroom (Walk-in Shower)',
                'amenity_ids' => [1, 2, 3, 4, 5, 6, 7, 9],
            ],
            [
                'slug' => 'bougainvillea-deluxe',
                'name' => 'The Bougainvillea Deluxe Room',
                'type' => 'luxury',
                'description' => 'Enveloped in the vibrant colors of Cape Winelands flowers, this deluxe suite features elegant, hand-painted wooden paneling, a cloud-like King bed, and a full en-suite bath with a romantic soaking tub and stone-clad shower. Enjoy breathtaking daily sunsets behind the Hawequa mountains from your deck chairs.',
                'short_description' => 'Regal suite featuring warm floral accents, full luxury bathroom, and magnificent mountain sunsets.',
                'price_per_night' => 1600,
                'capacity' => 2,
                'bed_type' => 'King Bed',
                'bathroom_type' => 'En-suite Full Bath (Luxury Bath + Stone Shower)',
                'amenity_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9],
            ],
        ];

        foreach ($rooms as $roomData) {
            $amenityIds = $roomData['amenity_ids'];
            unset($roomData['amenity_ids']);

            $room = Room::create($roomData);
            $room->amenities()->sync($amenityIds);
        }
    }
}
