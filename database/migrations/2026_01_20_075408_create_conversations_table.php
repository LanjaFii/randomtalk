<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user1_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('user2_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // 🔒 Une seule conversation par paire
            $table->unique(['user1_id', 'user2_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};

