import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// PayTR servisini import et
const PayTRService = require('@/services/PayTRService');

export async function POST(request: NextRequest) {
  try {
    // PayTR'den gelen verileri al
    const formData = await request.formData();
    const merchantOid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const totalAmount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;

    console.log('PayTR callback received:', {
      merchantOid,
      status,
      totalAmount,
      hash
    });

    // Gerekli alanları kontrol et
    if (!merchantOid || !status || !totalAmount || !hash) {
      return NextResponse.json({ status: 'failed', message: 'Eksik parametreler' }, { status: 400 });
    }

    // Hash doğrulaması yap
    const isValid = await PayTRService.verifyCallback({
      merchantOid,
      status,
      totalAmount: parseInt(totalAmount, 10),
      hash
    });

    if (!isValid) {
      console.error('Invalid hash in PayTR callback');
      return NextResponse.json({ status: 'failed', message: 'Geçersiz hash' }, { status: 400 });
    }

    // Siparişi güncelle
    const order = await prisma.order.findUnique({
      where: { id: merchantOid }
    });

    if (!order) {
      console.error(`Order not found: ${merchantOid}`);
      return NextResponse.json({ status: 'failed', message: 'Sipariş bulunamadı' }, { status: 404 });
    }

    // Ödeme durumuna göre sipariş durumunu güncelle
    let orderStatus: OrderStatus;
    if (status === 'success') {
      orderStatus = OrderStatus.PROCESSING;
    } else {
      orderStatus = OrderStatus.CANCELLED;
    }

    await prisma.order.update({
      where: { id: merchantOid },
      data: { status: orderStatus, paymentStatus: status === 'success' ? 'PAID' : 'FAILED' }
    });

    console.log(`Order ${merchantOid} updated with status: ${orderStatus}`);

    // PayTR'ye başarılı yanıt döndür
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('PayTR callback error:', error);
    return NextResponse.json({ status: 'failed', message: 'İşlem hatası' }, { status: 500 });
  }
}

// CORS için OPTIONS metodu
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
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