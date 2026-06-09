<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:255', 'unique:rooms,slug'],
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
