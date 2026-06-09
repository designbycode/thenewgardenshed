@component('mail::message')
# 🌿 Booking Request Received

Hi {{ $booking->name }},

Thank you for your interest in **The Garden Shed**. We have received your booking request and our team is currently processing it. Here are the details of your requested stay:

---

## 🛏️ Accommodation Details

@if($booking->room->getFirstMediaUrl('images', 'card'))
<img src="{{ $booking->room->getFirstMediaUrl('images', 'card') }}" alt="{{ $booking->room->name }}" style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; margin: 15px 0; border: 1px solid #e2e8f0; display: block;" />
@endif

### **{{ $booking->room->name }}**
*{{ $booking->room->type }} Suite*

---

## 📅 Stay Information

@component('mail::panel')
**Check-in:** {{ $booking->check_in->toFormattedDateString() }} (from 14:00)  
**Check-out:** {{ $booking->check_out->toFormattedDateString() }} (by 10:00)  
**Duration:** {{ $booking->check_in->diffInDays($booking->check_out) }} {{ Str::plural('night', $booking->check_in->diffInDays($booking->check_out)) }}  
**Number of Guests:** {{ $booking->guests }} {{ Str::plural('guest', $booking->guests) }}
@endcomponent

---

## 👤 Guest Information

* **Full Name:** {{ $booking->name }}
* **Email Address:** {{ $booking->email }}
* **Phone Number:** {{ $booking->phone ?? 'Not provided' }}

@if($booking->notes)
### **Special Requests / Notes:**
> {{ $booking->notes }}
@endif

---

## 💳 Estimated Price Breakdown

* **Price per night:** R {{ number_format($booking->room->price_per_night, 2) }}
* **Nights:** {{ $booking->check_in->diffInDays($booking->check_out) }}
* **Total Estimated Cost:** **R {{ number_format($booking->total_price, 2) }}**

**Current Status:** `{{ ucfirst($booking->status) }}`

---

Our team will review your request and send a confirmation email shortly. If you need to make any changes or have questions, please feel free to reply directly to this email.

@component('mail::button', ['url' => config('app.url')])
Go to Website
@endcomponent

Warm regards,  
**The Garden Shed Team**
@endcomponent
