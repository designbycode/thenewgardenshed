<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->word() . ' Room';
        return [
            'slug' => Str::slug($name),
            'name' => $name,
            'type' => $this->faker->randomElement(['luxury', 'standard', 'cozy']),
            'description' => $this->faker->paragraph(),
            'short_description' => $this->faker->sentence(),
            'price_per_night' => $this->faker->randomFloat(2, 50, 500),
            'capacity' => $this->faker->numberBetween(1, 10),
            'bed_type' => 'King',
            'bathroom_type' => 'Private',
        ];
    }
}
