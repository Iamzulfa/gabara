<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:15', Rule::unique(User::class, 'phone')->ignore($this->user()->id)],
            'gender' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'birthdate' => ['required', 'date', 'before:today'],
            'avatar' => ['nullable', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }
}
