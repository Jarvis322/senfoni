import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { addOrder } from '@/lib/orderStorage';

// PayTR API bilgileri (gerçek uygulamada .env dosyasından alınmalı)
const MERCHANT_ID = 'XXXXXX';
const MERCHANT_KEY = 'YYYYYYYYYYYYYY';
const MERCHANT_SALT = 'ZZZZZZZZZZZZZZ';
const PAYTR_API_URL = 'https://www.paytr.com/odeme/api/get-token';

interface PaymentRequestBody {
  user: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
  };
  card?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
  order: {
    amount: number; // Kuruş cinsinden (örn: 10.99 TL -> 1099)
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  paymentMethod: 'creditCard' | 'bankTransfer';
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequestBody = await request.json();
    
    // Kullanıcı bilgileri
    const { user, card, order, paymentMethod } = body;
    
    // Sipariş numarası oluştur (benzersiz olmalı)
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Banka havalesi/EFT ödeme yöntemi seçildiyse
    if (paymentMethod === 'bankTransfer') {
      try {
        // Siparişi dosya tabanlı depolama sistemine kaydet
        const newOrder = addOrder({
          id: uuidv4(),
          orderId,
          status: 'pending_payment', // Ödeme bekliyor durumu
          totalAmount: order.amount / 100, // TL cinsinden (kuruştan çevir)
          paymentMethod: 'bankTransfer',
          paymentStatus: 'pending',
          customerName: user.fullName,
          customerEmail: user.email,
          customerPhone: user.phone,
          shippingAddress: user.address,
          city: user.city,
          zipCode: user.zipCode || '',
          createdAt: new Date().toISOString(),
          items: order.items.map(item => ({
            id: uuidv4(),
            productId: item.id,
            name: item.name,
            price: item.price / 100, // TL cinsinden (kuruştan çevir)
            quantity: item.quantity
          }))
        });
        
        // Başarılı yanıt döndür
        return NextResponse.json({
          success: true,
          orderId,
          message: 'Sipariş başarıyla oluşturuldu. Ödeme onayı bekleniyor.'
        });
      } catch (error) {
        console.error('Sipariş oluşturma hatası:', error);
        return NextResponse.json(
          { success: false, error: 'Sipariş oluşturulurken bir hata oluştu.' },
          { status: 500 }
        );
      }
    }
    
    // Kredi kartı ödeme yöntemi için
    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Kart bilgileri eksik.' },
        { status: 400 }
      );
    }
    
    // Sepet bilgisi oluştur (JSON formatında)
    const basketItems = order.items.map(item => [
      item.name,
      item.price, // Kuruş cinsinden
      item.quantity
    ]);
    
    const basketStr = JSON.stringify(basketItems);
    
    // PayTR için gerekli parametreler
    const params = {
      merchant_id: MERCHANT_ID,
      user_ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      merchant_oid: orderId,
      email: user.email,
      payment_amount: order.amount, // Kuruş cinsinden toplam tutar
      currency: 'TL',
      test_mode: '1', // Test modu (1: açık, 0: kapalı)
      no_installment: '0', // Taksit seçeneği (0: aktif, 1: deaktif)
      max_installment: '12', // Maksimum taksit sayısı
      user_name: user.fullName,
      user_address: user.address,
      user_phone: user.phone,
      merchant_ok_url: `${request.nextUrl.origin}/odeme/basarili`,
      merchant_fail_url: `${request.nextUrl.origin}/odeme/basarisiz`,
      basket: basketStr,
      debug_on: '1', // Debug modu (1: açık, 0: kapalı)
      cc_owner: card.name,
      cc_number: card.number,
      expiry_month: card.expiry.split('/')[0],
      expiry_year: `20${card.expiry.split('/')[1]}`,
      cvv: card.cvv,
    };
    
    // Hash oluştur
    const hashStr = `${MERCHANT_ID}${params.user_ip}${params.merchant_oid}${params.email}${params.payment_amount}${params.currency}${params.test_mode}${params.no_installment}${params.max_installment}${params.merchant_ok_url}${params.merchant_fail_url}${params.user_name}${params.user_phone}${params.user_address}${params.basket}${params.debug_on}${params.cc_owner}${params.cc_number}${params.expiry_month}${params.expiry_year}${params.cvv}`;
    
    const paytrToken = Buffer.from(`${hashStr}${MERCHANT_SALT}`, 'utf8').toString();
    const token = crypto.createHash('sha256').update(paytrToken).digest('base64');
    
    // PayTR API'sine istek gönder
    const formData = new FormData();
    Object.entries({ ...params, paytr_token: token }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    
    // Kredi kartı siparişini dosya tabanlı depolama sistemine kaydet
    try {
      addOrder({
        id: uuidv4(),
        orderId,
        status: 'processing', // İşleniyor durumu
        totalAmount: order.amount / 100, // TL cinsinden (kuruştan çevir)
        paymentMethod: 'creditCard',
        paymentStatus: 'completed',
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        shippingAddress: user.address,
        city: user.city,
        zipCode: user.zipCode || '',
        createdAt: new Date().toISOString(),
        items: order.items.map(item => ({
          id: uuidv4(),
          productId: item.id,
          name: item.name,
          price: item.price / 100, // TL cinsinden (kuruştan çevir)
          quantity: item.quantity
        }))
      });
    } catch (error) {
      console.error('Kredi kartı siparişi kaydedilemedi:', error);
      // Hata durumunda işleme devam et, kritik değil
    }
    
    // Gerçek entegrasyonda bu kısım aktif edilmeli
    // const paytrResponse = await fetch(PAYTR_API_URL, {
    //   method: 'POST',
    //   body: formData,
    // });
    // 
    // const paytrResult = await paytrResponse.json();
    // 
    // if (paytrResult.status === 'success') {
    //   return NextResponse.json({
    //     success: true,
    //     redirectUrl: paytrResult.token,
    //   });
    // } else {
    //   return NextResponse.json(
    //     { success: false, error: paytrResult.reason },
    //     { status: 400 }
    //   );
    // }
    
    // Test amaçlı başarılı yanıt
    return NextResponse.json({
      success: true,
      orderId,
      // redirectUrl: 'https://www.paytr.com/odeme/guvenli/' + token,
      message: 'Ödeme başarıyla tamamlandı.',
    });
    
  } catch (error) {
    console.error('Ödeme işlemi hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Ödeme işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
} 