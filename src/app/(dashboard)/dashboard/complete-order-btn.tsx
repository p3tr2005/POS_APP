// src/components/dashboard/CompleteOrderButton.tsx
'use client';

import { useTransition } from 'react';

import { updateOrderStatusAction } from '@/app/actions/checkout.action';
import { Check } from 'lucide-react';

export function CompleteOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await updateOrderStatusAction(orderId, 'COMPLETED');
        });
      }}
      className="flex items-center gap-2 bg-black px-6 py-3 text-[10px] font-black tracking-[0.3em] text-white uppercase italic transition-all hover:bg-zinc-800 disabled:opacity-50"
    >
      <Check size={14} strokeWidth={4} />
      {isPending ? 'PROCESSING...' : 'MARK_AS_PAID'}
    </button>
  );
}
