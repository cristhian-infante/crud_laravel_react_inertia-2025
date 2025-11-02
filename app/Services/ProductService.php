<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\BranchStock;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB; // ✅ AGREGAR ESTA IMPORTACIÓN

class ProductService
{
    //funciones para las listas
    public function getAllProducts(): collection //todos los productos
    {
        return Product::all();
    }

    public function getAllBranches(): collection //todos los Sucursales - ✅ CORREGIDA
    {
        return Branch::where('status', 1)
            ->withCount([
                'branchStocks as total_products',
                'branchStocks as products_with_stock' => function($query) {
                    $query->where('stock', '>', 0);
                }
            ])
            ->get()
            ->map(function ($branch) {
                return [
                    'id' => $branch->id,
                    'name' => $branch->name,
                    'code' => $branch->code,
                    'total_products' => $branch->total_products,
                    'products_with_stock' => $branch->products_with_stock,
                    'display_text' => "{$branch->name} ({$branch->products_with_stock}/{$branch->total_products})"
                ];
            });
    }

    public function getAllCategories(): collection //Todas las Categorías
    {
        return Category::all();
    }

    public function getAllSupliers(): collection //Todas los proveedores
    {
        return Supplier::all();
    }

    public function getProductDetail_($sku)  //Detalle de los Productos
    {
        return Product::with(['category','brand','supplier', 'proveedor'])
            ->select([
                'products.id',
                'products.category_id',
                'products.brand_id',
                'products.supplier_id',
                'products.sku',
                'products.barcode',
                'products.description',
                'products.name',         
                'products.stock_min',

                'products.ubicacion',
                'products.estado',
                'products.proveedor_id',
                'products.stock',
                'products.precio',
                'products.costo',
                'products.imagen',
                'products.created_at',
                'products.updated_at',
                'categories.id as category_id',
                'categories.nameCategory as category_name',
                'suppliers.name as proveedor_nombre',
                'suppliers.contacto as proveedor_contacto',
                'suppliers.telefono as proveedor_telefono',
                'suppliers.email as proveedor_email',
            ])
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->leftJoin('suppliers', 'products.proveedor_id', '=', 'suppliers.id')
            ->where('products.sku', $sku) // Cambiado de id a sku
            ->first();
    }

    public function getProductDetail($sku)
    {
        $product = Product::with([
                'category:id,name', 
                'brand:id,name', 
                'supplier:id,name,contact_email,phone,address'
            ])
            ->select([
                'products.id',
                'products.category_id',
                'products.sku',
                'products.barcode', 
                'products.name',
                'products.description', 
                'products.brand_id',
                'products.stock_min', 
                'products.status', 
                'products.supplier_id',
                'products.stock_total',
                'products.price', 
                'products.cost', 
                'products.image', 
                'products.created_at',
                'products.updated_at'
            ])
            ->where('products.sku', $sku)
            ->first();

        if (!$product) {
            return null;
        }

        return [
            'id' => $product->id,
            'category_id' => $product->category_id,
            'sku' => $product->sku,
            'codBarras' => $product->barcode, 
            'name' => $product->name,
            'description' => $product->description,
            'marca' => $product->brand->name ?? 'Sin marca',
            'stockMin' => $product->stock_min, 
            'ubicacion' => 'Sin ubicación', 
            'estado' => $product->status, 
            'proveedor_id' => $product->supplier_id,
            'stock' => $product->stock_total,
            'precio' => $product->price, 
            'costo' => $product->cost, 
            'imagen' => $product->image, 
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'category_name' => $product->category->name ?? '', 
            'proveedor_nombre' => $product->supplier->name ?? null,
            'proveedor_contacto' => $product->supplier->contacto ?? null,
            'proveedor_telefono' => $product->supplier->telefono ?? null,
            'proveedor_email' => $product->supplier->email ?? null,
        ];
    }

    // getProductsForBranch

    public function getAllProductsP($branchId = null): Collection
    {
        if ($branchId) {
            return $this->getProductsByBranch($branchId);
        } else {
            return $this->getAllProductsWithStock();
        }
    }

