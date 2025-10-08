<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class ProductService{

    public function getAllProducts():collection{
        return Product::all();
    }

    public function getAllBranches():collection{
        return Branch::all();
    }

    public function getAllCategories():collection{
        return Category::all();
    }

    public function getAllSupliers():collection{
        return Supplier::all();
    }
        
   public function getProductDetail($sku)    {
        return Product::with(['category', 'proveedor'])
            ->select([
                'tbl_products.id',
                'tbl_products.category_id',
                'tbl_products.sku',
                'tbl_products.codBarras',
                'tbl_products.nombre',
                'tbl_products.descripcion',
                'tbl_products.marca',
                'tbl_products.stockMin',
                'tbl_products.ubicacion',
                'tbl_products.estado',
                'tbl_products.proveedor_id',
                'tbl_products.stock',
                'tbl_products.precio',
                'tbl_products.costo',
                'tbl_products.imagen',
                'tbl_products.created_at',
                'tbl_products.updated_at',
                'tbl_category.id as category_id',
                'tbl_category.nameCategory as category_name',
                'tbl_proveedores.nombre as proveedor_nombre',
                'tbl_proveedores.contacto as proveedor_contacto',
                'tbl_proveedores.telefono as proveedor_telefono',
                'tbl_proveedores.email as proveedor_email'
            ])
            ->join('tbl_category', 'tbl_products.category_id', '=', 'tbl_category.id')
            ->leftJoin('tbl_proveedores', 'tbl_products.proveedor_id', '=', 'tbl_proveedores.id')
            ->where('tbl_products.sku', $sku) // Cambiado de id a sku
            ->first();
    }


    //getProductsForBranch
   
    public function getAllProductsP($branchId = null): Collection  {
            // Si se pasa un branchId, filtrar por esa sucursal
            // Si no, devolver todos los productos de todas las sucursales
        if ($branchId) {
            return $this->getProductsByBranch($branchId);
        } else {
            return $this->getAllProductsWithStock();
        }
    }

private function getAllProductsWithStock(): Collection
{
    return Product::with(['category', 'brand', 'supplier'])
        ->leftJoin('branch_stock', 'products.id', '=', 'branch_stock.product_id')
        ->leftJoin('branches', 'branch_stock.branch_id', '=', 'branches.id')
        ->leftJoin('warehouse_locations', 'branch_stock.location_id', '=', 'warehouse_locations.id')
        ->select('products.*', 
                'branch_stock.stock as stock_en_sucursal',
                'branches.name as branch_name',
                'warehouse_locations.location_code',
                'warehouse_locations.aisle',
                'warehouse_locations.rack', 
                'warehouse_locations.shelf',
                'warehouse_locations.position')
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,                        
                'description' => $product->description,
                'brand_name' => $product->brand->name ?? '',
                'stock_min' => $product->stock_min,
                'stock_total' => $product->stock_en_sucursal ?? 0,
                'price' => $product->price,
                'cost' => $product->cost,
                'image' => $product->image,
                'status' => $product->status,
                'category_name' => $product->category->name ?? '',
                'supplier_name' => $product->supplier->name ?? '',
                'formatted_price' => '$' . number_format($product->price, 2),
                'stock_status' => $this->getStockStatus($product->stock_en_sucursal ?? 0, $product->stock_min),
                'branch_name' => $product->branch_name ?? '',
                'location_code' => $product->location_code ?? '',
                'ubicacion' => $product->location_code ? 
                    'Pasillo ' . $product->aisle . ', Rack ' . $product->rack . ', Nivel ' . $product->shelf : 
                    'Sin ubicación'
            ];
        });
}

private function getProductsByBranch($branchId): Collection
{
    return Product::with(['category', 'brand', 'supplier'])
        ->leftJoin('branch_stock', function($join) use ($branchId) {
            $join->on('products.id', '=', 'branch_stock.product_id')
                ->where('branch_stock.branch_id', '=', $branchId);
        })
        ->leftJoin('branches', 'branch_stock.branch_id', '=', 'branches.id')
        ->leftJoin('warehouse_locations', 'branch_stock.location_id', '=', 'warehouse_locations.id')
        ->select('products.*', 
                'branch_stock.stock as stock_en_sucursal',
                'branches.name as branch_name',
                'warehouse_locations.location_code',
                'warehouse_locations.aisle',
                'warehouse_locations.rack', 
                'warehouse_locations.shelf',
                'warehouse_locations.position')
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,                        
                'description' => $product->description,
                'brand_name' => $product->brand->name ?? '',
                'stock_min' => $product->stock_min,
                'stock_total' => $product->stock_en_sucursal ?? 0,
                'price' => $product->price,
                'cost' => $product->cost,
                'image' => $product->image,
                'status' => $product->status,
                'category_name' => $product->category->name ?? '',
                'supplier_name' => $product->supplier->name ?? '',
                'formatted_price' => '$' . number_format($product->price, 2),
                'stock_status' => $this->getStockStatus($product->stock_en_sucursal ?? 0, $product->stock_min),
                'branch_name' => $product->branch_name ?? '',
                'location_code' => $product->location_code ?? '',
                'ubicacion' => $product->location_code ? 
                    'Pasillo ' . $product->aisle . ', Rack ' . $product->rack . ', Nivel ' . $product->shelf : 
                    'Sin ubicación'
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