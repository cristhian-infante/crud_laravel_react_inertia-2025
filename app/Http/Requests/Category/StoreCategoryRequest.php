<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nameCategory' => 'required|string|max:255|unique:tbl_category,nameCategory'
        ];
    }

    public function messages(): array
    {
        return [
            'nameCategory.required' => 'El nombre de la categoría es obligatorio',
            'nameCategory.unique' => 'El nombre de la categoría ya existe',
            'nameCategory.max' => 'El nombre no puede exceder los 255 caracteres'
        ];
    }
}