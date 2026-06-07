<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\Meeting;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Submission;
use App\Models\User;
use Cloudinary\Api\ApiResponse;
use Cloudinary\Api\Upload\UploadApi;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class LegacyTestCaseAlignmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (['admin', 'mentor', 'student'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
    }

    public function test_enrollment_messages_match_legacy_testcase(): void
    {
        $student = $this->userWithRole('student');
        $mentor = $this->userWithRole('mentor');

        $publicClass = ClassModel::factory()->create([
            'mentor_id' => $mentor->id,
            'visibility' => true,
            'enrollment_code' => 'VALID123',
        ]);

        $privateClass = ClassModel::factory()->create([
            'mentor_id' => $mentor->id,
            'visibility' => false,
            'enrollment_code' => 'PRIVATE1',
        ]);

        $this->actingAs($student)
            ->from('/classes')
            ->post(route('enrollments.store'), ['enrollment_code' => ''])
            ->assertSessionHasErrors(['enrollment_code' => 'Kode kelas wajib diisi']);

        $this->actingAs($student)
            ->from('/classes')
            ->post(route('enrollments.store'), ['enrollment_code' => 'UNKNOWN1'])
            ->assertSessionHasErrors(['enrollment_code' => 'Kode kelas tidak ditemukan']);

        $this->actingAs($student)
            ->from('/classes')
            ->post(route('enrollments.store'), ['enrollment_code' => $privateClass->enrollment_code])
            ->assertSessionHasErrors(['enrollment_code' => 'Kelas tidak tersedia untuk pendaftaran']);

        Enrollment::create([
            'class_id' => $publicClass->id,
            'student_id' => $student->id,
        ]);

        $this->actingAs($student)
            ->from('/classes')
            ->post(route('enrollments.store'), ['enrollment_code' => $publicClass->enrollment_code])
            ->assertSessionHasErrors(['enrollment_code' => 'Anda sudah terdaftar di kelas ini']);

        $newStudent = $this->userWithRole('student');

        $this->actingAs($newStudent)
            ->post(route('enrollments.store'), ['enrollment_code' => $publicClass->enrollment_code])
            ->assertRedirect(route('classes.index'))
            ->assertSessionHas('success', 'Berhasil mendaftar kelas');

        $this->assertDatabaseHas('enrollments', [
            'class_id' => $publicClass->id,
            'student_id' => $newStudent->id,
        ]);
    }

    public function test_submission_and_grading_rules_match_legacy_testcase(): void
    {
        $student = $this->userWithRole('student');
        $mentor = $this->userWithRole('mentor');
        $class = $this->classWithStudent($student, $mentor);
        $assignment = $this->assignmentForClass($class);
        $closedAssignment = $this->assignmentForClass($class, [
            'date_close' => now()->subDay()->toDateString(),
            'time_close' => '00:00',
        ]);

        $this->actingAs($student)
            ->from('/assignments')
            ->post(route('submissions.store', [$class, $assignment]), [])
            ->assertSessionHasErrors(['file' => 'File tidak boleh kosong']);

        $this->actingAs($student)
            ->from('/assignments')
            ->post(route('submissions.store', [$class, $assignment]), [
                'file' => UploadedFile::fake()->create('submission.jpg', 10, 'image/jpeg'),
            ])
            ->assertSessionHasErrors([
                'file' => 'Tipe file tidak didukung. Hanya PDF dan DOCX yang diizinkan',
            ]);

        $this->actingAs($student)
            ->from('/assignments')
            ->post(route('submissions.store', [$class, $assignment]), [
                'file' => UploadedFile::fake()->create('submission.pdf', 2049, 'application/pdf'),
            ])
            ->assertSessionHasErrors(['file' => 'Ukuran file maksimal 2 MB']);

        $this->actingAs($student)
            ->from('/assignments')
            ->post(route('submissions.store', [$class, $closedAssignment]), [
                'file' => UploadedFile::fake()->create('submission.pdf', 1, 'application/pdf'),
            ])
            ->assertSessionHasErrors(['file' => 'Batas waktu pengumpulan telah lewat']);

        $cloudinaryApi = Mockery::mock(UploadApi::class);
        $cloudinaryApi->shouldReceive('upload')->twice()->andReturn(
            new ApiResponse([
                'public_id' => 'submissions/legacy-create',
                'secure_url' => 'https://example.test/submission-create.pdf',
            ], []),
            new ApiResponse([
                'public_id' => 'submissions/legacy-update',
                'secure_url' => 'https://example.test/submission-update.pdf',
            ], []),
        );
        $cloudinaryApi->shouldReceive('destroy')
            ->once()
            ->with('submissions/legacy-create')
            ->andReturn(new ApiResponse(['result' => 'ok'], []));
        Cloudinary::shouldReceive('uploadApi')->andReturn($cloudinaryApi);

        $this->actingAs($student)
            ->from('/assignments')
            ->post(route('submissions.store', [$class, $assignment]), [
                'file' => UploadedFile::fake()->create('submission.pdf', 1, 'application/pdf'),
            ])
            ->assertSessionHas('success', 'Tugas berhasil dikumpulkan');

        $submission = Submission::where('assignment_id', $assignment->id)
            ->where('student_id', $student->id)
            ->firstOrFail();

        $this->actingAs($student)
            ->from('/assignments')
            ->patch(route('submissions.update', [$class, $assignment, $submission]), [
                'file' => UploadedFile::fake()->create('submission.docx', 1, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
            ])
            ->assertSessionHas('success', 'Submission berhasil diperbarui');

        $this->actingAs($mentor)
            ->from('/assignments')
            ->post(route('submissions.updateGrade', [$class, $assignment, $submission]), [
                'grade' => -1,
            ])
            ->assertSessionHasErrors(['grade' => 'Nilai minimal adalah 0.']);

        $this->actingAs($mentor)
            ->from('/assignments')
            ->post(route('submissions.updateGrade', [$class, $assignment, $submission]), [
                'grade' => 101,
            ])
            ->assertSessionHasErrors(['grade' => 'Nilai maksimal adalah 100.']);

        $this->actingAs($mentor)
            ->from('/assignments')
            ->post(route('submissions.updateGrade', [$class, $assignment, $submission]), [
                'grade' => 100,
                'feedback' => 'Lengkap',
            ])
            ->assertSessionHas('success', 'Nilai berhasil disimpan!');

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'grade' => 100,
            'feedback' => 'Lengkap',
        ]);
    }

    public function test_quiz_availability_and_attempt_rules_match_legacy_testcase(): void
    {
        $student = $this->userWithRole('student');
        $class = $this->classWithStudent($student);

        $draftQuiz = $this->quizForClass($class, ['status' => 'Draf']);
        $this->actingAs($student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$class, $draftQuiz]))
            ->assertSessionHasErrors(['quiz' => 'Kuis ini belum tersedia.']);

        $futureQuiz = $this->quizForClass($class, [
            'open_datetime' => now()->addHour(),
            'close_datetime' => now()->addHours(2),
        ]);

        $this->actingAs($student)
            ->get(route('classes.quizzes.show', [$class, $futureQuiz]))
            ->assertInertia(fn (Assert $page) => $page
                ->where('can_attempt', false)
                ->where('message', 'Tidak bisa memulai')
            );

        $this->actingAs($student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$class, $futureQuiz]))
            ->assertSessionHasErrors(['quiz' => 'Tidak bisa memulai']);

        $closedQuiz = $this->quizForClass($class, [
            'open_datetime' => now()->subHours(2),
            'close_datetime' => now()->subHour(),
        ]);

        $this->actingAs($student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$class, $closedQuiz]))
            ->assertSessionHasErrors(['quiz' => 'Quiz sudah ditutup']);

        $maxAttemptQuiz = $this->quizForClass($class);
        QuizAttempt::factory()->create([
            'quiz_id' => $maxAttemptQuiz->id,
            'student_id' => $student->id,
            'status' => 'completed',
            'finished_at' => now(),
        ]);

        $this->actingAs($student)
            ->from('/classes')
            ->post(route('classes.quizzes.start', [$class, $maxAttemptQuiz]))
            ->assertSessionHasErrors([
                'quiz' => 'Anda telah mencapai batas maksimum pengerjaan quiz',
            ]);

        $resumeQuiz = $this->quizForClass($class);
        $existingAttempt = QuizAttempt::factory()->create([
            'quiz_id' => $resumeQuiz->id,
            'student_id' => $student->id,
            'status' => 'in_progress',
        ]);

        $this->actingAs($student)
            ->post(route('classes.quizzes.start', [$class, $resumeQuiz]))
            ->assertRedirect(route('quiz.attempts.show', $existingAttempt));

        $this->assertDatabaseCount('quiz_attempts', 2);
    }

    public function test_quiz_scoring_matches_legacy_testcase(): void
    {
        $student = $this->userWithRole('student');
        $class = $this->classWithStudent($student);

        $correctAttempt = $this->attemptWithQuestion($student, $class, 'pilihan_ganda', [
            ['text' => 'A', 'is_correct' => false],
            ['text' => 'B', 'is_correct' => true],
        ]);

        $this->actingAs($student)
            ->post(route('quiz.attempts.submit', $correctAttempt), [
                'answers' => [
                    [
                        'question_id' => $correctAttempt->quiz->questions->first()->id,
                        'answer_text' => 'B',
                    ],
                ],
            ])
            ->assertSessionHas('success', 'Jawaban berhasil dikirim!');

        $this->assertSame('completed', $correctAttempt->refresh()->status);
        $this->assertEquals(100.0, $correctAttempt->score);

        $wrongAttempt = $this->attemptWithQuestion($student, $class, 'pilihan_ganda', [
            ['text' => 'A', 'is_correct' => false],
            ['text' => 'B', 'is_correct' => true],
        ]);

        $this->actingAs($student)
            ->post(route('quiz.attempts.submit', $wrongAttempt), [
                'answers' => [
                    [
                        'question_id' => $wrongAttempt->quiz->questions->first()->id,
                        'answer_text' => 'A',
                    ],
                ],
            ]);

        $this->assertSame('completed', $wrongAttempt->refresh()->status);
        $this->assertEquals(0.0, $wrongAttempt->score);

        $essayAttempt = $this->attemptWithQuestion($student, $class, 'esai', []);

        $this->actingAs($student)
            ->post(route('quiz.attempts.submit', $essayAttempt), [
                'answers' => [
                    [
                        'question_id' => $essayAttempt->quiz->questions->first()->id,
                        'answer_text' => 'Jawaban esai siswa',
                    ],
                ],
            ]);

        $this->assertSame('completed', $essayAttempt->refresh()->status);
        $this->assertNull($essayAttempt->score);
    }

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

    private function assignmentForClass(ClassModel $class, array $attributes = []): Assignment
    {
        $meeting = Meeting::factory()->create(['class_id' => $class->id]);

        return Assignment::factory()->create(array_merge([
            'meeting_id' => $meeting->id,
            'date_open' => now()->subDay()->toDateString(),
            'time_open' => '00:00',
            'date_close' => now()->addDay()->toDateString(),
            'time_close' => '23:59',
        ], $attributes));
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

    private function attemptWithQuestion(
        User $student,
        ClassModel $class,
        string $questionType,
        array $options
    ): QuizAttempt {
        $quiz = $this->quizForClass($class);

        Question::factory()->create([
            'quiz_id' => $quiz->id,
            'type' => $questionType,
            'options' => $options,
        ]);

        $attempt = QuizAttempt::factory()->create([
            'quiz_id' => $quiz->id,
            'student_id' => $student->id,
            'status' => 'in_progress',
        ]);

        return $attempt->load('quiz.questions');
    }
}
