import { Link } from '@inertiajs/react';
import ModalEditar from './ModalEditar';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Category {
    id: number;
    nameCategory: string;
}

interface TablaCategoriasProps {
    categories: Category[];
}

export default function TablaCategorias({ categories }: TablaCategoriasProps) {
    return (
        <Table>
            <TableCaption>Categorias | Listas</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nombre Categoria</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((categoria) => (
                    <TableRow key={categoria.id}>
                        <TableCell className="font-medium">
                            {categoria.id}
                        </TableCell>
                        <TableCell>{categoria.nameCategory}</TableCell>
                        <TableCell className="text-right">
                            {/* <ModalEditar /> */}
                            <button className="text-red-600 hover:text-red-900">
                                Eliminar
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}