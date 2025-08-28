import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, Product } from "@/lib/types"
import { storage, mockCategories } from "@/lib/mock-data"
import { withAdmin } from "@/lib/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = storage.products.find((p) => p.id === params.id && p.isActive)

    if (!product) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    const category = mockCategories.find((cat) => cat.id === product.categoryId)

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: {
        ...product,
        category,
      },
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

export const PUT = withAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const productIndex = storage.products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    const body = await request.json()
    const { name, description, price, categoryId, imageUrl, stock, isActive } = body

    // Update product
    const updatedProduct = {
      ...storage.products[productIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(categoryId && { categoryId }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date(),
    }

    storage.products[productIndex] = updatedProduct

    const category = mockCategories.find((cat) => cat.id === updatedProduct.categoryId)

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: {
        ...updatedProduct,
        category,
      },
      message: "Product updated successfully",
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
})

export const DELETE = withAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const productIndex = storage.products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    // Soft delete by setting isActive to false
    storage.products[productIndex].isActive = false
    storage.products[productIndex].updatedAt = new Date()

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Product deleted successfully",
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
})
