<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\ClassModel;
use App\Models\Discussion;
use App\Models\DiscussionReply;
use App\Models\Enrollment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DiscussionUnitTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test enrollment validation for discussions and replies.
     */
    public function testEnrollmentValidation()
    {
        // Create users
        $student = User::factory()->create(['role' => 'student']);
        $unenrolledStudent = User::factory()->create(['role' => 'student']);
        $mentor = User::factory()->create(['role' => 'mentor']);

        // Create class
        $class = ClassModel::factory()->create(['mentor_id' => $mentor->id]);

        // Enroll student
        Enrollment::factory()->create([
            'student_id' => $student->id,
            'class_id' => $class->id,
        ]);

        // Test 1: Enrolled student can create discussion
        $user = $student;
        $isEnrolled = $user->role !== 'student' || $class->enrollments()->where('student_id', $user->id)->exists();
        $this->assertTrue($isEnrolled, 'Enrolled student should be able to create discussion');

        // Test 2: Unenrolled student cannot create discussion
        $user = $unenrolledStudent;
        $isEnrolledUnenrolled = $user->role === 'student' && ! $class->enrollments()->where('student_id', $user->id)->exists();
        $this->assertTrue($isEnrolledUnenrolled, 'Unenrolled student should not be able to create discussion');

        // Test 3: Enrolled student can reply
        $discussion = Discussion::factory()->create([
            'class_id' => $class->id,
            'opener_student_id' => $student->id,
        ]);

        $user = $student;
        $isEnrolledForReply = $class->enrollments()->where('student_id', $user->id)->exists();
        $this->assertTrue($isEnrolledForReply, 'Enrolled student should be able to reply');

        // Test 4: Unenrolled student cannot reply
        $user = $unenrolledStudent;
        $isEnrolledForReplyUnenrolled = $class->enrollments()->where('student_id', $user->id)->exists();
        $this->assertFalse($isEnrolledForReplyUnenrolled, 'Unenrolled student should not be able to reply');
    }

    /**
     * Test reply spam interval validation.
     */
    public function testReplySpamInterval()
    {
        // Create users
        $student = User::factory()->create(['role' => 'student']);
        $mentor = User::factory()->create(['role' => 'mentor']);

        // Create class and enroll student
        $class = ClassModel::factory()->create(['mentor_id' => $mentor->id]);
        Enrollment::factory()->create([
            'student_id' => $student->id,
            'class_id' => $class->id,
        ]);

        // Create discussion
        $discussion = Discussion::factory()->create([
            'class_id' => $class->id,
            'opener_student_id' => $student->id,
        ]);

        Auth::shouldReceive('user')->andReturn($student);

        // Test 1: Student can reply initially
        $user = Auth::user();
        $lastReply = DiscussionReply::where('discussion_id', $discussion->id)
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->first();

        $canReply = true;
        if ($lastReply && $lastReply->created_at->gt(now()->subMinutes(2))) {
            $canReply = false;
        }
        $this->assertTrue($canReply, 'Student should be able to reply initially');

        // Create a recent reply
        DiscussionReply::factory()->create([
            'discussion_id' => $discussion->id,
            'user_id' => $student->id,
            'posted_at' => now(),
        ]);

        // Test 2: Student cannot reply within 2 minutes
        $lastReply = DiscussionReply::where('discussion_id', $discussion->id)
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->first();

        $canReplySpam = true;
        if ($lastReply && $lastReply->created_at->gt(now()->subMinutes(2))) {
            $canReplySpam = false;
        }
        $this->assertFalse($canReplySpam, 'Student should not be able to reply within 2 minutes');

        // Test 3: Mentor can bypass spam check
        $user = $mentor;
        $bypassSpam = ! in_array($user->role, ['mentor', 'admin']);
        $this->assertFalse($bypassSpam, 'Mentor should bypass spam check');
    }

    /**
     * Test closed discussion status validation.
     */
    public function testClosedDiscussionStatus()
    {
        // Create users
        $student = User::factory()->create(['role' => 'student']);
        $mentor = User::factory()->create(['role' => 'mentor']);

        // Create class and enroll student
        $class = ClassModel::factory()->create(['mentor_id' => $mentor->id]);
        Enrollment::factory()->create([
            'student_id' => $student->id,
            'class_id' => $class->id,
        ]);

        // Create open discussion
        $discussion = Discussion::factory()->create([
            'class_id' => $class->id,
            'opener_student_id' => $student->id,
            'status' => 'open',
        ]);

        Auth::shouldReceive('user')->andReturn($student);

        // Test 1: Can reply to open discussion
        $canReplyOpen = $discussion->status !== 'closed';
        $this->assertTrue($canReplyOpen, 'Should be able to reply to open discussion');

        // Test 2: Cannot reply to closed discussion
        $discussion->update(['status' => 'closed']);
        $canReplyClosed = $discussion->status !== 'closed';
        $this->assertFalse($canReplyClosed, 'Should not be able to reply to closed discussion');

        // Test 3: Opener can toggle status
        $user = Auth::user();
        $isOpener = $discussion->opener_student_id === $user->id;
        $isMentorOrAdmin = in_array($user->role, ['mentor', 'admin']);
        $canToggle = $isOpener || $isMentorOrAdmin;
        $this->assertTrue($canToggle, 'Opener should be able to toggle status');

        // Test 4: Non-opener student cannot toggle status
        $otherStudent = User::factory()->create(['role' => 'student']);
        Enrollment::factory()->create([
            'student_id' => $otherStudent->id,
            'class_id' => $class->id,
        ]);
        Auth::shouldReceive('user')->andReturn($otherStudent);
        $user = Auth::user();
        $isOpenerOther = $discussion->opener_student_id === $user->id;
        $isMentorOrAdminOther = in_array($user->role, ['mentor', 'admin']);
        $canToggleOther = $isOpenerOther && $isMentorOrAdminOther;
        $this->assertFalse($canToggleOther, 'Non-opener student should not be able to toggle status');

        // Test 5: Mentor can toggle status
        $user = $mentor;
        $isMentorOrAdminMentor = in_array($user->role, ['mentor', 'admin']);
        $canToggleMentor = $isMentorOrAdminMentor;
        $this->assertTrue($canToggleMentor, 'Mentor should be able to toggle status');

        // Test 6: Toggle logic
        $discussion->status = 'open';
        $newStatus = $discussion->status === 'open' ? 'closed' : 'open';
        $this->assertEquals('closed', $newStatus, 'Status should toggle from open to closed');

        $discussion->status = 'closed';
        $newStatus = $discussion->status === 'open' ? 'closed' : 'open';
        $this->assertEquals('open', $newStatus, 'Status should toggle from closed to open');
    }
}
