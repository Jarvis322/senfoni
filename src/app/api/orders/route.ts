import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUser, getAllOrders } from '@/lib/orderStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      // Eğer email parametresi yoksa, tüm siparişleri döndür (admin için)
      // Gerçek uygulamada burada yetkilendirme kontrolü yapılmalı
      const orders = getAllOrders();
      return NextResponse.json({ success: true, orders });
    }
    
    // Kullanıcının siparişlerini getir
    const orders = getOrdersByUser(email);
    
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Siparişler getirilirken hata oluştu:', error);
    return NextResponse.json(
      { success: false, error: 'Siparişler getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 