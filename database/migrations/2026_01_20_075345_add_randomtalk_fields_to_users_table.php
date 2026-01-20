<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('public_id', 9)->unique()->after('id');
            $table->enum('status', ['online', 'offline'])->default('offline');
            $table->timestamp('last_seen')->nullable();

            $table->index('public_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['public_id']);
            $table->dropColumn(['public_id', 'status', 'last_seen']);
        });
    }
};

