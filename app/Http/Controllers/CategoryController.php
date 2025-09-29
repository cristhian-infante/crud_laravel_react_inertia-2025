<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    //Index
    public function index()
    {
        return inertia('Category/Index', [
            'categories' => Category::all()
        ]);
    }
    //Store -> Crear
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nameCategory' => 'required|string|max:255|unique:tbl_category,nameCategory'
            ]);

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

            // Crear la categoría con el código generado
            Category::create([
                'codCategory' => $codCategory,
                'nameCategory' => $validated['nameCategory']
            ]);

            return redirect()->route('category.index')
                ->with('success', 'Categoría creada exitosamente');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
                
        } catch (\Exception $e) {
            Log::error('Error al crear categoría: ' . $e->getMessage());
            
            return redirect()->route('category.index')
                ->with('error', 'Error al crear la categoría');
        }
    }
    //Update -> Actualizar
    public function update(Request $request, $id)
    {
        try {
            // Incluir registros eliminados temporalmente
            $category = Category::withTrashed()->find($id);
            
            if (!$category) {
                return redirect()->route('category.index')
                    ->with('error', 'Categoría no encontrada');
            }

            $validated = $request->validate([
                'nameCategory' => 'required|string|max:255|unique:tbl_category,nameCategory,' . $category->id
            ]);

            $category->update($validated);

            return redirect()->route('category.index')
                ->with('success', 'Categoría actualizada exitosamente');
                
        } catch (\Exception $e) {
            return redirect()->route('category.index')
                ->with('error', 'Error al actualizar la categoría');
        }
    }
    
    //Eliminar
    public function destroy($id)
    {
        try {
            $category = Category::find($id);
            
            if (!$category) {
                return redirect()->route('category.index')
                    ->with('error', 'Categoría no encontrada');
            }

            $categoryName = $category->nameCategory;
            $category->delete();
            
            return redirect()->route('category.index')
                ->with('success', "Categoría '{$categoryName}' eliminada exitosamente");
                
        } catch (\Exception $e) {
            return redirect()->route('category.index')
                ->with('error', 'Error al eliminar la categoría: ' . $e->getMessage());
        }
    }

    public function bulkDelete(Request $request)
    {
        try {
            $ids = $request->input('ids', []);
            
            \Log::info('Intentando eliminar categorías con IDs: ' . json_encode($ids));
            
            if (empty($ids)) {
                return redirect()->route('category.index')
                    ->with('error', 'No se proporcionaron categorías para eliminar');
            }
            
            // Verificar cuántas categorías existen con estos IDs
            $existingCategories = Category::whereIn('id', $ids)->get();
            $existingCount = $existingCategories->count();
            
            \Log::info('Categorías encontradas: ' . $existingCount);
            
            if ($existingCount === 0) {
                return redirect()->route('category.index')
                    ->with('error', 'No se encontraron las categorías seleccionadas');
            }
            
            // Eliminar las categorías que existen
            $deletedCount = 0;
            foreach ($existingCategories as $category) {
                $category->delete();
                $deletedCount++;
            }
            
            \Log::info('Categorías eliminadas: ' . $deletedCount);
            
            $message = $deletedCount === 1 
                ? "1 categoría eliminada exitosamente" 
                : "{$deletedCount} categorías eliminadas exitosamente";
            
            return redirect()->route('category.index')
                ->with('success', $message);
                
        } catch (\Exception $e) {
            \Log::error('Error en bulkDelete: ' . $e->getMessage());
            return redirect()->route('category.index')
                ->with('error', 'Error al eliminar las categorías: ' . $e->getMessage());
        }
    }

    //Papelera
    public function trashed()
    {
        return inertia('Category/Trashed', [
            'categories' => Category::onlyTrashed()->get()
        ]);
    }

    public function restore($id)
    {
        try {
            $category = Category::onlyTrashed()->find($id);
            
            if (!$category) {
                return redirect()->route('category.trashed')
                    ->with('error', 'Categoría no encontrada en la papelera');
            }

            $category->restore();

            return redirect()->route('category.trashed')
                ->with('success', 'Categoría restaurada exitosamente');
                
        } catch (\Exception $e) {
            \Log::error('Error al restaurar categoría: ' . $e->getMessage());
            return redirect()->route('category.trashed')
                ->with('error', 'Error al restaurar la categoría');
        }
    }

    public function forceDelete($id)
    {
        try {
            $category = Category::onlyTrashed()->find($id);
            
            if (!$category) {
                return redirect()->route('category.trashed')
                    ->with('error', 'Categoría no encontrada');
            }

            $category->forceDelete();

            return redirect()->route('category.trashed')
                ->with('success', 'Categoría eliminada permanentemente');
                
        } catch (\Exception $e) {
            \Log::error('Error al eliminar permanentemente categoría: ' . $e->getMessage());
            return redirect()->route('category.trashed')
                ->with('error', 'Error al eliminar permanentemente la categoría');
        }
    }

}