@component('mail::message')
# 🌿 The Garden Shed

**New Contact Inquiry**

---

**From:** {{ $data['name'] }}  
**Email:** {{ $data['email'] }}  
**Subject:** {{ $data['subject'] }}

**Message:**

{{ $data['message'] }}

---

@component('mail::button', ['url' => 'mailto:' . $data['email']])
Reply to {{ $data['name'] }}
@endcomponent

<small>Sent via the contact form on The Garden Shed website.</small>
@endcomponent
