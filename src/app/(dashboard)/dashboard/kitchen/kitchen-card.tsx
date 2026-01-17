// src/app/(dashboard)/dashboard/kitchen/KitchenCard.tsx
'use client';

import { useTransition } from 'react';

import { markOrderAsReadyAction } from '@/app/actions/kitchen.action';
import { CheckCircle2, Clock } from 'lucide-react';

export default function KitchenCard({ order }: { order: any }) {
  const [isPending, startTransition] = useTransition();

  const handleDone = () => {
    startTransition(async () => {
      await markOrderAsReadyAction(order.id);
    });
  };

  return (
    <div className="flex h-full flex-col border-[6px] border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between bg-black p-4 text-white">
        <span className="text-xl font-black tracking-tighter uppercase italic">
          #{order.id.slice(-5)}
        </span>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="text-xs font-black tracking-widest">
            {new Date(order.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div className="flex-1 space-y-4 p-6">
        {order?.items.map((item: any) => (
          <div key={item.id} className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-zinc-100 text-xl font-black text-black italic">
              {item.quantity}
            </div>
            <div className="flex-1">
              <p className="text-2xl leading-none font-black tracking-tight uppercase italic">
                {item.productTitle}
              </p>
              <p className="mt-1 text-[10px] font-bold tracking-widest uppercase opacity-40">
                Regular_Prep
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CARD FOOTER */}
      <button
        onClick={handleDone}
        disabled={isPending}
        className="flex items-center justify-center gap-3 bg-green-500 p-6 text-xl font-black tracking-[0.2em] text-white uppercase italic transition-colors hover:bg-green-600 disabled:opacity-50"
      >
        <CheckCircle2 size={24} strokeWidth={3} />
        {isPending ? 'PROCESSING...' : 'ORDER_READY'}
      </button>
    </div>
  );
}
