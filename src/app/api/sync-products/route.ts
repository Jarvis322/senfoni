import { syncProductsWithDatabase } from '@/services/productService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("API: Starting product synchronization...");
    const result = await syncProductsWithDatabase();
    console.log("API: Synchronization result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API: Synchronization error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 