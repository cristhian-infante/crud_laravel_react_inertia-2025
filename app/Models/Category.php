<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Product;

class Category extends Model
{
    use HasFactory;
    //nombre de la tabla
    protected $table = 'tbl_category';
    //campos de la tabla
    protected $fillable = [
        'nameCategory'
    ];

    //relaciones: category 1:n  productos
    public function products(): hasMany
    {
        return $this->hasMany(Product::class);
    }
}
