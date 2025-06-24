import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Pet } from '@/types/pet';
import { cn } from '@/lib/utils';
<<<<<<< Updated upstream
=======
import { TableSkeleton } from '@/components/ui/table-skeleton';
import {
  useBulkDeletePets,
  useBulkUpdatePetAvailability,
} from '@/hooks/usePets';
import type { Pet } from '@/types/pet';
>>>>>>> Stashed changes

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
}

export function PetDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

<<<<<<< Updated upstream
=======
  // Get unique values for filters
  const breedOptions = Array.from(
    new Set(data.map((pet: TData) => (pet as Pet).breed?.name).filter(Boolean)),
  );
  const sizeOptions = Array.from(
    new Set(data.map((pet: TData) => (pet as Pet).size).filter(Boolean)),
  );
>>>>>>> Stashed changes

  const getBreedOptions = (data: Pet[]) => {
    const breeds = Array.from(new Set(data.map((pet) => pet.breed.name)));
    return breeds.sort();
  };

  const getSizeOptions = () => ['Small', 'Medium', 'Large'];

  const breedOptions = getBreedOptions(data as Pet[]);
  const sizeOptions = getSizeOptions();

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

<<<<<<< Updated upstream
=======
  // Bulk actions handlers
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedPets = selectedRows.map((row) => row.original as Pet);
  const selectedIds = selectedPets.map((pet) => pet._id);

  const handleBulkDelete = async () => {
    try {
      await bulkDeletePets.mutateAsync(selectedIds);
      setRowSelection({});
    } catch {
      // Error handled in mutation
    }
  };

  const handleBulkUpdateAvailability = async (isAvailable: boolean) => {
    const targetIds = selectedPets
      .filter((pet) => pet.isAvailable !== isAvailable)
      .map((pet) => pet._id);

    if (targetIds.length === 0) {
      const statusText = isAvailable ? 'available' : 'sold';
      toast.info(`All selected pets are already ${statusText}`);
      return;
    }

    try {
      await bulkUpdateAvailability.mutateAsync({
        ids: targetIds,
        isAvailable,
      });
      setRowSelection({});
    } catch {
      // Error handled in mutation
    }
  };

  // Show loading skeleton while loading
>>>>>>> Stashed changes
  if (isLoading) {
    return (
      <div className={cn('w-full space-y-4', className)}>
        <div className="w-full">
          <div className="animate-pulse rounded-md bg-gray-100 p-6">
            <div className="h-6 w-1/3 rounded bg-gray-200 mb-4" />
            <div className="h-4 w-full rounded bg-gray-200 mb-2" />
            <div className="h-4 w-full rounded bg-gray-200 mb-2" />
            <div className="h-4 w-2/3 rounded bg-gray-200 mb-2" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search pets..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm pl-8"
              disabled={isLoading}
            />
          </div>

          <Select
            value={(table.getColumn('breed')?.getFilterValue() as string) ?? ''}
            onValueChange={(value) =>
              table
                .getColumn('breed')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select breed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Breeds</SelectItem>
              {breedOptions.map((breed) => (
                <SelectItem key={breed} value={breed}>
                  {breed}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={(table.getColumn('size')?.getFilterValue() as string) ?? ''}
            onValueChange={(value) =>
              table
                .getColumn('size')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {sizeOptions.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn('isAvailable')?.getFilterValue() as string) ?? ''
            }
            onValueChange={(value) =>
              table.getColumn('isAvailable')?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="h-4 w-4" />
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild>
            <Link to="/staff/pets/add">
              <Plus className="h-4 w-4" />
              Add Pet
            </Link>
          </Button>
        </div>
      </div>

      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="bg-muted/50 flex items-center justify-between rounded-md border px-4 py-2">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
            <Button variant="outline" size="sm">
              Bulk Update
            </Button>
            <Button variant="destructive" size="sm">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

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
                  className="hover:bg-muted/50"
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
                  No pets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 pb-4">
        <div className="text-muted-foreground text-sm">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {totalPages > 1 && (
            <Pagination className="w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => table.setPageIndex(pageNumber - 1)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    className={
                      !table.getCanNextPage()
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
