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
        Schema::create('messages', function (Blueprint $table) {
            $table->id('mg_id');
            $table->integer('mg_sender')->nullable();
            $table->integer('mg_receiver')->nullable();
            $table->softDeletes();
            $table->timestamp('mg_created_at')->nullable();
            $table->timestamp('mg_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
