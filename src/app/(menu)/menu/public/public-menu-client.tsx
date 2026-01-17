'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { createPublicOrderAction } from '@/app/actions/public-order.action';
import { ArrowRight, Plus, ShoppingBag, X, Zap } from 'lucide-react';

export default function PublicMenuClient({ products }: { products: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleConfirmOrder = () => {
    startTransition(async () => {
      const res = await createPublicOrderAction(cart);
      if (res.success && res.orderId) {
        setCart([]);
        setIsCartOpen(false);
        router.push(`/order-status/${res.orderId}`);
      }
    });
  };

  return (
    <div className="mx-auto min-h-screen max-w-md border-x-[6px] border-black bg-white pb-32">
      {/* ADIDAS STYLE HEADER */}
      <header className="sticky top-0 z-40 border-b-[6px] border-black bg-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-6xl leading-[0.8] font-black tracking-tighter uppercase italic">
              The
              <br />
              Menu
            </h1>
            <p className="mt-4 text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
              Freshly_Served_Daily
            </p>
          </div>
          <Zap size={40} fill="black" strokeWidth={0} />
        </div>
      </header>

      {/* PRODUCT LIST */}
      <div className="space-y-10 p-6">
        {products.map((item) => (
          <div key={item.id} className="group flex items-center justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-3xl leading-none font-black tracking-tighter uppercase italic transition-transform group-active:translate-x-2">
                {item.title}
              </h3>
              <p className="text-lg font-black italic opacity-60">
                IDR {Number(item.price).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                const existing = cart.find((c) => c.id === item.id);
                if (existing) {
                  setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
                } else {
                  setCart([...cart, { ...item, qty: 1 }]);
                }
              }}
              className="flex h-14 w-14 items-center justify-center bg-black text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] transition-all active:scale-90"
            >
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>

      {/* FLOATING CART BUTTON */}
      {totalItems > 0 && (
        <div className="fixed right-0 bottom-0 left-0 z-50 p-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="mx-auto flex w-full max-w-md items-center justify-between bg-black p-6 text-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <span className="flex items-center gap-3 font-black tracking-widest italic">
              <ShoppingBag size={20} /> BAG ({totalItems})
            </span>
            <span className="text-xl font-black italic underline decoration-2 underline-offset-4">
              IDR {total.toLocaleString()}
            </span>
          </button>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="animate-in slide-in-from-bottom fixed inset-0 z-[60] flex flex-col bg-white p-8 duration-300">
          <div className="mb-12 flex justify-between">
            <h2 className="text-5xl leading-none font-black tracking-tighter uppercase italic">
              Your_Bag
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="border-4 border-black p-2">
              <X size={24} strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between border-b-2 border-black pb-4">
                <div className="text-xl leading-none font-black uppercase italic">{item.title}</div>
                <div className="text-xl font-black italic">x{item.qty}</div>
              </div>
            ))}
          </div>

          <div className="border-t-[8px] border-black pt-8">
            <div className="mb-8 flex items-end justify-between">
              <span className="text-xs font-black tracking-[0.3em] opacity-40">TOTAL_PAYABLE</span>
              <span className="text-5xl font-black tracking-tighter italic">
                IDR {total.toLocaleString()}
              </span>
            </div>
            <button
              disabled={isPending}
              onClick={handleConfirmOrder}
              className="flex w-full items-center justify-center gap-4 bg-black py-8 text-2xl font-black tracking-[0.2em] text-white uppercase italic active:bg-zinc-800 disabled:bg-zinc-400"
            >
              {isPending ? 'SENDING...' : 'Confirm Order'} <ArrowRight strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
