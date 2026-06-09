<?php

namespace App\Http\Requests\GuestBook;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->input('action') === 'verify') {
            return [
                'password' => ['required', 'string'],
            ];
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'room_number' => ['required', 'string', 'max:255'],
            'stay_date' => ['required', 'string', 'max:255'],
            'overall_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'cleanliness_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'comfort_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'service_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'location_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'value_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'review' => ['required', 'string', 'max:5000'],
            'suggestions' => ['nullable', 'string', 'max:2000'],
            'would_recommend' => ['required', 'boolean'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('action') === 'verify') {
                $expected = config('app.review_page_password');
                if ($this->input('password') !== $expected) {
                    $validator->errors()->add('password', 'The review page password is incorrect.');
                }
            } elseif (!$this->session()->get('review_authenticated')) {
                $validator->errors()->add('password', 'Session expired. Please re-verify.');
            }
        });
    }
}
