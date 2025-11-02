<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ){}


    //Index
    public function index()
    {
        // Obtención de datos usando el Service Layer
        $branchId = auth()->user()->branch_id;
        $products = $this->productService->getAllProductsP($branchId);
        $branches = $this->productService->getAllBranches(); // Renombrado a branches/sucursales
        $categories = $this->productService->getAllCategories(); // Renombrado a categories
        $suppliers = $this->productService->getAllSupliers(); // Renombrado a suppliers

        // Preparamos los datos para Inertia
        return inertia('Product/Index', [
            'products' => $products,
            'branchs' => $branches, // O 'marcas' si ese es el significado real
            'categoriesBD' => $categories, // Clave más limpia
            'supplierDB' => $suppliers, // Clave más limpia
            'auth' => [
                'user' => auth()->user() // Práctica común: pasar el objeto User completo
            ]
        ]);
    }

    //detalle del producto 
    public function show(Request $request, $sku)
    {
        $detailProduct = $this->productService->getProductDetail($sku);
        dd($detailProduct); 
        
        return inertia('Product/components/DetailsProduct', [
            'detailProduct' => $detailProduct
        ]);        
    }  
}
