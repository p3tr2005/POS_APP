'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { db } from '@/database';
import { user } from '@/database/models';
import { BetterAuthError } from 'better-auth';
import { eq } from 'drizzle-orm';
import { flatten, safeParse } from 'valibot';

import { DEFAULT_AUTH_REDIRECT } from '@/utils/constants';
import { SignInFormSchema, SignUpFormSchema } from '@/utils/validators/auth.validator';

export async function SignUpFn(_: unknown, formData: FormData) {
  const payload = Object.fromEntries(formData);
  const { output: values, success, issues } = safeParse(SignUpFormSchema, payload);

  if (!success) {
    return { status: 'error', error: flatten(issues).nested };
  }

  try {
    // Gunakan await untuk memastikan proses selesai
    const resp = await auth.api.signUpEmail({
      body: {
        email: values.email,
        password: values.password,
        name: values.username, // Gunakan values.name sesuai input form
      },
    });

    // Jika resp ada, berarti berhasil
    if (resp) {
      return { status: 'success' };
    }
  } catch (err: any) {
    // Cek jika user sudah ada (Error 422 atau email-already-exists)
    if (err.status === 422 || err.body?.code === 'USER_ALREADY_EXISTS') {
      return { status: 'error', error: 'Email already registered.' };
    }

    console.error('[AUTH_ERROR]:', err);
    return { status: 'error', error: 'Failed to create account.' };
  }
}

export async function SignInFn(_: unknown, formData: FormData) {
  console.log('[INFO]: sign in - HIT.');

  const payload = Object.fromEntries(formData);

  // 1. validating input.
  const { output: values, success, issues } = safeParse(SignInFormSchema, payload);

  console.log('[INFO]: ', values);

  if (!success)
    return {
      status: 'error',
      error: flatten(issues).nested,
    };

  // 2. sign up
  try {
    const resp = await auth.api.signInEmail({
      body: { ...values, rememberMe: true, callbackURL: '/' },
    });

    console.log('[INFO]: sign in success.');

    console.log(resp);

    return { status: 'success' };
  } catch (err: any) {
    // console.log('[DEBUG] Error Body:', err.body);

    // 1. Check for the 401 Unauthorized status
    if (err.status === 'UNAUTHORIZED' || err.statusCode === 401) {
      return {
        status: 'error',
        error: 'Invalid email or password.',
      };
    }

    // 2. Fallback for other errors (like 500 or network issues)
    return {
      status: 'error',
      error: err.body?.message || 'Something went wrong, please try again.',
    };
  }
}

export async function logoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect(DEFAULT_AUTH_REDIRECT);
}

export async function updateUserRole(
  targetUserId: string,
  newRole: 'ADMIN' | 'CASHIER' | 'KITCHEN'
) {
  // 1. Cek apakah pengubah adalah Admin
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('UNAUTHORIZED_ACTION');
  }

  // 2. Update role di database
  await db.update(user).set({ role: newRole }).where(eq(user.id, targetUserId));

  // 3. Refresh data di halaman tersebut
  revalidatePath('/dashboard/users');

  return { success: true };
}
