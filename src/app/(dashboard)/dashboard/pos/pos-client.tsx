// src/app/(dashboard)/pos/POSClient.tsx
'use client';

import { useState, useTransition } from 'react';

import { processCheckoutAction } from '@/app/actions/checkout.action';
import { Minus, Plus, Search, ShoppingBag, Trash2, Utensils } from 'lucide-react';

export default function POSClient({ initialProducts }: { initialProducts: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');

  // Logic Tambah/Kurang Keranjang
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    startTransition(async () => {
      const res = await processCheckoutAction(cart);
      if (res.success) {
        alert('TRANSACTION COMPLETED');
        setCart([]);
      } else {
        alert(res.error);
      }
    });
  };

  const filteredProducts = initialProducts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full gap-0 border-t-4 border-black">
      {/* KIRI: MENU GRID */}
      <div className="flex-1 overflow-y-auto bg-[#f3f3f3] p-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-7xl leading-none font-black tracking-tighter uppercase italic">
            Catalog
          </h2>
          <div className="relative w-72 border-4 border-black bg-white">
            <Search className="absolute top-3 left-3" size={20} />
            <input
              type="text"
              placeholder="SEARCH MENU..."
              className="w-full p-3 pl-10 text-xs font-black tracking-widest uppercase outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="group flex h-48 flex-col justify-between border-4 border-black bg-white p-4 text-left transition-all hover:bg-black hover:text-white"
            >
              <div className="flex items-start justify-between">
                <span className="border border-current px-1 text-[10px] font-black italic">
                  IDR {Number(product.price).toLocaleString()}
                </span>
                <Utensils size={16} className="opacity-20 group-hover:opacity-100" />
              </div>
              <h4 className="mt-4 text-2xl leading-tight font-black tracking-tighter uppercase italic">
                {product.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* KANAN: CART / STRUK */}
      <div className="flex w-[450px] flex-col border-l-8 border-black bg-white">
        <div className="border-b-4 border-black bg-black p-8 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black tracking-tighter uppercase italic">Current Order</h3>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-8">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center opacity-20">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="mt-4 font-black tracking-[0.2em] italic">EMPTY_BAG</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="group border-b-2 border-zinc-100 pb-4">
                <div className="mb-3 flex items-start justify-between">
                  <h5 className="text-lg leading-none font-black uppercase italic">{item.title}</h5>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-300 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex border-2 border-black">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 transition-all hover:bg-black hover:text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex items-center bg-zinc-50 px-4 font-black">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 transition-all hover:bg-black hover:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-lg font-black italic">
                    IDR {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER TOTAL */}
        <div className="space-y-6 border-t-8 border-black p-8">
          <div className="flex items-end justify-between">
            <span className="text-xs font-black tracking-[0.3em] text-zinc-400">TOTAL_PAYABLE</span>
            <span className="text-4xl font-black tracking-tighter italic underline decoration-4 underline-offset-4">
              IDR {total.toLocaleString()}
            </span>
          </div>

          <button
            disabled={cart.length === 0 || isPending}
            onClick={handleCheckout}
            className="flex w-full items-center justify-center gap-4 bg-black py-6 text-xl font-black tracking-[0.4em] text-white uppercase italic transition-all hover:bg-zinc-800 disabled:bg-zinc-200"
          >
            {isPending ? 'PROCESSING...' : 'PROCESS_CHECKOUT'}
          </button>
        </div>
      </div>
    </div>
  );
}
