<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
   protected $fillable = [
            'category_id',  
            'nombre',
            'stock',
            'precio'
            ];
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
