<?php

namespace App\Http\Controllers\ContactUs;

use App\Events\ContactFormSubmitted;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactUs\ContactFormRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ContactUsStoreController extends Controller
{
    public function __invoke(ContactFormRequest $request): RedirectResponse
    {
        $data = $request->validated();

        event(new ContactFormSubmitted($data));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Your message has been sent successfully! We\'ll get back to you soon.',
        ]);

        return redirect()->back();
    }
}
