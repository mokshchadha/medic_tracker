import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    const validation = AuthService.validateSession(sessionId);

    if (!validation.valid) {
      const response = NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
      
      response.cookies.set('sessionId', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
      });

      return response;
    }

    return NextResponse.json({
      authenticated: true,
      username: validation.username,
      userId: validation.userId
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}