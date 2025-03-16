import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: string
    address?: string
    phone?: string
  }
  
  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
} 