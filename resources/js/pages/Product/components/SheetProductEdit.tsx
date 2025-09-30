import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    stockProduct: number;
    priceProduct: number;
    nameCategory: string;
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar Producto</SheetTitle>
          <SheetDescription>
            Realiza cambios en el producto aquí. Haz clic en guardar cuando termines.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4">
          <div className="grid gap-3">
            <Label htmlFor="product-name">Nombre del Producto</Label>
            <Input 
              id="product-name" 
              value={formData.nameProduct}
              onChange={(e) => handleChange('nameProduct', e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="product-category">Categoría</Label>
            <Input 
              id="product-category" 
              value={formData.nameCategory}
              onChange={(e) => handleChange('nameCategory', e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="product-stock">Stock</Label>
            <Input 
              id="product-stock" 
              type="number"
              min="0"
              value={formData.stockProduct}
              onChange={(e) => handleChange('stockProduct', Number(e.target.value))}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="product-price">Precio</Label>
            <Input 
              id="product-price" 
              type="number"
              step="0.01"
              min="0.01"
              value={formData.priceProduct}
              onChange={(e) => handleChange('priceProduct', Number(e.target.value))}
            />
          </div>
        </div>
        <SheetFooter className="mt-auto">
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