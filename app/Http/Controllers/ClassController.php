<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\ClassModel;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Helpers\ValidationHelper;

class ClassController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $baseQuery = ClassModel::select([
            'id',
            'name',
            'description',
            'thumbnail',
            'public_id',
            'mentor_id',
            'enrollment_code',
            'academic_year_tag',
        ])->with([
            'mentor:id,name,avatar',
            'enrollments.student:id,name,avatar',
        ]);

        if ($user->role === 'admin') {
            $classes = $baseQuery->get();
        } elseif ($user->role === 'mentor') {
            $classes = $baseQuery
                ->where('mentor_id', $user->id)
                ->get();
        } elseif ($user->role === 'student') {
            $classes = $baseQuery
                ->whereHas('enrollments', function ($q) use ($user) {
                    $q->where('student_id', $user->id);
                })
                ->where('visibility', true)
                ->get();
        } else {
            abort(403, 'Akses tidak diizinkan');
        }

        return Inertia::render('Classes/Class', compact('classes'));
    }

    public function show($id)
{
    $user = Auth::user();

    $class = ClassModel::with([
        'mentor:id,name,avatar',
        'enrollments.student:id,name,avatar',
        'discussions',
        'meetings' => function ($query) {
            $query->select('id', 'class_id', 'title', 'description', 'created_at')
                ->with([
                    'materials' => function ($query) {
                        $query->select('id', 'meeting_id', 'link', 'created_at');
                    },
                    'assignments' => function ($query) {
                        $query->select(
                            'id',
                            'meeting_id',
                            'title',
                            'description',
                            'date_open',
                            'time_open',
                            'date_close',
                            'time_close',
                            'file_link',
                            'created_at'
                        )->with(['submissions' => function ($query) {
                            $query->select(
                                'submissions.id',
                                'submissions.assignment_id',
                                'submissions.student_id',
                                'submissions.feedback',
                                'submissions.submission_content',
                                'submissions.grade',
                                'submissions.submitted_at',
                                'submissions.created_at',
                                'users.name as student_name'
                            )->join('users', 'submissions.student_id', '=', 'users.id');
                        }]);
                    },
                ]);
        },
        'enrollments' => function ($query) {
            $query->select('enrollments.id', 'enrollments.class_id', 'enrollments.student_id')
                ->with(['student:id,name,avatar']);
        },
        // ========================== QUIZ ==========================
        'quizzes' => function ($query) use ($user) {
            $query->withCount('questions')
                  ->with(['attempts' => function ($q) use ($user) {
                      if ($user->role === 'student') {
                          // student hanya ambil attempt sendiri
                          $q->where('student_id', $user->id);
                      } else {
                          // mentor/admin ambil semua attempt + student info
                          $q->with('student:id,name');
                      }
                  }])
                  ->orderByDesc('created_at');

            if ($user->role === 'student') {
                $query->where('status', 'Diterbitkan');
            }
        },
        // ==========================================================
    ])->findOrFail($id);

    if ($user->role === 'student' && !$class->visibility) {
        abort(403, 'Akses tidak diizinkan');
    }

    if ($user->role === 'student' && !$class->enrollments->contains('student_id', $user->id)) {
        abort(403, 'Anda belum terdaftar di kelas ini');
    }

    return Inertia::render('Classes/ClassDetail', [
        'class' => $class,
        'userRole' => $user->role,
    ]);
}



    public function store(Request $request)
    {
        $this->authorizeAction();

        $validator = ValidationHelper::class($request->all());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        $validated = $validator->validated();

        try {
            DB::beginTransaction();

            if ($request->hasFile('thumbnail')) {
                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('thumbnail')->getRealPath(),
                    ['folder' => 'images/classes']
                );

                $validated['thumbnail'] = $uploaded['secure_url'];
                $validated['public_id'] = $uploaded['public_id'];
            }

            $validated['mentor_id'] = Auth::id();

            ClassModel::create($validated);

            DB::commit();

            return redirect()
                ->route('classes.index')
                ->with('success', 'Kelas berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuat kelas: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $this->authorizeAction();

        $class = ClassModel::findOrFail($id);

        $validator = ValidationHelper::class($request->all(), true, $class->id);
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        $validated = $validator->validated();

        try {
            DB::beginTransaction();

            if ($request->hasFile('thumbnail')) {
                if (!empty($class->public_id)) {
                    Cloudinary::uploadApi()->destroy($class->public_id);
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('thumbnail')->getRealPath(),
                    ['folder' => 'images/classes']
                );

                $validated['thumbnail'] = $uploaded['secure_url'];
                $validated['public_id'] = $uploaded['public_id'];
            } else {
                $validated['thumbnail'] = $class->thumbnail;
                $validated['public_id'] = $class->public_id;
            }

            $class->update($validated);

            DB::commit();

            return redirect()
                ->route('classes.index')
                ->with('success', 'Kelas berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui kelas: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $this->authorizeAction();

        $class = ClassModel::findOrFail($id);

        try {
            DB::beginTransaction();

            if (!empty($class->public_id)) {
                Cloudinary::uploadApi()->destroy($class->public_id);
            }

            $class->delete();

            DB::commit();

            return redirect()
                ->route('classes.index')
                ->with('success', 'Kelas berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus kelas: ' . $e->getMessage());
        }
    }

    private function authorizeAction()
    {
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['admin', 'mentor'])) {
            abort(403, 'Akses tidak diizinkan');
        }
    }
}
