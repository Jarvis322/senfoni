import { NextRequest, NextResponse } from 'next/server';
import { syncProductsWithDatabase } from '@/services/productService';

export async function POST(request: NextRequest) {
  try {
    const result = await syncProductsWithDatabase();
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${result.count} ürün başarıyla senkronize edildi` 
    });
    
  } catch (error) {
    console.error('Ürün senkronizasyonu hatası:', error);
    return NextResponse.json({ 
      error: 'Ürünler senkronize edilirken bir hata oluştu' 
    }, { status: 500 });
  }
} 