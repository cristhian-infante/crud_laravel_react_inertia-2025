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
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        const result = await onDelete(brand.id);

        if (result.success) {
            setIsDeleteDialogOpen(false);
        }

        setIsDeleting(false);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDeleteDialogOpen(open);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isDeleting}
                    >
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setIsEditModalOpen(true)}
                        disabled={isDeleting}
                    >
                        Editar
                    </DropdownMenuItem>

                    <AlertDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={handleDialogOpenChange}
                    >
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={(e) => e.preventDefault()}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    ¿Estás absolutamente seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto
                                    eliminará permanentemente la marca "
                                    {brand.name}" y todos sus datos asociados.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            <ModalEditar
                brand={brand}
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />
        </>
    );
};