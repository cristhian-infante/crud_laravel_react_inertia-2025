<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest; // Nombre corregido
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Requests\Category\BulkDeleteRequest;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $categoryService
    ) {}

    // Index - Listar categorías
    public function index()
    {
        return inertia('Category/Index', [
            'categories' => $this->categoryService->getAllCategories()
        ]);
    }

    // Store - Crear categoría
    public function store(StoreCategoryRequest $request): RedirectResponse // Nombre corregido
    {
        try {
            $this->categoryService->createCategory($request->validated());

            return redirect()->route('category.index')
                ->with('success', 'Categoría creada exitosamente');
                
        } catch (\Exception $e) {
            
            return redirect()->route('category.index')
                ->with('error', 'Error al crear la categoría');
        }
    }

    // Update - Actualizar categoría
    public function update(UpdateCategoryRequest $request, $id): RedirectResponse
    {
        try {
            $category = $this->categoryService->updateCategory($id, $request->validated());
            
            if (!$category) {
                return redirect()->route('category.index')
                    ->with('error', 'Categoría no encontrada');
            }

            return redirect()->route('category.index')
                ->with('success', 'Categoría actualizada exitosamente');
                
        } catch (\Exception $e) {
           
            return redirect()->route('category.index')
                ->with('error', 'Error al actualizar la categoría');
        }
    }

    // Destroy - Eliminar categoría
    public function destroy($id): RedirectResponse
    {
        try {
            $category = $this->categoryService->deleteCategory($id);
            
            if (!$category) {
                return redirect()->route('category.index')
                    ->with('error', 'Categoría no encontrada');
            }

            return redirect()->route('category.index')
                ->with('success', "Categoría '{$category->nameCategory}' eliminada exitosamente");
                
        } catch (\Exception $e) {
            return redirect()->route('category.index')
                ->with('error', 'Error al eliminar la categoría: ' . $e->getMessage());
        }
    }

    // BulkDelete - Eliminación múltiple
    public function bulkDelete(BulkDeleteRequest $request): RedirectResponse
    {
        try {
            $deletedCount = $this->categoryService->bulkDeleteCategories($request->input('ids'));

            $message = $deletedCount === 1 
                ? "1 categoría eliminada exitosamente" 
                : "{$deletedCount} categorías eliminadas exitosamente";

            return redirect()->route('category.index')
                ->with('success', $message);
                
        } catch (\Exception $e) {
           
            return redirect()->route('category.index')
                ->with('error', 'Error al eliminar las categorías: ' . $e->getMessage());
        }
    }

    // Trashed - Papelera
    public function trashed()
    {
        return inertia('Category/Trashed', [
            'categories' => $this->categoryService->getTrashedCategories()
        ]);
    }

    // Restore - Restaurar categoría
    public function restore($id): RedirectResponse
    {
        try {
            $category = $this->categoryService->restoreCategory($id);
            
            if (!$category) {
                return redirect()->route('category.trashed')
                    ->with('error', 'Categoría no encontrada en la papelera');
            }

            return redirect()->route('category.trashed')
                ->with('success', 'Categoría restaurada exitosamente');
                
        } catch (\Exception $e) {
            
            return redirect()->route('category.trashed')
                ->with('error', 'Error al restaurar la categoría');
        }
    }

    // ForceDelete - Eliminar permanentemente
    public function forceDelete($id): RedirectResponse
    {
        try {
            $deleted = $this->categoryService->forceDeleteCategory($id);
            
            if (!$deleted) {
                return redirect()->route('category.trashed')
                    ->with('error', 'Categoría no encontrada');
            }

            return redirect()->route('category.trashed')
                ->with('success', 'Categoría eliminada permanentemente');
                
        } catch (\Exception $e) {
            
            return redirect()->route('category.trashed')
                ->with('error', 'Error al eliminar permanentemente la categoría');
        }
    }
}