import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import PayTRService from '@/services/PayTRService';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const params = Object.fromEntries(data.entries());

    // PayTR callback doğrulama
    const isValid = PayTRService.verifyPaymentCallback(params);
    if (!isValid) {
      console.error('Invalid PayTR callback:', params);
      return NextResponse.json({ error: 'Invalid callback' }, { status: 400 });
    }

    // Siparişi güncelle
    const order = await prisma.order.update({
      where: {
        id: params.merchant_oid as string
      },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.FAILED,
        paymentDetails: params as any
      }
    });

    return NextResponse.json({
      status: 'success',
      orderId: order.id
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
} 