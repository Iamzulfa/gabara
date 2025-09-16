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
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Meeting extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'meetings';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'class_id',
        'title',
        'description',
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function materials()
    {
        return $this->hasMany(Material::class, 'meeting_id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'meeting_id');
    }
}
