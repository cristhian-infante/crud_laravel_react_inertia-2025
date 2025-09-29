// "use client"

// import * as React from "react"
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table"
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import ModalEditar from "./ModalEditar"

// interface Category {
//   id: number
//   CodCategory: string
//   nameCategory: string
// }

// interface DataTableCategoriasProps {
//   categories: Category[]
// }

// // Componente para las celdas de acciones
// const ActionsCell = ({ row }: { row: any }) => {
//   const category = row.original;
//   const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

//   const handleDelete = () => {
    
//     setIsDeleteDialogOpen(false);
//   };

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Abrir menú</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Acciones</DropdownMenuLabel>
//           {/* <DropdownMenuItem
//             onClick={() => navigator.clipboard.writeText(category.id.toString())}
//           >
//             Copiar ID
//           </DropdownMenuItem> */}
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
//             Editar
//           </DropdownMenuItem>
          
//           {/* Trigger para el diálogo de eliminación */}
//           <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//             <AlertDialogTrigger asChild>
//               <DropdownMenuItem 
//                 className="text-red-600 focus:text-red-600"
//                 onSelect={(e) => e.preventDefault()}
//               >
//                 Eliminar
//               </DropdownMenuItem>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   Esta acción no se puede deshacer. Esto eliminará permanentemente
//                   la categoría "{category.nameCategory}" y todos sus datos asociados.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
//                 <AlertDialogAction 
//                   onClick={handleDelete}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   Eliminar
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Modal de edición */}
//       <ModalEditar 
//         category={category} 
//         isOpen={isEditModalOpen} 
//         onOpenChange={setIsEditModalOpen} 
//       />
//     </>
//   );
// };

// export const columns: ColumnDef<Category>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   // {
//   //   accessorKey: "id",
//   //   header: ({ column }) => {
//   //     return (
//   //       <Button
//   //         variant="ghost"
//   //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//   //       >
//   //         ID
//   //         <ArrowUpDown className="ml-2 h-4 w-4" />
//   //       </Button>
//   //     )
//   //   },
//   //   cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
//   // },
//   {
//     accessorKey: "codCategory",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Código Categoría
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div>{row.getValue("codCategory")}</div>,
//   },
//   {
//     accessorKey: "nameCategory",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Nombre Categoría
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div>{row.getValue("nameCategory")}</div>,
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ActionsCell,
//   },
// ]

// export default function DataTableCategorias({ categories }: DataTableCategoriasProps) {
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [rowSelection, setRowSelection] = React.useState({})

//   const table = useReactTable({
//     data: categories,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   })

//   return (
//     <div className="w-full">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Filtrar categorías..."
//           value={(table.getColumn("nameCategory")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("nameCategory")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columnas <ChevronDown className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => {
//                 return (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     className="capitalize"
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) =>
//                       column.toggleVisibility(!!value)
//                     }
//                   >
//                     {column.id === "nameCategory" ? "Nombre" : column.id}
//                   </DropdownMenuCheckboxItem>
//                 )
//               })}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   )
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No se encontraron categorías.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} de{" "}
//           {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Anterior
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Siguiente
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }


////////////
"use client"

import * as React from "react"
import { router } from '@inertiajs/react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ModalEditar from "./ModalEditar"

// =============================================================================
// INTERFACES Y TIPOS
// =============================================================================

interface Category {
  id: number
  CodCategory: string
  nameCategory: string
}

interface DataTableCategoriasProps {
  categories: Category[]
}

// =============================================================================
// COMPONENTE ACTIONS CELL (CELDAS DE ACCIONES)
// =============================================================================

interface ActionsCellProps {
  row: any
  onDelete: (id: number) => Promise<{ success: boolean; error?: string }>
}

const ActionsCell = ({ row, onDelete }: ActionsCellProps) => {
  const category = row.original;
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    const result = await onDelete(category.id);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
    }
    
    setIsDeleting(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsEditModalOpen(true)} 
            disabled={isDeleting}
          >
            Editar
          </DropdownMenuItem>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDialogOpenChange}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onSelect={(e) => e.preventDefault()}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente
                  la categoría "{category.nameCategory}" y todos sus datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalEditar 
        category={category} 
        isOpen={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
      />
    </>
  );
};

