<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('draw_histories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('matched_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamp('created_at')->useCurrent();

            // Évite les répétitions trop fréquentes
            $table->index(['user_id', 'matched_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('draw_histories');
    }
};

