"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Link, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SheetProductEdit } from "./SheetProductEdit"
import { router } from '@inertiajs/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// =============================================================================
// INTERFACES Y TIPOS
// =============================================================================

export interface Product {
    id: number; 
    sku: string;
    name: string;  
    description?: string;
    brand_name: string; 
    stock_min: number; 
    stock_total: number; 
    price: number; 
    cost?: number;
    image?: string; 
    status: string; 
    category_name: string; 
    supplier_name?: string; 
    branch_name?: string; 
    ubicacion?: string;
    location_code?: string;
    aisle?: string;
    rack?: string;
    shelf?: string;
    position?: string;
    
    // Campos calculados del backend
    formatted_price?: string;
    stock_status?: string;
}

interface Branch {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    branch_id: number;
}

interface DataTableProductsProps {
  products: Product[];
  branchs: Branch[];
  user: User;
  onProductChange?: (products: Product[]) => void;
}

// =============================================================================
// COMPONENTE VISTA MÓVIL
// =============================================================================

function MobileProductView({ table, onEdit }: { table: any; onEdit: (product: Product) => void }) {
  const handleViewDetails = (sku:string)=>{
    router.visit(`/product/${sku}`);
  }
  return (    
      <div className="space-y-3 md:hidden">
          {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                
                  <div
                      key={row.id}
                      className="space-y-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                  >
                      {/*  CONTENEDOR PRINCIPAL REORGANIZADO */}
                      <div className="flex items-start gap-3">
                          {/* Checkbox de selección */}
                          <Checkbox
                              checked={row.getIsSelected()}
                              onCheckedChange={(value) =>
                                  row.toggleSelected(!!value)
                              }
                              aria-label="Select row"
                          />
                          
                          {/* Código del producto pegado a la izquierda */}
                          <div className="flex-1">
                              <h3 className="text-lg font-semibold text-left">
                                  {row.getValue('sku')}
                              </h3>                                   
                          </div>

                          {/* Dropdown de acciones */}
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                  >
                                      <span className="sr-only">
                                          Abrir Menú
                                      </span>
                                      <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                      Acciones
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleViewDetails(row.original.sku)}>
                                      Detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                      onClick={() => onEdit(row.original)}
                                  >
                                      Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                      Eliminar
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Header con nombre y categoría */}
                      <div className="text-left">
                          <h3 className="text-lg font-semibold">
                              {row.getValue('name')}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">
                                  {row.getValue('category_name')}
                              </span>
                              {row.original.branch_name && (
                                  <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                      {row.original.branch_name}
                                  </span>
                              )}
                          </div>
                      </div>

                      {/* Información del producto */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                              <p className="font-medium text-muted-foreground">
                                  Precio
                              </p>
                              <p className="font-bold text-green-600 dark:text-green-400">
                                  {row.original.formatted_price || `S/. ${Number(row.getValue('price')).toLocaleString('es-PE', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                  })}`}
                              </p>
                          </div>
                          <div className="space-y-1">
                              <p className="font-medium text-muted-foreground">
                                  Stock
                              </p>
                              <p className="font-semibold">
                                  {Number(row.getValue('stock_total')).toLocaleString()}{' '}
                                  unidades
                              </p>
                              {row.original.stock_status && (
                                  <p className={`text-xs ${
                                      row.original.stock_status === 'low' ? 'text-red-500' : 
                                      row.original.stock_status === 'out' ? 'text-red-700' : 
                                      'text-green-500'
                                  }`}>
                                      {row.original.stock_status === 'low' ? 'Stock bajo' : 
                                       row.original.stock_status === 'out' ? 'Sin stock' : 
                                       'Stock normal'}
                                  </p>
                              )}
                          </div>
                      </div>

                      {/* Ubicación */}
                      {row.original.ubicacion && (
                          <div className="text-sm">
                              <p className="font-medium text-muted-foreground">Ubicación</p>
                              <p className="font-semibold">{row.original.ubicacion}</p>
                          </div>
                      )}
                  </div>
              ))
          ) : (
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                  <p className="text-muted-foreground">
                      No hay productos encontrados.
                  </p>
              </div>
          )}
      </div>
  );
}

// =============================================================================
// COMPONENTE VISTA DESKTOP
// =============================================================================

