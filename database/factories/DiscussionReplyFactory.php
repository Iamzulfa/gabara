<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\DiscussionReply;
use App\Models\Discussion;
use App\Models\User;

class DiscussionReplyFactory extends Factory
{
    protected $model = DiscussionReply::class;

    public function definition()
    {
        return [
            'discussion_id' => Discussion::factory(),
            'user_id' => User::factory()->create(['role' => 'student'])->id,
            'reply_text' => $this->faker->paragraph(),
            'posted_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'parent_id' => null,
        ];
    }

    public function withParent($parentId = null)
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parentId ?? DiscussionReply::factory(),
        ]);
    }
}
