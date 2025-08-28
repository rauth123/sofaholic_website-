import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, Product } from "@/lib/types"
import { storage, mockCategories } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 },
      )
    }

    const searchLower = query.toLowerCase()
    const searchResults = storage.products
      .filter((product) => {
        if (!product.isActive) return false

        return (
          product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower)
        )
      })
      .map((product) => ({
        ...product,
        category: mockCategories.find((cat) => cat.id === product.categoryId),
      }))
      .sort((a, b) => {
        // Prioritize name matches over description matches
        const aNameMatch = a.name.toLowerCase().includes(searchLower)
        const bNameMatch = b.name.toLowerCase().includes(searchLower)

        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1

        return b.createdAt.getTime() - a.createdAt.getTime()
      })

    return NextResponse.json<ApiResponse<Product[]>>({
      success: true,
      data: searchResults,
      message: `Found ${searchResults.length} products matching "${query}"`,
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
