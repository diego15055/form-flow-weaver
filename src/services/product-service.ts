export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  thumbnail: string
  images: string[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductsQueryParams {
  limit?: number
  skip?: number
  sort?: string
  search?: string
  filters?: Record<string, any>
}

export const fetchProducts = async (params: ProductsQueryParams): Promise<ProductsResponse> => {
  const { limit = 10, skip = 0, search = "", filters = {} } = params
  
  // Construir a URL base
  let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  
  // Adicionar parâmetro de pesquisa se existir
  if (search) {
    // Na API real, você usaria o endpoint de pesquisa
    // Como a dummyjson tem endpoint de search, podemos usar
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
  }
  
  // Na API real, você adicionaria os outros filtros aqui
  // Como a dummyjson não suporta filtros complexos, estamos apenas simulando
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos')
  }
  
  return response.json()
}