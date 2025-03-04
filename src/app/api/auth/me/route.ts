import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/services/userService';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get the token from the cookie
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Oturum açılmamış' 
      }, { status: 401 });
    }
    
    // Verify the token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as { userId: string };
    
    // Get the user from the database
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user 
    });
  } catch (error: any) {
    // If token is invalid or expired
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      const response = NextResponse.json({ 
        success: false, 
        error: 'Oturum süresi dolmuş, lütfen tekrar giriş yapın' 
      }, { status: 401 });
      
      // Clear the invalid token
      response.cookies.set({
        name: 'auth_token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
      });
      
      return response;
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Bir hata oluştu' 
    }, { status: 500 });
  }
} 