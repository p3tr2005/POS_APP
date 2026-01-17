import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PROTECTED_ROUTES_PREFIX } from '@/utils/constants';

import { auth } from './auth';

export async function proxy(request: NextRequest) {
  const sessionCookie = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = pathname.startsWith(PROTECTED_ROUTES_PREFIX);

  // 1. Jika mencoba akses rute terproteksi tapi tidak punya session
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // 2. Jika mencoba akses rute auth (login/register) tapi sudah punya session
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Jalankan middleware untuk semua rute kecuali file statis dan api
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
