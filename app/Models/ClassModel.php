<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $name
 * @property string $description
 * @property string $enrollment_code
 * @property string|null $thumbnail
 * @property bool $visibility
 * @property string $academic_year_tag
 * @property string $mentor_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class ClassModel extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'classes';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'enrollment_code',
        'thumbnail',
        'visibility',
        'academic_year_tag',
        'mentor_id',
    ];

    protected $casts = [
        'visibility' => 'boolean',
    ];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'class_id');
    }

    public function meetings()
    {
        return $this->hasMany(Meeting::class, 'class_id');
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class, 'class_id');
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class, 'class_id');
    }
}
