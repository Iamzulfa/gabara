<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $attempt_id
 * @property string $question_id
 * @property string $answer_text
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Answer extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'answers';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'attempt_id',
        'question_id',
        'answer_text',
    ];

    public function quizAttempt()
    {
        return $this->belongsTo(QuizAttempt::class, 'attempt_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
