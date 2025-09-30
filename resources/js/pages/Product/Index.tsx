import AppLayout from '@/layouts/app-layout';
import product from '@/routes/product';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DataTableProductos from './components/DataTableProductos';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Productos',
        href: product.index().url,
    },
];

interface Product {
    idProduct: number;
    idCategory: number;
    nameProduct: string;
    stockProduct: number;
    priceProduct: number;
    nameCategory: string; 
}

interface PageProps{
    products : Product[];
    flash?: {
        success?: string;
        error?: string;
    }
}

export default function Index({products}: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />
            <div className="m-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Gestión de Productos
                    </h1>
                </div>

                {products.length > 0 ? (
                    <DataTableProductos products={products} />
                ) : (
                    <div className="rounded-lg border p-8 text-center">
                        <p className="text-muted-foreground">
                            No hay Productos registrados.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
