<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:categories,id'
        ];
    }

    public function messages(): array
    {
        return [
            'ids.required' => 'Seleccione al menos una categoría para eliminar',
            'ids.array' => 'Los datos deben ser un array válido',
            'ids.min' => 'Seleccione al menos una categoría',
            'ids.*.integer' => 'Los IDs deben ser números enteros',
            'ids.*.exists' => 'Una o más categorías seleccionadas no existen'
        ];
    }
}