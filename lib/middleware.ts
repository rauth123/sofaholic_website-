import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "./types.ts"
import { requireAuth, requireAdmin } from "./auth"

// Middleware helper for protected routes
export function withAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
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

    return handler(request, user)
  }
}

// Middleware helper for admin-only routes
export function withAdmin(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    const user = requireAdmin(token)
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Access denied. Admin privileges required.",
        },
        { status: 403 },
      )
    }

    return handler(request, user)
  }
}
