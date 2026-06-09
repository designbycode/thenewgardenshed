<?php

namespace App\Http\Requests;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class BookingStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => ['required', 'exists:rooms,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'check_in' => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $roomId = $this->input('room_id');
            $checkIn = $this->input('check_in');
            $checkOut = $this->input('check_out');

            if ($roomId && $checkIn && $checkOut) {
                $overlap = Booking::where('room_id', $roomId)
                    ->where('status', '!=', 'cancelled')
                    ->where('status', '!=', 'rejected')
                    ->where(function ($query) use ($checkIn, $checkOut) {
                        $query->where(function ($q) use ($checkIn, $checkOut) {
                            $q->where('check_in', '>=', $checkIn)
                              ->where('check_in', '<', $checkOut);
                        })->orWhere(function ($q) use ($checkIn, $checkOut) {
                            $q->where('check_out', '>', $checkIn)
                              ->where('check_out', '<=', $checkOut);
                        })->orWhere(function ($q) use ($checkIn, $checkOut) {
                            $q->where('check_in', '<=', $checkIn)
                              ->where('check_out', '>=', $checkOut);
                        });
                    })
                    ->exists();

                if ($overlap) {
                    $validator->errors()->add('check_in', 'The selected room is not available for these dates.');
                }
            }

            $roomId = $this->input('room_id');
            $guests = (int) $this->input('guests');

            if ($roomId && $guests) {
                $room = Room::find($roomId);
                if ($room && $guests > $room->max_guests) {
                    $validator->errors()->add('guests', "The number of guests cannot exceed {$room->max_guests}.");
                }
            }
        });
    }
}