    private function getAllProductsWithStock(): Collection
    {
        return Product::with(['category', 'brand', 'supplier'])
            ->select('products.*')
            ->addSelect([
                'stock_total' => BranchStock::selectRaw('COALESCE(SUM(stock), 0)')
                    ->whereColumn('product_id', 'products.id'),
                'stock_min' => BranchStock::select('stock_min')
                    ->whereColumn('product_id', 'products.id')
                    ->orderBy('stock_min', 'desc')
                    ->limit(1)
            ])
            ->get()
            ->map(function ($product) {
                $stockTotal = $product->stock_total ?? 0;
                $stockMin = $product->stock_min ?? 10;
                
                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'description' => $product->description,
                    'brand_name' => $product->brand->name ?? '',
                    'stock_min' => $stockMin,
                    'stock_total' => $stockTotal,
                    'price' => $product->price,
                    'cost' => $product->cost,
                    'image' => $product->image,
                    'status' => $product->status,
                    'category_name' => $product->category->name ?? '',
                    'supplier_name' => $product->supplier->name ?? '',
                    'formatted_price' => 'S/. '.number_format($product->price, 2),
                    'stock_status' => $this->getStockStatus($stockTotal, $stockMin),
                    'branch_name' => '', // Para vista global no mostramos sucursal específica
                    'location_code' => '',
                    'ubicacion' => 'Varias sucursales',
                    'sucursales_count' => BranchStock::where('product_id', $product->id)->count()
                ];
            });
    }

    private function getProductsByBranch($branchId): Collection
    {
        // ✅ OBTENER PRODUCTOS FILTRADOS POR SUCURSAL ESPECÍFICA
        return Product::with(['category', 'brand', 'supplier'])
            ->join('branch_stock', 'products.id', '=', 'branch_stock.product_id')
            ->join('branches', 'branch_stock.branch_id', '=', 'branches.id')
            ->leftJoin('warehouse_locations', 'branch_stock.location_id', '=', 'warehouse_locations.id')
            ->where('branches.id', $branchId) // ✅ FILTRAR POR SUCURSAL
            ->select(
                'products.*',
                'branch_stock.stock as stock_en_sucursal',
                'branch_stock.stock_min as stock_min_sucursal',
                'branches.name as branch_name',
                'warehouse_locations.location_code',
                'warehouse_locations.aisle',
                'warehouse_locations.rack',
                'warehouse_locations.shelf',
                'warehouse_locations.position'
            )
            ->get()
            ->map(function ($product) {
                $stockTotal = $product->stock_en_sucursal ?? 0;
                $stockMin = $product->stock_min_sucursal ?? 10;
                
                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'branch_id' => $product->branch_id, // ✅ INCLUIR EN EL RESULTADO
                  'branch_name' => $product->branch_name,
                    'description' => $product->description,
                    'brand_name' => $product->brand->name ?? '',
                    'stock_min' => $stockMin,
                    'stock_total' => $stockTotal,
                    'price' => $product->price,
                    'cost' => $product->cost,
                    'image' => $product->image,
                    'status' => $product->status,
                    'category_name' => $product->category->name ?? '',
                    'supplier_name' => $product->supplier->name ?? '',
                    'formatted_price' => 'S/. '.number_format($product->price, 2),
                    'stock_status' => $this->getStockStatus($stockTotal, $stockMin),
                    'branch_name' => $product->branch_name ?? '',
                    'location_code' => $product->location_code ?? '',
                    'ubicacion' => $product->location_code ?
                        'Pasillo '.$product->aisle.', Rack '.$product->rack.', Nivel '.$product->shelf :
                        'Sin ubicación',
                ];
            });
    }


    // Función auxiliar para el estado del stock
    private function getStockStatus($stock, $stockMin)
    {
        if ($stock <= 0) {
            return 'Agotado';
        } elseif ($stock <= $stockMin) {
            return 'Bajo Stock';
        } else {
            return 'En Stock';
        }
    }
}