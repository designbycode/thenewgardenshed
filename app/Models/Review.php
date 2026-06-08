<?php

namespace App\Models;

use Database\Factories\ReviewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name', 'email', 'room_number', 'country', 'stay_date',
    'overall_rating', 'cleanliness_rating', 'comfort_rating',
    'service_rating', 'location_rating', 'value_rating',
    'review', 'suggestions', 'would_recommend',
    'is_approved', 'created_at',
])]
class Review extends Model
{
    /** @use HasFactory<ReviewFactory> */
    use HasFactory;

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('created_at');
    }

    protected function casts(): array
    {
        return [
            'overall_rating' => 'integer',
            'cleanliness_rating' => 'integer',
            'comfort_rating' => 'integer',
            'service_rating' => 'integer',
            'location_rating' => 'integer',
            'value_rating' => 'integer',
            'would_recommend' => 'boolean',
            'is_approved' => 'boolean',
            'stay_date' => 'date',
        ];
    }
}
