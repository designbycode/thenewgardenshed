<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Mail\AdminBookingNotification;
use Illuminate\Support\Facades\Mail;

class SendAdminBookingNotification
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
        $adminEmail = config('mail.from.address', 'admin@example.com');

        Mail::to($adminEmail)->send(
            new AdminBookingNotification($event->booking)
        );
    }
}
