// components/ModalDetallesBrand.tsx
'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Brand } from './DataTableBrands/types';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface ModalDetallesProps {
    brand: Brand | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ModalDetallesBrand({ brand, isOpen, onOpenChange }: ModalDetallesProps) {
    if (!brand) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">                        
                            <span>{brand.name}</span>
                    </DialogTitle>
                    <DropdownMenuSeparator />
                    <DialogDescription>
                        Detalles completos de la marca
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-right">Nombre:</span>
                        <span className="col-span-3 text-sm">{brand.name}</span>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-right">Estado:</span>
                        <div className="col-span-3">
                            <Badge 
                                variant={brand.status === 'active' ? 'default' : 'secondary'}
                                className={
                                    brand.status === 'active' 
                                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                                }
                            >
                                {brand.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-right">Creado:</span>
                        <span className="col-span-3 text-sm">{brand.created_at}</span>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-right">Actualizado:</span>
                        <span className="col-span-3 text-sm">{brand.updated_at}</span>
                    </div>

                    {brand.logo && (
                        <div className="grid grid-cols-4 items-start gap-4">
                            <span className="text-sm font-medium text-right">Logo:</span>
                            <div className="col-span-3">
                                <img 
                                    src={brand.logo} 
                                    alt={brand.name}
                                    className="h-20 w-20 object-cover rounded-lg border"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}