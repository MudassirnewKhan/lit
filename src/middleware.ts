// File Path: src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is the secret path stored on the server.
const ADMIN_PATH = process.env.ADMIN_LOGIN_PATH;

// The "Allow List" of all known public pages and page groups.
const publicRoutes = [
  '/',
  '/about',
  '/apply',
  '/alumni',
  '/resources',
  '/policies',
  '/login',
  '/donate'
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Check if the requested path is the exact secret admin path.
  if (pathname === `/${ADMIN_PATH}`) {
    // If it matches, allow the request to proceed to the admin page.
    return NextResponse.next();
  }

  // 2. Check if the requested path is one of the known public routes.
  const isPublic = publicRoutes.some(route => 
    pathname === route || (pathname.startsWith(route + '/') && route !== '/')
  );
  
  if (isPublic) {
    // If it's a public route, allow the request.
    return NextResponse.next();
  }

  // 3. If it's not the admin path and not a public route, it's an invalid attempt.
  // Block the request by FORCEFULLY REDIRECTING to the homepage.
  const url = request.nextUrl.clone();
  url.pathname = '/'; // Redirect to the homepage
  return NextResponse.redirect(url);
}

// This config ensures the middleware runs on every request except for static files
// and internal Next.js assets, which is necessary for this security model.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};