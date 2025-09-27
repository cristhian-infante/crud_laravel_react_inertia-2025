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
import { useState, useEffect } from 'react';

interface Category {
    id: number;
    nameCategory: string;
}

interface ModalEditarProps {
    category: Category;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ModalEditar({ category, isOpen, onOpenChange }: ModalEditarProps) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.nameCategory);
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Editando categoría:', category.id, 'Nuevo nombre:', name);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editando Categoría #{category.id}</DialogTitle>
                        <DialogDescription>
                            Modifique el nombre de la categoría.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Nombre</Label>
                            <Input 
                                id="name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre de la categoría"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}