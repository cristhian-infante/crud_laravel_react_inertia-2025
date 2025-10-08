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
        Schema::create('warehouse_locations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
                $table->string('aisle', 10); // Más corto
                $table->string('rack', 10);  // Más corto
                $table->string('shelf', 10); // Más corto
                $table->string('position', 10); // Más corto
                $table->string('location_code')->virtualAs("CONCAT(aisle, '-', rack, '-', shelf, '-', position)");
                $table->text('description')->nullable();
                $table->boolean('status')->default(true);
                $table->timestamps();
                
                // ✅ Este nombre ahora cabe en 64 caracteres
                $table->unique(['branch_id', 'aisle', 'rack', 'shelf', 'position']);
                $table->index('location_code');
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_locations');
    }
};
