<?php

namespace App\Http\Controllers\Admin;

use App\Events\BookingCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminBookingStoreRequest;
use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $bookings = Booking::with('room')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('room', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('room_id'), function ($query, $roomId) {
                $query->where('room_id', $roomId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $rooms = Room::where('is_active', true)->orderBy('name')->get()->map(fn ($room) => [
            'id' => $room->id,
            'name' => $room->name,
        ]);

        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
            'rooms' => $rooms,
            'filters' => $request->only(['search', 'status', 'room_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        $rooms = Room::with(['media', 'bookings' => function ($query) {
            $query->whereNotIn('status', ['cancelled', 'rejected']);
        }])->where('is_active', true)->get()->map(fn ($room) => [
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
            'bookings' => $room->bookings->map(fn ($booking) => [
                'check_in' => $booking->check_in->format('Y-m-d'),
                'check_out' => $booking->check_out->format('Y-m-d'),
            ]),
        ]);

        return Inertia::render('admin/bookings/create', [
            'rooms' => $rooms,
            'preselectedRoomId' => $request->query('room_id') ? (int) $request->query('room_id') : null,
        ]);
    }

    public function store(AdminBookingStoreRequest $request): RedirectResponse
    {
        $room = Room::findOrFail($request->validated('room_id'));

        $checkIn = Carbon::parse($request->validated('check_in'));
        $checkOut = Carbon::parse($request->validated('check_out'));
        $nights = $checkIn->diffInDays($checkOut);

        $pricePerNight = $room->price_per_night;
        $originalPrice = $nights * $pricePerNight;

        $discountType = $request->validated('discount_type');
        $discountValue = (float) $request->validated('discount_value', 0);
        $discountAmount = 0.00;

        if ($discountType === 'percentage') {
            $discountAmount = $originalPrice * ($discountValue / 100);
        } elseif ($discountType === 'fixed') {
            $discountAmount = min($discountValue, $originalPrice);
        }

        $totalPrice = max(0.00, $originalPrice - $discountAmount);

        $booking = Booking::create([
            ...$request->validated(),
            'original_price' => $originalPrice,
            'discount_amount' => $discountAmount,
            'total_price' => $totalPrice,
            'status' => 'confirmed',
        ]);

        event(new BookingCreated($booking));

        session()->flash('toast', ['type' => 'success', 'message' => 'Booking created successfully.']);

        return redirect()->route('admin.bookings.show', $booking->id);
    }

    public function calendar(Request $request): Response
    {
        // Load bookings with room relationship
        $bookings = Booking::with('room')->get()->map(fn ($booking) => [
            'id' => $booking->id,
            'room_id' => $booking->room_id,
            'name' => $booking->name,
            'email' => $booking->email,
            'phone' => $booking->phone,
            'check_in' => $booking->check_in->format('Y-m-d'),
            'check_out' => $booking->check_out->format('Y-m-d'),
            'status' => $booking->status,
            'guests' => $booking->guests,
            'total_price' => $booking->total_price,
            'room_name' => $booking->room->name,
        ]);

        // Load active rooms
        $rooms = Room::where('is_active', true)->get()->map(fn ($room) => [
            'id' => $room->id,
            'name' => $room->name,
            'type' => $room->type,
            'price_per_night' => $room->price_per_night,
            'capacity' => $room->capacity,
            'max_guests' => $room->max_guests,
        ]);

        return Inertia::render('admin/bookings/calendar', [
            'bookings' => $bookings,
            'rooms' => $rooms,
        ]);
    }

    public function show(Booking $booking): Response
    {
        return Inertia::render('admin/bookings/show', [
            'booking' => $booking->load('room'),
        ]);
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,cancelled,rejected'],
        ]);

        $booking->update($validated);

        session()->flash('toast', ['type' => 'success', 'message' => 'Booking status updated successfully.']);

        return redirect()->back();
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        session()->flash('toast', ['type' => 'success', 'message' => 'Booking deleted successfully.']);

        return redirect()->route('admin.bookings.index');
    }
}
