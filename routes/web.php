<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactUs\ContactUsIndexController;
use App\Http\Controllers\ContactUs\ContactUsStoreController;
use App\Http\Controllers\Facilities\FacilitiesIndexController;
use App\Http\Controllers\GuestBook\GuestBookCreateController;
use App\Http\Controllers\GuestBook\GuestBookIndexController;
use App\Http\Controllers\HomeIndexController;
use App\Http\Controllers\Rooms\RoomsIndexController;
use App\Http\Controllers\Rooms\RoomsShowController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeIndexController::class)->name('home');
Route::get('/rooms', RoomsIndexController::class)->name('rooms.index');
Route::get('/rooms/{room:slug}', RoomsShowController::class)->name('rooms.show');
Route::get('/facilities', FacilitiesIndexController::class)->name('facilities.index');
Route::get('/guest-book', GuestBookIndexController::class)->name('guest-book.index');
Route::get('/guest-book/create', [GuestBookCreateController::class, '__invoke'])->name('guest-book.create');
Route::post('/guest-book/create', [GuestBookCreateController::class, 'store'])->name('guest-book.store');

Route::get('/contact-us', ContactUsIndexController::class)->name('contact-us.index');
Route::post('/contact-us', ContactUsStoreController::class)->name('contact-us.store');

Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store')->middleware('booking.enabled');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/admin.php';
