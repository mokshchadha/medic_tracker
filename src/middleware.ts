// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`[Middleware] Processing: ${pathname}`);

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/check', 
    '/api/auth/logout',
    '/login',
    '/favicon.ico'
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    console.log(`[Middleware] ${pathname} is a public route, allowing access`);
    return NextResponse.next();
  }

  // Skip middleware for Next.js internal routes
  if (pathname.startsWith('/_next/')) {
    console.log(`[Middleware] ${pathname} is a Next.js internal route, skipping`);
    return NextResponse.next();
  }

  // Get session ID from cookies
  const sessionId = request.cookies.get('sessionId')?.value;
  console.log(`[Middleware] Session ID: ${sessionId ? 'present' : 'missing'}`);

  // If no session ID, redirect to login
  if (!sessionId) {
    console.log(`[Middleware] No session ID, redirecting to login`);
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Validate session
  const validation = AuthService.validateSession(sessionId);
  console.log(`[Middleware] Session validation result:`, validation);

  if (!validation.valid) {
    console.log(`[Middleware] Invalid session, clearing cookie and redirecting to login`);
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    
    response.cookies.set('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;
  }

  console.log(`[Middleware] Valid session for user: ${validation.username}`);

  // Add user info to request headers for use in API routes
  const response = NextResponse.next();
  response.headers.set('X-User-ID', validation.userId?.toString() || '');
  response.headers.set('X-Username', validation.username || '');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
}