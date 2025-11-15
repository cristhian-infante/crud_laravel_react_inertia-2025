<?php
namespace App\Services;

use App\Models\Brand;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon; // para el idioma del formato de horas 

class BrandService
{

    public function getAllBrands(): Collection
    {
         Carbon::setLocale('es');
    
        return Brand::all()->map(function ($brand) {
            return [
                'id' => $brand->id,
                'logo' =>$brand->logo ? asset('storage/image/brand/' . $brand->logo) : null,
                'name' => $brand->name,
                'status' => $brand->status ? 'active' : 'inactive',
                'created_at' => $brand->created_at->translatedFormat('j \\d\\e F \\d\\e Y'),
                'updated_at' => $brand->updated_at->translatedFormat('j \\d\\e F \\d\\e Y'),
            ];
        });
    }

   


}