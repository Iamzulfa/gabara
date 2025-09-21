<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $assignment_id
 * @property string $student_id
 * @property string|null $submission_content
 * @property float|null $grade
 * @property string|null $feedback
 * @property \Carbon\Carbon|null $submitted_at
 * @property string|null $public_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Submission extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'submissions';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'assignment_id',
        'student_id',
        'submission_content',
        'grade',
        'feedback',
        'submitted_at',
        'public_id',
    ];

    protected $casts = [
        'grade' => 'float',
        'submitted_at' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
