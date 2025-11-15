import { EyeOff, Trash2 } from 'lucide-react';
import * as React from 'react';

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
import { Button } from '@/components/ui/button';
import { BulkActionsProps } from './types';

export const BulkActions = ({ table, onDeleteMultiple }: BulkActionsProps) => {
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isDisabling, setIsDisabling] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isDisableDialogOpen, setIsDisableDialogOpen] = React.useState(false);

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    const handleDeleteMultiple = async () => {
        if (selectedCount === 0) return;

        setIsDeleting(true);
        const selectedIds = selectedRows.map((row) => row.original.id);
        await onDeleteMultiple(selectedIds);
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        table.toggleAllPageRowsSelected(false);
    };

    const handleDisableMultiple = async () => {
        if (selectedCount === 0) return;

        setIsDisabling(true);
        const selectedIds = selectedRows.map((row) => row.original.id);
        // Aquí llamamo a la función para inhabilitar
        // await onDisableMultiple(selectedIds);
        //console.log('Inhabilitando marcas:', selectedIds);
        setIsDisabling(false);
        setIsDisableDialogOpen(false);
        table.toggleAllPageRowsSelected(false);
    };

    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
            <div className="flex-1 text-sm">
                <span className="font-medium">{selectedCount}</span> Marca(s)
                seleccionada(s)
            </div>

            {/* Botón y Dialog para Inhabilitar */}
            <AlertDialog
                open={isDisableDialogOpen}
                onOpenChange={setIsDisableDialogOpen}
            >
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isDisabling}
                        className="border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                    >
                        <EyeOff className="mr-2 h-4 w-4" />
                        {isDisabling
                            ? 'Inhabilitando...'
                            : `Inhabilitar (${selectedCount})`}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Inhabilitar {selectedCount} Marca(s)?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción cambiará el estado de {selectedCount}{' '}
                            Marca(s) a "Inactivo". Podrás volver a activarlas
                            posteriormente si es necesario.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDisabling}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDisableMultiple}
                            className="bg-amber-600 hover:bg-amber-700"
                            disabled={isDisabling}
                        >
                            {isDisabling
                                ? 'Inhabilitando...'
                                : `Inhabilitar ${selectedCount} Marca(s)`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Botón y Dialog para Eliminar */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting
                            ? 'Eliminando...'
                            : `Eliminar (${selectedCount})`}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar {selectedCount} Marca(s)?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción moverá {selectedCount} Marca(s) a la
                            papelera. Podrás restaurarlas posteriormente si es
                            necesario.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMultiple}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? 'Eliminando...'
                                : `Eliminar ${selectedCount} Marca(s)`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
             
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.toggleAllPageRowsSelected(false)}
                disabled={isDeleting || isDisabling}
            >
                Deseleccionar
            </Button>
        </div>
    );
};
