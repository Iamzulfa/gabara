<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $class_id
 * @property string $title
 * @property string $description
 * @property string $status
 * @property string $opener_student_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Discussion extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'discussions';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'class_id',
        'title',
        'description',
        'status',
        'opener_student_id',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function openerStudent()
    {
        return $this->belongsTo(User::class, 'opener_student_id');
    }

    public function discussionReplies()
    {
        return $this->hasMany(DiscussionReply::class, 'discussion_id')->with('user')->orderBy('posted_at', 'asc');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
