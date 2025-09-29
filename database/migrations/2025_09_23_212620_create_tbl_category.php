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
       Schema::create('tbl_category', function (Blueprint $table) {
            $table->id();
            $table->string('codCategory')->unique();
            $table->string('nameCategory');
            $table->boolean('status')->default(true)->comment('0: Inactivo, 1: Activo');
            $table->softDeletes();
            $table->timestamps();
            
            // Índices para mejor rendimiento
            $table->index('status');
            $table->index('codCategory');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_category');
    }
};
