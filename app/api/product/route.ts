import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, Product, ProductFilters, PaginatedResponse } from "@/lib/types"
import { storage, mockCategories } from "@/lib/mock-data"
import { withAdmin } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: ProductFilters = {
      categoryId: searchParams.get("categoryId") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    }

    const filteredProducts = storage.products.filter((product) => {
      if (!product.isActive) return false

      if (filters.categoryId && product.categoryId !== filters.categoryId) return false

      if (filters.minPrice && product.price < filters.minPrice) return false
      if (filters.maxPrice && product.price > filters.maxPrice) return false

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower)
        )
      }

      return true
    })

    // Add category information
    const productsWithCategories = filteredProducts.map((product) => ({
      ...product,
      category: mockCategories.find((cat) => cat.id === product.categoryId),
    }))

    // Sort products
    productsWithCategories.sort((a, b) => {
      const aValue = a[filters.sortBy!]
      const bValue = b[filters.sortBy!]

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Paginate results
    const startIndex = (filters.page! - 1) * filters.limit!
    const endIndex = startIndex + filters.limit!
    const paginatedProducts = productsWithCategories.slice(startIndex, endIndex)

    const response: PaginatedResponse<Product> = {
      data: paginatedProducts,
      pagination: {
        page: filters.page!,
        limit: filters.limit!,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / filters.limit!),
      },
    }

    return NextResponse.json<ApiResponse<PaginatedResponse<Product>>>({
      success: true,
      data: response,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { name, description, price, categoryId, imageUrl, stock } = body

    // Validate required fields
    if (!name || !description || !price || !categoryId || stock === undefined) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Name, description, price, categoryId, and stock are required",
        },
        { status: 400 },
      )
    }

    // Check if category exists
    const categoryExists = mockCategories.find((cat) => cat.id === categoryId)
    if (!categoryExists) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Category not found",
        },
        { status: 404 },
      )
    }

    // Create new product
    const newProduct: Product = {
      id: (storage.products.length + 1).toString(),
      name,
      description,
      price: Number(price),
      categoryId,
      imageUrl,
      stock: Number(stock),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    storage.products.push(newProduct)

    return NextResponse.json<ApiResponse<Product>>(
      {
        success: true,
        data: {
          ...newProduct,
          category: categoryExists,
        },
        message: "Product created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
})