function DesktopProductView({ table, onEdit }: { table: any; onEdit: (product: Product) => void }) {
  return (
    <div className="hidden md:block overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                No hay Resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// =============================================================================
// COLUMNAS
// =============================================================================

export const getColumns = (onEdit: (product: Product) => void): ColumnDef<Product>[] => [
  //checkbox - id
  {
    id: "select",
    header: ({table}) =>(
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  //SKU
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono">{row.getValue("sku")}</div>,
  },
  //Nombre Producto
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Producto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  //Marca
  {
    accessorKey: "brand_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Marca
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("brand_name")}</div>,
  },
  //Categoría
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoría
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary inline-block">
        {row.getValue("category_name")}
      </div>
    ),
  },
  //Sucursal
  {
    accessorKey: "branch_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sucursal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-sm">
        {row.getValue("branch_name") || "N/A"}
      </div>
    ),
  },
  //Ubicación
  {
    accessorKey: "ubicacion",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ubicación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-sm">{row.getValue("ubicacion") || "N/A"}</div>,
  },
  //Stock
  {
    accessorKey: "stock_total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = Number(row.getValue("stock_total"));
      const stockMin = row.original.stock_min || 0;
      const isLowStock = stock <= stockMin;
      const isOutOfStock = stock === 0;
      
      return (
        <div className={`font-semibold ${
          isOutOfStock ? 'text-red-700' : 
          isLowStock ? 'text-red-600' : 'text-green-600'
        }`}>
          {stock.toLocaleString()} Unidades
          {isLowStock && !isOutOfStock && <span className="text-xs text-red-500 block">Stock bajo</span>}
          {isOutOfStock && <span className="text-xs text-red-700 block">Sin stock</span>}
        </div>
      );
    },
  },
  //Stock Mínimo
  {
    accessorKey: "stock_min",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock Mín.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{Number(row.getValue("stock_min")).toLocaleString()}</div>,
  },
  //Precio
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-bold text-green-600">
        {row.original.formatted_price || `S/. ${Number(row.getValue("price")).toLocaleString('es-PE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`}
      </div>
    ),
  },
  //Costo
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Costo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const costo = row.getValue("cost");
      return (
        <div className="text-orange-600">
          {costo ? `S/. ${Number(costo).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}` : "N/A"}
        </div>
      );
    },
  },
  //Estado
{
  accessorKey: "status",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Estado
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  cell: ({ row }) => {
    const status = row.getValue("status");
    
    // ✅ Función segura para obtener estilos
    const getStatusStyles = (status: any) => {
      const statusStr = String(status).toLowerCase();
      
      switch (statusStr) {
        case 'active':
        case 'activo':
        case '1':
        case 'true':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'inactive':
        case 'inactivo':
        case '0':
        case 'false':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'discontinued':
        case 'descontinuado':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-blue-100 text-blue-800 border-blue-200';
      }
    };
    
    // ✅ Función segura para obtener texto
    const getStatusText = (status: any) => {
      if (status === null || status === undefined) return 'Desconocido';
      
      const statusStr = String(status).toLowerCase();
      
      switch (statusStr) {
        case 'active':
        case 'activo':
        case '1':
        case 'true':
          return 'Activo';
        case 'inactive':
        case 'inactivo':
        case '0':
        case 'false':
          return 'Inactivo';
        case 'discontinued':
        case 'descontinuado':
          return 'Descontinuado';
        default:
          return String(status).charAt(0).toUpperCase() + String(status).slice(1);
      }
    };
    
    return (
      <div className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusStyles(status)}`}>
        {getStatusText(status)}
      </div>
    );
  },
},
  //Acciones
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

      const handleViewDetails = () => {
            router.visit(`/product/${product.sku}`);
        };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir Menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewDetails}>
                        Detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(product)}>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function DataTableProductos({ products, branchs, user, onProductChange }: DataTableProductsProps){
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [isMobile, setIsMobile] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    
    // ✅ Estado para la sucursal seleccionada
    const [selectedBranch, setSelectedBranch] = React.useState<number>(() => {
        if (user?.branch_id && branchs?.length > 0) {
            return user.branch_id;
        }
        if (branchs?.length > 0) {
            return branchs[0].id;
        }
        return 0;
    });

    // ✅ Filtrar productos por sucursal (basado en branch_name)
    const filteredProducts = React.useMemo(() => {
        if (!products) return [];
        
        if (selectedBranch === 0) {
            return products; // Mostrar todos los productos
        }
        
        const selectedBranchData = branchs?.find(branch => branch.id === selectedBranch);
        if (!selectedBranchData) return products;
        
        return products.filter(product => product.branch_name === selectedBranchData.name);
    }, [products, selectedBranch, branchs]);

    // Detectar si es móvil
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsSheetOpen(true);
    };

    const handleSaveProduct = (updatedProduct: Product) => {
        const updatedProducts = products.map(p => 
            p.id === updatedProduct.id ? updatedProduct : p
        );
        
        if (onProductChange) {
            onProductChange(updatedProducts);
        }
        
        setIsSheetOpen(false);
        setEditingProduct(null);
    };

    const handleBranchChange = (branchId: string) => {
        const branchIdNumber = Number(branchId);
        setSelectedBranch(branchIdNumber);
    };

    // Encontrar la sucursal actual del usuario
    const currentUserBranch = branchs?.find(branch => branch.id === selectedBranch);

    // ✅ Contador de productos TOTALES por sucursal (sin filtros de búsqueda)
    const getTotalProductCountByBranch = (branchId: number) => {
        if (!products) return 0;
        if (branchId === 0) return products.length;
        
        const branchData = branchs?.find(branch => branch.id === branchId);
        if (!branchData) return 0;
        
        return products.filter(product => product.branch_name === branchData.name).length;
    };

    // ✅ Contador de productos FILTRADOS por búsqueda por sucursal
    const getFilteredProductCountByBranch = (branchId: number) => {
        if (!products) return 0;
        
        // Obtener los filtros actuales de búsqueda
        const skuFilter = table.getColumn('sku')?.getFilterValue() as string || '';
        const nameFilter = table.getColumn('name')?.getFilterValue() as string || '';
        
        let filtered = products;
        
        // Aplicar filtro de sucursal
        if (branchId !== 0) {
            const branchData = branchs?.find(branch => branch.id === branchId);
            if (branchData) {
                filtered = filtered.filter(product => product.branch_name === branchData.name);
            }
        }
        
        // Aplicar filtros de búsqueda
        if (skuFilter) {
            filtered = filtered.filter(product => 
                product.sku.toLowerCase().includes(skuFilter.toLowerCase())
            );
        }
        
        if (nameFilter) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }
        
        return filtered.length;
    };

    const table = useReactTable({
        data: filteredProducts, // ✅ Usar productos filtrados
        columns: getColumns(handleEdit),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full space-y-4">
            {/* Header con filtros y controles */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Input
                        placeholder="SKU Producto..."
                        value={(table.getColumn('sku')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('sku')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    <Input
                        placeholder="Nombre de Producto..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    /> 
                    
                    {/*  Select de Sucursales con formato (coincidencias/total) */}
                    <Select value={selectedBranch.toString()} onValueChange={handleBranchChange} >
                        <SelectTrigger className="max-w-sm">
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    {currentUserBranch ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            {currentUserBranch.name}
                                            <span className="text-xs text-gray-500 ml-auto">
                                                ({getFilteredProductCountByBranch(selectedBranch)}/{getTotalProductCountByBranch(selectedBranch)})
                                            </span>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Todas las sucursales
                                            <span className="text-xs text-gray-500 ml-auto">
                                                ({getFilteredProductCountByBranch(0)}/{getTotalProductCountByBranch(0)})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sucursales</SelectLabel>
                                
                                {/* Opción para mostrar todos los productos */}
                                <SelectItem value="0">
                                    <div className="flex justify-between items-center w-full">
                                        <span>Todas las sucursales</span>
                                        <span className="text-xs text-gray-500">
                                            ({getFilteredProductCountByBranch(0)}/{getTotalProductCountByBranch(0)})
                                        </span>
                                    </div>
                                </SelectItem>
                                
                                {branchs?.map((branch) => (
                                    <SelectItem key={branch.id} value={branch.id.toString()}>
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${branch.id === user?.branch_id ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                                {branch.name}
                                                {branch.id === user?.branch_id && (
                                                    <span className="text-xs text-blue-600">(Actual)</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                ({getFilteredProductCountByBranch(branch.id)}/{getTotalProductCountByBranch(branch.id)})
                                            </span>
                                        </div>
                                    </SelectItem>
                                )) || <SelectItem value="0">No hay sucursales</SelectItem>}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>                
                
                {/* Dropdown para mostrar/ocultar columnas (solo desktop) */}
                {!isMobile && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columna <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id === 'sku' && 'SKU'}
                                            {column.id === 'name' && 'Producto'}
                                            {column.id === 'brand_name' && 'Marca'}
                                            {column.id === 'category_name' && 'Categoría'}
                                            {column.id === 'branch_name' && 'Sucursal'}
                                            {column.id === 'ubicacion' && 'Ubicación'}
                                            {column.id === 'stock_total' && 'Stock'}
                                            {column.id === 'stock_min' && 'Stock Mín.'}
                                            {column.id === 'price' && 'Precio'}
                                            {column.id === 'cost' && 'Costo'}
                                            {column.id === 'status' && 'Estado'}
                                            {column.id === 'actions' && 'Acciones'}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Vistas separadas por dispositivo */}
            <MobileProductView table={table} onEdit={handleEdit} />
            <DesktopProductView table={table} onEdit={handleEdit} />

            {/* Paginación compartida */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{' '}
                    {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                    {selectedBranch !== 0 && (
                        <span className="text-blue-600 ml-2">
                            (Sucursal: {currentUserBranch?.name})
                        </span>
                    )}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
            {editingProduct && (
                <SheetProductEdit
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                />
            )}
        </div>
    );
}