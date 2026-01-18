'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import ModifierModal from '@/app/(dashboard)/dashboard/pos/modifier-modal';
import { Dialog } from '@/ui/components/dialog';
import { useCartStore } from '@/ui/hooks/useCartStore';
import { ArrowRight, Plus, Search, ShoppingBag, UtensilsCrossed } from 'lucide-react';

export default function MenuClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [search, setSearch] = useState('');

  // Ambil state dari Zustand
  const { cart, addToCart } = useCartStore();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const filteredProducts = (products || []).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFBEB] pb-40 text-black">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b-[6px] border-black bg-white p-6 shadow-[0_6px_0_0_rgba(0,0,0,1)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="border-2 border-black bg-black p-2 text-white">
              <UtensilsCrossed size={24} />
            </div>
            <h1 className="text-3xl font-[1000] tracking-tighter uppercase italic">BOBA_GACOR</h1>
          </div>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="CARI MENU..."
              className="w-full border-4 border-black p-3 pl-12 text-sm font-black uppercase outline-none focus:bg-yellow-50"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 left-4 -translate-y-1/2 opacity-40" size={20} />
          </div>
        </div>
      </nav>

      {/* MODAL */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct && (
          <ModifierModal
            product={selectedProduct}
            onConfirm={(data: any) => {
              addToCart(selectedProduct, data);
              setSelectedProduct(null);
            }}
          />
        )}
      </Dialog>

      {/* GRID MENU */}
      <main className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-10 p-6 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border-[6px] border-black bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all hover:-translate-y-2"
          >
            <div className="flex h-56 items-center justify-center border-b-[6px] border-black bg-zinc-100">
              <ShoppingBag size={60} className="opacity-10" />
            </div>
            <div className="p-6">
              <h4 className="mb-6 text-3xl font-[1000] tracking-tighter uppercase italic">
                {product.title}
              </h4>
              <div className="flex items-end justify-between">
                <p className="text-3xl leading-none font-[1000] italic">
                  IDR {Number(product.price).toLocaleString()}
                </p>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="border-[4px] border-black bg-yellow-400 p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all active:shadow-none"
                >
                  <Plus size={28} strokeWidth={4} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* FLOATING CART BUTTON */}
      <div
        className={`fixed right-0 bottom-8 left-0 z-50 transform px-6 transition-all duration-500 ${
          totalItems > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => router.push('/menu/checkout')}
            className="flex w-full items-center justify-between border-[6px] border-white bg-black p-6 text-white shadow-[0_0_0_6px_rgba(0,0,0,1)] transition-all hover:bg-zinc-900"
          >
            <div className="flex items-center gap-5 text-left">
              <div className="relative">
                <ShoppingBag size={32} strokeWidth={3} />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-yellow-400 text-xs font-[1000] text-black">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="mb-1 text-[10px] leading-none font-black tracking-widest text-zinc-500 uppercase">
                  Total_Items
                </p>
                <p className="text-xl leading-none font-black tracking-tighter uppercase italic">
                  LIHAT_PESANAN
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="mb-1 text-[10px] leading-none font-black tracking-widest text-zinc-500 uppercase">
                  Subtotal
                </p>
                <p className="text-3xl font-[1000] tracking-tighter italic">
                  IDR {totalPrice.toLocaleString()}
                </p>
              </div>
              <ArrowRight size={32} strokeWidth={4} className="text-yellow-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
