import { NextRequest, NextResponse } from 'next/server';
import { loginUser, UserLoginData } from '@/services/userService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const loginData: UserLoginData = {
      email: body.email,
      password: body.password
    };

    const result = await loginUser(loginData);

    // Set JWT token as HTTP-only cookie
    const response = NextResponse.json({ 
      success: true, 
      user: result.user 
    });
    
    response.cookies.set({
      name: 'auth_token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Giriş sırasında bir hata oluştu' 
    }, { status: 401 });
  }
} 