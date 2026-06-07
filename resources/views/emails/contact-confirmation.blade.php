@component('mail::message')
# 🌿 The Garden Shed

**Thank you for reaching out, {{ $data['name'] }}!**

---

We've received your message and our team will review it shortly. Here's a summary of what you sent:

**Subject:** {{ $data['subject'] }}

**Your message:**
> {{ $data['message'] }}

---

We typically respond within 2 hours during business hours. If your enquiry is urgent, feel free to give us a call.

@component('mail::button', ['url' => config('app.url')])
Visit The Garden Shed
@endcomponent

Warm regards,<br>
**The Garden Shed Team**
@endcomponent
