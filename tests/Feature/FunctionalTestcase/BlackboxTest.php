<?php

namespace Tests\Feature\FunctionalTestcase;

use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

/**
 * Blackbox Test – FR-5 Quiz Attempt
 *
 * Menguji flow end-to-end quiz attempt melalui HTTP request
 * berdasarkan Test Case Sheet TC-QUIZ-001 s/d TC-QUIZ-005.
 */
class BlackboxTest extends TestCase
{
    use RefreshDatabase;

    private User $student;

    private ClassModel $class;

    protected function setUp(): void
    {
        parent::setUp();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (['admin', 'mentor', 'student'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $this->student = $this->userWithRole('student');
        $this->class = $this->classWithStudent($this->student);
    }

    /**
     * TC-QUIZ-001 [BBT R1] Semua kondisi terpenuhi → QuizAttempt baru dibuat status "in_progress".
     */
    public function test_tc_quiz_001_valid_attempt_creates_in_progress_record(): void
    {
        $validQuiz = $this->quizForClass($this->class, ['attempts_allowed' => 3]);

        $this->actingAs($this->student)
            ->post(route('classes.quizzes.start', [$this->class, $validQuiz]))
            ->assertRedirect();

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $validQuiz->id,
            'student_id' => $this->student->id,
            'status' => 'in_progress',
        ]);
    }

    /**
     * TC-QUIZ-002 [BBT R3] Quiz berstatus "Draf" → session error "Kuis ini belum tersedia."
     */
    public function test_tc_quiz_002_draft_quiz_is_rejected(): void
    {
        $draftQuiz = $this->quizForClass($this->class, ['status' => 'Draf']);

        $this->actingAs($this->student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$this->class, $draftQuiz]))
            ->assertSessionHasErrors(['quiz' => 'Kuis ini belum tersedia.']);
    }

    /**
     * TC-QUIZ-003 [BBT R4a] Waktu belum masuk open_datetime → Inertia can_attempt=false & session error.
     */
    public function test_tc_quiz_003_future_quiz_is_rejected(): void
    {
        $futureQuiz = $this->quizForClass($this->class, [
            'open_datetime' => now()->addHour(),
            'close_datetime' => now()->addHours(2),
        ]);

        $this->actingAs($this->student)
            ->get(route('classes.quizzes.show', [$this->class, $futureQuiz]))
            ->assertInertia(fn (Assert $page) => $page
                ->where('can_attempt', false)
                ->where('message', 'Tidak bisa memulai')
            );

        $this->actingAs($this->student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$this->class, $futureQuiz]))
            ->assertSessionHasErrors(['quiz' => 'Tidak bisa memulai']);
    }

    /**
     * TC-QUIZ-004 [BBT R4b] Waktu sudah melewati close_datetime → session error "Quiz sudah ditutup".
     */
    public function test_tc_quiz_004_closed_quiz_is_rejected(): void
    {
        $closedQuiz = $this->quizForClass($this->class, [
            'open_datetime' => now()->subHours(2),
            'close_datetime' => now()->subHour(),
        ]);

        $this->actingAs($this->student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$this->class, $closedQuiz]))
            ->assertSessionHasErrors(['quiz' => 'Quiz sudah ditutup']);
    }

    /**
     * TC-QUIZ-005 [BBT R6] Student sudah mencapai batas attempt → session error.
     */
    public function test_tc_quiz_005_max_attempts_reached_is_rejected(): void
    {
        $maxAttemptQuiz = $this->quizForClass($this->class, ['attempts_allowed' => 1]);

        QuizAttempt::factory()->create([
            'quiz_id' => $maxAttemptQuiz->id,
            'student_id' => $this->student->id,
            'status' => 'completed',
            'finished_at' => now(),
        ]);

        $this->actingAs($this->student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$this->class, $maxAttemptQuiz]))
            ->assertSessionHasErrors([
                'quiz' => 'Anda telah mencapai batas maksimum pengerjaan quiz',
            ]);
    }

    // ──────────────────────────────────────────────
    //  HELPERS
    // ──────────────────────────────────────────────

    private function userWithRole(string $role): User
    {
        $user = User::factory()->create(['role' => $role]);
        $user->assignRole($role);

        return $user;
    }

    private function classWithStudent(User $student, ?User $mentor = null): ClassModel
    {
        $mentor ??= $this->userWithRole('mentor');

        $class = ClassModel::factory()->create([
            'mentor_id' => $mentor->id,
            'visibility' => true,
        ]);

        Enrollment::create([
            'class_id' => $class->id,
            'student_id' => $student->id,
        ]);

        return $class;
    }

    private function quizForClass(ClassModel $class, array $attributes = []): Quiz
    {
        return Quiz::factory()->create(array_merge([
            'class_id' => $class->id,
            'open_datetime' => now()->subHour(),
            'close_datetime' => now()->addHour(),
            'status' => 'Diterbitkan',
            'attempts_allowed' => 1,
        ], $attributes));
    }
}
