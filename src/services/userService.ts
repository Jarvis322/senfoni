import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Types
export type UserRegistrationData = {
  email: string;
  password: string;
  name?: string;
  surname?: string;
  phone?: string;
};

export type UserLoginData = {
  email: string;
  password: string;
};

export type UserUpdateData = {
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
};

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  user: SafeUser;
  token: string;
};

// Helper functions
const excludePassword = (user: any): SafeUser => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as SafeUser;
};

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// Service functions
export async function registerUser(data: UserRegistrationData): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await prisma.$queryRaw`
    SELECT * FROM "User" WHERE email = ${data.email} LIMIT 1
  `;

  if (existingUser && Array.isArray(existingUser) && existingUser.length > 0) {
    throw new Error('Bu e-posta adresi zaten kullanılıyor');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.$queryRaw`
    INSERT INTO "User" (id, email, password, name, surname, phone, role, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), ${data.email}, ${hashedPassword}, ${data.name}, ${data.surname}, ${data.phone}, 'USER', now(), now())
    RETURNING id, email, name, surname, phone, address, city, country, "postalCode", role, "createdAt", "updatedAt"
  `;

  const newUser = Array.isArray(user) ? user[0] : user;

  // Generate token
  const token = generateToken(newUser.id);

  return {
    user: excludePassword(newUser),
    token
  };
}

export async function loginUser(data: UserLoginData): Promise<AuthResponse> {
  // Find user
  const users = await prisma.$queryRaw`
    SELECT * FROM "User" WHERE email = ${data.email} LIMIT 1
  `;
  
  const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

  if (!user) {
    throw new Error('Geçersiz e-posta veya şifre');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Geçersiz e-posta veya şifre');
  }

  // Generate token
  const token = generateToken(user.id);

  return {
    user: excludePassword(user),
    token
  };
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
  const users = await prisma.$queryRaw`
    SELECT id, email, name, surname, phone, address, city, country, "postalCode", role, "createdAt", "updatedAt"
    FROM "User" WHERE id = ${userId} LIMIT 1
  `;
  
  const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

  if (!user) {
    return null;
  }

  return user as SafeUser;
}

export async function updateUserProfile(userId: string, data: UserUpdateData): Promise<SafeUser> {
  // Construct SET clause dynamically
  const setClause = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `"${key}" = '${value}'`)
    .join(', ');

  if (!setClause) {
    throw new Error('No fields to update');
  }

  // Execute update query with raw SQL
  const users = await prisma.$queryRaw`
    UPDATE "User"
    SET ${setClause}, "updatedAt" = now()
    WHERE id = ${userId}
    RETURNING id, email, name, surname, phone, address, city, country, "postalCode", role, "createdAt", "updatedAt"
  `;
  
  const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

  if (!user) {
    throw new Error('User not found');
  }

  return user as SafeUser;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  // Find user
  const users = await prisma.$queryRaw`
    SELECT * FROM "User" WHERE id = ${userId} LIMIT 1
  `;
  
  const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Mevcut şifre yanlış');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.$queryRaw`
    UPDATE "User"
    SET password = ${hashedPassword}, "updatedAt" = now()
    WHERE id = ${userId}
  `;

  return true;
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  await prisma.$queryRaw`
    INSERT INTO "_UserWishlist" ("A", "B")
    VALUES (${userId}, ${productId})
    ON CONFLICT DO NOTHING
  `;
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  await prisma.$queryRaw`
    DELETE FROM "_UserWishlist"
    WHERE "A" = ${userId} AND "B" = ${productId}
  `;
}

export async function getWishlist(userId: string) {
  const products = await prisma.$queryRaw`
    SELECT p.*
    FROM "Product" p
    JOIN "_UserWishlist" w ON p.id = w."B"
    WHERE w."A" = ${userId}
  `;
  
  return products || [];
}

export async function getUserOrders(userId: string) {
  const orders = await prisma.$queryRaw`
    SELECT *
    FROM "Order"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
  `;
  
  return orders || [];
} 