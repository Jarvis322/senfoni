import { NextRequest, NextResponse } from 'next/server';
import { syncProductsWithDatabase } from '@/services/productService';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authorization here if needed
    // This is a simple implementation - in production, you should add proper auth checks
    
    console.log("Starting product synchronization from API route");
    const result = await syncProductsWithDatabase();
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in sync products API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 