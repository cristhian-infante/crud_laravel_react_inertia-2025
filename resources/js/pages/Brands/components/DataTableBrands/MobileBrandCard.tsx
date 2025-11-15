import * as React from 'react';
import { Edit, Trash2, EyeOff, MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from './StatusBadge';
import ModalEditar from '../ModalEditar';
import { MobileBrandCardProps } from './types';

export const MobileBrandCard = ({ brand, onDelete }: MobileBrandCardProps) => {
    // Estados para controlar modales y diálogos
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isDisableDialogOpen, setIsDisableDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isDisabling, setIsDisabling] = React.useState(false);

    /**
     * Maneja la eliminación de la marca
     */
    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await onDelete(brand.id);
        if (result.success) {
            setIsDeleteDialogOpen(false);
        }
        setIsDeleting(false);
    };

    /**
     * Maneja la inhabilitación de la marca
     */
    const handleDisable = async () => {
        setIsDisabling(true);
        // TODO: Implementar lógica de inhabilitación
        console.log('Inhabilitando marca:', brand.id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsDisableDialogOpen(false);
        setIsDisabling(false);
    };

    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
            {/* Header con información de la marca */}
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-card-foreground">
                            {brand.name}
                        </h3>
                        <StatusBadge status={brand.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        ID: {brand.id}
                    </p>
                </div>
                
                {/* Menú de acciones desplegable */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isDeleting || isDisabling}
                        >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {/* Opción: Editar */}
                        <DropdownMenuItem
                            onClick={() => setIsEditModalOpen(true)}
                            disabled={isDeleting || isDisabling}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Editar marca
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Opción: Inhabilitar */}
                        <DropdownMenuItem
                            onClick={() => setIsDisableDialogOpen(true)}
                            disabled={isDeleting || isDisabling || brand.status === 'inactive'}
                            className="flex items-center gap-2 text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                        >
                            <EyeOff className="h-4 w-4" />
                            {brand.status === 'inactive' ? 'Ya está inactiva' : 'Inhabilitar'}
                        </DropdownMenuItem>

                        {/* Opción: Eliminar */}
                        <DropdownMenuItem
                            onClick={() => setIsDeleteDialogOpen(true)}
                            disabled={isDeleting || isDisabling}
                            className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Estados de carga */}
            {(isDeleting || isDisabling) && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                    {isDeleting && 'Eliminando marca...'}
                    {isDisabling && 'Inhabilitando marca...'}
                </div>
            )}

            {/* ========================================================= 
            // DIÁLOGO DE INHABILITACIÓN
               ========================================================= */}
            <AlertDialog
                open={isDisableDialogOpen}
                onOpenChange={setIsDisableDialogOpen}
            >
                <AlertDialogTrigger asChild>
                    {/* El trigger está en el DropdownMenu */}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <EyeOff className="h-5 w-5 text-amber-600" />
                            ¿Inhabilitar marca?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            La marca <strong>"{brand.name}"</strong> cambiará a estado "Inactivo".
                            <br /><br />
                            <span className="text-amber-600">
                                Los productos asociados permanecerán en el sistema pero no estarán 
                                disponibles para nuevas ventas.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDisabling}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDisable}
                            className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
                            disabled={isDisabling}
                        >
                            {isDisabling ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Inhabilitando...
                                </span>
                            ) : (
                                'Sí, inhabilitar'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ========================================================= 
            // DIÁLOGO DE ELIMINACIÓN
             ========================================================= */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogTrigger asChild>
                    {/* El trigger está en el DropdownMenu */}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-600" />
                            ¿Eliminar marca?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar la marca <strong>"{brand.name}"</strong>.
                            <br /><br />
                            <span className="text-red-600 font-medium">
                                ⚠️ Esta acción no se puede deshacer. La marca y todos sus 
                                datos asociados serán movidos a la papelera.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Eliminando...
                                </span>
                            ) : (
                                'Sí, eliminar'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal de edición */}
            <ModalEditar
                brand={brand}
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />
        </div>
    );
};