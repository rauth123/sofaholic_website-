import type { User, Category, Product, Order, Notification } from "./types.ts"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123", // In production, this would be hashed
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "john@example.com",
    password: "user123",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    email: "jane@example.com",
    password: "user123",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
]

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Clothing",
    description: "Fashion and apparel",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Books",
    description: "Books and educational materials",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Home & Garden",
    description: "Home improvement and garden supplies",
    createdAt: new Date("2024-01-01"),
  },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    categoryId: "1",
    imageUrl: "/wireless-headphones.png",
    stock: 50,
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in various colors",
    price: 29.99,
    categoryId: "2",
    imageUrl: "/cotton-tshirt.png",
    stock: 100,
    isActive: true,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "3",
    name: "JavaScript Programming Book",
    description: "Complete guide to modern JavaScript programming",
    price: 49.99,
    categoryId: "3",
    imageUrl: "/javascript-book.png",
    stock: 25,
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    name: "Garden Hose",
    description: "Durable 50ft garden hose with spray nozzle",
    price: 39.99,
    categoryId: "4",
    imageUrl: "/coiled-garden-hose.png",
    stock: 30,
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Smartphone",
    description: "Latest model smartphone with advanced camera",
    price: 799.99,
    categoryId: "1",
    imageUrl: "/modern-smartphone.png",
    stock: 20,
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
]

export const mockOrders: Order[] = [
  {
    id: "1",
    userId: "2",
    items: [
      {
        id: "1",
        orderId: "1",
        productId: "1",
        quantity: 1,
        price: 199.99,
      },
      {
        id: "2",
        orderId: "1",
        productId: "2",
        quantity: 2,
        price: 29.99,
      },
    ],
    totalAmount: 259.97,
    status: "delivered",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-20"),
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "2",
    title: "Order Shipped",
    message: "Your order #1 has been shipped and is on its way!",
    type: "success",
    isRead: false,
    createdAt: new Date("2024-02-18"),
  },
  {
    id: "2",
    userId: "2",
    title: "New Product Available",
    message: "Check out our latest smartphone with advanced features!",
    type: "info",
    isRead: true,
    createdAt: new Date("2024-02-01"),
  },
]

// In-memory storage for development (replace with database in production)
export const storage = {
  users: [...mockUsers],
  categories: [...mockCategories],
  products: [...mockProducts],
  orders: [...mockOrders],
  notifications: [...mockNotifications],
  cartItems: [] as any[],
}
