'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { BetterAuthError } from 'better-auth';
import { flatten, safeParse } from 'valibot';

import { DEFAULT_AUTH_REDIRECT } from '@/utils/constants';
import { SignInFormSchema, SignUpFormSchema } from '@/utils/validators/auth.validator';

export async function SignUpFn(_: unknown, formData: FormData) {
  console.log('[INFO]: sign up - HIT.');

  const payload = Object.fromEntries(formData);

  // 1. validating input.
  const { output: values, success, issues } = safeParse(SignUpFormSchema, payload);

  console.log('[INFO]: ', values);

  if (!success) {
    console.log('[ERROR]: validation error.');

    return {
      status: 'error',
      error: flatten(issues).nested,
    };
  }

  // 2. sign up
  try {
    console.log('[INFO]: creating account...');

    const resp = await auth.api.signUpEmail({
      body: { ...values, name: values.username, rememberMe: true, callbackURL: '/auth/sign-in' },
    });

    console.log('[INFO]: account created.');

    console.log(resp);

    return { status: 'success' };
  } catch (err) {
    if (err instanceof BetterAuthError) {
      console.log('[ERROR]: Better-auth error');
      console.log(err);
    }

    return {
      status: 'error',
      error: 'Something went wrong, try again.',
    };
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
