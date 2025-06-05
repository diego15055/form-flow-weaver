import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { fetchProducts, Product, ProductsQueryParams } from "@/services/product-service"
import { DataTableAdvancedFilters, FilterOption } from "@/components/data-table/data-table-advanced-filters"

export default function ExemploPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState([])
  const [tableFilters, setTableFilters] = useState([])
  
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({})

  const [queryParams, setQueryParams] = useState<ProductsQueryParams>({
    limit: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  })

  const applyFilters = (filters: Record<string, any>) => {
    setAdvancedFilters(filters);
    
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    
    setSorting([]);
    
    setTableFilters([]);
    
    setQueryParams({
      limit: 10, 
      skip: 0,
      sort: JSON.stringify([]),
      search: filters.search || "",
      filters: {
        ...filters,
      },
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => fetchProducts(queryParams),
  })

  const pageCount = data ? Math.ceil(data.total / pagination.pageSize) : 0

  const handlePaginationChange = (newPagination: typeof pagination) => {
    setPagination(newPagination)
    setQueryParams(prev => ({
      ...prev,
      limit: newPagination.pageSize,
      skip: newPagination.pageIndex * newPagination.pageSize,
    }))
  }

  const handleSortingChange = (newSorting: any) => {
    setSorting(newSorting)
    setQueryParams(prev => ({
      ...prev,
      sort: JSON.stringify(newSorting),
    }))
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Título" />
      ),
    },
    {
      accessorKey: "brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Marca" />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Preço" />
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price)
        return formatted
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estoque" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm">
              Editar
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive">
              Excluir
            </Button>
          </div>
        )
      },
    },
  ]

  const brandFilters = [
    { label: "Apple", value: "Apple" },
    { label: "Samsung", value: "Samsung" },
    { label: "OPPO", value: "OPPO" },
    { label: "Huawei", value: "Huawei" },
  ]

  const categoryFilters = [
    { label: "smartphones", value: "smartphones" },
    { label: "laptops", value: "laptops" },
    { label: "fragrances", value: "fragrances" },
    { label: "skincare", value: "skincare" },
    { label: "groceries", value: "groceries" },
  ]

  const filterOptions: FilterOption[] = [
    {
      type: "text",
      key: "search",
      label: "Pesquisar",
      placeholder: "Digite o termo de busca...",
    },
    {
      type: "select",
      key: "brand",
      label: "Marca",
      placeholder: "Selecione uma marca",
      options: brandFilters,
    },
    {
      type: "checkbox",
      key: "category",
      label: "Categoria",
      options: categoryFilters,
    },
    {
      type: "range",
      key: "price",
      label: "Preço",
    },
    {
      type: "number",
      key: "stock",
      label: "Estoque mínimo",
      placeholder: "Estoque mínimo",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Catálogo de Produtos</h1>
      
      <DataTableAdvancedFilters
        filterOptions={filterOptions}
        onSearch={applyFilters}
        initialValues={advancedFilters}
      />
      
      <DataTable
        columns={columns}
        data={data?.products || []}
        totalCount={data?.total || 0}
        pageCount={pageCount}
        filterKey="title"
        filters={[]} 
        searchPlaceholder="" 
        onPaginationChange={handlePaginationChange}
        onSortingChange={handleSortingChange}
        onColumnFiltersChange={setTableFilters}
        urlStateKey="productsTable"
        toolbar={
          <Button size="sm" className="h-8">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        }
      />
    </div>
  )
}