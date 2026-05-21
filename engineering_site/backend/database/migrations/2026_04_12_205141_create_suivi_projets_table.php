<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('suivi_projets')) {
            Schema::create('suivi_projets', function (Blueprint $table) {
                $table->id();
                
                $table->unsignedBigInteger('id_projet');
                $table->foreign('id_projet')->references('id_projet')->on('projets')->onDelete('cascade');
                
                $table->unsignedBigInteger('id_employe');
                $table->foreign('id_employe')->references('id_employe')->on('employes')->onDelete('cascade');
                
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