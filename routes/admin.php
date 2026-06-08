<?php

use App\Http\Controllers\Admin\RoomController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/rooms');

    Route::get('rooms', [RoomController::class, 'index'])->name('rooms.index');
    Route::get('rooms/create', [RoomController::class, 'create'])->name('rooms.create');
    Route::post('rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::get('rooms/{room}', [RoomController::class, 'edit'])->name('rooms.edit');
    Route::put('rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');
    Route::delete('rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');
    Route::post('rooms/{room}/images', [RoomController::class, 'uploadImage'])->name('rooms.images.upload');
    Route::put('rooms/{room}/images/reorder', [RoomController::class, 'reorderImages'])->name('rooms.images.reorder');
    Route::delete('rooms/{room}/images/{media}', [RoomController::class, 'deleteImage'])->name('rooms.images.delete');
});
