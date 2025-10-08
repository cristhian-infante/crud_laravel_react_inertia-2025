<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'suppliers';
    
    protected $fillable = [
        'name', 
        'contact_email', 
        'phone', 
        'address', 
        'status'
    ];
    
    protected $casts = [
        'status' => 'boolean'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}