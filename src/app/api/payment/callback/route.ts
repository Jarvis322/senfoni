import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PayTRService } from '@/services/PayTRService';

// Enum değerlerini doğrudan tanımla
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export async function POST(request: NextRequest) {
  try {
    // PayTR'nin IP adreslerini kontrol et
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip');
    const allowedIps = ['193.111.162.0/24', '193.111.163.0/24']; // PayTR'nin IP aralıkları
    
    // IP kontrolü (production'da aktif edilmeli)
    // if (!allowedIps.some(ip => isIpInRange(clientIp, ip))) {
    //   console.error('Unauthorized IP:', clientIp);
    //   return new NextResponse('Unauthorized IP', { status: 403 });
    // }

    const data = await request.formData();
    
    // PayTR'den gelen verileri al
    const merchantOid = data.get('merchant_oid') as string;
    const status = data.get('status') as string;
    const totalAmount = data.get('total_amount') as string;
    const hash = data.get('hash') as string;
    
    // PayTR servisini başlat
    const paytr = new PayTRService();
    
    // Hash doğrulaması yap
    const isValid = paytr.verifyHash({
      merchant_oid: merchantOid,
      status: status,
      total_amount: totalAmount,
      hash: hash
    });
    
    if (!isValid) {
      console.error('PayTR hash doğrulaması başarısız');
      return new NextResponse('Hash validation failed', { status: 400 });
    }
    
    // Sipariş durumunu güncelle
    if (status === 'success') {
      await prisma.order.update({
        where: { id: merchantOid },
        data: { 
          status: 'PROCESSING',
          paymentStatus: 'PAID',
          paymentDetails: {
            provider: 'PAYTR',
            transactionId: data.get('transaction_id') as string,
            amount: parseFloat(totalAmount) / 100, // PayTR kuruş olarak gönderir
            date: new Date(),
            status: 'success'
          }
        }
      });
    } else {
      await prisma.order.update({
        where: { id: merchantOid },
        data: { 
          status: 'CANCELLED',
          paymentStatus: 'FAILED',
          paymentDetails: {
            provider: 'PAYTR',
            transactionId: data.get('transaction_id') as string || '',
            amount: parseFloat(totalAmount) / 100,
            date: new Date(),
            status: 'failed',
            errorMessage: data.get('failed_reason_msg') as string || 'Ödeme başarısız'
          }
        }
      });
    }
    
    // PayTR'ye başarılı yanıt gönder
    return new NextResponse('OK', { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('PayTR callback hatası:', error);
    return new NextResponse('Error', { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// IP aralığı kontrolü için yardımcı fonksiyon
function isIpInRange(ip: string | null, range: string): boolean {
  if (!ip) return false;
  
  const [rangeIp, bits] = range.split('/');
  const mask = ~((1 << (32 - parseInt(bits))) - 1);
  
  const ipParts = ip.split('.').map(Number);
  const rangeIpParts = rangeIp.split('.').map(Number);
  
  const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
  const rangeIpNum = (rangeIpParts[0] << 24) + (rangeIpParts[1] << 16) + (rangeIpParts[2] << 8) + rangeIpParts[3];
  
  return (ipNum & mask) === (rangeIpNum & mask);
} 