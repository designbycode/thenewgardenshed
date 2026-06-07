<?php

namespace App\Listeners;

use App\Events\ContactFormSubmitted;
use App\Mail\ContactConfirmation;
use Illuminate\Support\Facades\Mail;

class SendContactConfirmationToSubmitter
{
    public function handle(ContactFormSubmitted $event): void
    {
        Mail::to($event->data['email'], $event->data['name'])->send(
            new ContactConfirmation($event->data),
        );
    }
}
