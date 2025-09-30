<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProductService;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ){}


    //Index
    public function index()
    {
        return inertia('Product/Index', [
            'products' => $this->productService->getAllProductsP()
        ]);
    }
    //
}
