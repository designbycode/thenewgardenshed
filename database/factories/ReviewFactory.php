<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'country' => $this->faker->country(),
            'room_number' => 'Suite '.$this->faker->numberBetween(1, 10),
            'stay_date' => $this->faker->date(),
            'overall_rating' => $this->faker->numberBetween(1, 5),
            'cleanliness_rating' => $this->faker->numberBetween(1, 5),
            'comfort_rating' => $this->faker->numberBetween(1, 5),
            'service_rating' => $this->faker->numberBetween(1, 5),
            'location_rating' => $this->faker->numberBetween(1, 5),
            'value_rating' => $this->faker->numberBetween(1, 5),
            'review' => $this->faker->paragraph(),
            'is_approved' => false,
            'would_recommend' => $this->faker->boolean(),
        ];
    }
}
