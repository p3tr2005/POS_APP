'use client';

import { useState, useTransition } from 'react';

import { processCheckoutAction } from '@/app/actions/checkout.action';
import { Dialog } from '@/ui/components/dialog';
import { Minus, Plus, Search, ShoppingBag, Trash2, Utensils, X } from 'lucide-react';
import { toast } from 'sonner';

import ModifierModal from './modifier-modal';

export default function POSClient({ initialProducts }: { initialProducts: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // 1. Logic Tambah ke Keranjang (Setelah Customization)
  const handleConfirmCustomization = (customData: { modifiers: string[]; notes: string }) => {
    const cartId = `${selectedProduct.id}-${customData.modifiers.sort().join('-')}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) => (item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item));
      }
      return [
        ...prev,
        {
          ...selectedProduct,
          cartId,
          qty: 1,
          modifiers: customData.modifiers,
          notes: customData.notes,
        },
      ];
    });

    setSelectedProduct(null);
    toast.success(`${selectedProduct.title} ditambahkan!`);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    startTransition(async () => {
      const res = await processCheckoutAction(cart);
      if (res.success) {
        toast.success('TRANSACTION_COMPLETED_GACOR!');
        setCart([]);
      } else {
        toast.error(res.error || 'CHECKOUT_FAILED');
      }
    });
  };

  const filteredProducts = initialProducts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#f3f3f3]">
      {/* --- MODAL CUSTOMIZATION (SHADCN) --- */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct && (
          <ModifierModal product={selectedProduct} onConfirm={handleConfirmCustomization} />
        )}
      </Dialog>

      {/* --- KIRI: MENU CATALOG --- */}
      <div className="flex-1 overflow-y-auto border-r-8 border-black p-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-8xl leading-none font-black tracking-tighter uppercase italic">
              Catalog
            </h2>
            <p className="mt-2 text-xs font-black tracking-[0.3em] text-zinc-400">
              SELECT_ITEMS_TO_START
            </p>
          </div>
          <div className="relative w-full border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:w-80">
            <Search className="absolute top-1/2 left-4 -translate-y-1/2 opacity-30" size={20} />
            <input
              type="text"
              placeholder="SEARCH_MENU..."
              className="w-full p-4 pl-12 text-sm font-black tracking-widest uppercase outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pb-20 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group flex h-52 flex-col justify-between border-[4px] border-black bg-white p-6 text-left transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <div className="flex items-start justify-between">
                <span className="bg-black px-2 py-1 text-[10px] font-black text-white italic">
                  IDR {Number(product.price).toLocaleString()}
                </span>
                <div className="border-2 border-black bg-zinc-100 p-2 transition-colors group-hover:bg-yellow-400">
                  <Utensils size={18} />
                </div>
              </div>
              <h4 className="text-2xl leading-none font-black tracking-tighter uppercase italic">
                {product.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* --- KANAN: CART / SUMMARY --- */}
      <div className="flex w-[480px] flex-col bg-white">
        <div className="flex items-center justify-between border-b-8 border-black bg-black p-8 text-white">
          <h3 className="text-3xl font-black tracking-tighter uppercase italic">Current_Order</h3>
          <div className="border-2 border-white bg-white px-3 py-1 text-sm font-black text-black">
            {cart.length}
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-8">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center opacity-10">
              <ShoppingBag size={120} strokeWidth={3} />
              <p className="mt-4 text-2xl font-black tracking-widest italic">EMPTY_BAG</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="group border-b-4 border-black pb-6 last:border-0">
                <div className="mb-2 flex items-start justify-between">
                  <h5 className="text-xl leading-none font-black uppercase italic">{item.title}</h5>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="p-1 text-zinc-300 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* MODIFIERS & NOTES */}
                <div className="mb-3 flex flex-wrap gap-1">
                  {item.modifiers?.map((m: string) => (
                    <span
                      key={m}
                      className="border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[9px] font-black text-zinc-500 uppercase italic"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                {item.notes && (
                  <p className="mb-4 border-l-4 border-red-600 bg-red-50 p-2 text-[11px] font-bold text-red-600 uppercase">
                    " {item.notes} "
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <button
                      onClick={() => updateQty(item.cartId, -1)}
                      className="border-r-[3px] border-black p-2 transition-colors hover:bg-black hover:text-white"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="flex items-center bg-zinc-50 px-6 text-lg font-black">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.cartId, 1)}
                      className="border-l-[3px] border-black p-2 transition-colors hover:bg-black hover:text-white"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                  <p className="text-xl font-black italic">
                    IDR {(Number(item.price) * item.qty).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- FOOTER TOTAL & CHECKOUT --- */}
        <div className="border-t-8 border-black bg-zinc-50 p-8">
          <div className="mb-8 flex items-end justify-between">
            <span className="text-xs font-black tracking-[0.3em] text-zinc-400">GRAND_TOTAL</span>
            <div className="text-right">
              <span className="block text-4xl font-black tracking-tighter italic">
                IDR {total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            disabled={cart.length === 0 || isPending}
            onClick={handleCheckout}
            className="flex w-full items-center justify-center gap-4 bg-black py-8 text-3xl font-black tracking-tighter text-white uppercase italic shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-zinc-300 disabled:shadow-none"
          >
            {isPending ? (
              'PROCESSING...'
            ) : (
              <>
                PROCESS_CHECKOUT <Plus size={32} strokeWidth={4} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
