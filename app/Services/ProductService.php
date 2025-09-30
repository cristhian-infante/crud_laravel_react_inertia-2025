<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class ProductService{

    public function getAllProducts():collection{
        return Product::all();
    }

    public function getAllProductsP(): Collection
    {
        return Product::with('category')
            ->select([
                'tbl_products.id as idProduct',
                'tbl_products.nombre as nameProduct', 
                'tbl_products.stock as stockProduct',
                'tbl_products.precio as priceProduct',
                'tbl_category.id as idCategory',
                'tbl_category.nameCategory as nameCategory'
            ])
            ->join('tbl_category', 'tbl_products.category_id', '=', 'tbl_category.id')
            ->get();
    }


}