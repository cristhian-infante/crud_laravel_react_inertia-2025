'use client';

import { router } from '@inertiajs/react';
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
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

//import { BulkActions, ActionsCell, MobileBrandCard, StatusBadge } from './DataTableBrands';
import { BulkActions } from './DataTableBrands/BulkActions';
import { ActionsCell } from './DataTableBrands/ActionsCell';
import { MobileBrandCard } from './DataTableBrands/MobileBrandCard';
import { StatusBadge } from './DataTableBrands/StatusBadge';
import { DataTableBrandProps, Brand } from './DataTableBrands/types';

export default function DataTableBrands({
    brands,
    onBrandChange,
}: DataTableBrandProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [data, setData] = React.useState<Brand[]>(brands);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setData(brands);
    }, [brands]);

    const handleDeleteBrandOptimistic = async (
        id: number,
    ): Promise<{ success: boolean; error?: string }> => {
        const previousData = [...data];
        setData((prev) => prev.filter((brand) => brand.id !== id));

        try {
            await router.delete(`/brands/${id}`, {
                preserveScroll: true,
                preserveState: false,
            });

            if (onBrandChange) {
                onBrandChange();
            }

            return { success: true };
        } catch (error) {
            setData(previousData);
            return { success: false, error: 'Error al eliminar la marca' };
        }
    };

    const handleDeleteMultipleBrands = async (
        ids: number[],
    ): Promise<{ success: boolean; error?: string }> => {
        if (ids.length === 0) {
            return { success: false, error: 'No hay marcas seleccionadas' };
        }

        const previousData = [...data];
        setData((prev) => prev.filter((brand) => !ids.includes(brand.id)));

        try {
            await router.post(
                '/brands/bulk-delete',
                { ids: ids },
                {
                    preserveScroll: true,
                    preserveState: false,
                },
            );

            table.toggleAllPageRowsSelected(false);

            if (onBrandChange) {
                onBrandChange();
            }

            return { success: true };
        } catch (error) {
            setData(previousData);
            return { success: false, error: 'Error al eliminar las marcas' };
        }
    };

    const columnsWithActions = React.useMemo<ColumnDef<Brand>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
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
                accessorKey: 'name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Nombre Marca
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.getValue('name')}</div>,
            },
            {
                accessorKey: 'status',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Estado
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <StatusBadge status={row.getValue('status')} />
                ),
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => (
                    <ActionsCell
                        row={row}
                        onDelete={handleDeleteBrandOptimistic}
                    />
                ),
            },
        ],
        [],
    );

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
    });

    return (
        <div className="w-full space-y-4">
            <BulkActions
                table={table}
                onDeleteMultiple={handleDeleteMultipleBrands}
            />

            <div className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center">
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Input
                        placeholder="Filtrar por nombre..."
                        value={
                            (table.getColumn('name')?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table.getColumn('name')?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                        disabled={isLoading}
                    />
                    <Input
                        placeholder="Filtrar por estado..."
                        value={
                            (table.getColumn('status')?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table.getColumn('status')?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                        disabled={isLoading}
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto"
                            disabled={isLoading}
                        >
                            Columnas <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id === 'name'
                                        ? 'Nombre'
                                        : column.id === 'status'
                                          ? 'Estado'
                                          : column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="hidden md:block">
                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="whitespace-nowrap"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        ))}
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
                                                <TableCell
                                                    key={cell.id}
                                                    className="whitespace-nowrap"
                                                >
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
                                            colSpan={columnsWithActions.length}
                                            className="h-24 text-center"
                                        >
                                            No se encontraron marcas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <div className="block md:hidden">
                {table.getRowModel().rows?.length ? (
                    <div className="space-y-3">
                        {table.getRowModel().rows.map((row) => {
                            const brand = row.original;
                            return (
                                <MobileBrandCard
                                    key={brand.id}
                                    brand={brand}
                                    onDelete={handleDeleteBrandOptimistic}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-lg border p-6 text-center">
                        <p className="text-muted-foreground">
                            No se encontraron marcas.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{' '}
                    {table.getFilteredRowModel().rows.length} fila(s)
                    seleccionadas.
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
    );
}