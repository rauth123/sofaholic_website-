export interface User {
  id: string
  email: string
  password: string // In production, this would be hashed
  firstName: string
  lastName: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  category?: Category
  imageUrl?: string
  stock: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  product?: Product
  quantity: number
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  user?: User
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number // Price at time of order
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Authentication types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: Omit<User, "password">
  token: string
}

// Product filtering and search types
export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: "name" | "price" | "createdAt"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
