<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_review(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create(['is_approved' => false]);

        $response = $this->actingAs($user)->post(route('admin.reviews.approve', $review));

        $response->assertStatus(302);
        $this->assertTrue($review->fresh()->is_approved);
    }

    public function test_admin_can_reject_review(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create(['is_approved' => true]);

        $response = $this->actingAs($user)->post(route('admin.reviews.reject', $review));

        $response->assertStatus(302);
        $this->assertFalse($review->fresh()->is_approved);
    }

    public function test_admin_can_delete_review(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.reviews.destroy', $review));

        $response->assertStatus(302);
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }
}