// =============================================================================
// COMPONENTE PRINCIPAL DATATABLECATEGORIAS
// =============================================================================

export default function DataTableCategorias({ categories }: DataTableCategoriasProps) {
  // ===========================================================================
  // ESTADOS
  // ===========================================================================
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Category[]>(categories)
  const [isLoading, setIsLoading] = React.useState(false)

  // ===========================================================================
  // FUNCIONES DE MANEJO DE DATOS CON INERTIA
  // ===========================================================================

  /**
   * Maneja la eliminación usando Inertia router.delete
   * Esta es la forma CORRECTA con Inertia
   */
  const handleDeleteCategory = async (id: number): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      router.delete(`/categories/${id}`, {
        // Opciones de Inertia
        preserveScroll: true,
        preserveState: false,
        
        onBefore: () => {
          setIsLoading(true);
        },
        
        onSuccess: (page) => {
          // Inertia automáticamente recarga la página con los datos actualizados
          // Pero también podemos actualizar localmente para mejor UX
          setData(prev => prev.filter(category => category.id !== id));
          
          // Mostrar toast de éxito
          toast.success('Categoría eliminada exitosamente');
          resolve({ success: true });
        },
        
        onError: (errors) => {
          // Manejar errores específicos
          let errorMessage = 'Error al eliminar la categoría';
          
          if (errors.message) {
            errorMessage = errors.message;
          } else if (typeof errors === 'string') {
            errorMessage = errors;
          }
          
          toast.error(errorMessage);
          resolve({ success: false, error: errorMessage });
        },
        
        onFinish: () => {
          setIsLoading(false);
        }
      });
    });
  }

  /**
   * Versión optimista con Inertia
   */
  const handleDeleteCategoryOptimistic = async (id: number): Promise<{ success: boolean; error?: string }> => {
    // Guardar estado anterior para rollback
    const previousData = [...data];
    
    // Eliminación optimista - actualizar UI inmediatamente
    setData(prev => prev.filter(category => category.id !== id));
    
    const toastId = toast.loading('Eliminando categoría...');
    
    return new Promise((resolve) => {
      router.delete(`/categories/${id}`, {
        preserveScroll: true,
        
        onSuccess: () => {
          toast.success('Categoría eliminada exitosamente', { id: toastId });
          resolve({ success: true });
        },
        
        onError: (errors) => {
          // Rollback en caso de error
          setData(previousData);
          
          const errorMessage = errors.message || 'Error al eliminar la categoría';
          toast.error(errorMessage, { id: toastId });
          resolve({ success: false, error: errorMessage });
        }
      });
    });
  }

  // ===========================================================================
  // CONFIGURACIÓN DE COLUMNAS
  // ===========================================================================

  const columnsWithActions = React.useMemo<ColumnDef<Category>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
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
    {
      accessorKey: "codCategory",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Código Categoría
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("codCategory")}</div>,
    },
    {
      accessorKey: "nameCategory",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre Categoría
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("nameCategory")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell 
          row={row} 
          onDelete={handleDeleteCategoryOptimistic} // Usar la versión optimista
        />
      ),
    },
  ], [])

  // ===========================================================================
  // CONFIGURACIÓN DE LA TABLA
  // ===========================================================================

  const table = useReactTable({
    data: data,
    columns: columnsWithActions,
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
  })

  // ===========================================================================
  // RENDERIZADO
  // ===========================================================================

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        
        <Input
          placeholder="Filtrar por nombre de categoría..."
          value={(table.getColumn("nameCategory")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nameCategory")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={isLoading}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" disabled={isLoading}>
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "nameCategory" ? "Nombre" : 
                     column.id === "codCategory" ? "Código" : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center"
                >
                  No se encontraron categorías.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}