<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $title
 * @property string $thumbnail
 * @property string $public_id
 * @property string $content
 * @property string $admin_id
 * @property \Carbon\Carbon $posted_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Announcement extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'announcements';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'thumbnail',
        'public_id',
        'content',
        'admin_id',
        'posted_at',
    ];

    protected $casts = [
        'posted_at' => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
