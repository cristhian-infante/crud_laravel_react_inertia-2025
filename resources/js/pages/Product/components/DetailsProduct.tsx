import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import producturl from '@/routes/product';

// Define la interfaz para el producto
interface ProductDetail {
    id: number;
    category_id: number;
    sku: string;
    codBarras: string;
    nombre: string;
    descripcion: string;
    marca: string;
    stockMin: number;
    ubicacion: string;
    estado: string;
    proveedor_id: number;
    stock: number;
    precio: number;
    costo: number;
    imagen: string;
    created_at: string;
    updated_at: string;
    category_name: string;
    proveedor_nombre?: string;
    proveedor_contacto?: string;
    proveedor_telefono?: string;
    proveedor_email?: string;
}

export default function DetailsProduct() {
    const { detailProduct } = usePage().props;
    const product = detailProduct as ProductDetail;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Panel de control',
            href: dashboard().url,
        },
        {
            title: 'Productos',
            href: producturl.index().url,
        },
        {
            title: product?.nombre || 'Detalle del Producto',
            href: '#',
        },
    ];

    if (!product) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Producto no encontrado" />
                <div className="container mx-auto p-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Producto no encontrado</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">El producto que buscas no existe.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detalle - ${product.nombre}`} />
            
            <div className="container mx-auto p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        {/* Columna izquierda - Imagen */}
                        <div>
                            <img 
                                src={product.imagen || '/images/placeholder.jpg'} 
                                alt={product.nombre}
                                className="w-full h-80 object-cover rounded-lg"
                            />
                        </div>

                        {/* Columna derecha - Información */}
                        <div className="space-y-6">
                            {/* Información básica */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.nombre}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                        {product.marca}
                                    </span>
                                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                                        {product.category_name}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        product.estado === 'activo' 
                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                    }`}>
                                        {product.estado}
                                    </span>
                                </div>
                            </div>

                            {/* Códigos */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">SKU</label>
                                    <p className="text-lg font-mono text-gray-900 dark:text-white">{product.sku}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Código de Barras</label>
                                    <p className="text-lg font-mono text-gray-900 dark:text-white">{product.codBarras}</p>
                                </div>
                            </div>

                            {/* Precios */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Precio de Venta</label>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        S/. {Number(product.precio).toLocaleString('es-PE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Costo</label>
                                    <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                                        {product.costo ? `S/. ${Number(product.costo).toLocaleString('es-PE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}` : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Stock Actual</label>
                                    <p className={`text-xl font-bold ${
                                        product.stock <= product.stockMin 
                                            ? 'text-red-600 dark:text-red-400' 
                                            : 'text-green-600 dark:text-green-400'
                                    }`}>
                                        {product.stock} unidades
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Stock Mínimo</label>
                                    <p className="text-lg text-gray-900 dark:text-white">{product.stockMin} unidades</p>
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Ubicación en Bodega</label>
                                <p className="text-lg text-gray-900 dark:text-white">{product.ubicacion}</p>
                            </div>

                            {/* Proveedor */}
                            {product.proveedor_nombre && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Proveedor</label>
                                    <p className="text-lg text-gray-900 dark:text-white">{product.proveedor_nombre}</p>
                                    {product.proveedor_contacto && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Contacto: {product.proveedor_contacto}</p>
                                    )}
                                    {product.proveedor_telefono && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono: {product.proveedor_telefono}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Descripción del Producto</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {product.descripcion || 'No hay descripción disponible para este producto.'}
                        </p>
                    </div>

                    {/* Fechas */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Creado</label>
                                <p className="text-gray-900 dark:text-white">{new Date(product.created_at).toLocaleDateString('es-PE')}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Actualizado</label>
                                <p className="text-gray-900 dark:text-white">{new Date(product.updated_at).toLocaleDateString('es-PE')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}