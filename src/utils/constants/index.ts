/**
 * Rute yang HANYA bisa diakses jika user BELUM login.
 * Jika sudah login, user akan di-redirect ke dashboard.
 */
export const AUTH_ROUTES = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password'];

/**
 * Rute yang butuh login.
 * Semua rute yang dimulai dengan prefix ini akan diproteksi.
 */
export const PROTECTED_ROUTES_PREFIX = '/dashboard';

/**
 * Rute publik yang bisa diakses siapa saja (misal: Landing Page).
 */
export const PUBLIC_ROUTES = [
  '/menu/public',
  '/menu/checkout',
  '/order-status', // Kita pakai startsWith nanti untuk menangani ID dinamis
];

/**
 * Redirect default setelah login sukses.
 */
export const DEFAULT_AUTH_REDIRECT = '/auth/sign-in';
export const DEFAULT_LOGIN_REDIRECT = '/dashboard';
