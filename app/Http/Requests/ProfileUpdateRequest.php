<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        $role = $this->user()->role ?? $this->input('role');

        $rules = [
            'name'      => ['required', 'string', 'max:255'],
            'phone'     => ['required', 'string', 'max:15'],
            'email'     => ['required', 'email', Rule::unique('users')->ignore($this->user()->id)],
            'gender'    => ['required', 'string', 'max:20'],
            'birthdate' => ['required', 'date'],
            'avatar'    => ['nullable', 'image', 'max:2048'],
        ];

        if ($role === 'student') {
            $rules['parent_name']  = ['required', 'string', 'max:255'];
            $rules['parent_phone'] = ['required', 'string', 'max:15'];
            $rules['address']      = ['required', 'string', 'max:255'];
        }

        if ($role === 'mentor') {
            $rules['expertise'] = ['required', 'string', 'max:255'];
            $rules['scope']     = ['required', 'string'];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'avatar.image' => 'Foto profil harus berupa gambar.',
            'avatar.max' => 'Ukuran foto maksimal 2MB.',
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'phone.required' => 'Nomor WhatsApp wajib diisi.',
            'phone.max' => 'Nomor WhatsApp maksimal 15 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'gender.required' => 'Jenis kelamin wajib diisi.',
            'gender.max' => 'Jenis kelamin maksimal 20 karakter.',
            'birthdate.required' => 'Tanggal lahir wajib diisi.',
            'birthdate.date' => 'Tanggal lahir tidak valid.',

            'address.required' => 'Alamat wajib diisi.',
            'address.max' => 'Alamat maksimal 255 karakter.',
            'parent_name.required' => 'Nama orang tua / wali wajib diisi.',
            'parent_phone.required' => 'Nomor HP orang tua / wali wajib diisi.',
            'address.' => 'Alamat wajib diisi untuk siswa.',

            'expertise.required' => 'Bidang keilmuan wajib diisi.',
            'scope.required' => 'Bidang keilmuan wajib diisi.',
        ];
    }
}
