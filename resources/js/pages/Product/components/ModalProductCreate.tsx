// // components/ModalProductCreate.tsx
// import { Button } from '@/components/ui/button';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import React from 'react';
// import { CBBranches } from './comboboxs/CBBranches';
// import { CBCategory } from './comboboxs/CBCategory';
// import { CBSuplier } from './comboboxs/CBSuplier';

// // Interface actualizada según tu BD
// interface Product {
//     id: number;
//     category_id: number;
//     brand_id: number;
//     supplier_id: number;
//     sku: string;
//     name: string;
//     description?: string;
//     stock_min: number;
//     stock_total: number;
//     cost: number;
//     price: number;
//     image?: string;
//     status: boolean;
//     created_at?: string;
//     updated_at?: string;
// }

// interface Branch {
//     id: number;
//     name: string;
//     code: string;
//     address?: string;
//     phone?: string;
//     email?: string;
//     status: boolean;
// }

// interface Category {
//     id: number;
//     name: string;
//     code: string;
//     status: boolean;
// }

// interface Supplier {
//     id: number;
//     name: string;
//     contact_email: string;
//     phone: string;
//     address: string;
//     status: boolean;
// }

// interface ModalProductCreateProps {
//     onSave?: (
//         product: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
//     ) => void;
//     trigger?: React.ReactNode;
//     open?: boolean;
//     categories: Category[];
//     branchs: Branch[];
//     suppliers: Supplier[];
//     onOpenChange?: (open: boolean) => void;
// }

// export function ModalProductCreate({
//     onSave,
//     trigger,
//     open,
//     branchs,
//     categories,
//     suppliers,
//     onOpenChange,
// }: ModalProductCreateProps) {
//     const [formData, setFormData] = React.useState<
//         Omit<Product, 'id' | 'created_at' | 'updated_at'>
//     >({
//         category_id: 0,
//         brand_id: 0,
//         supplier_id: 0,
//         sku: '',
//         name: '',
//         description: '',
//         stock_min: 0,
//         stock_total: 0,
//         cost: 0,
//         price: 0,
//         image: '',
//         status: true,
//     });

//     const [errors, setErrors] = React.useState<Record<string, string>>({});

//     const validateForm = (): boolean => {
//         const newErrors: Record<string, string> = {};

//         if (!formData.name.trim()) {
//             newErrors.name = 'El nombre del producto es requerido';
//         }
//         if (!formData.sku.trim()) {
//             newErrors.sku = 'El SKU es requerido';
//         }
//         if (formData.category_id <= 0) {
//             newErrors.category_id = 'La categoría es requerida';
//         }
//         if (formData.brand_id <= 0) {
//             newErrors.brand_id = 'La marca es requerida';
//         }
//         if (formData.supplier_id <= 0) {
//             newErrors.supplier_id = 'El proveedor es requerido';
//         }
//         if (formData.stock_min < 0) {
//             newErrors.stock_min = 'El stock mínimo no puede ser negativo';
//         }
//         if (formData.stock_total < 0) {
//             newErrors.stock_total = 'El stock total no puede ser negativo';
//         }
//         if (formData.cost < 0) {
//             newErrors.cost = 'El costo no puede ser negativo';
//         }
//         if (formData.price <= 0) {
//             newErrors.price = 'El precio debe ser mayor a 0';
//         }
//         if (formData.price < formData.cost) {
//             newErrors.price = 'El precio debe ser mayor o igual al costo';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSave = () => {
//         if (!validateForm()) {
//             return;
//         }

//         if (onSave) {
//             onSave(formData);
//             // Limpiar formulario después de guardar
//             setFormData({
//                 category_id: 0,
//                 brand_id: 0,
//                 supplier_id: 0,
//                 sku: '',
//                 name: '',
//                 description: '',
//                 stock_min: 0,
//                 stock_total: 0,
//                 cost: 0,
//                 price: 0,
//                 image: '',
//                 status: true,
//             });
//             setErrors({});
//         }
//     };

