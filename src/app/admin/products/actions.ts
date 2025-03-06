'use server';

import { prisma } from "@/lib/prisma";

// Ürünleri getiren fonksiyon
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return products;
  } catch (error) {
    console.error("Ürünler yüklenirken hata oluştu:", error);
    return [];
  }
}

// Ürün silme fonksiyonu
export async function deleteProductFromDB(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error(`Ürün silinirken hata oluştu (ID: ${id}):`, error);
    return false;
  }
} 