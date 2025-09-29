import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import category from '@/routes/category';
import ModalCrear from './ModalCrear';
import DataTableCategorias from './DataTableCategorias';
import { useEffect } from 'react';
import { toast } from 'sonner';

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

interface PageProps {
    categories: Category[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ categories }: PageProps) {
    const { flash } = usePage<PageProps>().props;

    // Manejar flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias | Lista" />
            <div className="m-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
                    <ModalCrear />
                </div>
                
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