//     const handleChange = (
//         field: keyof Omit<Product, 'id' | 'created_at' | 'updated_at'>,
//         value: string | number | boolean,
//     ) => {
//         setFormData((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//         // Limpiar error del campo cuando se modifica
//         if (errors[field]) {
//             setErrors((prev) => ({
//                 ...prev,
//                 [field]: '',
//             }));
//         }
//     };

//     const handleComboboxChange = (
//         field: 'category_id' | 'brand_id' | 'supplier_id',
//         value: number,
//     ) => {
//         handleChange(field, value);
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
//             <DialogContent className="max-h-[90vh] w-[95vw] max-w-[1200px] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle>Crear Nuevo Producto</DialogTitle>
//                     <DialogDescription>
//                         Completa la información para agregar un nuevo producto
//                         al inventario.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="grid gap-6 py-4">
//                     {/* Información Básica */}
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-semibold">
//                             Información Básica
//                         </h3>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-sku">SKU *</Label>
//                                 <Input
//                                     id="create-sku"
//                                     value={formData.sku}
//                                     onChange={(e) =>
//                                         handleChange('sku', e.target.value)
//                                     }
//                                     placeholder="FIL-BOS-001"
//                                     className={
//                                         errors.sku ? 'border-red-500' : ''
//                                     }
//                                 />
//                                 {errors.sku && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.sku}
//                                     </p>
//                                 )}
//                             </div>
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-name">
//                                     Nombre del Producto *
//                                 </Label>
//                                 <Input
//                                     id="create-name"
//                                     value={formData.name}
//                                     onChange={(e) =>
//                                         handleChange('name', e.target.value)
//                                     }
//                                     placeholder="Nombre del producto"
//                                     className={
//                                         errors.name ? 'border-red-500' : ''
//                                     }
//                                 />
//                                 {errors.name && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.name}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-brand">Marca *</Label>
//                                 <CBBranches
//                                     value={formData.brand_id}
//                                     onChange={(value) =>
//                                         handleComboboxChange(
//                                             'brand_id',
//                                             Number(value),
//                                         )
//                                     }
//                                     branchs={branchs}
//                                 />
//                                 {errors.brand_id && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.brand_id}
//                                     </p>
//                                 )}
//                             </div>
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-category">
//                                     Categoría *
//                                 </Label>
//                                 <CBCategory
//                                     value={formData.category_id}
//                                     onChange={(value) =>
//                                         handleComboboxChange(
//                                             'category_id',
//                                             Number(value),
//                                         )
//                                     }
//                                     categories={categories}
//                                 />
//                                 {errors.category_id && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.category_id}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-supplier">
//                                     Proveedor *
//                                 </Label>
//                                 <CBSuplier
//                                     value={formData.supplier_id}
//                                     onChange={(value) =>
//                                         handleComboboxChange(
//                                             'supplier_id',
//                                             Number(value),
//                                         )
//                                     }
//                                     suppliers={suppliers}
//                                 />
//                                 {errors.supplier_id && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.supplier_id}
//                                     </p>
//                                 )}
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-description">
//                                     Descripción
//                                 </Label>
//                                 <Textarea
//                                     id="create-description"
//                                     value={formData.description || ''}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             'description',
//                                             e.target.value,
//                                         )
//                                     }
//                                     placeholder="Descripción detallada del producto"
//                                     rows={3}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Inventario */}
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-semibold">Inventario</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-stock-total">
//                                     Stock Total *
//                                 </Label>
//                                 <Input
//                                     id="create-stock-total"
//                                     type="number"
//                                     min="0"
//                                     value={formData.stock_total}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             'stock_total',
//                                             Number(e.target.value),
//                                         )
//                                     }
//                                     className={
//                                         errors.stock_total
//                                             ? 'border-red-500'
//                                             : ''
//                                     }
//                                 />
//                                 {errors.stock_total && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.stock_total}
//                                     </p>
//                                 )}
//                             </div>
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-stock-min">
//                                     Stock Mínimo *
//                                 </Label>
//                                 <Input
//                                     id="create-stock-min"
//                                     type="number"
//                                     min="0"
//                                     value={formData.stock_min}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             'stock_min',
//                                             Number(e.target.value),
//                                         )
//                                     }
//                                     className={
//                                         errors.stock_min ? 'border-red-500' : ''
//                                     }
//                                 />
//                                 {errors.stock_min && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.stock_min}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Precios */}
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-semibold">Precios</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-cost">Costo *</Label>
//                                 <Input
//                                     id="create-cost"
//                                     type="number"
//                                     min="0"
//                                     step="0.01"
//                                     value={formData.cost}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             'cost',
//                                             Number(e.target.value),
//                                         )
//                                     }
//                                     placeholder="0.00"
//                                     className={
//                                         errors.cost ? 'border-red-500' : ''
//                                     }
//                                 />
//                                 {errors.cost && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.cost}
//                                     </p>
//                                 )}
//                             </div>
//                             <div className="grid gap-2">
//                                 <Label htmlFor="create-price">
//                                     Precio de Venta *
//                                 </Label>
//                                 <Input
//                                     id="create-price"
//                                     type="number"
//                                     min="0"
//                                     step="0.01"
//                                     value={formData.price}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             'price',
//                                             Number(e.target.value),
//                                         )
//                                     }
//                                     placeholder="0.00"
//                                     className={
//                                         errors.price ? 'border-red-500' : ''
//                                     }
//                                 />
//                                 {errors.price && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.price}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Mostrar margen de ganancia */}
//                         {formData.cost > 0 && formData.price > 0 && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="grid gap-2">
//                                     <Label>Margen Bruto</Label>
//                                     <Input
//                                         value={`$${(formData.price - formData.cost).toLocaleString()}`}
//                                         disabled
//                                         className="bg-muted"
//                                     />
//                                 </div>
//                                 <div className="grid gap-2">
//                                     <Label>Porcentaje de Ganancia</Label>
//                                     <Input
//                                         value={`${(((formData.price - formData.cost) / formData.cost) * 100).toFixed(2)}%`}
//                                         disabled
//                                         className="bg-muted"
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Estado */}
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-semibold">Estado</h3>
//                         <div className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 id="create-status"
//                                 checked={formData.status}
//                                 onChange={(e) =>
//                                     handleChange('status', e.target.checked)
//                                 }
//                                 className="rounded border-gray-300"
//                             />
//                             <Label
//                                 htmlFor="create-status"
//                                 className="text-sm leading-none font-medium"
//                             >
//                                 Producto activo
//                             </Label>
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                             Los productos inactivos no estarán disponibles para
//                             venta.
//                         </p>
//                     </div>
//                 </div>

