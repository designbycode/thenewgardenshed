<?php

namespace App\Models;

use Database\Factories\AmenityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Amenity extends Model
{
    protected $fillable = ['slug', 'name', 'description', 'icon', 'display_order'];

    /** @use HasFactory<AmenityFactory> */
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function rooms(): BelongsToMany
    {
        return $this->belongsToMany(Room::class);
    }
}
