<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Quiz;
use App\Services\FunctionalTestcase\QuizRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class QuizController extends Controller
{
    // =========================================================================
    // ===== BAGIAN UNTUK MENTOR (ROUTE GLOBAL /quizzes) =====
    // =========================================================================

    /**
     * Menampilkan daftar semua kuis yang dibuat oleh mentor yang sedang login, atau semua kuis jika admin.
     */
    public function index()
    {
        // Admin dan Mentor dapat melihat semua kuis dan kelas (Fitur Kolaborasi)
        $quizzes = Quiz::with('class:id,name')
            ->withCount('questions')
            ->orderByDesc('created_at')
            ->get();

        $classes = ClassModel::select('id', 'name')->get();

        return Inertia::render('Quizzes/Quiz', [
            'quizzes' => $quizzes,
            'classes' => $classes,
        ]);
    }

    /**
     * Menampilkan halaman form untuk membuat kuis baru.
     */
    public function create()
    {
        // Admin dan Mentor dapat melihat semua kelas
        $classes = ClassModel::select('id', 'name')->get();

        return Inertia::render('Quizzes/QuizBuilder', [
            'classes' => $classes,
            'quiz' => null,
        ]);
    }

    /**
     * Menyimpan kuis baru ke database.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validasi, pastikan class_id yang dipilih valid
        $classRule = [
            'required',
            'uuid',
            Rule::exists('classes', 'id'),
        ];

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_open' => 'nullable|date',
            'time_open' => 'nullable|date_format:H:i',
            'date_close' => 'nullable|date',
            'time_close' => 'nullable|date_format:H:i',
            'time_limit_minutes' => 'required|integer|min:1',
            'status' => 'required|string|in:Draf,Diterbitkan',
            'attempts_allowed' => 'required|integer|min:1',
            'class_id' => $classRule,
            'questions' => 'present|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.type' => 'required|string|in:pilihan_ganda,benar_salah,esai',
            'questions.*.options' => 'present|array',
            'questions.*.options.*.text' => ['exclude_if:questions.*.type,esai', 'required', 'string'],
            'questions.*.options.*.is_correct' => ['exclude_if:questions.*.type,esai', 'required', 'boolean'],
        ]);

        // Gabung date dan time menjadi datetime untuk database
        $openDatetime = null;
        $closeDatetime = null;

        if ($validated['date_open'] && $validated['time_open']) {
            $openDatetime = $validated['date_open'].' '.$validated['time_open'].':00';
        } elseif ($validated['date_open']) {
            $openDatetime = $validated['date_open'].' 00:00:00';
        }

        if ($validated['date_close'] && $validated['time_close']) {
            $closeDatetime = $validated['date_close'].' '.$validated['time_close'].':00';
        } elseif ($validated['date_close']) {
            $closeDatetime = $validated['date_close'].' 23:59:59';
        }

        // Validasi bahwa close datetime setelah open datetime jika keduanya ada
        if ($openDatetime && $closeDatetime && strtotime($closeDatetime) <= strtotime($openDatetime)) {
            return back()->withErrors(['date_close' => 'Tanggal dan waktu tutup harus setelah tanggal dan waktu buka.']);
        }

        $quizData = collect($validated)->except(['questions', 'date_open', 'time_open', 'date_close', 'time_close'])->toArray();
        $quizData['open_datetime'] = $openDatetime;
        $quizData['close_datetime'] = $closeDatetime;

        DB::transaction(function () use ($quizData, $validated) {
            $quiz = Quiz::create($quizData);
            foreach ($validated['questions'] ?? [] as $questionData) {
                $quiz->questions()->create([
                    'question_text' => $questionData['question_text'],
                    'type' => $questionData['type'],
                    'options' => $questionData['options'] ?? [],
                ]);
            }
        });

        return redirect()->route('quizzes.index')->with('success', 'Quiz berhasil dibuat');
    }

    /**
     * Menampilkan detail kuis (untuk preview mentor atau admin).
     */
    public function show(Quiz $quiz)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            $this->authorizeMentorAction($quiz);
        }

        $quiz->load(['questions', 'class:id,name'])->loadCount('questions');

        $quiz->questions->transform(function ($question) {
            if (is_string($question->options)) {
                $decoded = json_decode($question->options, true);
                $question->options = is_array($decoded) ? $decoded : [];
            } elseif (is_array($question->options)) {
                // biarkan apa adanya
            } elseif ($question->options === null) {
                $question->options = [];
            } else {
                $question->options = [];
            }

            return $question;
        });

        return Inertia::render('Quizzes/QuizDetail', [
            'quiz' => $quiz,
        ]);
    }

    public function edit(Quiz $quiz)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            $this->authorizeMentorAction($quiz);
        }

        $quiz->load(['questions', 'class:id,name'])->loadCount('questions');

        $quiz->questions->transform(function ($question) {
            if (is_string($question->options)) {
                $decoded = json_decode($question->options, true);
                $question->options = is_array($decoded) ? $decoded : [];
            } elseif (is_array($question->options)) {
                // biarkan apa adanya
            } else {
                $question->options = [];
            }

            return $question;
        });

        // Split datetime menjadi date dan time untuk frontend
        $quizData = $quiz->toArray();
        if ($quiz->open_datetime) {
            $openDateTime = \Carbon\Carbon::parse($quiz->open_datetime);
            $quizData['date_open'] = $openDateTime->format('Y-m-d');
            $quizData['time_open'] = $openDateTime->format('H:i');
        } else {
            $quizData['date_open'] = '';
            $quizData['time_open'] = '00:00';
        }

        if ($quiz->close_datetime) {
            $closeDateTime = \Carbon\Carbon::parse($quiz->close_datetime);
            $quizData['date_close'] = $closeDateTime->format('Y-m-d');
            $quizData['time_close'] = $closeDateTime->format('H:i');
        } else {
            $quizData['date_close'] = '';
            $quizData['time_close'] = '00:00';
        }

        // Admin dan Mentor dapat melihat semua kelas
        $classes = ClassModel::select('id', 'name')->get();

        return Inertia::render('Quizzes/QuizBuilder', [
            'quiz' => $quizData,
            'classes' => $classes,
        ]);
    }

    /**
     * Memperbarui kuis di database.
     */
    public function update(Request $request, Quiz $quiz)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            $this->authorizeMentorAction($quiz); // Keamanan
        }

        // Validasi, pastikan class_id yang dipilih valid
        $classRule = [
            'required',
            'uuid',
            Rule::exists('classes', 'id'),
        ];

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_open' => 'nullable|date',
            'time_open' => 'nullable|date_format:H:i',
            'date_close' => 'nullable|date',
            'time_close' => 'nullable|date_format:H:i',
            'time_limit_minutes' => 'required|integer|min:1',
            'status' => 'required|string|in:Draf,Diterbitkan',
            'attempts_allowed' => 'required|integer|min:1',
            'class_id' => $classRule,
            'questions' => 'present|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.type' => 'required|string|in:pilihan_ganda,benar_salah,esai',
            'questions.*.options' => 'present|array',
            'questions.*.options.*.text' => ['exclude_if:questions.*.type,esai', 'required', 'string'],
            'questions.*.options.*.is_correct' => ['exclude_if:questions.*.type,esai', 'required', 'boolean'],
        ]);

        // Gabung date dan time menjadi datetime untuk database
        $openDatetime = null;
        $closeDatetime = null;

        if ($validated['date_open'] && $validated['time_open']) {
            $openDatetime = $validated['date_open'].' '.$validated['time_open'].':00';
        } elseif ($validated['date_open']) {
            $openDatetime = $validated['date_open'].' 00:00:00';
        }

        if ($validated['date_close'] && $validated['time_close']) {
            $closeDatetime = $validated['date_close'].' '.$validated['time_close'].':00';
        } elseif ($validated['date_close']) {
            $closeDatetime = $validated['date_close'].' 23:59:59';
        }

        // Validasi bahwa close datetime setelah open datetime jika keduanya ada
        if ($openDatetime && $closeDatetime && strtotime($closeDatetime) <= strtotime($openDatetime)) {
            return back()->withErrors(['date_close' => 'Tanggal dan waktu tutup harus setelah tanggal dan waktu buka.']);
        }

        $quizData = collect($validated)->except(['questions', 'date_open', 'time_open', 'date_close', 'time_close'])->toArray();
        $quizData['open_datetime'] = $openDatetime;
        $quizData['close_datetime'] = $closeDatetime;

        DB::transaction(function () use ($quiz, $quizData, $validated) {
            $quiz->update($quizData);
            $quiz->questions()->delete();
            foreach ($validated['questions'] ?? [] as $questionData) {
                $quiz->questions()->create([
                    'question_text' => $questionData['question_text'],
                    'type' => $questionData['type'],
                    'options' => $questionData['options'] ?? [],
                ]);
            }
        });

        return redirect()->route('quizzes.index')->with('success', 'Quiz berhasil diperbarui');
    }

    /**
     * Menghapus kuis.
     */
    public function destroy(Quiz $quiz)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            $this->authorizeMentorAction($quiz); // Keamanan
        }
        $quiz->delete();

        return redirect()->route('quizzes.index')->with('success', 'Quiz berhasil dihapus');
    }

    public function data(Quiz $quiz)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            $this->authorizeMentorAction($quiz);
        }
        $quiz->load(['class:id,name', 'questions']);
        foreach ($quiz->questions as $question) {
            if (is_string($question->options)) {
                $decoded = json_decode($question->options, true);
                $question->options = is_array($decoded) ? $decoded : [];
            }
        }

        // Split datetime menjadi date dan time untuk frontend
        $quizData = $quiz->toArray();
        if ($quiz->open_datetime) {
            $openDateTime = \Carbon\Carbon::parse($quiz->open_datetime);
            $quizData['date_open'] = $openDateTime->format('Y-m-d');
            $quizData['time_open'] = $openDateTime->format('H:i');
        } else {
            $quizData['date_open'] = '';
            $quizData['time_open'] = '00:00';
        }

        if ($quiz->close_datetime) {
            $closeDateTime = \Carbon\Carbon::parse($quiz->close_datetime);
            $quizData['date_close'] = $closeDateTime->format('Y-m-d');
            $quizData['time_close'] = $closeDateTime->format('H:i');
        } else {
            $quizData['date_close'] = '';
            $quizData['time_close'] = '00:00';
        }

        return response()->json($quizData);
    }

    // =========================================================================
    // ===== BAGIAN UNTUK SISWA (ROUTE NESTED /classes/{class}/quizzes/{quiz}) =====
    // =========================================================================

    /**
     * Menampilkan detail kuis untuk siswa di dalam kelas tertentu.
     */
    public function showForStudent(ClassModel $class, Quiz $quiz)
    {
        $user = Auth::user();
        $rules = app(QuizRules::class);

        // 🔒 Pastikan siswa terdaftar di kelas & kuis sesuai kelas
        if (
            ! $class->enrollments()->where('student_id', $user->id)->exists() ||
            $quiz->class_id !== $class->id
        ) {
            abort(403, 'Akses tidak diizinkan.');
        }

        // 🚫 Jika belum dipublikasikan, jangan tampilkan ke siswa
        if ($quiz->status !== 'Diterbitkan' && $user->role === 'student') {
            abort(403, 'Kuis ini belum tersedia.');
        }

        // 📦 Load relasi dasar
        $quiz->load('class:id,name')->loadCount('questions');

        // 🧭 Ambil semua attempt milik user untuk kuis ini (beserta jawaban dan soal)
        $allAttempts = $quiz->quizAttempts()
            ->with(['answers', 'quiz.questions'])
            ->where('student_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($attempt) {
                $totalQuestions = $attempt->quiz->questions->count();
                $answeredCount = $attempt->answers->count();

                $correctCount = 0;
                foreach ($attempt->quiz->questions as $q) {
                    if ($q->type !== 'esai' && ! empty($q->options)) {
                        $options = is_array($q->options)
                            ? $q->options
                            : json_decode($q->options, true);

                        $correctOption = collect($options)->firstWhere('is_correct', true);
                        $answer = $attempt->answers->firstWhere('question_id', $q->id);

                        if ($correctOption && $answer) {
                            if (strtolower(trim($correctOption['text'])) === strtolower(trim($answer->answer_text))) {
                                $correctCount++;
                            }
                        }
                    }
                }

                // 💡 Tambahkan field dinamis agar bisa dipakai langsung di frontend
                $attempt->answered_count = $answeredCount;
                $attempt->correct_count = $correctCount;
                $attempt->total_questions = $totalQuestions;

                return $attempt;
            });

        // 🔄 Temukan attempt yang sedang berlangsung
        $activeAttempt = $allAttempts->firstWhere('status', 'in_progress');
        $latestAttempt = $activeAttempt;

        // ✅ Jika tidak ada in_progress, ambil attempt terakhir (entah selesai atau belum)
        if (! $latestAttempt && $allAttempts->isNotEmpty()) {
            $latestAttempt = $allAttempts->first();
        }

        // 🧮 Hitung jumlah attempt yang sudah selesai
        $finishedAttemptCount = $allAttempts
            ->whereIn('status', QuizRules::completedStatuses())
            ->count();

        // 📤 Kirim data ke Inertia
        $decision = $rules->startDecision($quiz, true, true, $activeAttempt, $finishedAttemptCount);

        return Inertia::render('Quizzes/QuizInfo', [
            'quiz' => $quiz,
            'attempt' => $latestAttempt,
            'attempts' => $allAttempts,
            'can_attempt' => $decision['allowed'],
            'message' => $decision['message'],
            'classData' => $class->only(['id', 'name']),
        ]);
    }

    // =========================================================================
    // ===== HELPER UNTUK KEAMANAN =====
    // =========================================================================

    /**
     * Helper untuk memastikan mentor hanya bisa mengakses kuis miliknya.
     */
    private function authorizeMentorAction(Quiz $quiz)
    {
        // Fitur Kolaborasi: Mentor diizinkan mengelola kuis lintas kelas.
        // Pengecekan (mentor_id !== user->id) dinonaktifkan.
        return true;
    }
}