//                 <DialogFooter className="gap-2">
//                     <Button
//                         type="button"
//                         onClick={handleSave}
//                         disabled={Object.keys(errors).some(
//                             (key) => errors[key] !== '',
//                         )}
//                     >
//                         Crear Producto
//                     </Button>
//                     <Button
//                         variant="outline"
//                         onClick={() => onOpenChange?.(false)}
//                     >
//                         Cancelar
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
// components/ModalProductCreate.tsx
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { CBBranches } from './comboboxs/CBBranches';
import { CBCategory } from './comboboxs/CBCategory';
import { CBSuplier } from './comboboxs/CBSuplier';
import { X, Star } from 'lucide-react';

// Interface actualizada según tu BD
interface Product {
    id: number;
    category_id: number;
    brand_id: number;
    supplier_id: number;
    sku: string;
    name: string;
    description?: string;
    stock_min: number;
    stock_total: number;
    cost: number;
    price: number;
    image?: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}

interface Branch {
    id: number;
    name: string;
    code: string;
    address?: string;
    phone?: string;
    email?: string;
    status: boolean;
}

interface Category {
    id: number;
    name: string;
    code: string;
    status: boolean;
}

interface Supplier {
    id: number;
    name: string;
    contact_email: string;
    phone: string;
    address: string;
    status: boolean;
}

