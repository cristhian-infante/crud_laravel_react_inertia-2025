import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import brands from '@/routes/brands';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import DataTableBrands from './components/DataTableBrands';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Marcas',
        href: brands.index().url,
    },
    
];

interface Brand{
    id: number
    name: string
    status: string
}

interface PageProps{
    brands: Brand[];
    flash?: {
        success?: string
        error?: string
    }
}

export default function Index({brands}:PageProps) {
    const {flash} = usePage<PageProps>().props;
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
            <Head title="Marcas | Lista" />
            <div className="m-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Gestión de Marcas
                    </h1>
                    {/* <ModalCrear /> */}
                </div>

                {brands.length > 0 ? (
                    <DataTableBrands brands={brands} />
                ) : (
                    <div className="rounded-lg border p-8 text-center">
                        <p className="text-muted-foreground">
                            No hay Marcas registradas.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
