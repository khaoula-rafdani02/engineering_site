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
      Schema::create('projets', function (Blueprint $table) {
    $table->id('id_projet');
    $table->string('nom_projet');
    $table->text('description');
    $table->date('date_debut');
    $table->date('date_cloture')->nullable();
    $table->string('maitre_ouvrage');
    $table->decimal('indemnite',10,2);

    $table->unsignedBigInteger('id_client');
    $table->unsignedBigInteger('id_employe');

    $table->enum('statut',['En cours','Terminé','Suspendu']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projets');
    }
};
