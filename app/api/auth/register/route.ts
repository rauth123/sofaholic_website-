import { type NextRequest, NextResponse } from "next/server"
import type { RegisterRequest, ApiResponse, AuthResponse } from "@/lib/types"
import { storage } from "@/lib/mock-data"
import { generateToken, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, firstName, lastName } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = storage.users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 },
      )
    }

    // Create new user
    const newUser = {
      id: (storage.users.length + 1).toString(),
      email,
      password: hashPassword(password),
      firstName,
      lastName,
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    storage.users.push(newUser)

    // Generate token and return user data
    const { password: _, ...userWithoutPassword } = newUser
    const token = generateToken(userWithoutPassword)

    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: "User registered successfully",
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
}
