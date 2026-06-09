<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('room_number')->nullable();
            $table->string('country')->nullable();
            $table->date('stay_date')->nullable();
            $table->unsignedTinyInteger('overall_rating');
            $table->unsignedTinyInteger('cleanliness_rating');
            $table->unsignedTinyInteger('comfort_rating');
            $table->unsignedTinyInteger('service_rating');
            $table->unsignedTinyInteger('location_rating');
            $table->unsignedTinyInteger('value_rating');
            $table->text('review');
            $table->text('suggestions')->nullable();
            $table->boolean('would_recommend')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
