import { NextRequest, NextResponse } from 'next/server';
import { registerUser, UserRegistrationData } from '@/services/userService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData: UserRegistrationData = {
      email: body.email,
      password: body.password,
      name: body.name,
      surname: body.surname,
      phone: body.phone
    };

    const result = await registerUser(userData);

    // Set JWT token as HTTP-only cookie
    const response = NextResponse.json({ 
      success: true, 
      user: result.user 
    }, { status: 201 });
    
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
      error: error.message || 'Kayıt işlemi sırasında bir hata oluştu' 
    }, { status: 400 });
  }
} 