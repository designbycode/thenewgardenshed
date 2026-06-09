<?php

namespace App\Models;

use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Room extends Model implements HasMedia
{
    protected $fillable = [
        'slug',
        'name',
        'type',
        'description',
        'short_description',
        'blockquote',
        'price_per_night',
        'capacity',
        'bed_type',
        'bathroom_type',
        'max_guests',
        'number_of_beds',
        'is_active',
    ];

    /** @use HasFactory<RoomFactory> */
    use HasFactory;

    use InteractsWithMedia;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function bookings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useDisk('public');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 320, 180)
            ->format('webp')
            ->quality(80);

        $this->addMediaConversion('card')
            ->fit(Fit::Crop, 640, 360)
            ->format('webp')
            ->quality(80);

        $this->addMediaConversion('large')
            ->fit(Fit::Crop, 1280, 720)
            ->format('webp')
            ->quality(85);
    }

    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
            'capacity' => 'integer',
            'max_guests' => 'integer',
            'number_of_beds' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
