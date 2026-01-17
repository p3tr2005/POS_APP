'use client';
import { useActionState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SignUpFn } from '@/app/actions/auth.action';
// Pastikan action ini ada
import { UserPlus, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { getFieldError } from '@/utils/fn';

export default function SignUpPage() {
  const [state, action, isSubmitting] = useActionState(SignUpFn, null);
  const router = useRouter();

  useEffect(() => {
    if (!state) return;
    if (state.status === 'success') {
      toast.success('PERSONNEL REGISTERED');
      router.replace('/auth/sign-in');
      return;
    }
    if (typeof state.error === 'string') {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <main className="flex min-h-screen flex-col bg-white md:flex-row">
      {/* SISI KIRI: Visual Identity */}
      <div className="hidden flex-col justify-between bg-black p-12 text-white md:flex md:w-1/2">
        <div className="flex items-center gap-3">
          <Zap size={40} fill="white" strokeWidth={0} />
          <h2 className="text-4xl font-black tracking-tighter italic">POS_SYSTEM</h2>
        </div>
        <div>
          <h1 className="text-[8vw] leading-[0.8] font-black tracking-tighter uppercase italic">
            Join
            <br />
            The
            <br />
            Crew.
          </h1>
          <div className="mt-8 flex gap-2">
            <div className="h-2 w-10 bg-zinc-700"></div>
            <div className="h-2 w-20 bg-white"></div>
          </div>
        </div>
        <p className="text-xs font-black tracking-widest uppercase italic opacity-40">
          New Personnel Onboarding // 2026
        </p>
      </div>

      {/* SISI KANAN: Form Sign Up */}
      <div className="flex flex-1 flex-col justify-center p-8 md:p-24">
        <div className="mx-auto w-full max-w-md">
          <header className="mb-12">
            <h2 className="mb-4 text-6xl leading-none font-black tracking-tighter uppercase italic">
              Sign_Up
            </h2>
            <p className="text-[10px] font-black tracking-widest uppercase italic opacity-40">
              Create your staff credentials below
            </p>
          </header>

          <form action={action} className="space-y-6">
            {/* Input Name */}
            <div className="group space-y-2">
              <label
                className="block text-xs font-black tracking-widest uppercase italic"
                htmlFor="name"
              >
                Full_Name
              </label>
              <input
                id="name"
                name="username"
                type="text"
                required
                placeholder="YOUR NAME"
                className="w-full border-[6px] border-black p-5 text-lg font-black uppercase italic transition-all outline-none placeholder:text-zinc-200 focus:bg-black focus:text-white"
              />
              {getFieldError(state, 'name') && (
                <p className="text-[10px] font-black text-red-600 uppercase italic">
                  Error: {getFieldError(state, 'name')}
                </p>
              )}
            </div>

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

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="group mt-4 flex w-full items-center justify-between bg-black p-6 text-2xl font-black tracking-[0.2em] text-white uppercase italic shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-800"
            >
              {isSubmitting ? 'REGISTERING...' : 'Join_System'}
              <UserPlus className="transition-transform group-hover:scale-110" strokeWidth={4} />
            </button>
          </form>

          {/* Footer Link */}
          <footer className="mt-12 flex flex-col gap-2 border-t-4 border-zinc-100 pt-8">
            <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase italic">
              Already a member?
            </p>
            <Link
              href="/auth/sign-in"
              className="text-xl font-black tracking-tighter text-black uppercase italic underline decoration-4 underline-offset-4 transition-opacity hover:opacity-50"
            >
              Back_To_Login_→
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
