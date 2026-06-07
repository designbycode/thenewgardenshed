<?php

namespace App\Models;

use Database\Factories\AmenityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['slug', 'name', 'description', 'icon', 'display_order'])]
class Amenity extends Model
{
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
