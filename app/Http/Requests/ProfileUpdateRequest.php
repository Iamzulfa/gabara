<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize()
    {
        // pastikan user diizinkan (mis. hanya owner)
        return auth()->check();
    }

    public function rules()
    {
        // role could be passed in form or read from auth user
        $role = $this->user()->role ?? $this->input('role');

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($this->user()->id)],
            'gender' => ['nullable', 'string', 'max:20'],
            'birthdate' => ['nullable', 'date'],

            // student-specific
            'parent_name' => ['required_if:role,student', 'nullable', 'string', 'max:255'],
            'parent_phone' => ['required_if:role,student', 'nullable', 'string', 'max:20'],
            'address' => ['required_if:role,student', 'nullable', 'string'],

            // mentor-specific
            'expertise' => ['required_if:role,mentor', 'nullable', 'string', 'max:255'],
            'scope' => ['nullable', 'string'],

            // avatar
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }

    // If you expect role to be in request when editing other users,
    // consider adding prepareForValidation() or other rules.
}
