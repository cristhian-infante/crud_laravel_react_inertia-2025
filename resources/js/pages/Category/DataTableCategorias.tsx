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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react"

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
  codCategory: string
  nameCategory: string
}

interface DataTableCategoriasProps {
  categories: Category[]
  onCategoryChange?: () => void // Callback opcional para notificar cambios
}

// =============================================================================
// COMPONENTE PARA ELIMINACIÓN MASIVA
// =============================================================================

const BulkActions = ({ table, onDeleteMultiple }: { 
  table: any
  onDeleteMultiple: (ids: number[]) => Promise<{ success: boolean; error?: string }>
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const handleDeleteMultiple = async () => {
    if (selectedCount === 0) return;
    
    setIsDeleting(true);
    const selectedIds = selectedRows.map(row => row.original.id);
    await onDeleteMultiple(selectedIds);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    table.toggleAllPageRowsSelected(false);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1 text-sm">
        <span className="font-medium">{selectedCount}</span> categoría(s) seleccionada(s)
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Eliminando...' : `Eliminar (${selectedCount})`}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {selectedCount} categoría(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción moverá {selectedCount} categoría(s) a la papelera. 
              Podrás restaurarlas posteriormente si es necesario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMultiple}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : `Eliminar ${selectedCount} categoría(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.toggleAllPageRowsSelected(false)}
        disabled={isDeleting}
      >
        Deseleccionar
      </Button>
    </div>
  );
};

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
// COMPONENTE PARA VERSIÓN MÓVIL
// =============================================================================

const MobileCategoryCard = ({ 
  category, 
  onDelete 
}: { 
  category: Category
  onDelete: (id: number) => Promise<{ success: boolean; error?: string }>
}) => {
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

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold text-base">{category.nameCategory}</h3>
          <p className="text-sm text-muted-foreground">Código: {category.codCategory}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            disabled={isDeleting}
          >
            <span className="sr-only">Editar</span>
            Editar
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
              >
                <span className="sr-only">Eliminar</span>
                {isDeleting ? '...' : 'Eliminar'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción moverá la categoría "{category.nameCategory}" a la papelera.
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
        </div>
      </div>
      
      {isDeleting && (
        <div className="text-xs text-muted-foreground">
          Eliminando...
        </div>
      )}

      <ModalEditar 
        category={category} 
        isOpen={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
      />
    </div>
  );
};

// =============================================================================
// COMPONENTE PRINCIPAL DATATABLECATEGORIAS
// =============================================================================

export default function DataTableCategorias({ categories, onCategoryChange }: DataTableCategoriasProps) {
  // ===========================================================================
  // ESTADOS
  // ===========================================================================
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Category[]>(categories)
  const [isLoading, setIsLoading] = React.useState(false)

  // Escuchar cambios en las categorías desde las props
  React.useEffect(() => {
    setData(categories);
  }, [categories]);

  // ===========================================================================
  // FUNCIONES DE MANEJO DE DATOS CON INERTIA - SIMPLIFICADAS
  // ===========================================================================

  /**
   * Eliminación individual - Versión simplificada
   */
  const handleDeleteCategoryOptimistic = async (id: number): Promise<{ success: boolean; error?: string }> => {
    const previousData = [...data];
    
    // Eliminación optimista
    setData(prev => prev.filter(category => category.id !== id));
    
    try {
      await router.delete(`/categories/${id}`, {
        preserveScroll: true,
        preserveState: false,
      });
      
      // Notificar al componente padre si es necesario
      if (onCategoryChange) {
        onCategoryChange();
      }
      
      return { success: true };
    } catch (error) {
      // Rollback en caso de error
      setData(previousData);
      return { success: false, error: 'Error al eliminar la categoría' };
    }
  }

  /**
   * Eliminación masiva - Versión simplificada
   */
  const handleDeleteMultipleCategories = async (ids: number[]): Promise<{ success: boolean; error?: string }> => {
    if (ids.length === 0) {
      return { success: false, error: 'No hay categorías seleccionadas' };
    }

    const previousData = [...data];
    
    // Eliminación optimista
    setData(prev => prev.filter(category => !ids.includes(category.id)));
    
    try {
      await router.post('/categories/bulk-delete', { 
        ids: ids 
      }, {
        preserveScroll: true,
        preserveState: false,
      });
      
      // Limpiar selección
      table.toggleAllPageRowsSelected(false);
      
      // Notificar al componente padre si es necesario
      if (onCategoryChange) {
        onCategoryChange();
      }
      
      return { success: true };
    } catch (error) {
      // Rollback en caso de error
      setData(previousData);
      return { success: false, error: 'Error al eliminar las categorías' };
    }
  };

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
          onDelete={handleDeleteCategoryOptimistic}
        />
      ),
    },
  ], []) // Removí las dependencias ya que las funciones están definidas dentro del componente

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
    <div className="w-full space-y-4">
      {/* Bulk Actions */}
      <BulkActions 
        table={table}
        onDeleteMultiple={handleDeleteMultipleCategories}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Filtrar por nombre..."
            value={(table.getColumn("nameCategory")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nameCategory")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={isLoading}
          />
          
          <Input
            placeholder="Filtrar por código..."
            value={(table.getColumn("codCategory")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("codCategory")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={isLoading}
          />
        </div>
        
        {/* Selector de columnas */}
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

      {/* Para desktop - se muestra en md y arriba */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="whitespace-nowrap">
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
                        <TableCell key={cell.id} className="whitespace-nowrap">
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
        </div>
      </div>

      {/* Para mobile - se muestra en sm y abajo */}
      <div className="block md:hidden">
        {table.getRowModel().rows?.length ? (
          <div className="space-y-3">
            {table.getRowModel().rows.map((row) => {
              const category = row.original;
              return (
                <MobileCategoryCard 
                  key={category.id} 
                  category={category}
                  onDelete={handleDeleteCategoryOptimistic}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-lg">
            <p className="text-muted-foreground">No se encontraron categorías.</p>
          </div>
        )}
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