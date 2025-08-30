// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

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

  // Session validation will happen in the AuthContext and API routes
  // Middleware just checks for presence of session cookie
  console.log(`[Middleware] Session ID present, allowing access`);

  // Add session ID to request headers for API routes to use
  const response = NextResponse.next();
  response.headers.set('X-Session-ID', sessionId);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
}