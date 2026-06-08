<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAmenityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $amenity = $this->route('amenity');

        return [
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('amenities', 'slug')->ignore($amenity->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['required', 'string', 'max:255'],
            'display_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
