<?php
namespace App\Services;

use App\Models\Brand;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;


class BrandService
{

    public function getAllBrands(): Collection
    {
        return Brand::all();
    }
}