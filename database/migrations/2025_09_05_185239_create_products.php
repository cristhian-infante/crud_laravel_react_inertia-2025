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
            $table->text('description')->nullable();
            $table->string('name');
            $table->integer('stock_min');
            $table->integer('stock_total')->default(0);
            $table->decimal('cost', 10, 2);
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
            
            $table->index('sku');
            $table->index('status');
            $table->index(['category_id', 'brand_id']);
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
