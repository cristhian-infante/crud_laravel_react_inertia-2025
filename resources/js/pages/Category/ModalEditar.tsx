import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import rcategory from '@/routes/category';

interface Category {
    id: number;
    code: string;
    name: string;
}

interface ModalEditarProps {
    category: Category;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function ModalEditar({ category, isOpen, onOpenChange, onSuccess }: ModalEditarProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
    });

    // Cargar datos cuando se abre el modal o cambia la categoría
    useEffect(() => {
        if (category && isOpen) {
            setData('name', category.name);
        }
    }, [category, isOpen]);

    // Limpiar formulario cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        put(rcategory.update(category.id).url, {
            preserveScroll: true,
            preserveState: false, // IMPORTANTE: Evita conflictos
            onSuccess: () => {
                reset();
                onOpenChange(false);
                if (onSuccess) {
                    onSuccess();
                }
                // NO mostrar toast aquí - se manejará en la página principal
            },
            onError: () => {
                // Los errores se mostrarán automáticamente en los campos
                // NO mostrar toast aquí para evitar duplicados
            },
        });
    };

    const handleCancel = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editando Categoría</DialogTitle>
                    <DialogDescription>
                        Modifique el nombre de la categoría {category.code}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="nameCategory">Nombre</Label>
                            <Input
                                id="nameCategory"
                                name="nameCategory"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                placeholder="Ingrese el nombre de la categoría"
                                disabled={processing}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}