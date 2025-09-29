<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
//nuestras rutas
Route::get('/category',[CategoryController::class, 'index'])->name('category.index');//listaremos las categorias
Route::post('/category/store', [CategoryController::class, 'store'])->name('category.store'); // registramos una nueva categoria
Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('category.update');//editamos la categoria
Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('category.destroy');
Route::post('/categories/bulk-delete', [CategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');
// routes/web.php
Route::get('/categories/trashed', [CategoryController::class, 'trashed'])->name('category.trashed');
Route::post('/categories/{category}/restore', [CategoryController::class, 'restore'])->name('category.restore');
Route::delete('/categories/{category}/force', [CategoryController::class, 'forceDelete'])->name('category.force-delete');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
