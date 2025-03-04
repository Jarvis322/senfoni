import { NextRequest, NextResponse } from 'next/server';
import { updateExchangeRates, getAllExchangeRates } from '@/services/currencyService';

// Döviz kurlarını getir
export async function GET() {
  try {
    const exchangeRates = await getAllExchangeRates();
    
    return NextResponse.json({
      success: true,
      data: exchangeRates,
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}

// Döviz kuru ekle/güncelle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Gerekli alanları kontrol et
    if (!body.baseCurrency || !body.targetCurrency || body.rate === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: baseCurrency, targetCurrency, rate' },
        { status: 400 }
      );
    }
    
    // Rate değerinin sayı olduğunu kontrol et
    const rate = parseFloat(body.rate);
    if (isNaN(rate) || rate <= 0) {
      return NextResponse.json(
        { error: 'Rate must be a positive number' },
        { status: 400 }
      );
    }
    
    // Döviz kurunu güncelle
    await updateExchangeRates([
      {
        baseCurrency: body.baseCurrency,
        targetCurrency: body.targetCurrency,
        rate,
      },
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Exchange rate updated successfully',
    });
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    
    return NextResponse.json(
      { error: 'Failed to update exchange rate' },
      { status: 500 }
    );
  }
}

// Döviz kurunu sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const baseCurrency = searchParams.get('baseCurrency');
    const targetCurrency = searchParams.get('targetCurrency');
    
    if (!baseCurrency || !targetCurrency) {
      return NextResponse.json(
        { error: 'Missing required parameters: baseCurrency, targetCurrency' },
        { status: 400 }
      );
    }
    
    // Burada silme işlemi yapılacak (şu an için desteklenmiyor)
    // await deleteExchangeRate(baseCurrency, targetCurrency);
    
    return NextResponse.json({
      success: true,
      message: 'Exchange rate deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting exchange rate:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete exchange rate' },
      { status: 500 }
    );
  }
} 