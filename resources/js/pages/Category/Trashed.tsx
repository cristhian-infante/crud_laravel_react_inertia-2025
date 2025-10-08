import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import category from '@/routes/category';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Undo2, Trash2, ArrowLeft } from 'lucide-react';
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
import { useState } from 'react';

// Importaciones para el DataTable
import * as React from "react"
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
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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

interface Category {
  id: number
  code: string
  name: string
  deleted_at: string
}

// =============================================================================
// COMPONENTE PARA ACCIONES MASIVAS EN PAPELERA
// =============================================================================

const TrashedBulkActions = ({ table, onRestoreMultiple, onForceDeleteMultiple }: { 
  table: any
  onRestoreMultiple: (ids: number[]) => Promise<void>
  onForceDeleteMultiple: (ids: number[]) => Promise<void>
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [actionType, setActionType] = React.useState<'restore' | 'delete' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const handleAction = async () => {
    if (selectedCount === 0 || !actionType) return;
    
    setIsProcessing(true);
    const selectedIds = selectedRows.map(row => row.original.id);
    
    if (actionType === 'restore') {
      await onRestoreMultiple(selectedIds);
    } else {
      await onForceDeleteMultiple(selectedIds);
    }
    
    setIsProcessing(false);
    setIsDialogOpen(false);
    setActionType(null);
    table.toggleAllPageRowsSelected(false);
  };

  const openDialog = (type: 'restore' | 'delete') => {
    setActionType(type);
    setIsDialogOpen(true);
  };

  if (selectedCount === 0) return null;

  const actionText = actionType === 'restore' ? 'Restaurar' : 'Eliminar permanentemente';
  const dialogTitle = actionType === 'restore' 
    ? `¿Restaurar ${selectedCount} categoría(s)?` 
    : `¿Eliminar permanentemente ${selectedCount} categoría(s)?`;
  
  const dialogDescription = actionType === 'restore'
    ? `Esta acción restaurará ${selectedCount} categoría(s) a la lista principal.`
    : `Esta acción NO se puede deshacer. Se eliminarán permanentemente ${selectedCount} categoría(s) y todos sus datos asociados.`;

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1 text-sm">
          <span className="font-medium">{selectedCount}</span> categoría(s) seleccionada(s)
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDialog('restore')}
            disabled={isProcessing}
          >
            <Undo2 className="h-4 w-4 mr-2" />
            {isProcessing && actionType === 'restore' ? 'Restaurando...' : `Restaurar (${selectedCount})`}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => openDialog('delete')}
            disabled={isProcessing}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isProcessing && actionType === 'delete' ? 'Eliminando...' : `Eliminar (${selectedCount})`}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.toggleAllPageRowsSelected(false)}
          disabled={isProcessing}
        >
          Deseleccionar
        </Button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className={actionType === 'delete' ? "bg-red-600 hover:bg-red-700" : ""}
              disabled={isProcessing}
            >
              {isProcessing ? `${actionText}...` : `${actionText} ${selectedCount} categoría(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Componente para las acciones de cada fila
const ActionsCell = ({ row, onRestore, onForceDelete }: { 
  row: any
  onRestore: (id: number) => Promise<void>
  onForceDelete: (id: number) => Promise<void>
}) => {
  const category = row.original;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleForceDelete = async () => {
    setIsDeleting(true);
    await onForceDelete(category.id);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    await onRestore(category.id);
    setIsRestoring(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRestore}
        disabled={isRestoring || isDeleting}
      >
        <Undo2 className="h-4 w-4 mr-1" />
        {isRestoring ? 'Restaurando...' : 'Restaurar'}
      </Button>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting || isRestoring}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
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
              onClick={handleForceDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Componente para versión móvil
const MobileCategoryCard = ({ 
  category, 
  onRestore, 
  onForceDelete 
}: { 
  category: Category
  onRestore: (id: number) => Promise<void>
  onForceDelete: (id: number) => Promise<void>
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleForceDelete = async () => {
    setIsDeleting(true);
    await onForceDelete(category.id);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    await onRestore(category.id);
    setIsRestoring(false);
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold text-base">{category.name}</h3>
          <p className="text-sm text-muted-foreground">Código: {category.code}</p>
          <p className="text-xs text-muted-foreground">
            Eliminada: {new Date(category.deleted_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestore}
            disabled={isRestoring || isDeleting}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting || isRestoring}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar permanentemente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente
                  la categoría "{category.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleForceDelete}
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
      
      {/* Estados de carga */}
      {(isRestoring || isDeleting) && (
        <div className="text-xs text-muted-foreground">
          {isRestoring && 'Restaurando...'}
          {isDeleting && 'Eliminando...'}
        </div>
      )}
    </div>
  );
};

export default function Trashed({ categories }: { categories: Category[] }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categorías', href: category.index().url },
    { title: 'Papelera Categorías', href: category.trashed().url },
  ];

  // Estados para el DataTable
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Category[]>(categories)
  const [isLoading, setIsLoading] = React.useState(false)

  // Actualizar datos cuando cambien las categorías
  React.useEffect(() => {
    setData(categories);
  }, [categories]);

  const handleRestore = async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      await router.post(`/categories/${id}/restore`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          setData(prev => prev.filter(category => category.id !== id));
          toast.success('Categoría restaurada exitosamente');
        },
        onError: () => {
          toast.error('Error al restaurar la categoría');
        }
      });
    } catch (error) {
      toast.error('Error al restaurar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDelete = async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      await router.delete(`/categories/${id}/force`, {
        preserveScroll: true,
        onSuccess: () => {
          setData(prev => prev.filter(category => category.id !== id));
          toast.success('Categoría eliminada permanentemente');
        },
        onError: () => {
          toast.error('Error al eliminar la categoría');
        }
      });
    } catch (error) {
      toast.error('Error al eliminar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Restauración masiva de categorías
   */
  const handleRestoreMultiple = async (ids: number[]): Promise<void> => {
    setIsLoading(true);
    try {
      const restorePromises = ids.map(id => 
        router.post(`/categories/${id}/restore`, {}, { preserveScroll: true })
      );
      
      await Promise.all(restorePromises);
      setData(prev => prev.filter(category => !ids.includes(category.id)));
      toast.success(`${ids.length} categoría(s) restaurada(s) exitosamente`);
    } catch (error) {
      toast.error('Error al restaurar las categorías');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Eliminación permanente masiva
   */
  const handleForceDeleteMultiple = async (ids: number[]): Promise<void> => {
    setIsLoading(true);
    try {
      const deletePromises = ids.map(id => 
        router.delete(`/categories/${id}/force`, { preserveScroll: true })
      );
      
      await Promise.all(deletePromises);
      setData(prev => prev.filter(category => !ids.includes(category.id)));
      toast.success(`${ids.length} categoría(s) eliminada(s) permanentemente`);
    } catch (error) {
      toast.error('Error al eliminar las categorías');
    } finally {
      setIsLoading(false);
    }
  };

  // Columnas del DataTable
  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "code",
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
      cell: ({ row }) => <div className="font-medium">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "name",
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
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "deleted_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Eliminada el
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {new Date(row.getValue("deleted_at")).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell 
          row={row}
          onRestore={handleRestore}
          onForceDelete={handleForceDelete}
        />
      ),
    },
  ]

  // Configuración de la tabla
  const table = useReactTable({
    data: data,
    columns,
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Papelera - Categorías" />
      <div className="m-4 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">           
            <h1 className="text-2xl font-bold">Papelera de Categorías</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} categoría(s) eliminada(s)
          </div>
        </div>

        {/* Bulk Actions */}
        <TrashedBulkActions 
          table={table}
          onRestoreMultiple={handleRestoreMultiple}
          onForceDeleteMultiple={handleForceDeleteMultiple}
        />

        {data.length > 0 ? (
          <div className="w-full space-y-4">
            {/* Controles del DataTable */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Input
                  placeholder="Filtrar por nombre..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                  disabled={isLoading}
                />
                
                <Input
                  placeholder="Filtrar por código..."
                  value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("code")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                  disabled={isLoading}
                />
              </div>
              
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
                          {column.id === "name" ? "Nombre" : 
                           column.id === "code" ? "Código" : 
                           column.id === "deleted_at" ? "Fecha Eliminación" : column.id}
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
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No se encontraron resultados.
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
              <div className="space-y-3">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const category = row.original;
                    return (
                      <MobileCategoryCard 
                        key={category.id} 
                        category={category}
                        onRestore={handleRestore}
                        onForceDelete={handleForceDelete}
                      />
                    );
                  })
                ) : (
                  <div className="text-center p-6 border rounded-lg">
                    <Trash2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No se encontraron resultados.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Paginación */}
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
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Trash2 className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">La papelera está vacía</p>
              <Button variant="outline" asChild className="mt-2">
                <a href={category.index().url}>
                  Volver a Categorías
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}