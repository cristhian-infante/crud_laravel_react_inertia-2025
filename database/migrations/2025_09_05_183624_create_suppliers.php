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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->enum('document_type', ['RUC', 'DNI', 'OTHER'])->default('RUC');
            $table->string('document_number', 20)->nullable();
            $table->string('name');
            $table->string('contact_person')->nullable(); // ✅ NUEVO
            $table->string('contact_email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->boolean('status')->default(true);
            $table->softDeletes();
            $table->timestamps();
            
            $table->index(['document_type', 'document_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
