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

//COLUMNAS
export const columns: ColumnDef<Product>[] = [
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
  //Nombre Categoria
  // {
  //   accessorKey: "nameCategory",
  //   header: "Categoría",
  //   cell:({ row }) => (
  //     <div className="capitalize">{row.getValue("nameCategory")}</div>
  //   ),
  // },
  {
    accessorKey: "nameCategory",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoría
          <ArrowUpDown />
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
          <ArrowUpDown />
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
        <ArrowUpDown />
      </Button>
    )
  },
  cell: ({ row }) => (
    <div>{Number(row.getValue("stockProduct")).toLocaleString()} Unidades</div>
  ),
},
  // precio
  {
  accessorKey: "priceProduct",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Precio
        <ArrowUpDown />
      </Button>
    )
  },
  cell: ({ row }) => (
    <div>S/. {Number(row.getValue("priceProduct")).toLocaleString()}.00</div>
  ),
},
  //acciones
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir Menú</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


export default function DataTableProductos({products, onProductChange}:DataTableProductsProps){
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
    data: products,
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
      <div className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Input
                  placeholder="Nombre de Producto"
                  value={
                      (table.getColumn('nameProduct')?.getFilterValue() as string) ??
                      ''
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
                      (table.getColumn('nameCategory')?.getFilterValue() as string) ??
                      ''
                  }
                  onChange={(event) =>
                      table
                          .getColumn('nameCategory')
                          ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
              />
          </div>
          <div className="overflow-hidden rounded-md border">
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
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                      </TableHead>
                                  );
                              })}
                          </TableRow>
                      ))}
                  </TableHeader>
                  <TableBody>
                      {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                              <TableRow
                                  key={row.id}
                                  data-state={row.getIsSelected() && 'selected'}
                              >
                                  {row.getVisibleCells().map((cell) => (
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
                              <TableCell
                                  colSpan={columns.length}
                                  className="h-24 text-center"
                              >
                                  No hay Resultados.
                              </TableCell>
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} de{' '}
                  {table.getFilteredRowModel().rows.length} fila(s)
                  seleccionada(s).
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
      </div>
  );
}