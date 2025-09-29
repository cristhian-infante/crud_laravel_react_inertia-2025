<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    public function index()
    {
        return inertia('Category/Index', [
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
        {
            try {
                $validated = $request->validate([
                    'nameCategory' => 'required|string|max:255|unique:tbl_category,nameCategory'
                ]);

                // Generar codCategory automáticamente usando contador independiente
                $categoryCount = Category::count() + 1;
                $codCategory = 'CAT-' . str_pad($categoryCount, 3, '0', STR_PAD_LEFT);

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

       
   public function update(Request $request, $id)
{
    try {
        \Log::info('Intentando actualizar categoría ID: ' . $id);
        
        // Incluir registros eliminados temporalmente
        $category = Category::withTrashed()->find($id);
        
        \Log::info('Categoría encontrada: ' . ($category ? 'Sí' : 'No'));
        
        if (!$category) {
            \Log::error('Categoría no encontrada con ID: ' . $id);
            return redirect()->route('category.index')
                ->with('error', 'Categoría no encontrada');
        }

        \Log::info('Categoría encontrada: ' . $category->nameCategory);
        
        // Resto del código...
        $validated = $request->validate([
            'nameCategory' => 'required|string|max:255|unique:tbl_category,nameCategory,' . $category->id
        ]);

        $category->update($validated);

        return redirect()->route('category.index')
            ->with('success', 'Categoría actualizada exitosamente');
            
    } catch (\Exception $e) {
        \Log::error('Error: ' . $e->getMessage());
        return redirect()->route('category.index')
            ->with('error', 'Error al actualizar la categoría');
    }
}

public function destroy($id)
{
    try {
        $category = Category::find($id);
        
        if (!$category) {
            return redirect()->route('category.index')
                ->with('error', 'Categoría no encontrada');
        }

        $category->delete();

        return redirect()->route('category.index')
            ->with('success', 'Categoría eliminada exitosamente');
            
    } catch (\Exception $e) {
        \Log::error('Error al eliminar categoría: ' . $e->getMessage());
        return redirect()->route('category.index')
            ->with('error', 'Error al eliminar la categoría');
    }
}

}