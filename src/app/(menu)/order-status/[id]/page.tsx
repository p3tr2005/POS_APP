'use client';

import { useEffect, useRef, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { CheckCircle2, Clock, Package, Volume2, VolumeX, Zap } from 'lucide-react';

export default function OrderStatusPage() {
  const params = useParams();
  const [status, setStatus] = useState<'PENDING' | 'READY' | 'COMPLETED' | null>(null);
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);

  // Ref untuk melacak perubahan status agar audio tidak looping
  const prevStatus = useRef<'PENDING' | 'READY' | 'COMPLETED' | null>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/order-status?id=${params.id}`);
      const data = await res.json();
      setStatus(data.status);
    } catch (e) {
      console.error('FAILED_TO_FETCH_STATUS');
    }
  };

  // Logic Polling: Berhenti jika sudah READY atau COMPLETED
  useEffect(() => {
    checkStatus();
    if (status === 'PENDING' || status === null) {
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [params.id, status]);

  // Logic Audio Notification
  useEffect(() => {
    if (isMuted) return;

    // Bell berbunyi saat pertama kali halaman terbuka dan status pending
    if (prevStatus.current === null && status === 'PENDING') {
      new Audio('/bell.mp3').play().catch(() => null);
    }

    // Suara Ready berbunyi HANYA saat transisi dari PENDING ke READY
    if (prevStatus.current === 'PENDING' && status === 'READY') {
      new Audio('/order-ready.mp3').play().catch(() => null);

      // Getar HP (Vibrate API)
      if (window.navigator.vibrate) {
        window.navigator.vibrate([300, 100, 300]);
      }
    }

    prevStatus.current = status;
  }, [status, isMuted]);

  if (!status)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          <p className="animate-pulse font-black tracking-widest italic">CONNECTING_TO_SERVER...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f0f0] p-6 font-sans text-black">
      {/* TOMBOL MUTE FLOATING */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-6 right-6 z-50 rounded-full bg-black p-4 text-white shadow-xl transition-transform hover:scale-110"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="relative w-full max-w-md">
        {/* AKSEN GARIS TIGA (ADIDAS VIBE) */}
        <div className="absolute -top-12 left-10 flex gap-2">
          <div className="h-20 w-4 skew-x-[20deg] bg-black"></div>
          <div className="h-20 w-4 skew-x-[20deg] bg-black"></div>
          <div className="h-20 w-4 skew-x-[20deg] bg-black"></div>
        </div>

        <div className="relative overflow-hidden border-[10px] border-black bg-white p-8 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)]">
          {/* HEADER SECTION */}
          <div className="mb-10 flex items-start justify-between">
            <div>
              <Zap size={40} fill="black" strokeWidth={0} />
              <p className="mt-2 text-[10px] font-black tracking-[0.3em] uppercase italic opacity-30">
                Live_Order_Tracker
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase opacity-40">Order_ID</p>
              <p className="text-lg leading-none font-black italic">
                #{params.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="py-10 text-center">
            {status === 'PENDING' ? (
              <div className="animate-in fade-in zoom-in space-y-8 duration-700">
                <div className="relative flex justify-center">
                  <Clock size={100} className="animate-spin-slow absolute opacity-10" />
                  <Package size={80} className="relative z-10 translate-y-2" />
                </div>

                <h1 className="text-[4rem] leading-[0.85] font-black tracking-tighter uppercase italic">
                  WE_ARE
                  <br />
                  <span className="bg-black px-2 text-white">PREPARING</span>
                  <br />
                  YOUR_BOBA
                </h1>

                <div className="flex justify-center gap-3 pt-4">
                  <div className="h-3 w-3 animate-bounce rounded-full bg-black"></div>
                  <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
                  <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
                </div>

                <p className="text-xs font-bold tracking-[0.2em] uppercase italic opacity-50">
                  Please wait at your table
                </p>
              </div>
            ) : (
              <div className="animate-in zoom-in-95 space-y-8 duration-500">
                <div className="flex justify-center">
                  <div className="relative">
                    <CheckCircle2
                      size={120}
                      className="relative z-10 text-[#00FF41]"
                      strokeWidth={3}
                    />
                    <div className="absolute inset-0 animate-pulse bg-[#00FF41] opacity-20 blur-3xl"></div>
                  </div>
                </div>

                <h1 className="text-[5rem] leading-[0.8] font-black tracking-tighter text-black uppercase italic">
                  ORDER
                  <br />
                  <span className="text-[#00FF41] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    IS_READY
                  </span>
                </h1>

                <div
                  onClick={() => router.push('/')}
                  className="-rotate-2 transform bg-black p-6 shadow-[8px_8px_0px_0px_rgba(0,255,65,1)]"
                >
                  <p className="text-2xl font-black tracking-widest text-white uppercase italic">
                    COLLECT_NOW
                  </p>
                </div>

                <p className="animate-bounce pt-4 text-sm font-black uppercase italic">
                  → Go to the Pickup Counter ←
                </p>
              </div>
            )}
          </div>

          {/* FOOTER AKSEN */}
          <div className="mt-12 flex items-center justify-between border-t-[4px] border-black pt-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-1 bg-black"></div>
              ))}
            </div>
            <p className="text-[9px] font-black tracking-[0.4em] uppercase italic opacity-20">
              Authentic_Boba_System_v1.0
            </p>
          </div>
        </div>
      </div>

      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none fixed bottom-0 left-0 p-10 opacity-5">
        <h1 className="text-[15vw] leading-none font-black tracking-tighter italic">BOBA_POS</h1>
      </div>
    </div>
  );
}
