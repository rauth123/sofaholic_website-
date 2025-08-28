import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, Category } from "@/lib/types"
import { storage } from "@/lib/mock-data"
import { withAdmin } from "@/lib/middleware"

export async function GET() {
  try {
    return NextResponse.json<ApiResponse<Category[]>>({
      success: true,
      data: storage.categories,
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
    const { name, description } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Name is required",
        },
        { status: 400 },
      )
    }

    // Check if category name already exists
    const existingCategory = storage.categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase())
    if (existingCategory) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Category with this name already exists",
        },
        { status: 409 },
      )
    }

    // Create new category
    const newCategory: Category = {
      id: (storage.categories.length + 1).toString(),
      name,
      description,
      createdAt: new Date(),
    }

    storage.categories.push(newCategory)

    return NextResponse.json<ApiResponse<Category>>(
      {
        success: true,
        data: newCategory,
        message: "Category created successfully",
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
