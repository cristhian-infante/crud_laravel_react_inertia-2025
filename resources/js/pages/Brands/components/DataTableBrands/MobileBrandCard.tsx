import * as React from 'react';

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
import ModalEditar from '../ModalEditar';
import { MobileBrandCardProps } from './types';

export const MobileBrandCard = ({ brand, onDelete }: MobileBrandCardProps) => {
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

    return (
        <div className="space-y-3 rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                    <h3 className="text-base font-semibold">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        Estado: {brand.status}
                    </p>
                </div>
                <div className="ml-2 flex gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditModalOpen(true)}
                        disabled={isDeleting}
                    >
                        <span className="sr-only">Editar</span>
                        Editar
                    </Button>

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
                                <span className="sr-only">Eliminar</span>
                                {isDeleting ? '...' : 'Eliminar'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    ¿Eliminar Marca?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción moverá la Marca "{brand.name}" a
                                    la papelera.
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
                </div>
            </div>

            {isDeleting && (
                <div className="text-xs text-muted-foreground">
                    Eliminando...
                </div>
            )}

            <ModalEditar
                brand={brand}
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />
        </div>
    );
};