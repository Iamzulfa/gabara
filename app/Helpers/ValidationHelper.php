<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Validator;

class ValidationHelper
{
    public static function class($data, $isUpdate = false, $classId = null)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'enrollment_code' => [
                'required',
                'string',
                'max:50',
                $isUpdate ? 'unique:classes,enrollment_code,' . $classId : 'unique:classes,enrollment_code',
            ],
            'academic_year_tag' => 'required|string|max:50',
            'visibility' => 'required|boolean',
            'thumbnail' => $isUpdate ? 'nullable|image|mimes:jpeg,png,jpg|max:2048' : 'required|image|mimes:jpeg,png,jpg|max:2048',
        ];

        return Validator::make(
            $data,
            $rules,
            [
                'name.required' => 'Nama kelas wajib diisi.',
                'name.string' => 'Nama kelas harus berupa teks.',
                'name.max' => 'Nama kelas maksimal 255 karakter.',
                'description.required' => 'Deskripsi wajib diisi.',
                'description.string' => 'Deskripsi harus berupa teks.',
                'description.max' => 'Deskripsi maksimal 1000 karakter.',
                'enrollment_code.required' => 'Kode enrollment wajib diisi.',
                'enrollment_code.string' => 'Kode enrollment harus berupa teks.',
                'enrollment_code.max' => 'Kode enrollment maksimal 10 karakter.',
                'enrollment_code.unique' => 'Kode enrollment sudah digunakan.',
                'academic_year_tag.required' => 'Tag tahun akademik wajib diisi.',
                'academic_year_tag.string' => 'Tag tahun akademik harus berupa teks.',
                'academic_year_tag.max' => 'Tag tahun akademik maksimal 50 karakter.',
                'visibility.required' => 'Visibilitas wajib diisi.',
                'visibility.boolean' => 'Visibilitas harus berupa true atau false.',
                'thumbnail.required' => 'Thumbnail harus diisi',
                'thumbnail.image' => 'Thumbnail harus berupa gambar.',
                'thumbnail.mimes' => 'Thumbnail hanya boleh berformat jpeg, png, atau jpg.',
                'thumbnail.max' => 'Ukuran thumbnail maksimal 2MB.',
            ]
        );
    }

    // public static function meeting($data, $isUpdate = false, $meetingId = null)
    // {
    //     $rules = [
    //         'class_id' => 'required|string|exists:classes,id',
    //         'title' => 'required|string|max:255',
    //         'description' => 'required|string',
    //     ];

    //     return Validator::make(
    //         $data,
    //         $rules,
    //         [
    //             'class_id.required' => 'ID kelas wajib diisi.',
    //             'class_id.string' => 'ID kelas harus berupa teks.',
    //             'class_id.exists' => 'Kelas tidak ditemukan.',
    //             'title.required' => 'Judul pertemuan wajib diisi.',
    //             'title.string' => 'Judul pertemuan harus berupa teks.',
    //             'title.max' => 'Judul pertemuan maksimal 255 karakter.',
    //             'description.required' => 'Deskripsi pertemuan wajib diisi.',
    //             'description.string' => 'Deskripsi pertemuan harus berupa teks.',
    //         ]
    //     );
    // }

    public static function meeting($data, $isUpdate = false, $meetingId = null)
    {
        $rules = [
            'class_id' => ['required', 'string', 'exists:classes,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'materials.*.link' => ['nullable', 'url'],
            'assignments' => ['sometimes', 'array'],
            'assignments.*.title' => ['required', 'string', 'max:255'],
            'assignments.*.description' => ['required', 'string'],
            'assignments.*.date_open' => ['required', 'date'],
            'assignments.*.time_open' => ['required', 'date_format:H:i'],
            'assignments.*.date_close' => ['required', 'date', 'after_or_equal:assignments.*.date_open'],
            'assignments.*.time_close' => ['required', 'date_format:H:i'],
            'assignments.*.file_link' => ['nullable', 'url'],
        ];

        if ($isUpdate && $meetingId) {
            $rules['title'][] = 'unique:meetings,title,' . $meetingId;
        } else {
            $rules['title'][] = 'unique:meetings,title';
        }

        return Validator::make(
            $data,
            $rules,
            [
                'class_id.required' => 'ID kelas wajib diisi.',
                'class_id.string' => 'ID kelas harus berupa teks.',
                'class_id.exists' => 'Kelas tidak ditemukan.',
                'title.required' => 'Judul pertemuan wajib diisi.',
                'title.string' => 'Judul pertemuan harus berupa teks.',
                'title.max' => 'Judul pertemuan maksimal 255 karakter.',
                'title.unique' => 'Judul pertemuan sudah digunakan.',
                'description.required' => 'Deskripsi pertemuan wajib diisi.',
                'description.string' => 'Deskripsi pertemuan harus berupa teks.',
                'materials.*.link.url' => 'Link berkas harus berupa URL yang valid.',
                'assignments.*.title.required' => 'Judul tugas wajib diisi.',
                'assignments.*.title.string' => 'Judul tugas harus berupa teks.',
                'assignments.*.title.max' => 'Judul tugas maksimal 255 karakter.',
                'assignments.*.description.required' => 'Deskripsi tugas wajib diisi.',
                'assignments.*.description.string' => 'Deskripsi tugas harus berupa teks.',
                'assignments.*.date_open.required' => 'Tanggal dibuka wajib diisi.',
                'assignments.*.date_open.date' => 'Tanggal dibuka harus berupa tanggal yang valid.',
                'assignments.*.time_open.required' => 'Waktu dibuka wajib diisi.',
                'assignments.*.time_open.date_format' => 'Waktu dibuka harus dalam format HH:mm.',
                'assignments.*.date_close.required' => 'Tanggal ditutup wajib diisi.',
                'assignments.*.date_close.date' => 'Tanggal ditutup harus berupa tanggal yang valid.',
                'assignments.*.date_close.after_or_equal' => 'Tanggal ditutup harus sama atau setelah tanggal dibuka.',
                'assignments.*.time_close.required' => 'Waktu ditutup wajib diisi.',
                'assignments.*.time_close.date_format' => 'Waktu ditutup harus dalam format HH:mm.',
                'assignments.*.file_link.url' => 'Link file pendukung harus berupa URL yang valid.',
            ]
        );
    }
}
