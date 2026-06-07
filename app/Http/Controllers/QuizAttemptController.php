<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\ClassModel;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Services\FunctionalTestcase\QuizRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuizAttemptController extends Controller
{
    /**
     * Mulai atau lanjutkan attempt.
     */
    public function start(Request $request, ClassModel $class, Quiz $quiz)
    {
        $user = Auth::user();
        $rules = app(QuizRules::class);

        $decision = $rules->startDecision(
            $quiz,
            $class->enrollments()->where('student_id', $user->id)->exists(),
            $quiz->class_id === $class->id,
            $rules->activeAttempt($quiz, $user->id),
            $rules->completedAttemptCount($quiz, $user->id)
        );

        if (! $decision['allowed']) {
            return back()->withErrors([$decision['key'] => $decision['message']]);
        }

        if ($decision['action'] === QuizRules::ACTION_RESUME) {
            return redirect()->route('quiz.attempts.show', $decision['attempt']->id);
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
        if ($attempt->student_id !== $user->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

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

            // Hapus jawaban lama
            $attempt->answers()->delete();

            foreach ($questions as $question) {
                $submitted = collect($validated['answers'])->firstWhere('question_id', (string) $question->id);
                $answerText = data_get($submitted, 'answer_text', '');
                if ($answerText === null) {
                    $answerText = '';
                }

                Answer::create([
                    'attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                    'answer_text' => $answerText,
                ]);

            }

            $attempt->update([
                'finished_at' => now(),
                'status' => 'completed',
                'score' => app(QuizRules::class)->scoreFor($questions, $validated['answers']),
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
            ->when($quizId, fn ($q) => $q->where('quiz_id', $quizId))
            ->orderByDesc('created_at')
            ->paginate(10);

        if (! $quiz && $attempts->count() > 0) {
            $quiz = $attempts->first()->quiz;
        }

        return Inertia::render('Quizzes/QuizHistory', [
            'attempts' => $attempts,
            'classData' => $classData,
            'quiz' => $quiz,
        ]);
    }
}
