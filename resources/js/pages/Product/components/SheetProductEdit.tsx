import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React from "react"

// AGREGA LA INTERFAZ
interface Product {
    idProduct: number;
    idCategory: number;
    nameProduct: string;
    sku: string;
    codBarras: string;
    descripcion?: string;
    marca: string;
    stockMin: number;
    ubicacion?: string;
    estado: 'activo' | 'inactivo' | 'descontinuado';
    proveedor_id?: number;
    stockProduct: number;
    priceProduct: number;
    costo?: number;
    imagen?: string;
    nameCategory: string;
    created_at?: string;
    updated_at?: string;
}

interface SheetProductEditProps {
  product: Product
  onSave?: (product: Product) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SheetProductEdit({ 
  product, 
  onSave, 
  trigger,
  open,
  onOpenChange 
}: SheetProductEditProps) {
  const [formData, setFormData] = React.useState<Product>(product)

  // MEJORA: Manejar cambio de apertura/cierre
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Resetear al valor original al cerrar
      setFormData(product);
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  // MEJORA: Agregar validación
  const handleSave = () => {
    if (!formData.nameProduct.trim()) {
      alert('El nombre del producto es requerido');
      return;
    }
    if (formData.stockProduct < 0) {
      alert('El stock no puede ser negativo');
      return;
    }
    if (formData.priceProduct <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
    if (formData.stockMin < 0) {
      alert('El stock mínimo no puede ser negativo');
      return;
    }
    if (formData.costo && formData.costo < 0) {
      alert('El costo no puede ser negativo');
      return;
    }
    
    if (onSave) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Editar Producto</SheetTitle>
          <SheetDescription>
            Realiza cambios en el producto aquí. Haz clic en guardar cuando termines.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid gap-3">
              <Label htmlFor="product-name">Nombre del Producto *</Label>
              <Input 
                id="product-name" 
                value={formData.nameProduct}
                onChange={(e) => handleChange('nameProduct', e.target.value)}
                placeholder="Ingrese el nombre del producto"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="product-sku">SKU *</Label>
              <Input 
                id="product-sku" 
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                placeholder="Código SKU único"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="product-codBarras">Código de Barras</Label>
              <Input 
                id="product-codBarras" 
                value={formData.codBarras}
                onChange={(e) => handleChange('codBarras', e.target.value)}
                placeholder="Código de barras"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="product-marca">Marca *</Label>
              <Input 
                id="product-marca" 
                value={formData.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
                placeholder="Marca del producto"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="product-category">Categoría *</Label>
              <Input 
                id="product-category" 
                value={formData.nameCategory}
                onChange={(e) => handleChange('nameCategory', e.target.value)}
                placeholder="Categoría del producto"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="product-descripcion">Descripción</Label>
              <Textarea 
                id="product-descripcion" 
                value={formData.descripcion || ''}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Descripción detallada del producto"
                rows={3}
              />
            </div>
          </div>

          {/* Inventario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inventario</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="product-stock">Stock Actual *</Label>
                <Input 
                  id="product-stock" 
                  type="number"
                  min="0"
                  value={formData.stockProduct}
                  onChange={(e) => handleChange('stockProduct', Number(e.target.value))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="product-stockMin">Stock Mínimo *</Label>
                <Input 
                  id="product-stockMin" 
                  type="number"
                  min="0"
                  value={formData.stockMin}
                  onChange={(e) => handleChange('stockMin', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="product-ubicacion">Ubicación en Bodega</Label>
              <Input 
                id="product-ubicacion" 
                value={formData.ubicacion || ''}
                onChange={(e) => handleChange('ubicacion', e.target.value)}
                placeholder="Ej: BOD-A-12"
              />
            </div>
          </div>

          {/* Precios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Precios</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="product-price">Precio Venta *</Label>
                <Input 
                  id="product-price" 
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.priceProduct}
                  onChange={(e) => handleChange('priceProduct', Number(e.target.value))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="product-costo">Costo</Label>
                <Input 
                  id="product-costo" 
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costo || ''}
                  onChange={(e) => handleChange('costo', e.target.value ? Number(e.target.value) : '')}
                  placeholder="Costo de adquisición"
                />
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estado</h3>
            
            <div className="grid gap-3">
              <Label htmlFor="product-estado">Estado del Producto</Label>
              <select 
                id="product-estado"
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value as Product['estado'])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="descontinuado">Descontinuado</option>
              </select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="product-imagen">URL de Imagen</Label>
              <Input 
                id="product-imagen" 
                value={formData.imagen || ''}
                onChange={(e) => handleChange('imagen', e.target.value)}
                placeholder="URL de la imagen del producto"
              />
            </div>
          </div>
        </div>
        <SheetFooter className="mt-auto sticky bottom-0 bg-background pt-4 border-t">
          <Button type="button" onClick={handleSave}>
            Guardar cambios
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}