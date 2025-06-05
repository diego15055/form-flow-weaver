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
  
  const url = search? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}` : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos')
  }
  
  return response.json()
}