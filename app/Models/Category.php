<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //nombre de la tabla
    protected $table = 'tbl_category';
    //campos de la tabla
    protected $fillable = [
        'nameCategory'
    ];

    //relaciones: category 1:n  productos
    public function products(): hasMany
    {
        return $this->hasMany(Products::class);
    }
}
