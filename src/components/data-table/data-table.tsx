import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUrlState } from "@/hooks/use-url-state"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCount: number
  pageCount: number
  filterKey: string
  filters?: {
    title: string
    key: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  searchPlaceholder?: string
  showColumnVisibility?: boolean
  onPaginationChange?: (pagination: PaginationState) => void
  onSortingChange?: (sorting: SortingState) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  urlStateKey?: string
  toolbar?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pageCount,
  filterKey,
  filters,
  searchPlaceholder,
  showColumnVisibility = true,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  urlStateKey = "tableState",
  toolbar,
}: DataTableProps<TData, TValue>) {
  const [tableState, setTableState] = useUrlState(
    {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      sorting: [],
      columnFilters: [],
      columnVisibility: {},
    },
    urlStateKey
  )

  const pagination = tableState.pagination
  const sorting = tableState.sorting
  const columnFilters = tableState.columnFilters
  const columnVisibility = tableState.columnVisibility

  // Referência para controlar se a mudança foi interna ou externa
  const isInitialRender = React.useRef(true);
  const prevPagination = React.useRef(pagination);
  const prevSorting = React.useRef(sorting);

  React.useEffect(() => {
    // Pular a primeira renderização e chamadas quando a mudança foi interna
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    // Verificar se a mudança veio de fora do componente
    const paginationChanged = 
      JSON.stringify(prevPagination.current) !== JSON.stringify(pagination);
      
    if (paginationChanged && onPaginationChange) {
      prevPagination.current = pagination;
      onPaginationChange(pagination);
    }
  }, [pagination, onPaginationChange]);

  React.useEffect(() => {
    // Pular a primeira renderização
    if (isInitialRender.current) {
      return;
    }
    
    // Verificar se a mudança veio de fora do componente
    const sortingChanged = 
      JSON.stringify(prevSorting.current) !== JSON.stringify(sorting);
      
    if (sortingChanged && onSortingChange) {
      prevSorting.current = sorting;
      onSortingChange(sorting);
    }
  }, [sorting, onSortingChange]);

  React.useEffect(() => {
    onColumnFiltersChange?.(columnFilters)
  }, [columnFilters, onColumnFiltersChange])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        pagination:
          typeof updater === "function" ? updater(prev.pagination) : updater,
      }))
    },
    onSortingChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        sorting: typeof updater === "function" ? updater(prev.sorting) : updater,
      }))
    },
    onColumnFiltersChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        columnFilters:
          typeof updater === "function" ? updater(prev.columnFilters) : updater,
      }))
    },
    onColumnVisibilityChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        columnVisibility:
          typeof updater === "function"
            ? updater(prev.columnVisibility)
            : updater,
      }))
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterKey={filterKey}
        filters={filters}
        searchPlaceholder={searchPlaceholder}
        showColumnVisibility={showColumnVisibility}
      >
        {toolbar}
      </DataTableToolbar>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={pageCount}
        rowCount={totalCount}
        onPageChange={(page) =>
          setTableState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, pageIndex: page },
          }))
        }
        onPageSizeChange={(size) =>
          setTableState((prev) => ({
            ...prev,
            pagination: { pageIndex: 0, pageSize: size },
          }))
        }
      />
    </div>
  )
}
