<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
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
        // In a real application, we would use a Mailable class.
        // For this task, we'll simulate sending an email.
        $booking = $event->booking;
        $adminEmail = config('mail.from.address', 'admin@example.com');

        // Mail::to($adminEmail)->send(new AdminBookingNotification($booking));

        \Log::info("Admin Notification: New booking request from {$booking->name} for room {$booking->room->name} from {$booking->check_in} to {$booking->check_out}.");
    }
}
