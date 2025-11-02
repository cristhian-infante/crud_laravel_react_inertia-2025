<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseLocation extends Model
{
     protected $table = 'warehouse_locations';
     protected $fillable = [
        'branch_id',
        'aisle',
        'rack',
        'shelf',
        'position',
        'description',
        'status',
    ];
     protected $casts = [
        'status' => 'boolean',
    ];
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
    public function branchStocks(): HasMany
    {
        return $this->hasMany(BranchStock::class, 'location_id');
    }
}
