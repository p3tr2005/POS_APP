import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import {
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  PROTECTED_ROUTES_PREFIX,
  PUBLIC_ROUTES,
} from '@/utils/constants';

import { auth } from './auth';

// 1. Definisikan rute yang boleh diakses semua orang tanpa login

export async function proxy(request: NextRequest) {
  const sessionCookie = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = pathname.startsWith(PROTECTED_ROUTES_PREFIX);

  // Cek apakah rute saat ini adalah rute publik
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // --- LOGIC MIDDLEWARE ---

  // 1. Jika rute publik, biarkan lewat (Next)
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. Jika mencoba akses rute terproteksi tapi tidak punya session
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // 3. Jika mencoba akses rute auth (login/register) tapi sudah punya session
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
