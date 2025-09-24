import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head,Link } from '@inertiajs/react';
import category from '@/routes/category';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias',
        href: category.index().url,
    },
];

interface Category{
    id: number;
    nameCategory:string;
}

export default function Index({categories}:{categories:Category[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias | Lista" />
            {categories.length > 0 && (            
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
                                    <Link 
                                        href='#'
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        Editar
                                    </Link>
                                    <button className="text-red-600 hover:text-red-900">
                                        Eliminar
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>                    
                </Table>
                )}
            </AppLayout>
    );
}
