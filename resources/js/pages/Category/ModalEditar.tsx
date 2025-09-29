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
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import rcategory from '@/routes/category';

interface Category {
    id: number;
    codCategory: string;
    nameCategory: string;
}

interface ModalEditarProps {
    category: Category;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function ModalEditar({ category, isOpen, onOpenChange, onSuccess }: ModalEditarProps) {
    const { props } = usePage();

    const { data, setData, put, processing, errors, reset } = useForm({
        nameCategory: '',
    });

    // Manejar flash messages - igual que en crear
    useEffect(() => {
        const successMessage =
            props.flash?.success || props.success || props.message;

        const errorMessage =
            props.flash?.error || props.errors?.nameCategory || props.error;

        if (successMessage) {
            toast.success(successMessage);
        }

        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [props.flash, props.success, props.error, props.errors]);

    // Cargar datos cuando se abre el modal o cambia la categoría
    useEffect(() => {
        if (category && isOpen) {
            setData('nameCategory', category.nameCategory);
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
        // console.log('ID de categoría a editar:', category.id);
        //  console.log('URL de actualización:', rcategory.update('category.update', category.id).url);
        // USANDO LA MISMA ESTRUCTURA QUE EL MODAL CREAR
        put(rcategory.update(category.id).url, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
                if (onSuccess) {
                    onSuccess();
                }
                // El toast se manejará automáticamente con el flash message
            },
            onError: (errors) => {
                // Mostrar errores inmediatos
                if (errors.nameCategory) {
                    toast.error(errors.nameCategory);
                }
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
                        Modifique el nombre de la categoría {category.codCategory}.
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
                                value={data.nameCategory}
                                onChange={(e) =>
                                    setData('nameCategory', e.target.value)
                                }
                                required
                                placeholder="Ingrese el nombre de la categoría"
                                disabled={processing}
                            />
                            {errors.nameCategory && (
                                <p className="text-sm text-red-600">
                                    {errors.nameCategory}
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