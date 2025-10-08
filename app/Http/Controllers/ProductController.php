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
                'products' => $this->productService->getAllProductsP(), //productos
                'branchs' => $this->productService->getAllBranches(),  //marcas
                'categoriesBD' => $this->productService->getAllCategories(),
                'supplierDB' => $this->productService->getAllSupliers(),
                'auth' => [ 
                    'user' => [
                        'id' => auth()->id(),
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'branch_id' => auth()->user()->branch_id,
                    ]
                ]
            ]);
        }
    //detalle del producto 
    public function show(Request $request, $sku)
    {
        return inertia('Product/components/DetailsProduct', [
            'detailProduct' => $this->productService->getProductDetail($sku)
        ]);        
    }
}
