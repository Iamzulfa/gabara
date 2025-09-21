<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\AnnouncementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest Routes
Route::get('/', [HomepageController::class, 'index'])->name('homepage');

// Dashboard Routes
Route::middleware(['auth', 'verified'])->get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// User Routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('users.index');
    Route::get('/{id}', [UserController::class, 'show'])->name('users.show');
    Route::post('/', [UserController::class, 'store'])->name('users.store');
    Route::put('/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy');
});

// Announcement Routes
Route::middleware(['auth', 'verified'])->prefix('announcements')->group(function () {
    Route::get('/', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/{id}', [AnnouncementController::class, 'show'])->name('announcements.show');

    Route::middleware('role:admin')->group(function () {
        Route::post('/', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::patch('/{id}', [AnnouncementController::class, 'update'])->name('announcements.update');
        Route::delete('/{id}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
    });
});

// Class Routes
Route::middleware(['auth', 'verified'])->prefix('classes')->group(function () {
    Route::get('/', [ClassController::class, 'index'])->name('classes.index');
    Route::get('/{id}', [ClassController::class, 'show'])->name('classes.show');

    Route::middleware('role:admin|mentor')->group(function () {
        Route::post('/', [ClassController::class, 'store'])->name('classes.store');
        Route::patch('/{id}', [ClassController::class, 'update'])->name('classes.update');
        Route::delete('/{id}', [ClassController::class, 'destroy'])->name('classes.destroy');
    });

    Route::middleware('role:student')->group(function () {
        Route::post('/enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');
    });
});

// Meeting Routes
Route::middleware(['auth', 'verified', 'role:admin|mentor'])->prefix('meetings')->group(function () {
    Route::post('/', [MeetingController::class, 'store'])->name('meetings.store');
    Route::patch('/{id}', [MeetingController::class, 'update'])->name('meetings.update');
    Route::delete('/{id}', [MeetingController::class, 'destroy'])->name('meetings.destroy');
});

// Material Routes
Route::middleware(['auth', 'verified', 'role:admin|mentor'])->prefix('materials')->group(function () {
    Route::delete('/{id}', [MaterialController::class, 'destroy'])->name('materials.destroy');
});

// Assignment Routes
Route::middleware(['auth', 'verified'])->prefix('/classes/assignments')->group(function () {
    Route::get('/{id}', [AssignmentController::class, 'show'])->name('assignments.show');
    Route::delete('/{id}', [AssignmentController::class, 'destroy'])->name('assignments.destroy')->middleware('role:admin|mentor');
});

// Submission Routes
Route::middleware(['auth', 'verified'])->prefix('/classes/assignments')->group(function () {
    Route::middleware('role:student')->group(function () {
        Route::post('/{assignmentId}/submissions', [SubmissionController::class, 'store'])->name('submissions.store');
        Route::post('/submissions/{submissionId}', [SubmissionController::class, 'update'])->name('submissions.update');
        Route::delete('/submissions/{submissionId}', [SubmissionController::class, 'destroy'])->name('submissions.destroy');
    });
    Route::post('/submissions/{submissionId}/grade', [SubmissionController::class, 'updateGrade'])->name('submissions.updateGrade')->middleware('role:admin|mentor');
});

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
