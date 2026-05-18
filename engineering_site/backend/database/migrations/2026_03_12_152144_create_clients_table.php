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
        Schema::create('clients', function (Blueprint $table) {
    $table->id('id_client');
    $table->string('nom');
    $table->string('email')->unique();
    $table->string('telephone');
    $table->string('mot_de_passe');
    $table->timestamp('date_creation')->useCurrent();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
