// src/components/dashboard/OrderNotifier.tsx
'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Bell } from 'lucide-react';

export function OrderNotifier() {
  const router = useRouter();
  const [hasNewOrder, setHasNewOrder] = useState(false);

  useEffect(() => {
    // Polling sederhana: Cek data baru setiap 10 detik
    const interval = setInterval(() => {
      router.refresh(); // Meminta Next.js mengambil data terbaru (Server Component)
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      {hasNewOrder && (
        <div className="fixed top-10 left-1/2 z-[100] flex -translate-x-1/2 animate-bounce items-center gap-6 border-8 border-white bg-black p-6 text-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
          <Bell size={40} className="animate-pulse fill-white" />
          <div>
            <h4 className="text-3xl leading-none font-black uppercase italic">
              New Incoming Order!
            </h4>
            <p className="text-[10px] font-bold tracking-[0.3em] opacity-60">
              CHECK THE DASHBOARD IMMEDIATELY
            </p>
          </div>
          <button
            onClick={() => setHasNewOrder(false)}
            className="border-2 border-white px-4 py-2 text-xs font-black"
          >
            DISMISS
          </button>
        </div>
      )}
    </>
  );
}
