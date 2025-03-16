import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Önbellek süresi: 1 saat
export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    // API yanıtı için önbellek başlıkları
    const response = NextResponse.json(
      {
        products: [
          // Örnek ürün verileri
        ]
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, max-age=3600',
          'Vercel-CDN-Cache-Control': 'public, max-age=3600',
        },
      }
    )

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  }
}

// POST istekleri için önbellek devre dışı
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  }
} 