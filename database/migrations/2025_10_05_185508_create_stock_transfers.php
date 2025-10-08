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
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_code')->unique();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('from_branch_id')->constrained('branches');
            $table->foreignId('to_branch_id')->constrained('branches');
            $table->foreignId('from_location_id')->constrained('warehouse_locations');
            $table->foreignId('to_location_id')->constrained('warehouse_locations');
            $table->integer('quantity');
            $table->enum('status', ['pending', 'approved', 'in_transit', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->index('transfer_code');
            $table->index('status');
            $table->index(['from_branch_id', 'to_branch_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transfers');
    }
};
