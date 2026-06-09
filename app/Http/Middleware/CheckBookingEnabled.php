<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBookingEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('app.booking_system_enabled')) {
            abort(403, 'Booking system is currently disabled.');
        }

        return $next($request);
    }
}
