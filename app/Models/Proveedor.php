<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Proveedor extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_proveedores';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'contacto',
        'telefono',
        'email',
        'direccion',
        'ruc',
        'estado',
        'notas'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /**
     * Get the attributes that should be appended.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'estado_formateado'
    ];

    /**
     * Get the products for the supplier.
     */
    public function productos(): HasMany
    {
        return $this->hasMany(Product::class, 'proveedor_id');
    }

    /**
     * Scope a query to only include active suppliers.
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', true);
    }

    /**
     * Scope a query to only include inactive suppliers.
     */
    public function scopeInactivos($query)
    {
        return $query->where('estado', false);
    }

    /**
     * Get the formatted estado attribute.
     *
     * @return string
     */
    public function getEstadoFormateadoAttribute(): string
    {
        return $this->estado ? 'Activo' : 'Inactivo';
    }

    /**
     * Get the contacto completo attribute.
     *
     * @return string|null
     */
    public function getContactoCompletoAttribute(): ?string
    {
        if ($this->contacto && $this->telefono) {
            return "{$this->contacto} - {$this->telefono}";
        }

        return $this->contacto ?? $this->telefono;
    }

    /**
     * Check if the supplier can be deleted.
     *
     * @return bool
     */
    public function getPuedeEliminarAttribute(): bool
    {
        return $this->productos()->count() === 0;
    }
}