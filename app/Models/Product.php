<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    
    protected $fillable = [
        'category_id', 
        'brand_id',
        'supplier_id',
        'sku',
        'description',
        'name',
        'stock_min',
        'stock_total',
        'cost',
        'price',
        'image',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost' => 'decimal:2',
        'stock_total' => 'integer',
        'stock_min' => 'integer',
        'status' => 'boolean',
    ];

    protected $attributes = [
        'status' => true,
        'stock_total' => 0,
        'stock_min' => 0
    ];
    
    // Relaciones
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
    
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    // Accesores útiles
    public function getFormattedPriceAttribute(): string
    {
        return '$ ' . number_format($this->price, 2);
    }

    public function getFormattedCostAttribute(): string
    {
        return '$ ' . number_format($this->cost, 2);
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->stock_total <= 0) {
            return 'Agotado';
        } elseif ($this->stock_total <= $this->stock_min) {
            return 'Stock Bajo';
        } else {
            return 'Disponible';
        }
    }
}