import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import category from '@/routes/category';
import ModalCrear from './ModalCrear';
import TablaCategorias from './TablaCategorias'; 

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias',
        href: category.index().url,
    },
];

interface Category {
    id: number;
    nameCategory: string;
}

export default function Index({ categories }: { categories: Category[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias | Lista" />
            <div className="m-4">
                <ModalCrear />
                {categories.length > 0 && (
                    <TablaCategorias categories={categories} />
                )}
            </div>
        </AppLayout>
    );
}