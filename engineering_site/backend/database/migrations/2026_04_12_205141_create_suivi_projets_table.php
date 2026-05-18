<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    if (!Schema::hasTable('suivi_projets')) {  // ← زيد هاد السطر
        Schema::create('suivi_projets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_projet')->constrained('projets')->onDelete('cascade');
            $table->foreignId('id_employe')->constrained('employes')->onDelete('cascade');
            $table->string('localisation')->nullable();
            $table->enum('statut', ['En cours', 'Terminé', 'Suspendu'])->default('En cours');
            $table->text('commentaire')->nullable();
            $table->json('photos')->nullable();
            $table->timestamp('date_suivi')->useCurrent();
            $table->timestamps();
        });
    }
}

    public function down()
    {
        Schema::dropIfExists('suivi_projets');
    }
};