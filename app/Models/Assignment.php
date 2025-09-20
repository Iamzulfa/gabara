<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $meeting_id
 * @property string $title
 * @property string $description
 * @property \Carbon\Carbon $date_open
 * @property string $time_open
 * @property \Carbon\Carbon $date_close
 * @property string $time_close
 * @property string|null $file_link
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Assignment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'assignments';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'meeting_id',
        'title',
        'description',
        'date_open',
        'time_open',
        'date_close',
        'time_close',
        'file_link',
    ];

    protected $casts = [
        'date_open' => 'date',
        'time_open' => 'string',
        'date_close' => 'date',
        'time_close' => 'string',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class, 'meeting_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'assignment_id');
    }
}
