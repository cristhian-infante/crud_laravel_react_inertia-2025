<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Category;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();   
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('brand_id')->constrained('brands');
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique(); // ✅ NUEVO
            $table->text('description')->nullable();
            $table->string('name');
            $table->string('model')->nullable(); // ✅ NUEVO: Modelo del repuesto
            $table->string('year')->nullable(); // ✅ NUEVO: Año de aplicación
            $table->text('compatibility')->nullable(); // ✅ NUEVO: Vehículos compatibles
            $table->decimal('cost', 10, 2);
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
            
            $table->index('sku');
            $table->index('barcode'); // ✅ NUEVO índice
            $table->index('status');
            $table->index(['category_id', 'brand_id']);
            $table->index('model'); // ✅ NUEVO índice para búsquedas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