interface ModalProductCreateProps {
    onSave?: (
        product: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
        imageFiles?: File[],
        mainImageIndex?: number
    ) => void;
    trigger?: React.ReactNode;
    open?: boolean;
    categories: Category[];
    branchs: Branch[];
    suppliers: Supplier[];
    onOpenChange?: (open: boolean) => void;
}

// Componente de File Upload con Preview y selección de imagen principal
function FileUploadWithPreview({ 
    onFilesChange,
    onMainImageChange 
}: { 
    onFilesChange: (files: File[]) => void;
    onMainImageChange: (index: number) => void;
}) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [mainImageIndex, setMainImageIndex] = React.useState<number>(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            onFilesChange(updatedFiles);
            
            // Si es la primera imagen, automáticamente se convierte en principal
            if (files.length === 0 && newFiles.length > 0) {
                setMainImageIndex(0);
                onMainImageChange(0);
            }
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
        
        // Ajustar el índice de la imagen principal si es necesario
        if (index === mainImageIndex) {
            const newMainIndex = updatedFiles.length > 0 ? 0 : -1;
            setMainImageIndex(newMainIndex);
            onMainImageChange(newMainIndex);
        } else if (index < mainImageIndex) {
            const newMainIndex = mainImageIndex - 1;
            setMainImageIndex(newMainIndex);
            onMainImageChange(newMainIndex);
        }
    };

    const handleSetMainImage = (index: number) => {
        setMainImageIndex(index);
        onMainImageChange(index);
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="product-images" className="text-sm font-medium">
                            Imágenes del Producto
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                            Puedes subir múltiples imágenes. La primera imagen será la principal por defecto.
                            Formatos: PNG, JPG, JPEG, GIF (Máx. 5MB por imagen)
                        </p>
                    </div>
                    
                    <div className="grid gap-4">
                        <Input
                            id="product-images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        
                        {files.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Vista Previa ({files.length} {files.length === 1 ? 'imagen' : 'imágenes'})
                                    </Label>
                                    {mainImageIndex >= 0 && (
                                        <div className="text-sm text-blue-600 flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-current" />
                                            Imagen {mainImageIndex + 1} marcada como principal
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {files.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <div className={`aspect-square border-2 rounded-lg overflow-hidden bg-muted ${
                                                index === mainImageIndex 
                                                    ? 'border-blue-500 ring-2 ring-blue-200' 
                                                    : 'border-gray-200'
                                            }`}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {index === mainImageIndex && (
                                                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Principal
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Botón para marcar como principal */}
                                            <button
                                                type="button"
                                                onClick={() => handleSetMainImage(index)}
                                                className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                                                    index === mainImageIndex 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                                }`}
                                            >
                                                {index === mainImageIndex ? 'Principal' : 'Marcar Principal'}
                                            </button>
                                            
                                            {/* Botón para eliminar */}
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            
                                            <div className="mt-1 text-xs text-muted-foreground truncate">
                                                {file.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            setFiles([]);
                                            setMainImageIndex(-1);
                                            onFilesChange([]);
                                            onMainImageChange(-1);
                                        }}
                                    >
                                        Limpiar Todas las Imágenes
                                    </Button>
                                    
                                    {files.length > 1 && (
                                        <div className="text-xs text-muted-foreground flex items-center">
                                            <Star className="w-3 h-3 mr-1" />
                                            Haz clic en "Marcar Principal" para elegir la imagen destacada
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function ModalProductCreate({
    onSave,
    trigger,
    open,
    branchs,
    categories,
    suppliers,
    onOpenChange,
}: ModalProductCreateProps) {
    const [formData, setFormData] = React.useState<
        Omit<Product, 'id' | 'created_at' | 'updated_at'>
    >({
        category_id: 0,
        brand_id: 0,
        supplier_id: 0,
        sku: '',
        name: '',
        description: '',
        stock_min: 0,
        stock_total: 0,
        cost: 0,
        price: 0,
        image: '',
        status: true,
    });

    const [imageFiles, setImageFiles] = React.useState<File[]>([]);
    const [mainImageIndex, setMainImageIndex] = React.useState<number>(-1);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del producto es requerido';
        }
        if (!formData.sku.trim()) {
            newErrors.sku = 'El SKU es requerido';
        }
        if (formData.category_id <= 0) {
            newErrors.category_id = 'La categoría es requerida';
        }
        if (formData.brand_id <= 0) {
            newErrors.brand_id = 'La marca es requerida';
        }
        if (formData.supplier_id <= 0) {
            newErrors.supplier_id = 'El proveedor es requerido';
        }
        if (formData.stock_min < 0) {
            newErrors.stock_min = 'El stock mínimo no puede ser negativo';
        }
        if (formData.stock_total < 0) {
            newErrors.stock_total = 'El stock total no puede ser negativo';
        }
        if (formData.cost < 0) {
            newErrors.cost = 'El costo no puede ser negativo';
        }
        if (formData.price <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }
        if (formData.price < formData.cost) {
            newErrors.price = 'El precio debe ser mayor o igual al costo';
        }

        // Validar tamaño de archivos
        for (const file of imageFiles) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                newErrors.images = 'Alguna imagen excede el tamaño máximo de 5MB';
                break;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        if (onSave) {
            onSave(formData, imageFiles, mainImageIndex);
            // Limpiar formulario después de guardar
            setFormData({
                category_id: 0,
                brand_id: 0,
                supplier_id: 0,
                sku: '',
                name: '',
                description: '',
                stock_min: 0,
                stock_total: 0,
                cost: 0,
                price: 0,
                image: '',
                status: true,
            });
            setImageFiles([]);
            setMainImageIndex(-1);
            setErrors({});
        }
    };

    const handleChange = (
        field: keyof Omit<Product, 'id' | 'created_at' | 'updated_at'>,
        value: string | number | boolean,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Limpiar error del campo cuando se modifica
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const handleComboboxChange = (
        field: 'category_id' | 'brand_id' | 'supplier_id',
        value: number,
    ) => {
        handleChange(field, value);
    };

    const handleFilesChange = (files: File[]) => {
        setImageFiles(files);
        // Limpiar error de imágenes si existe
        if (errors.images) {
            setErrors((prev) => ({
                ...prev,
                images: '',
            }));
        }
    };

    const handleMainImageChange = (index: number) => {
        setMainImageIndex(index);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-h-[90vh] w-[95vw] max-w-[1200px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Producto</DialogTitle>
                    <DialogDescription>
                        Completa la información para agregar un nuevo producto al inventario.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Información Básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Información Básica
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-sku">SKU *</Label>
                                <Input
                                    id="create-sku"
                                    value={formData.sku}
                                    onChange={(e) =>
                                        handleChange('sku', e.target.value)
                                    }
                                    placeholder="FIL-BOS-001"
                                    className={
                                        errors.sku ? 'border-red-500' : ''
                                    }
                                />
                                {errors.sku && (
                                    <p className="text-sm text-red-500">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">
                                    Nombre del Producto *
                                </Label>
                                <Input
                                    id="create-name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange('name', e.target.value)
                                    }
                                    placeholder="Nombre del producto"
                                    className={
                                        errors.name ? 'border-red-500' : ''
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-brand">Marca *</Label>
                                <CBBranches
                                    value={formData.brand_id}
                                    onChange={(value) =>
                                        handleComboboxChange(
                                            'brand_id',
                                            Number(value),
                                        )
                                    }
                                    branchs={branchs}
                                />
                                {errors.brand_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.brand_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-category">
                                    Categoría *
                                </Label>
                                <CBCategory
                                    value={formData.category_id}
                                    onChange={(value) =>
                                        handleComboboxChange(
                                            'category_id',
                                            Number(value),
                                        )
                                    }
                                    categories={categories}
                                />
                                {errors.category_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-supplier">
                                    Proveedor *
                                </Label>
                                <CBSuplier
                                    value={formData.supplier_id}
                                    onChange={(value) =>
                                        handleComboboxChange(
                                            'supplier_id',
                                            Number(value),
                                        )
                                    }
                                    suppliers={suppliers}
                                />
                                {errors.supplier_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.supplier_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-description">
                                    Descripción
                                </Label>
                                <Textarea
                                    id="create-description"
                                    value={formData.description || ''}
                                    onChange={(e) =>
                                        handleChange(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Descripción detallada del producto"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Imágenes del Producto */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Imágenes del Producto</h3>
                        <FileUploadWithPreview 
                            onFilesChange={handleFilesChange}
                            onMainImageChange={handleMainImageChange}
                        />
                        {errors.images && (
                            <p className="text-sm text-red-500">{errors.images}</p>
                        )}
                    </div>

                    {/* Inventario */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Inventario</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-stock-total">
                                    Stock Total *
                                </Label>
                                <Input
                                    id="create-stock-total"
                                    type="number"
                                    min="0"
                                    value={formData.stock_total}
                                    onChange={(e) =>
                                        handleChange(
                                            'stock_total',
                                            Number(e.target.value),
                                        )
                                    }
                                    className={
                                        errors.stock_total
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {errors.stock_total && (
                                    <p className="text-sm text-red-500">
                                        {errors.stock_total}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-stock-min">
                                    Stock Mínimo *
                                </Label>
                                <Input
                                    id="create-stock-min"
                                    type="number"
                                    min="0"
                                    value={formData.stock_min}
                                    onChange={(e) =>
                                        handleChange(
                                            'stock_min',
                                            Number(e.target.value),
                                        )
                                    }
                                    className={
                                        errors.stock_min ? 'border-red-500' : ''
                                    }
                                />
                                {errors.stock_min && (
                                    <p className="text-sm text-red-500">
                                        {errors.stock_min}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Precios</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-cost">Costo *</Label>
                                <Input
                                    id="create-cost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.cost}
                                    onChange={(e) =>
                                        handleChange(
                                            'cost',
                                            Number(e.target.value),
                                        )
                                    }
                                    placeholder="0.00"
                                    className={
                                        errors.cost ? 'border-red-500' : ''
                                    }
                                />
                                {errors.cost && (
                                    <p className="text-sm text-red-500">
                                        {errors.cost}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-price">
                                    Precio de Venta *
                                </Label>
                                <Input
                                    id="create-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) =>
                                        handleChange(
                                            'price',
                                            Number(e.target.value),
                                        )
                                    }
                                    placeholder="0.00"
                                    className={
                                        errors.price ? 'border-red-500' : ''
                                    }
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Mostrar margen de ganancia */}
                        {formData.cost > 0 && formData.price > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Margen Bruto</Label>
                                    <Input
                                        value={`$${(formData.price - formData.cost).toLocaleString()}`}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Porcentaje de Ganancia</Label>
                                    <Input
                                        value={`${(((formData.price - formData.cost) / formData.cost) * 100).toFixed(2)}%`}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Estado</h3>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="create-status"
                                checked={formData.status}
                                onChange={(e) =>
                                    handleChange('status', e.target.checked)
                                }
                                className="rounded border-gray-300"
                            />
                            <Label
                                htmlFor="create-status"
                                className="text-sm leading-none font-medium"
                            >
                                Producto activo
                            </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Los productos inactivos no estarán disponibles para venta.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={Object.keys(errors).some(
                            (key) => errors[key] !== '',
                        )}
                    >
                        Crear Producto
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange?.(false)}
                    >
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}