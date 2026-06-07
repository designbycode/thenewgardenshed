<?php

namespace App\Listeners;

use App\Events\ContactFormSubmitted;
use App\Mail\ContactNotification;
use Illuminate\Support\Facades\Mail;

class SendContactNotificationToOwner
{
    public function handle(ContactFormSubmitted $event): void
    {
        Mail::to(config('mail.owner.address'), config('mail.owner.name'))->send(
            new ContactNotification($event->data),
        );
    }
}
