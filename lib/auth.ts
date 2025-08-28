import type { User } from "./types.ts"
import { storage } from "./mock-data"

// Simple JWT-like token generation (use proper JWT library in production)
export function generateToken(user: Omit<User, "password">): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export function verifyToken(token: string): Omit<User, "password"> | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())

    if (payload.exp < Date.now()) {
      return null // Token expired
    }

    const user = storage.users.find((u) => u.id === payload.id)
    if (!user) return null

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch {
    return null
  }
}

export function hashPassword(password: string): string {
  // Simple hash for demo (use bcrypt in production)
  return Buffer.from(password).toString("base64")
}

export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function requireAuth(token?: string): Omit<User, "password"> | null {
  if (!token) return null
  return verifyToken(token)
}

export function requireAdmin(token?: string): Omit<User, "password"> | null {
  const user = requireAuth(token)
  if (!user || user.role !== "admin") return null
  return user
}
