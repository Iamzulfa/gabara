<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;

/**
 * @property string $id
 * @property string $quiz_id
 * @property string $student_id
 * @property float|null $score
 * @property Carbon|null $started_at
 * @property Carbon|null $finished_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class QuizAttempt extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quiz_attempts';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'quiz_id',
        'student_id',
        'score',
        'status',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'score'       => 'float',
        'started_at'  => 'datetime',
        'status'      => 'string',
        'finished_at' => 'datetime',
    ];

    protected $attributes = [
        'score' => 0.0,
    ];

    /** ----------------------
     *  Relationships
     *  ---------------------*/
    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'attempt_id');
    }

   public function questions()
{
    return $this->hasManyThrough(
        Question::class,
        Quiz::class,
        'id',        // Foreign key di Quiz
        'quiz_id',   // Foreign key di Question
        'quiz_id',   // Local key di Attempt
        'id'         // Local key di Quiz
    );
}


    /**
     * Accessor: Hitung durasi (detik) antara mulai dan selesai.
     */
    public function getDurationAttribute()
    {
        if ($this->started_at && $this->finished_at) {
            return $this->finished_at->diffInSeconds($this->started_at);
        }
        return null;
    }
}
