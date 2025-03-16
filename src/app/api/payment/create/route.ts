import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PayTRService from '@/services/PayTRService';
import { formatPriceForPayTR } from '@/services/currencyService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  email: string;
  name: string;
  phone: string;
  address: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { orderId, cartItems, totalAmount, currency, customerInfo } = body;

    // Giriş yapmış kullanıcı veya misafir bilgileri kontrolü
    if (!session?.user && !customerInfo) {
      return NextResponse.json(
        { error: 'Kullanıcı bilgileri eksik' },
        { status: 400 }
      );
    }

    // Sepet kontrolü
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Geçersiz sepet' },
        { status: 400 }
      );
    }

    // Tutar kontrolü
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Geçersiz tutar' },
        { status: 400 }
      );
    }

    // Para birimi kontrolü
    if (!currency || !['TRY', 'USD', 'EUR'].includes(currency)) {
      return NextResponse.json(
        { error: 'Geçersiz para birimi' },
        { status: 400 }
      );
    }

    // PayTR için sepet öğelerini hazırla
    const basketItems = cartItems.map((item: CartItem) => ({
      name: item.name,
      price: formatPriceForPayTR(item.price),
      quantity: item.quantity
    }));

    // PayTR token'ı oluştur
    const token = await PayTRService.createPaymentToken({
      userId: session?.user?.id || 'guest',
      email: session?.user?.email || customerInfo.email,
      userName: session?.user?.name || customerInfo.name,
      userPhone: customerInfo?.phone,
      address: session?.user?.address || customerInfo.address,
      basketItems,
      totalAmount: formatPriceForPayTR(totalAmount),
      currency,
      merchantOid: orderId,
      userIp: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    if (!token) {
      throw new Error('PayTR token oluşturulamadı');
    }

    console.log('PayTR token created:', token);

    // Başarılı yanıt
    return NextResponse.json({
      success: true,
      formUrl: `https://www.paytr.com/odeme/guvenli/${token}`
    });

  } catch (error) {
    console.error('Payment creation error:', error);

    let status = 500;
    let errorMessage = 'Ödeme işlemi başlatılamadı';

    if (error instanceof Error) {
      if (error.message.includes('PAYTR-401')) {
        errorMessage = 'PayTR kimlik doğrulama hatası';
        status = 401;
      } else if (error.message.includes('PAYTR-400')) {
        errorMessage = 'PayTR parametre hatası';
        status = 400;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 