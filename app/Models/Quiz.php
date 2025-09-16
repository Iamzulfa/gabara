<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $title
 * @property string $description
 * @property \Carbon\Carbon $open_datetime
 * @property \Carbon\Carbon $close_datetime
 * @property int $time_limit_minutes
 * @property string $status
 * @property string $class_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Quiz extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quizzes';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'open_datetime',
        'close_datetime',
        'time_limit_minutes',
        'status',
        'class_id',
    ];

    protected $casts = [
        'open_datetime' => 'datetime',
        'close_datetime' => 'datetime',
        'time_limit_minutes' => 'integer',
        'status' => 'string',
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'quiz_id');
    }

    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class, 'quiz_id');
    }
}
