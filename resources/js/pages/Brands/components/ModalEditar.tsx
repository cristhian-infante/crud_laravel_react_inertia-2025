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
import rbrand from '@/routes/brands'; // Cambiado a rutas de brands

interface Brand {
    id: number;
    name: string;
    status: string;
}

interface ModalEditarProps {
    brand: Brand; // Cambiado de category a brand
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function ModalEditar({ brand, isOpen, onOpenChange, onSuccess }: ModalEditarProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: brand.name || '',
        status: brand.status || '', // Agregado campo status
    });

    // Cargar datos cuando se abre el modal o cambia la marca
    useEffect(() => {
        if (brand && isOpen) {
            setData({
                name: brand.name,
                status: brand.status
            });
        }
    }, [brand, isOpen]);

    // Limpiar formulario cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        put(rbrand.update(brand.id).url, {
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
                    <DialogTitle>Editando Marca</DialogTitle> {/* Cambiado de Categoría a Marca */}
                    <DialogDescription>
                        Modifique los datos de la marca.
                    </DialogDescription> {/* Removida referencia al código */}
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                placeholder="Ingrese el nombre de la marca"
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