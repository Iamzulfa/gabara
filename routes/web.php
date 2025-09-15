<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomepageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest Routes
Route::get('/', [HomepageController::class, 'index'])->name('homepage');

// Dashboard Routes
Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = auth()->user();

    if ($user->hasRole('admin')) {
        return Inertia::render('Admin/Dashboard');
    }

    if ($user->hasRole('mentor')) {
        return Inertia::render('Mentor/Dashboard');
    }

    if ($user->hasRole('student')) {
        return Inertia::render('Student/Dashboard');
    }

    abort(403, 'Unauthorized');
})->name('dashboard');

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
