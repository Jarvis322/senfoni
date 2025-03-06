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
    return NextResponse.next();
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/admin/:path*'
  ],
}; 