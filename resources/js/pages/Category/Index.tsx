import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import category from '@/routes/category';
import ModalCrear from './ModalCrear';
import TablaCategorias from './TablaCategorias'; 
import DataTableCategorias from './DataTableCategorias';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias',
        href: category.index().url,
    },
];

interface Category {
    id: number;
    codCategory: string;
    nameCategory: string;
}

export default function Index({ categories }: { categories: Category[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias | Lista" />
            <div className="m-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
                    <ModalCrear />
                </div>
                {/* {categories.length > 0 && (
                    <TablaCategorias categories={categories} />
                )}                
            </div> */}
             {categories.length > 0 ? (
                    <DataTableCategorias categories={categories} />
                ) : (
                    <div className="text-center p-8 border rounded-lg">
                        <p className="text-muted-foreground">No hay categorías registradas.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}