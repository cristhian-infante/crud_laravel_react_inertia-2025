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
        Schema::create('branch_orders', function (Blueprint $table) {
            //Pedidos entre Sucursales
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('from_branch_id')->constrained('branches'); // Sucursal que pide
            $table->foreignId('to_branch_id')->constrained('branches'); // Sucursal que tiene stock
            $table->foreignId('to_location_id')->constrained('warehouse_locations'); // Ubicación destino
            $table->integer('quantity');
            $table->enum('status', ['requested', 'approved', 'in_transit', 'delivered', 'cancelled'])->default('requested');
            $table->text('customer_info')->nullable(); // Info del cliente que solicitó
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            
            $table->index('order_code');
            $table->index('status');
            $table->index(['from_branch_id', 'to_branch_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_orders');
    }
};
