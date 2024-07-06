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
        Schema::create('message_contents', function (Blueprint $table) {
            $table->id('mgc_id');
            $table->integer('mgc_messageId')->nullable();
            $table->integer('mgc_sender')->nullable();
            $table->text('mgc_content')->nullable();
            $table->tinyInteger('mgc_isRead')->default(0)->nullable()->comment("0 okunmadı 1 okundu");
            $table->softDeletes();
            $table->timestamp('mgc_created_at')->nullable();
            $table->timestamp('mgc_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_contents');
    }
};
