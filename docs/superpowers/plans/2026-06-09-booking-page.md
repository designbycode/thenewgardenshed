# Booking Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace the inline booking dialog on the room show page with a dedicated `/booking` page featuring a room grid selector and booking form below.

**Architecture:** New `GET /booking` route backed by `BookingCreateController` renders a single Inertia page with two sections (room grid + form). The existing `POST /bookings` endpoint is unchanged except its redirect target changes to the rooms.show route. A `notes` column is added to the bookings table. The room show page dialog is replaced with a Wayfinder link to the booking page with `room_id` query param, and a success alert banner handles the post-booking flash.

**Tech Stack:** Laravel 13, Inertia.js, React 19, Wayfinder routes, shadcn/ui components, PHPUnit, Laravel migrations

---

### Task 1: Add `notes` column to bookings table

**Files:**
- Create: `database/migrations/2026_06_09_add_notes_to_bookings_table.php`
- Modify: `app/Models/Booking.php:13-23`

- [ ] **Step 1: Generate migration**

```bash
php artisan make:migration add_notes_to_bookings_table
```

- [ ] **Step 2: Write migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->text('notes')->nullable()->after('guests');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('notes');
        });
    }
};
```

- [ ] **Step 3: Update Booking model fillable**

```php
protected $fillable = [
    'room_id',
    'name',
    'email',
    'phone',
    'check_in',
    'check_out',
    'guests',
    'notes',
    'total_price',
    'status',
];
```

- [ ] **Step 4: Run migration**

```bash
php artisan migrate
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add notes column to bookings table"
```

---

### Task 2: Add notes validation + tests

**Files:**
- Modify: `app/Http/Requests/BookingStoreRequest.php:26-35`
- Modify: `tests/Feature/BookingTest.php`

- [ ] **Step 1: Add notes validation rule**

Edit `app/Http/Requests/BookingStoreRequest.php`, add after the `guests` rule (line 33):

```php
'notes' => ['nullable', 'string', 'max:1000'],
```

- [ ] **Step 2: Add two test methods to BookingTest.php**

```php
public function test_booking_rejects_notes_exceeding_max_length(): void
{
    $room = Room::factory()->create(['price_per_night' => 1000]);

    $response = $this->post(route('bookings.store'), [
        'room_id' => $room->id,
        'name' => 'Notes Test',
        'email' => 'notes@example.com',
        'check_in' => now()->addDay()->format('Y-m-d'),
        'check_out' => now()->addDays(3)->format('Y-m-d'),
        'guests' => 2,
        'notes' => str_repeat('a', 1001),
    ]);

    $response->assertSessionHasErrors(['notes']);
}

public function test_booking_succeeds_with_valid_notes(): void
{
    $room = Room::factory()->create(['price_per_night' => 1000]);

    $response = $this->post(route('bookings.store'), [
        'room_id' => $room->id,
        'name' => 'Notes Test',
        'email' => 'notes@example.com',
        'check_in' => now()->addDay()->format('Y-m-d'),
        'check_out' => now()->addDays(3)->format('Y-m-d'),
        'guests' => 2,
        'notes' => 'Please provide a hypoallergenic pillow.',
    ]);

    $response->assertStatus(302);
    $this->assertDatabaseHas('bookings', [
        'email' => 'notes@example.com',
        'notes' => 'Please provide a hypoallergenic pillow.',
    ]);
}
```

- [ ] **Step 3: Run tests**

```bash
php artisan test tests/Feature/BookingTest.php --filter=notes
```
Expected: 2 passes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add notes validation rules and tests"
```

---

### Task 3: Create BookingCreateController

**Files:**
- Create: `app/Http/Controllers/Booking/BookingCreateController.php`

- [ ] **Step 1: Write the controller**

```php
<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Inertia\Inertia;

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
            'bedType' => $room->bed_type,
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

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: create BookingCreateController"
```

---

### Task 4: Add GET /booking route

**Files:**
- Modify: `routes/web.php`

- [ ] **Step 1: Add the route import and definition**

```php
use App\Http\Controllers\Booking\BookingCreateController;

// After line 25 (existing bookings.store):
Route::get('/booking', BookingCreateController::class)->name('booking.create');
```

- [ ] **Step 2: Run `php artisan route:list` to confirm the route is registered**

