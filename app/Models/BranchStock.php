<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BranchStock extends Model
{
    use HasFactory;
     
    protected $table = 'branch_stock'; 
    protected $fillable = [
        'branch_id',
        'product_id',
        'location_id',
        'stock',
        'stock_min',
    ];

   
    protected $casts = [
        'stock' => 'integer',
        'stock_min' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

   
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(WarehouseLocation::class);
    }
}