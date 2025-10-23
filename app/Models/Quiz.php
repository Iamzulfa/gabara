<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;
use Illuminate\Support\Str;

class Quiz extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quizzes';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['title', 'description', 'open_datetime', 'close_datetime', 'time_limit_minutes', 'status', 'attempts_allowed', 'class_id'];

    protected $casts = [
        'open_datetime' => 'datetime',
        'close_datetime' => 'datetime',
        'time_limit_minutes' => 'integer',
        'status' => 'string',
        'attempts_allowed' => 'integer',
    ];

    protected $attributes = [
        'status' => 'close', // default sesuai migration
        'attempts_allowed' => 1,
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /** RELATIONSHIPS */

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

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class, 'quiz_id');
    }
}
