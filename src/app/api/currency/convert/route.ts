import { NextRequest, NextResponse } from 'next/server';
import { convertCurrency } from '@/services/currencyService';
import { Currency } from '@/types/currency';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Query parametrelerini al
    const amountParam = searchParams.get('amount');
    const fromCurrency = searchParams.get('from') as Currency || 'TRY';
    const toCurrency = searchParams.get('to') as Currency || 'USD';
    
    // Miktar parametresi kontrolü
    if (!amountParam) {
      return NextResponse.json(
        { error: 'Amount parameter is required' },
        { status: 400 }
      );
    }
    
    // Miktar değerini sayıya çevir
    const amount = parseFloat(amountParam);
    
    // Geçerli bir sayı kontrolü
    if (isNaN(amount)) {
      return NextResponse.json(
        { error: 'Amount must be a valid number' },
        { status: 400 }
      );
    }
    
    // Para birimi çevirme işlemi
    const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
    
    // Başarılı yanıt
    return NextResponse.json({
      success: true,
      amount,
      fromCurrency,
      toCurrency,
      convertedAmount,
    });
  } catch (error) {
    console.error('Currency conversion error:', error);
    
    // Hata yanıtı
    return NextResponse.json(
      { error: 'Failed to convert currency' },
      { status: 500 }
    );
  }
} 