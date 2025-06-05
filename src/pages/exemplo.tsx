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
  // Estado para paginação, ordenação e filtros
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState([])
  const [tableFilters, setTableFilters] = useState([])
  
  // Estado para os filtros avançados
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({})
  
  // Estado para controlar quando a pesquisa deve ser executada
  const [queryParams, setQueryParams] = useState<ProductsQueryParams>({
    limit: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  })

  // Função para aplicar os filtros e executar a pesquisa
  const applyFilters = (filters: Record<string, any>) => {
    // Atualizar o estado dos filtros avançados
    setAdvancedFilters(filters);
    
    // Resetar a paginação para o valor inicial
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    
    // Atualizar os parâmetros da consulta
    setQueryParams({
      limit: pagination.pageSize,
      skip: 0, // Reset para a primeira página
      sort: JSON.stringify(sorting),
      search: filters.search || "",
      filters: {
        ...filters,
        // Converter os filtros da tabela para o formato esperado pela API
        ...tableFilters.reduce((acc, filter: any) => {
          acc[filter.id] = filter.value
          return acc
        }, {}),
      },
    });
  }

  // Consulta usando TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => fetchProducts(queryParams),
  })

  // Calcular o número total de páginas
  const pageCount = data ? Math.ceil(data.total / pagination.pageSize) : 0

  // Atualizar os parâmetros da consulta quando a paginação ou ordenação mudar
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

  // Definição das colunas
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

  // Opções de filtro para marca e categoria
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

  // Definição dos filtros avançados
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
      
      {/* Filtros Avançados */}
      <DataTableAdvancedFilters
        filterOptions={filterOptions}
        onSearch={applyFilters}
        initialValues={advancedFilters}
      />
      
      {/* Tabela de Dados */}
      <DataTable
        columns={columns}
        data={data?.products || []}
        totalCount={data?.total || 0}
        pageCount={pageCount}
        filterKey="title"
        filters={[]} // Removemos os filtros da tabela, pois agora usamos os filtros avançados
        searchPlaceholder="" // Removemos o placeholder, pois agora usamos o campo de pesquisa nos filtros avançados
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