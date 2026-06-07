<?php

use App\Http\Controllers\ContactUs\ContactUsIndexController;
use App\Http\Controllers\Facilities\FacilitiesIndexController;
use App\Http\Controllers\HomeIndexController;
use App\Http\Controllers\Rooms\RoomsIndexController;
use App\Http\Controllers\Rooms\RoomsShowController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeIndexController::class)->name('home');
Route::get('/rooms', RoomsIndexController::class)->name('rooms.index');
Route::get('/rooms/{room:slug}', RoomsShowController::class)->name('rooms.show');
Route::get('/facilities', FacilitiesIndexController::class)->name('facilities.index');

Route::get('/contact-us', ContactUsIndexController::class)->name('contact-us.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';
