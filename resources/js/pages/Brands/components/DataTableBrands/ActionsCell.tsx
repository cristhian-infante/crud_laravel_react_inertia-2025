import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import ModalEditar from '../ModalEditar';
import { ActionsCellProps } from './types';

export const ActionsCell = ({ row, onDelete }: ActionsCellProps) => {
    const brand = row.original;
    
    // Estados para controlar la apertura de modales y diálogos
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isDisableDialogOpen, setIsDisableDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isDisabling, setIsDisabling] = React.useState(false);

    // =========================================================================
    // MANEJO DE ELIMINACIÓN
    // =========================================================================

    /**
     * Maneja la eliminación de una marca
     * Realiza la petición de eliminación y cierra el diálogo en caso de éxito
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
     * Maneja el cambio de estado del diálogo de eliminación
     * Útil para resetear estados cuando el usuario cierra el diálogo
     */
    const handleDeleteDialogOpenChange = (open: boolean) => {
        setIsDeleteDialogOpen(open);
    };

    // =========================================================================
    // MANEJO DE INHABILITACIÓN
    // =========================================================================

    /**
     * Maneja la inhabilitación de una marca
     * Cambia el estado de la marca a "inactivo" sin eliminarla
     */
    const handleDisable = async () => {
        setIsDisabling(true);

        // TODO: Implementar la lógica de inhabilitación
        // await onDisable(brand.id);
        console.log('Inhabilitando marca:', brand.id);
        
        // Simulamos una petición
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsDisableDialogOpen(false);
        setIsDisabling(false);
    };

    /**
     * Maneja el cambio de estado del diálogo de inhabilitación
     */
    const handleDisableDialogOpenChange = (open: boolean) => {
        setIsDisableDialogOpen(open);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isDeleting || isDisabling}
                    >
                        <span className="sr-only">Abrir menú de acciones</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Opción: Editar Marca */}
                    <DropdownMenuItem
                        onClick={() => setIsEditModalOpen(true)}
                        disabled={isDeleting || isDisabling}
                    >
                        Editar
                    </DropdownMenuItem>

                    {/* ========================================================= */}
                    {/*// DIÁLOGO DE ELIMINACIÓN*/}
                    {/* ========================================================= */}
                    <AlertDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={handleDeleteDialogOpenChange}
                    >
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onSelect={(e) => e.preventDefault()}
                                disabled={isDeleting || isDisabling}
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                {/* Título de confirmación para eliminación */}
                                <AlertDialogTitle>
                                    ¿Confirmar eliminación?
                                </AlertDialogTitle>
                                {/* Descripción detallada de las consecuencias */}
                                <AlertDialogDescription>
                                    Esta acción moverá la marca "{brand.name}" a la papelera. 
                                    La marca y todos sus productos asociados ya no estarán disponibles 
                                    en el sistema. Podrás restaurarla desde la papelera si es necesario.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                {/* Botón de cancelación - acción reversible */}
                                <AlertDialogCancel disabled={isDeleting}>
                                    Cancelar
                                </AlertDialogCancel>
                                {/* Botón de confirmación - acción destructiva */}
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* ========================================================= */}
                    {/*// DIÁLOGO DE INHABILITACIÓN*/}
                    {/* ========================================================= */}
                    <AlertDialog
                        open={isDisableDialogOpen}
                        onOpenChange={handleDisableDialogOpenChange}
                    >
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                onSelect={(e) => e.preventDefault()}
                                disabled={isDeleting || isDisabling}
                            >
                                {isDisabling ? 'Inhabilitando...' : 'Inhabilitar'}
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                {/* Título de confirmación para inhabilitación */}
                                <AlertDialogTitle>
                                    ¿Inhabilitar marca?
                                </AlertDialogTitle>
                                {/* Descripción de la inhabilitación vs eliminación */}
                                <AlertDialogDescription>
                                    La marca "{brand.name}" cambiará a estado "Inactivo". 
                                    Los productos asociados permanecerán en el sistema pero no estarán 
                                    disponibles para nuevas ventas. Puedes reactivar la marca en cualquier momento.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                {/* Botón de cancelación */}
                                <AlertDialogCancel disabled={isDisabling}>
                                    Cancelar
                                </AlertDialogCancel>
                                {/* Botón de confirmación - acción reversible */}
                                <AlertDialogAction
                                    onClick={handleDisable}
                                    className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
                                    disabled={isDisabling}
                                >
                                    {isDisabling ? 'Inhabilitando...' : 'Sí, inhabilitar'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal para editar la marca */}
            <ModalEditar
                brand={brand}
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />
        </>
    );
};