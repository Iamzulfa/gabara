<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\ClassModel;
use App\Models\QuizAttempt;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuizAttemptController extends Controller
{
    /**
     * Mulai atau lanjutkan attempt.
     */
    public function start(Request $request, ?ClassModel $class = null, Quiz $quiz)
    {
        $user = Auth::user();

        // Cek enroll
        if ($class && !$class->enrollments()->where('student_id', $user->id)->exists()) {
            return back()->withErrors(['authorization' => 'Anda tidak terdaftar di kelas ini.']);
        }

        // Pastikan quiz sesuai kelas
        if ($class && $quiz->class_id !== $class->id) {
            return back()->withErrors(['quiz' => 'Kuis tidak ditemukan di kelas ini.']);
        }

        // Cari attempt aktif
        $existing = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('student_id', $user->id)
            ->where('status', 'in_progress')
            ->first();

        if ($existing) {
            return redirect()->route('quiz.attempts.show', $existing->id);
        }

        // Validasi waktu
        $now = now();
        if ($quiz->open_datetime && $now->isBefore($quiz->open_datetime)) {
            return back()->withErrors(['quiz' => 'Kuis belum dibuka.']);
        }
        if ($quiz->close_datetime && $now->isAfter($quiz->close_datetime)) {
            return back()->withErrors(['quiz' => 'Waktu pengerjaan kuis sudah berakhir.']);
        }

        // Validasi attempt count
        $count = $quiz->quizAttempts()->where('student_id', $user->id)->count();
        if ($quiz->attempts_allowed > 0 && $count >= $quiz->attempts_allowed) {
            return back()->withErrors(['quiz' => 'Anda sudah mencapai batas pengerjaan kuis.']);
        }

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $user->id,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        return redirect()->route('quiz.attempts.show', $attempt->id);
    }

    /**
     * Halaman pengerjaan quiz.
     */
    public function show(QuizAttempt $attempt)
    {
        $user = auth()->user();
        if ($attempt->student_id !== $user->id) abort(403, 'Akses tidak diizinkan.');

        $attempt->load([
        'quiz.questions', // include options dari setiap pertanyaan
        'answers', // include jawaban siswa
    ]);

        $attempt->load(['quiz.questions', 'answers']);
        return Inertia::render('Quizzes/QuizAttempt', [
            'attempt' => $attempt,
            'quiz' => $attempt->quiz,
            'classData' => $attempt->quiz->class,
        ]);
    }

    /**
     * Submit hasil quiz.
     */
    public function submit(Request $request, QuizAttempt $attempt)
    {
        $user = $request->user();
        if ($attempt->student_id !== $user->id) {
            return redirect()->route('quiz.attempts.history', [
                'class' => $attempt->quiz->class_id,
                'quiz' => $attempt->quiz_id,
            ])->withErrors(['auth' => 'Anda tidak diizinkan mengirim jawaban untuk attempt ini.']);
        }

        if ($attempt->finished_at) {
            return redirect()->route('quiz.attempts.history', [
                'class' => $attempt->quiz->class_id,
                'quiz' => $attempt->quiz_id,
            ])->with('info', 'Attempt ini sudah selesai. Jawaban tidak dikirim ulang.');
        }

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|string',
            'answers.*.answer_text' => 'nullable|string',
        ]);

        DB::transaction(function () use ($attempt, $validated) {
            $quiz = $attempt->quiz()->with('questions')->firstOrFail();
            $questions = $quiz->questions;

            $correctCount = 0;
            $countableQuestions = 0;

            // Hapus jawaban lama
            $attempt->answers()->delete();

            foreach ($questions as $question) {
                $submitted = collect($validated['answers'])->firstWhere('question_id', (string)$question->id);
                $answerText = data_get($submitted, 'answer_text', '');
                if ($answerText === null) $answerText = '';

                Answer::create([
                    'attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                    'answer_text' => $answerText,
                ]);

                // Hitung score hanya untuk non-esai
                if ($question->type !== 'esai' && !empty($question->options)) {
                    $correctOption = collect($question->options)->firstWhere('is_correct', true);
                    if ($correctOption) {
                        $countableQuestions++;
                        $normalizedCorrect = strtolower(trim($correctOption['text']));
                        $normalizedAnswer = strtolower(trim($answerText));
                        if (!empty($answerText) && $normalizedCorrect === $normalizedAnswer) {
                            $correctCount++;
                        }
                    }
                }
            }

            $totalForScore = $countableQuestions > 0 ? $countableQuestions : 1;
            $score = round(($correctCount / $totalForScore) * 100, 2);

            $attempt->update([
                'finished_at' => now(),
                'status' => 'finished',
                'score' => $score,
            ]);
        });

        return redirect()->route('quiz.attempts.history', [
            'class' => $attempt->quiz->class_id,
            'quiz' => $attempt->quiz_id,
        ])->with('success', 'Jawaban berhasil dikirim!');
    }

    /**
     * Riwayat attempt siswa.
     */
    public function history(Request $request, $classId = null, $quizId = null)
    {
        $user = $request->user();
        $quiz = $quizId ? Quiz::with('questions')->findOrFail($quizId) : null;
        $classData = $classId ? ClassModel::findOrFail($classId) : null;

        $attempts = QuizAttempt::with(['quiz.questions', 'answers'])
            ->where('student_id', $user->id)
            ->when($quizId, fn($q) => $q->where('quiz_id', $quizId))
            ->orderByDesc('created_at')
            ->paginate(10);

        if (!$quiz && $attempts->count() > 0) $quiz = $attempts->first()->quiz;

        return Inertia::render('Quizzes/QuizHistory', [
            'attempts' => $attempts,
            'classData' => $classData,
            'quiz' => $quiz,
        ]);
    }
}
