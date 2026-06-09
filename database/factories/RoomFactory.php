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
        $name = $this->faker->unique()->word().' Room';

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'type' => $this->faker->randomElement(['luxury', 'standard', 'cozy']),
            'description' => $this->faker->paragraph(),
            'short_description' => $this->faker->sentence(),
            'price_per_night' => $this->faker->randomFloat(2, 50, 500),
            'capacity' => $this->faker->numberBetween(1, 4),
            'max_guests' => $this->faker->numberBetween(2, 4),
            'bed_type' => $this->faker->randomElement(['King', 'Queen', 'Double']),
            'bathroom_type' => $this->faker->randomElement(['Ensuite', 'Shared']),
        ];
    }
}
