<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discussions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('class_id');
            $table->string('title');
            $table->text('description');
            $table->string('status')->default('open')->comment('open/close');
            $table->uuid('opener_student_id');
            $table->foreign('class_id')->references('id')->on('classes')->onDelete('cascade');
            $table->foreign('opener_student_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('discussion_replies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('discussion_id');
            $table->uuid('user_id');
            $table->string('reply_text');
            $table->datetime('posted_at');
            $table->foreign('discussion_id')->references('id')->on('discussions')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('admin_id');
            $table->string('title');
            $table->string('thumbnail')->nullable();
            $table->string('public_id')->nullable();
            $table->text('content');
            $table->datetime('posted_at');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('discussion_replies');
        Schema::dropIfExists('discussions');
    }
};
