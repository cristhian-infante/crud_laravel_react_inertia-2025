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
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ModalCrear() {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        nameCategory: '',
    });

    // Limpiar formulario cuando se cierra el modal
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(category.store().url, {
            preserveScroll: true,
            preserveState: false, // IMPORTANTE: Evita conflictos
            onSuccess: () => {
                reset();
                setOpen(false);
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
                                className={errors.nameCategory ? 'border-red-500' : ''}
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
                                disabled={processing}
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