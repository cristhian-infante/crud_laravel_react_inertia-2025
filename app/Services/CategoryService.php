<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    public function getAllCategories(): Collection
    {
        return Category::all();
    }

    public function getTrashedCategories(): Collection
    {
        return Category::onlyTrashed()->get();
    }

    public function generateCategoryCode(): string
    {
        // Buscar el último código usado (incluyendo eliminados)
        $lastCategory = Category::withTrashed()
            ->orderBy('id', 'desc')
            ->first();

        if ($lastCategory) {
            // Extraer el número del último código
            $lastNumber = intval(substr($lastCategory->codCategory, 4));
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        $codCategory = 'CAT-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        // Verificar que el código no exista (por si acaso)
        $existingCategory = Category::withTrashed()
            ->where('codCategory', $codCategory)
            ->first();

        if ($existingCategory) {
            // Si existe, buscar el siguiente disponible
            $allCategories = Category::withTrashed()
                ->orderBy('id', 'desc')
                ->get();
            
            $usedNumbers = [];
            foreach ($allCategories as $cat) {
                $num = intval(substr($cat->codCategory, 4));
                $usedNumbers[] = $num;
            }
            
            $nextAvailable = 1;
            while (in_array($nextAvailable, $usedNumbers)) {
                $nextAvailable++;
            }
            
            $codCategory = 'CAT-' . str_pad($nextAvailable, 3, '0', STR_PAD_LEFT);
        }

        return $codCategory;
    }

    public function createCategory(array $data): Category
    {
        $data['codCategory'] = $this->generateCategoryCode();
        
        return Category::create($data);
    }

    public function updateCategory(int $id, array $data): ?Category
    {
        $category = Category::withTrashed()->find($id);
        
        if (!$category) {
            return null;
        }

        $category->update($data);
        return $category;
    }

    public function deleteCategory(int $id): ?Category
    {
        $category = Category::find($id);
        
        if (!$category) {
            return null;
        }

        $category->delete();
        return $category;
    }

    public function bulkDeleteCategories(array $ids): int
    {
        $existingCategories = Category::whereIn('id', $ids)->get();
        
        $deletedCount = 0;
        foreach ($existingCategories as $category) {
            $category->delete();
            $deletedCount++;
        }

        return $deletedCount;
    }

    public function restoreCategory(int $id): ?Category
    {
        $category = Category::onlyTrashed()->find($id);
        
        if (!$category) {
            return null;
        }

        $category->restore();
        return $category;
    }

    public function forceDeleteCategory(int $id): bool
    {
        $category = Category::onlyTrashed()->find($id);
        
        if (!$category) {
            return false;
        }

        return $category->forceDelete();
    }

    public function findCategory(int $id): ?Category
    {
        return Category::find($id);
    }

    public function findTrashedCategory(int $id): ?Category
    {
        return Category::onlyTrashed()->find($id);
    }
}