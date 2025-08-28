import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, User } from "@/lib/types"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    const user = requireAuth(token)
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      )
    }

    return NextResponse.json<ApiResponse<Omit<User, "password">>>({
      success: true,
      data: user,
      message: "User profile retrieved successfully",
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
