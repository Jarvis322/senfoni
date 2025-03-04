import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/orderStorage';

interface RouteParams {
  params: {
    orderId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { orderId } = params;
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Sipariş ID gereklidir.' },
        { status: 400 }
      );
    }
    
    // Siparişi getir
    const order = getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Sipariş getirilirken hata oluştu:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Sipariş durumunu güncelleme (admin için)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { status, paymentStatus } = body;
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Sipariş ID gereklidir.' },
        { status: 400 }
      );
    }
    
    if (!status && !paymentStatus) {
      return NextResponse.json(
        { success: false, error: 'Güncellenecek durum bilgisi gereklidir.' },
        { status: 400 }
      );
    }
    
    // Siparişi güncelle
    const updatedOrder = updateOrderStatus(orderId, status, paymentStatus);
    
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Sipariş güncellenirken hata oluştu:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 