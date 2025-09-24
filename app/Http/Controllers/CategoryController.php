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

            Category::create($validated);

            // Para Inertia, es mejor retornar un redirect
            return redirect()->route('category.index')
                ->with('success', 'Categoría creada exitosamente');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Para Inertia, retornar con errores
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
                
        } catch (\Exception $e) {
            Log::error('Error al crear categoría: ' . $e->getMessage());
            
            return redirect()->route('category.index')
                ->with('error', 'Error al crear la categoría');
        }
    }
}