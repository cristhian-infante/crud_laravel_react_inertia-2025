import AppLayout from '@/layouts/app-layout';
import product from '@/routes/product';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react'; // Agregar usePage
import DataTableProductos from './components/DataTableProductos';
import { Button } from '@headlessui/react';
import { ModalProductCreate } from './components/ModalProductCreate';
import { useState } from 'react';

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
    sku: string;
    codBarras: string;
    descripcion?: string;
    marca: string;
    stockMin: number;
    ubicacion?: string;
    estado: 'activo' | 'inactivo' | 'descontinuado';
    proveedor_id?: number;
    stockProduct: number;
    priceProduct: number;
    costo?: number;
    imagen?: string;
    nameCategory: string;
    created_at?: string;
    updated_at?: string;
}

interface Branch {
    id: number;
    name: string;
}

interface Supplier{
    id: number
    name:string
    contact_email: string
    phone: string
    address: string
    status: boolean
}

interface User {
    id: number;
    name: string;
    email: string;
    branch_id: number; 
}

interface Category{
  id: number
  code: string
  name: string
  status: boolean
}

interface PageProps {
    products: Product[];
    branchs: Branch[];
    categoriesBD: Category[];
    supplierDB: Supplier[];
    auth: { 
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ products, branchs, categoriesBD, supplierDB }: PageProps) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    
    // ✅ Obtener el usuario autenticado desde usePage
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleCreateProduct = (newProduct: Omit<Product, 'idProduct'>) => {
        setCreateModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />
            <div className="m-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Gestión de Productos
                    </h1>
                    <Button 
                        onClick={() => setCreateModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Nuevo Producto
                    </Button>                    
                </div>
                
                <ModalProductCreate 
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    onSave={handleCreateProduct}
                    branchs={branchs}
                    categories={categoriesBD}
                    suppliers={supplierDB}
                />

                {products.length > 0 ? (
                    <DataTableProductos 
                        products={products} 
                        branchs={branchs} 
                        user={user} // ✅ Pasar el usuario al DataTable
                    />
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