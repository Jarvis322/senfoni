import { NextRequest, NextResponse } from 'next/server';
import { fetchAndUpdateExchangeRates } from '@/services/currencyService';

// Döviz kurlarını dış API'den güncelle
export async function POST(request: NextRequest) {
  try {
    await fetchAndUpdateExchangeRates();
    
    return NextResponse.json({
      success: true,
      message: 'Exchange rates updated successfully',
    });
  } catch (error) {
    console.error('Error refreshing exchange rates:', error);
    
    return NextResponse.json(
      { error: 'Failed to refresh exchange rates' },
      { status: 500 }
    );
  }
} 