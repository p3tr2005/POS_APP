'use client';
import { useActionState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SignInFn } from '@/app/actions/auth.action';
import { ArrowRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { getFieldError } from '@/utils/fn';

export default function SignInPage() {
  const [state, action, isSubmitting] = useActionState(SignInFn, null);
  const router = useRouter();

  useEffect(() => {
    if (!state) return;
    if (state.status === 'success') {
      toast.success('ACCESS GRANTED');
      router.replace('/');
      return;
    }
    if (typeof state.error === 'string') {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <main className="flex min-h-screen flex-col bg-white md:flex-row">
      {/* SISI KIRI: Branding Visual (Hidden on mobile) */}
      <div className="hidden flex-col justify-between bg-black p-12 text-white md:flex md:w-1/2">
        <div className="flex items-center gap-3">
          <Zap size={40} fill="white" strokeWidth={0} />
          <h2 className="text-4xl font-black tracking-tighter italic">POS_SYSTEM</h2>
        </div>
        <div>
          <h1 className="text-[8vw] leading-[0.8] font-black tracking-tighter uppercase italic">
            Start
            <br />
            Your
            <br />
            Shift.
          </h1>
          <div className="mt-8 flex gap-2">
            <div className="h-2 w-20 bg-white"></div>
            <div className="h-2 w-10 bg-zinc-700"></div>
          </div>
        </div>
        <p className="text-xs font-black tracking-widest uppercase italic opacity-40">
          Authorized Personnel Only // 2026
        </p>
      </div>

      {/* SISI KANAN: Form Sign In */}
      <div className="flex flex-1 flex-col justify-center p-8 md:p-24">
        <div className="mx-auto w-full max-w-md">
          <header className="mb-12">
            <h2 className="mb-4 text-6xl leading-none font-black tracking-tighter uppercase italic">
              Sign_In
            </h2>
            <p className="text-[10px] font-black tracking-widest uppercase italic opacity-40">
              Enter credentials to unlock dashboard
            </p>
          </header>

          <form action={action} className="space-y-8">
            {/* Input Email */}
            <div className="group space-y-2">
              <label
                className="block text-xs font-black tracking-widest uppercase italic"
                htmlFor="email"
              >
                Staff_Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="EMAIL@KEDAI.COM"
                className="w-full border-[6px] border-black p-5 text-lg font-black uppercase italic transition-all outline-none placeholder:text-zinc-200 focus:bg-black focus:text-white"
              />
              {getFieldError(state, 'email') && (
                <p className="text-[10px] font-black text-red-600 uppercase italic">
                  Error: {getFieldError(state, 'email')}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div className="group space-y-2">
              <label
                className="block text-xs font-black tracking-widest uppercase italic"
                htmlFor="password"
              >
                Security_Key
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="********"
                className="w-full border-[6px] border-black p-5 text-lg font-black uppercase italic transition-all outline-none placeholder:text-zinc-200 focus:bg-black focus:text-white"
              />
              {getFieldError(state, 'password') && (
                <p className="text-[10px] font-black text-red-600 uppercase italic">
                  Error: {getFieldError(state, 'password')}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember-me"
                className="relative h-6 w-6 cursor-pointer appearance-none border-4 border-black checked:bg-black checked:after:absolute checked:after:top-[-4px] checked:after:left-1 checked:after:font-black checked:after:text-white checked:after:content-['✓']"
              />
              <label
                htmlFor="remember-me"
                className="cursor-pointer text-xs font-black uppercase italic"
              >
                Maintain_Session
              </label>
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="group flex w-full items-center justify-between bg-black p-6 text-2xl font-black tracking-[0.2em] text-white uppercase italic shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-800"
            >
              {isSubmitting ? 'VERIFYING...' : 'Access_Grant'}
              <ArrowRight
                className="transition-transform group-hover:translate-x-2"
                strokeWidth={4}
              />
            </button>
          </form>

          {/* Footer Link */}
          <footer className="mt-12 flex flex-col gap-2 border-t-4 border-zinc-100 pt-8">
            <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase italic">
              No account registered?
            </p>
            <Link
              href="/auth/sign-up"
              className="text-xl font-black tracking-tighter text-black uppercase italic underline decoration-4 underline-offset-4 transition-opacity hover:opacity-50"
            >
              Create_Account_→
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
