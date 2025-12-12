import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignore API and Next.js internal files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret: secret });
  
  const adminLoginPath = `/${process.env.ADMIN_LOGIN_PATH}`;

  // --- 1. Protect User Routes ---
  // Added '/network' to this list so it requires login
  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/feed') || 
    pathname.startsWith('/mentorship') || 
    pathname.startsWith('/profile') ||
    pathname.startsWith('/network') // <--- ADDED THIS
  ) {
    if (!token) {
      // If trying to access these private pages without login, send to student login
      return NextResponse.redirect(new URL('/login/awardee', request.url));
    }
  }

  // --- 2. Admin & Sub-admin Logic ---
  // Check if user has EITHER 'admin' or 'subadmin' role
  // We explicitly cast token.roles to any or array to avoid TS errors if needed
  const userRoles = (token?.roles as string[]) || [];
  const isAdminUser = userRoles.some((role: string) => ['admin', 'subadmin'].includes(role));
  
  const isAccessingAdminRoute = pathname.startsWith('/admin');

  if (isAccessingAdminRoute) {
    // If trying to access /admin but NOT an admin or subadmin -> BLOCK
    if (!isAdminUser) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If they are admin/subadmin -> ALLOW
    return NextResponse.next();
  }

  // Prevent admins from seeing the secret login page if they are already logged in
  if (pathname === adminLoginPath) {
    if (isAdminUser) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};