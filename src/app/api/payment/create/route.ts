import { NextRequest, NextResponse } from 'next/server';
import { PayTRService } from '@/services/PayTRService';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // İstek verilerini al
    const data = await request.json();
    const { orderId, shippingAddress } = data;

    // Sipariş bilgilerini veritabanından al
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true
      }
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    // Kullanıcı IP adresini al
    const forwardedFor = request.headers.get('x-forwarded-for');
    const userIp = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

    // Sepet öğelerini hazırla
    const items = order.items as Array<{ name: string; price: number; quantity: number }>;
    const basket = items.map(item => [
      item.name,
      (item.price * 100).toString(),
      item.quantity.toString()
    ]);

    // PayTR servisini başlat
    const paytr = new PayTRService();

    // Ödeme formu için parametreleri hazırla
    const params = {
      merchant_id: process.env.PAYTR_MERCHANT_ID!,
      merchant_key: process.env.PAYTR_MERCHANT_KEY!,
      merchant_salt: process.env.PAYTR_MERCHANT_SALT!,
      email: order.user.email,
      payment_amount: Math.round(order.totalAmount * 100), // Kuruş cinsinden
      merchant_oid: order.id,
      user_name: `${order.user.name || ''}`,
      user_address: shippingAddress,
      user_phone: order.user.phone || '',
      merchant_ok_url: 'https://senfonimuzikaletleri.com/siparis/basarili',
      merchant_fail_url: 'https://senfonimuzikaletleri.com/siparis/basarisiz',
      user_basket: JSON.stringify(basket),
      user_ip: userIp,
      currency: 'TL',
      test_mode: process.env.NODE_ENV === 'production' ? '0' : '1'
    };

    // Ödeme formunu oluştur
    const token = await paytr.createPaymentForm(params);

    // İframe URL'sini döndür
    return NextResponse.json({
      status: 'success',
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}`
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return new NextResponse('Payment creation failed', { status: 500 });
  }
} 