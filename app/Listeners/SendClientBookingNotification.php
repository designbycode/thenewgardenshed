<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Mail\ClientBookingNotification;
use Illuminate\Support\Facades\Mail;

class SendClientBookingNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BookingCreated $event): void
    {
        Mail::to($event->booking->email)->send(
            new ClientBookingNotification($event->booking)
        );
    }
}
