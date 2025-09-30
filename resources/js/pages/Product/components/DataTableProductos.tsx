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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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

// =============================================================================
// INTERFACES Y TIPOS
// =============================================================================

interface Product {
    idProduct: number;
    idCategory: number;
    nameProduct: string;
    stockProduct: number;
    priceProduct: number;
    nameCategory: string;
}

interface DataTableProductsProps {
  products: Product[]
  onProductChange?: (products: Product[]) => void
}

// =============================================================================
// COMPONENTE VISTA MÓVIL
// =============================================================================

// function MobileProductView({ table, onEdit }: { table: any; onEdit: (product: Product) => void }) {
//   return (
//     <div className="space-y-3 md:hidden">
//       {table.getRowModel().rows?.length ? (
//         table.getRowModel().rows.map((row: any) => (
//           <div key={row.id} className="border rounded-lg p-4 space-y-3 bg-card text-card-foreground shadow-sm">
//             {/* Header con nombre y categoría */}
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <h3 className="font-semibold text-lg">
//                   {row.getValue("nameProduct")}
//                 </h3>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
//                     {row.getValue("nameCategory")}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Información del producto */}
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div className="space-y-1">
//                 <p className="text-muted-foreground font-medium">Precio</p>
//                 <p className="font-bold text-green-600 dark:text-green-400">
//                   S/. {Number(row.getValue("priceProduct")).toLocaleString()}.00
//                 </p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-muted-foreground font-medium">Stock</p>
//                 <p className="font-semibold">
//                   {Number(row.getValue("stockProduct")).toLocaleString()} unidades
//                 </p>
//               </div>
//             </div>

//             {/* Acciones */}
//             <div className="flex justify-end gap-2 pt-2 border-t border-border">
//               <Button variant="outline" size="sm" className="text-xs" onClick={() => onEdit(row.original)}>
//                 Editar
//               </Button>
//               <Button variant="outline" size="sm" className="text-xs text-destructive border-destructive/20 hover:bg-destructive/10">
//                 Eliminar
//               </Button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center p-8 border rounded-lg bg-muted/50">
//           <p className="text-muted-foreground">No hay productos encontrados.</p>
//         </div>
//       )}
//     </div>
//   )
// }
function MobileProductView({ table, onEdit }: { table: any; onEdit: (product: Product) => void }) {
  return (
    <div className="space-y-3 md:hidden">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: any) => (
          <div key={row.id} className="border rounded-lg p-4 space-y-3 bg-card text-card-foreground shadow-sm">
            {/* ✅ AGREGA: Checkbox de selección */}
            <div className="flex justify-between items-start">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
              
              {/* Dropdown de acciones */}
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
                  <DropdownMenuItem onClick={() => onEdit(row.original)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          <DropdownMenuSeparator/>
            {/* Header con nombre y categoría */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {row.getValue("nameProduct")}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
                    {row.getValue("nameCategory")}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del producto */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium">Precio</p>
                <p className="font-bold text-green-600 dark:text-green-400">
                  S/. {Number(row.getValue("priceProduct")).toLocaleString()}.00
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium">Stock</p>
                <p className="font-semibold">
                  {Number(row.getValue("stockProduct")).toLocaleString()} unidades
                </p>
              </div>
            </div>

            {/* Acciones (opcionales - ya tenemos el dropdown) */}
            {/* <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => onEdit(row.original)}>
                Editar
              </Button>
              <Button variant="outline" size="sm" className="text-xs text-destructive border-destructive/20 hover:bg-destructive/10">
                Eliminar
              </Button>
            </div> */}
          </div>
        ))
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No hay productos encontrados.</p>
        </div>
      )}
    </div>
  )
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
  //Categoría
  {
    accessorKey: "nameCategory",
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
    cell: ({ row }) => <div>{row.getValue("nameCategory")}</div>,
  },
  //Nombre Producto
  {
    accessorKey: "nameProduct",
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
    cell: ({ row }) => <div>{row.getValue("nameProduct")}</div>,
  },
  //Stock
  {
    accessorKey: "stockProduct",
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
    cell: ({ row }) => (
      <div>{Number(row.getValue("stockProduct")).toLocaleString()} Unidades</div>
    ),
  },
  //Precio
  {
    accessorKey: "priceProduct",
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
      <div>S/. {Number(row.getValue("priceProduct")).toLocaleString()}.00</div>
    ),
  },
  //Acciones
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

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

export default function DataTableProductos({products, onProductChange}: DataTableProductsProps){
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [isMobile, setIsMobile] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

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
        // Actualizar el producto en la lista
        const updatedProducts = products.map(p => 
            p.idProduct === updatedProduct.idProduct ? updatedProduct : p
        );
        
        // Llamar al callback si existe
        if (onProductChange) {
            onProductChange(updatedProducts);
        }
        
        setIsSheetOpen(false);
        setEditingProduct(null);
    };

    const table = useReactTable({
        data: products,
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
                        placeholder="Nombre de Producto"
                        value={
                            (table.getColumn('nameProduct')?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('nameProduct')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />              
                    <Input
                        placeholder="Categorías"
                        value={
                            (table.getColumn('nameCategory')?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('nameCategory')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                
                {/* Dropdown para mostrar/ocultar columnas (solo desktop) */}
                {!isMobile && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columnas <ChevronDown className="ml-2 h-4 w-4" />
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
                                            {column.id === 'nameProduct' && 'Producto'}
                                            {column.id === 'nameCategory' && 'Categoría'}
                                            {column.id === 'stockProduct' && 'Stock'}
                                            {column.id === 'priceProduct' && 'Precio'}
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