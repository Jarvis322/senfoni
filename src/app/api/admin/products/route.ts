import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsFromDatabase } from '@/services/productService';

export async function GET(request: NextRequest) {
  try {
    const products = await fetchProductsFromDatabase();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Ürünler getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: error.message || 'Ürünler getirilemedi' },
      { status: 500 }
    );
  }
} 