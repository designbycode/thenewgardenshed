# Dedicated Booking Page Design

## Overview

Replace the inline booking dialog on the room show page with a dedicated booking page at `/booking` that shows a grid of room cards for selection and a booking form below.

## Routes

- `GET /booking` → `BookingCreateController@__invoke` (named `booking.create`)
  - Loads all active rooms for the grid
  - If `?room_id=X`, pre-selects that room
- `POST /bookings` → `BookingController@store` (named `bookings.store`, unchanged)

## Database

Add `notes` column to `bookings` table:
- Type: `text`, nullable
- Migration name: `add_notes_to_bookings_table`

Update `Booking` model `$fillable` to include `notes`.

## Validation (`BookingStoreRequest`)

Add rule: `notes => nullable|string|max:1000`

## Controllers

### New: `BookingCreateController`

```php
class BookingCreateController extends Controller
{
    public function __invoke()
    {
        $rooms = Room::with('media')->where('is_active', true)->get()->map(fn ($room) => [
            'id' => $room->id,
            'slug' => $room->slug,
            'name' => $room->name,
            'type' => $room->type,
            'pricePerNight' => (int) $room->price_per_night,
            'capacity' => (int) $room->capacity,
            'maxGuests' => (int) $room->max_guests,
            'thumbnail' => $room->getFirstMediaUrl('images', 'thumb') ?: null,
            'cardImage' => $room->getFirstMediaUrl('images', 'card') ?: null,
        ]);

        return Inertia::render('booking/create', [
            'rooms' => $rooms,
            'preselectedRoomId' => request()->query('room_id') ? (int) request()->query('room_id') : null,
        ]);
    }
}
```

## Frontend: `resources/js/pages/booking/create.tsx`

Single Inertia page with two sections stacked vertically:

### Section 1: Room Grid
- Heading: "Select a Room" / "Book a Room"
- Grid of room cards (reuses `CardRoom` pattern but simplified — clickable, highlight selected)
- Each card shows: thumbnail, name, type, price per night, capacity, bed type
- Clicking selects the room (highlight border) and populates the form below

### Section 2: Booking Form
- Room summary when selected: thumbnail + name + price
- Uses `<Form {...bookingCreate.form()}>` (Wayfinder-generated)
- Fields:
  - `name` (text, required)
  - `email` (email, required)
  - `phone` (tel, optional)
  - `guests` (number, min=1, max=room.maxGuests, required)
  - `check_in` (date, required)
  - `check_out` (date, required)
  - `notes` (textarea, optional, placeholder: "Dietary needs or questions")
  - `room_id` (hidden)
- Submit button: "Submit Booking Request"
- Validation errors shown inline per field (existing pattern)

### State Logic
- Room grid always visible
- Form disabled until a room is selected
- `room_id` set as hidden input on room select
- On submit success → redirect to room show page with flash + toast
- On validation error → errors shown inline, room stays selected

## Room Show Page Changes (`rooms/show.tsx`)

- Remove "Select & Book" button and entire `<Dialog>` component
- Replace with `<Link>` to `/booking?room_id={room.id}`
- Keep the room details, amenities, media carousel unchanged

## Emails

Both `ClientBookingNotification` and `AdminBookingNotification` blade templates updated to show `$notes` when present.

## Testing

- Test `GET /booking` returns 200 and renders rooms
- Test `GET /booking?room_id=X` pre-selects room
- Test `notes` field validation in `BookingStoreRequest`
- Test room show page no longer has dialog
- All existing booking tests continue passing
