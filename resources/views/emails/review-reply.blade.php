@component('mail::message')
# 🌿 The Garden Shed

**Hello {{ $review->name }},**

Thank you for sharing your experience staying in room **{{ $review->room_number ?? 'our suites' }}** on **{{ $review->stay_date ? $review->stay_date->format('F Y') : 'your recent stay' }}**.

We appreciate your review ({{ $review->overall_rating }}/5 stars). Here is our response:

---

{{ $messageBody }}

---

If you have any further questions or would like to plan another stay, please don't hesitate to reach out.

@component('mail::button', ['url' => config('app.url')])
Visit The Garden Shed
@endcomponent

Warm regards,<br>
**The Garden Shed Management**
@endcomponent
