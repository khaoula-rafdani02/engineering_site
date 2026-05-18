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
     Schema::create('documents', function (Blueprint $table) {
    $table->id('id_document');
    $table->string('fichier');
    $table->unsignedBigInteger('id_projet');
    $table->timestamp('date_upload')->useCurrent();
    $table->string('type_document');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
