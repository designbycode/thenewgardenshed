@component('mail::message')
# 🌿 The Garden Shed

**New Booking Request**

---

**From:** {{ $booking->name }}
**Email:** {{ $booking->email }}
**Phone:** {{ $booking->phone ?? 'Not provided' }}
**Room:** {{ $booking->room->name }}
**Check-in:** {{ $booking->check_in->toFormattedDateString() }}
**Check-out:** {{ $booking->check_out->toFormattedDateString() }}
**Guests:** {{ $booking->guests }}
@if($booking->notes)
**Notes:** {{ $booking->notes }}
@endif
**Total:** R {{ number_format($booking->total_price, 2) }}
**Status:** {{ ucfirst($booking->status) }}

@component('mail::button', ['url' => config('app.url') . '/admin/bookings/' . $booking->id])
Manage Booking
@endcomponent

<small>Sent automatically by The Garden Shed website.</small>
@endcomponent
