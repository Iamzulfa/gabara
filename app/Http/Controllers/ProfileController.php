<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProfileController extends Controller
{
    /**
     * Tampilkan halaman profile user.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/UserProfiles', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update profile user sesuai role + handle Cloudinary.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        // Common fields
        $user->name      = $data['name'] ?? $user->name;
        $user->phone     = $data['phone'] ?? $user->phone;
        $user->gender    = $data['gender'] ?? $user->gender;
        $user->birthdate = $data['birthdate'] ?? $user->birthdate;

        // Email update
        if (isset($data['email']) && $data['email'] !== $user->email) {
            $user->email = $data['email'];
            $user->email_verified_at = null;

            if (method_exists($user, 'sendEmailVerificationNotification')) {
                $user->sendEmailVerificationNotification();
            }
        }

        // Role-specific
        if ($user->role === 'student') {
            $user->parent_name  = $data['parent_name'] ?? null;
            $user->parent_phone = $data['parent_phone'] ?? null;
            $user->address      = $data['address'] ?? null;
        } elseif ($user->role === 'mentor') {
            $user->expertise = $data['expertise'] ?? null;
            $user->scope     = $data['scope'] ?? null;
        }

        // Avatar with Cloudinary
        if ($request->hasFile('avatar')) {
            if ($user->public_id) {
                Cloudinary::uploadApi()->destroy($user->public_id);
            }

            $uploaded = Cloudinary::uploadApi()->upload(
                $request->file('avatar')->getRealPath(),
                ['folder' => 'images/profile']
            );

            $user->avatar    = $uploaded['secure_url'];
            $user->public_id = $uploaded['public_id'];
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully!');
    }
}
