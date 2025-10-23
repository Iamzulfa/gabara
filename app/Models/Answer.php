<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * @property string $id
 * @property string $attempt_id
 * @property string $question_id
 * @property string $answer_text
 * @property Carbon $created_at
 * @property Carbon $updated_at
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

    protected $casts = [
        'answer_text' => 'string',
    ];

    // Opsional: memastikan ID selalu ada (fallback untuk kasus manual insert)
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /** ----------------------
     *  Relationships
     *  ---------------------*/
    public function attempt()
    {
        return $this->belongsTo(QuizAttempt::class, 'attempt_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
