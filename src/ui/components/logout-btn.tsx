'use client';

import { useTransition } from 'react';

import { logoutAction } from '@/app/actions/auth.action';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logoutAction())}
      disabled={isPending}
      className="flex w-full items-center gap-4 px-6 py-4 text-sm font-black tracking-widest text-zinc-400 uppercase italic transition-all hover:bg-red-600 hover:text-white disabled:opacity-50"
    >
      <LogOut size={20} strokeWidth={3} />
      {isPending ? 'EXITING...' : 'Logout_System'}
    </button>
  );
}
