import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import category from '@/routes/category';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ModalCrear() {
    const [open, setOpen] = useState(false);
    const { props } = usePage();

    
    const { data, setData, post, processing, errors, reset } = useForm({
        nameCategory: '',
    });

    // Manejar flash messages - versión segura
    useEffect(() => {
        // Diferentes formas en que Inertia puede pasar flash messages
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
    }, [props.flash, props.success, props.error, props.errors]); // Todas las dependencias posibles

    // Limpiar formulario cuando se cierra el modal
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const submit = (e) => {
        e.preventDefault();

        post(category.store().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
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
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Agregar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nueva Categoria</DialogTitle>
                    <DialogDescription>
                        Agregue una nueva categoria. Haga clic en guardar cuando
                        haya terminado.
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
                            />
                            {errors.nameCategory && (
                                <p className="text-sm text-red-600">
                                    {errors.nameCategory}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
