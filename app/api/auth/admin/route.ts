import { type NextRequest, NextResponse } from "next/server"
import type { LoginRequest, ApiResponse, AuthResponse } from "@/lib/types"
import { storage } from "@/lib/mock-data"
import { generateToken, comparePassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Find user by email
    const user = storage.users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid admin credentials",
        },
        { status: 401 },
      )
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Access denied. Admin privileges required.",
        },
        { status: 403 },
      )
    }

    // Verify password
    if (!comparePassword(password, user.password)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid admin credentials",
        },
        { status: 401 },
      )
    }

    // Generate token and return user data
    const { password: _, ...userWithoutPassword } = user
    const token = generateToken(userWithoutPassword)

    return NextResponse.json<ApiResponse<AuthResponse>>({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: "Admin login successful",
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
