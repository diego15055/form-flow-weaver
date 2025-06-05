import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
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
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  filterKey,
  filters,
  searchPlaceholder = "Buscar...",
  showColumnVisibility = true,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filters?.map((filter) => {
          const column = table.getColumn(filter.key)
          if (!column) return null
          return (
            <DataTableFacetedFilter
              key={filter.key}
              title={filter.title}
              options={filter.options}
              value={(column?.getFilterValue() as string[]) || []}
              onChange={(value) => column?.setFilterValue(value)}
            />
          )
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
          </Button>
        )}
        {children}
      </div>
      {showColumnVisibility && <DataTableViewOptions table={table} />}
    </div>
  )
}