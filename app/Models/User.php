<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Notifications\VerifyEmailCustom;
use App\Notifications\ResetPasswordCustom;

/**
 * @property string $id
 * @property string $role
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string $password
 * @property string|null $gender
 * @property \Carbon\Carbon|null $birthdate
 * @property string|null $avatar
 * @property string|null $bio
 * @property string|null $parent_name
 * @property string|null $parent_phone
 * @property string|null $address
 * @property string|null $expertise
 * @property string|null $public_id
 * @property \Carbon\Carbon|null $email_verified_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasUuids;

    protected $table = 'users';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'role',
        'name',
        'email',
        'phone',
        'password',
        'gender',
        'birthdate',
        'avatar',
        'bio',
        'parent_name',
        'parent_phone',
        'address',
        'expertise',
        'public_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => 'string',
            'birthdate' => 'date',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** -----------------
     *  Notifications
     *  ----------------- */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailCustom);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordCustom($token));
    }

    /** -----------------
     *  Relationships
     *  ----------------- */
    public function classes()
    {
        return $this->hasMany(ClassModel::class, 'mentor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'student_id');
    }

    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class, 'student_id');
    }

    public function discussionReplies()
    {
        return $this->hasMany(DiscussionReply::class, 'user_id');
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class, 'opener_student_id');
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'admin_id');
    }
}
