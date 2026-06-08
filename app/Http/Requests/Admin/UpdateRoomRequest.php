<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
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
        $room = $this->route('room');

        return [
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rooms', 'slug')->ignore($room->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:luxury,standard,cozy'],
            'description' => ['required', 'string'],
            'short_description' => ['required', 'string', 'max:255'],
            'blockquote' => ['nullable', 'string', 'max:65535'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'capacity' => ['required', 'integer', 'min:1'],
            'bed_type' => ['required', 'string', 'max:255'],
            'bathroom_type' => ['required', 'string', 'max:255'],
            'amenity_ids' => ['nullable', 'array'],
            'amenity_ids.*' => ['exists:amenities,id'],
        ];
    }
}