```bash
php artisan route:list --path=booking
```
Expected: shows both `GET booking` and `POST bookings`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add GET /booking route"
```

---

### Task 5: Create booking page frontend component

**Files:**
- Create: `resources/js/pages/booking/create.tsx`

- [ ] **Step 1: Write the page component**

```tsx
import { Form, Head, usePage } from '@inertiajs/react';
import { CalendarCheck, LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import placeholderRoom from '@/../images/placeholder-room.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import { store as bookingStore } from '@/routes/bookings';
import type { RoomItem } from '@/types/data';

interface BookingCreatePageProps {
    rooms: RoomItem[];
    preselectedRoomId: number | null;
}

export default function BookingCreate() {
    const { rooms, preselectedRoomId } = usePage<BookingCreatePageProps>().props;
    const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(
        rooms.find((r) => r.id === preselectedRoomId) ?? null,
    );

    useEffect(() => {
        document.title = 'Book a Room | The New Garden Shed';
    }, []);

    return (
        <>
            <Head title="Book a Room" />
            <MainWrapper className="py-12">
                <div className="mb-10">
                    <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
                        Book a Room
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a room and fill in your details to submit a booking request.
                    </p>
                </div>

                <section className="mb-12">
                    <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                        Select a Room
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <Card
                                key={room.id}
                                className={`cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:shadow-lg ${
                                    selectedRoom?.id === room.id
                                        ? 'ring-2 ring-primary ring-offset-2'
                                        : 'ring-1 ring-transparent hover:ring-1 hover:ring-border'
                                }`}
                                onClick={() => setSelectedRoom(room)}
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={room.cardImage ?? room.thumbnail ?? placeholderRoom}
                                        alt={room.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <Badge className="rounded-md border-border bg-background/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-sm backdrop-blur-md">
                                            {room.type} Suite
                                        </Badge>
                                    </div>
                                    <div className="absolute right-3 bottom-3 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-base font-semibold text-primary shadow-sm backdrop-blur-md">
                                        R {room.pricePerNight}{' '}
                                        <span className="text-xs font-normal text-muted-foreground">/ night</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-serif text-lg font-normal text-foreground">
                                        {room.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Up to {room.capacity} guests • {room.bedType}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                        Your Details
                    </h2>
                    {selectedRoom ? (
                        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                            <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
                                <img
                                    src={selectedRoom.cardImage ?? selectedRoom.thumbnail ?? placeholderRoom}
                                    alt={selectedRoom.name}
                                    className="h-16 w-24 rounded-lg object-cover"
                                />
                                <div>
                                    <p className="font-serif text-lg font-medium text-foreground">
                                        {selectedRoom.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        R {selectedRoom.pricePerNight} / night • Up to {selectedRoom.maxGuests} guests
                                    </p>
                                </div>
                            </div>

                            <Form
                                {...bookingStore.form()}
                                data={{
                                    room_id: selectedRoom.id,
                                    name: '',
                                    email: '',
                                    phone: '',
                                    guests: 1,
                                    check_in: '',
                                    check_out: '',
                                    notes: '',
                                }}
                                className="space-y-4"
                            >
                                {({ processing, errors, data, setData }) => (
                                    <>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="name">Your Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                                <InputError message={errors.name} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                                <InputError message={errors.email} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="phone">Phone Number (Optional)</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+27 12 345 6789"
                                                />
                                                <InputError message={errors.phone} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="guests">Number of Guests</Label>
                                                <Input
                                                    type="number"
                                                    id="guests"
                                                    name="guests"
                                                    value={data.guests}
                                                    onChange={(e) => setData('guests', parseInt(e.target.value) || 0)}
                                                    min="1"
                                                    max={selectedRoom.maxGuests}
                                                    required
                                                />
                                                <InputError message={errors.guests} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="check_in">Check-in Date</Label>
                                                <Input
                                                    type="date"
                                                    id="check_in"
                                                    name="check_in"
                                                    value={data.check_in}
                                                    onChange={(e) => setData('check_in', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.check_in} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="check_out">Check-out Date</Label>
                                                <Input
                                                    type="date"
                                                    id="check_out"
                                                    name="check_out"
                                                    value={data.check_out}
                                                    onChange={(e) => setData('check_out', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.check_out} />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="notes">Dietary Needs or Questions (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Let us know about any dietary requirements, allergies, or special requests..."
                                                rows={3}
                                            />
                                            <InputError message={errors.notes} />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-6 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                                        >
                                            {processing ? (
                                                <LoaderCircle size={14} className="animate-spin" />
                                            ) : (
                                                <CalendarCheck size={14} />
                                            )}
                                            <span>{processing ? 'Processing...' : 'Submit Booking Request'}</span>
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                Select a room above to start your booking.
                            </p>
                        </div>
                    )}
                </section>
            </MainWrapper>
        </>
    );
}

BookingCreate.displayName = 'BookingCreate';

BookingCreate.layout = (page: any) => <MainLayout>{page}</MainLayout>;
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: create booking page frontend component"
```

---

### Task 6: Update room show page to link to booking page

**Files:**
- Modify: `resources/js/pages/rooms/show.tsx`
- Modify: `app/Http/Controllers/BookingController.php:34`

- [ ] **Step 1: Update BookingController redirect**

Change the redirect to go to the room show page instead of back:

```php
// Old (line 34):
return redirect()->back()->with('booking_success', 'Your booking request has been submitted successfully.');

// New:
return redirect()->route('rooms.show', $room)->with('booking_success', 'Your booking request has been submitted successfully.');
```

- [ ] **Step 2: Simplify rooms/show.tsx**

Remove dialog-related imports, state, and JSX. Replace the booking dialog + success dialog with a Link to `/booking?room_id=X`.

Add import:
```tsx
import { create as bookingCreate } from '@/routes/booking';
```

Remove these imports (lines 24-31):
```tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
```

Remove these imports that are no longer needed for the dialog form:
```tsx
import { store as bookingStore } from '@/routes/bookings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { LoaderCircle, CheckCircle } from 'lucide-react'; // only if not used elsewhere
```

Remove dialog state and flash effect (replace lines 49-57):
```tsx
export default function RoomsShow({ room }: PageProps) {
    // Remove: const { flash } = usePage<PageProps>().props;
    // Remove: const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    // Remove: const [successDialogOpen, setSuccessDialogOpen] = useState(!!flash?.booking_success);
    // Remove: the useEffect for flash (lines 52-57)
    // Just keep the useEffect for document title / meta
```

Remove the `flash` field from `PageProps` interface:
```tsx
interface PageProps {
    room: RoomItem;
}
```

Replace the entire CTA block (lines 257-416) with:
```tsx
                            <div className="mt-8 border-t border-border pt-6">
                                <Link
                                    href={bookingCreate({ query: { room_id: room.id } })}
                                    className={cn(
                                        buttonVariants({ size: 'lg' }),
                                        'flex w-full items-center justify-center gap-2 rounded-xl border-none bg-primary py-6 text-xs font-semibold tracking-widest text-primary-foreground uppercase shadow-lg shadow-primary/20 transition-all duration-300 hover:brightness-110 active:scale-[0.99] sm:text-sm',
                                    )}
                                >
                                    <CalendarCheck size={16} />
                                    <span>
                                        Book {room.name.split(' ').slice(-2).join(' ')}
                                    </span>
                                </Link>

                                <span className="mt-2.5 block text-center font-sans text-[10px] text-muted-foreground">
                                    No immediate payment required. Secure
                                    booking estimate submitted instantly.
                                </span>
                            </div>
```

- [ ] **Step 3: Run frontend check**

```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: replace booking dialog with link to booking page"
```

---

### Task 7: Update email templates with notes

**Files:**
- Modify: `resources/views/emails/booking-client-notification.blade.php`
- Modify: `resources/views/emails/booking-admin-notification.blade.php`

- [ ] **Step 1: Add notes to admin notification**

```blade
{{-- After the "Guests" line, before "Total" --}}
**Guests:** {{ $booking->guests }}
@if($booking->notes)
**Notes:** {{ $booking->notes }}
@endif
**Total:** R {{ number_format($booking->total_price, 2) }}
```

- [ ] **Step 2: Add notes to client notification**

```blade
{{-- After the "Guests" line, before "Total" --}}
**Guests:** {{ $booking->guests }}
@if($booking->notes)
**Notes:** {{ $booking->notes }}
@endif
**Total:** R {{ number_format($booking->total_price, 2) }}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: show booking notes in notification emails"
```

---

### Task 8: Add booking page tests

**Files:**
- Modify: `tests/Feature/BookingTest.php`

- [ ] **Step 1: Add three test methods**

```php
public function test_booking_create_page_loads(): void
{
    Room::factory()->count(3)->create(['is_active' => true]);

    $response = $this->get(route('booking.create'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('booking/create')
        ->has('rooms', 3)
    );
}

public function test_booking_create_page_pre_selects_room(): void
{
    $room = Room::factory()->create(['is_active' => true]);

    $response = $this->get(route('booking.create', ['room_id' => $room->id]));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('booking/create')
        ->where('preselectedRoomId', $room->id)
    );
}

public function test_booking_create_page_redirects_to_room_show_on_success(): void
{
    $room = Room::factory()->create(['price_per_night' => 1000]);

    $response = $this->post(route('bookings.store'), [
        'room_id' => $room->id,
        'name' => 'Redirect Test',
        'email' => 'redirect@example.com',
        'check_in' => now()->addDay()->format('Y-m-d'),
        'check_out' => now()->addDays(3)->format('Y-m-d'),
        'guests' => 2,
    ]);

    $response->assertRedirect(route('rooms.show', $room));
}
```

- [ ] **Step 2: Run all tests**

```bash
php artisan test tests/Feature/BookingTest.php
```
Expected: All tests pass (existing 8 + 5 new = 13 tests).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add booking page tests"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run full test suite**

```bash
php artisan test
```
Expected: All tests pass.

- [ ] **Step 2: Build frontend**

```bash
npm run build
```
Expected: No errors.

- [ ] **Step 3: Verify git status is clean**

```bash
git status
```
Expected: Nothing to commit, working tree clean.
