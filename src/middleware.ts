import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

// Define protected routes that require authentication
const protectedRoutes = [
  '/hesabim',
  '/hesabim/siparisler',
  '/hesabim/favoriler',
  '/hesabim/adresler',
  '/hesabim/ayarlar',
  '/sepet/odeme'
];

// Define admin routes that require admin role
const adminRoutes = [
  '/admin'
];

// Statik dosyalar için önbellek süreleri (24 saat)
const STATIC_FILE_CACHE_MAX_AGE = 60 * 60 * 24
// API yanıtları için önbellek süreleri (1 saat)
const API_CACHE_MAX_AGE = 60 * 60
// Sayfa önbellekleri için yeniden doğrulama süresi (1 gün)
const REVALIDATE_TIME = 60 * 60 * 24

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // GEÇİCİ OLARAK DEVRE DIŞI BIRAKILIYOR
  // Admin sayfalarına erişim için kontrol yapılmıyor
  if (pathname.startsWith('/admin')) {
    console.log("Admin route detected, temporarily allowing access:", pathname);
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If it's not a protected or admin route, continue
  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next();
  }
  
  // Get the token from the cookie
  const token = request.cookies.get('auth_token')?.value;
  
  // If there's no token and it's a protected route, redirect to login
  if (!token) {
    const url = new URL('/giris', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  try {
    // Verify the token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    // For admin routes, check if the user is an admin (this would require additional logic)
    if (isAdminRoute) {
      console.log("Admin route detected:", pathname);
      
      try {
        // Kullanıcı bilgilerini al
        console.log("Fetching user data from API...");
        const userResponse = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
          headers: {
            Cookie: `auth_token=${token}`
          }
        });
        
        if (!userResponse.ok) {
          console.error("User data fetch failed:", userResponse.status, userResponse.statusText);
          throw new Error('Kullanıcı bilgileri alınamadı');
        }
        
        const userData = await userResponse.json();
        console.log("User data received:", userData);
        
        // Admin değilse ana sayfaya yönlendir
        if (userData.user.role !== 'ADMIN') {
          console.log("User is not admin, redirecting to home page");
          return NextResponse.redirect(new URL('/', request.url));
        }
        
        console.log("User is admin, proceeding to admin page");
      } catch (error) {
        console.error("Error in admin route check:", error);
        const url = new URL('/giris', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }
    
    // Continue to the protected route
    const response = NextResponse.next();

    // İstek yolu - pathname zaten yukarıda tanımlandı, tekrar tanımlamaya gerek yok
    // const pathname = request.nextUrl.pathname

    // Statik dosyalar için önbellek başlıkları
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/fonts/') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js')
    ) {
      response.headers.set(
        'Cache-Control',
        `public, max-age=${STATIC_FILE_CACHE_MAX_AGE}, s-maxage=${STATIC_FILE_CACHE_MAX_AGE}, stale-while-revalidate=${REVALIDATE_TIME}`
      )
    }
    // API istekleri için önbellek başlıkları
    else if (pathname.startsWith('/api/')) {
      // POST istekleri için önbellek devre dışı
      if (request.method === 'POST') {
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
      } else {
        response.headers.set(
          'Cache-Control',
          `public, max-age=${API_CACHE_MAX_AGE}, s-maxage=${API_CACHE_MAX_AGE}, stale-while-revalidate=${REVALIDATE_TIME}`
        )
      }
    }
    // Diğer sayfalar için önbellek başlıkları
    else {
      response.headers.set(
        'Cache-Control',
        'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      )
    }

    // Güvenlik başlıkları
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    )

    return response;
  } catch (error) {
    // If token verification fails, redirect to login
    const url = new URL('/giris', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)',
    '/admin/:path*'
  ],
}; 