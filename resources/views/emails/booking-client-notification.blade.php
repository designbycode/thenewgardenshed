@component('mail::message')
# 🌿 The Garden Shed

**Hi {{ $booking->name }}, thank you for your booking request!**

---

We've received your booking request for **{{ $booking->room->name }}**. Here's a summary:

**Check-in:** {{ $booking->check_in->toFormattedDateString() }}
**Check-out:** {{ $booking->check_out->toFormattedDateString() }}
**Guests:** {{ $booking->guests }}
**Total:** R {{ number_format($booking->total_price, 2) }}

**Status:** {{ ucfirst($booking->status) }}

---

Our team will review your request and get back to you shortly. If you have any questions in the meantime, feel free to reply to this email or call us.

@component('mail::button', ['url' => config('app.url')])
Visit The Garden Shed
@endcomponent

Warm regards,<br>
**The Garden Shed Team**
@endcomponent
