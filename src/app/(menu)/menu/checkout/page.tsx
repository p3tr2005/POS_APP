'use client';

import { useTransition } from 'react';

// Tambahkan ini
import { useRouter } from 'next/navigation';

import { createPublicOrderAction } from '@/app/actions/public-order.action';
import { useCartStore } from '@/ui/hooks/useCartStore';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
// Sesuaikan path ini
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useCartStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    startTransition(async () => {
      const res = await createPublicOrderAction(cart);

      if (res.success) {
        toast.success('Pesanan berhasil dibuat!');
        clearCart(); // Kosongkan keranjang di Zustand/LocalStorage
        router.push(`/order-status/${res.orderId}`); // Langsung lari ke status
      } else {
        toast.error(res.error || 'Gagal memproses pesanan');
      }
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.back()}
          disabled={isPending}
          className="mb-10 flex items-center gap-2 font-black uppercase italic hover:underline disabled:opacity-50"
        >
          <ArrowLeft size={20} /> Kembali ke Menu
        </button>

        <h2 className="mb-10 border-b-8 border-black pb-4 text-7xl font-[1000] tracking-tighter uppercase italic">
          Review_Order
        </h2>

        <div className="mb-12 space-y-8">
          {cart.length === 0 ? (
            <div className="border-4 border-dashed border-zinc-200 py-20 text-center">
              <p className="font-black text-zinc-400 italic">KERANJANG_KOSONG</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
                className="flex items-start justify-between border-b-4 border-zinc-100 pb-6"
              >
                <div>
                  <h3 className="text-2xl font-black uppercase italic">{item.title}</h3>
                  <div className="my-2 flex flex-wrap gap-2">
                    {item.modifiers.map((m) => (
                      <span
                        key={m}
                        className="border border-black bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase italic"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  {item.notes && (
                    <p className="text-xs font-bold text-red-600 uppercase italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-4">
                  <div className="flex border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <button
                      onClick={() => updateQty(item.cartId, -1)}
                      className="p-2 transition-colors hover:bg-black hover:text-white"
                    >
                      -
                    </button>
                    <span className="border-x-4 border-black px-6 py-2 font-black">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.cartId, 1)}
                      className="p-2 transition-colors hover:bg-black hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-zinc-400 transition-colors hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SUMMARY SECTION */}
        <div className="border-[8px] border-yellow-400 bg-black p-10 text-white shadow-[15px_15px_0_0_rgba(0,0,0,1)]">
          <div className="mb-10 flex items-end justify-between">
            <span className="text-xl font-black italic">TOTAL_TAGIHAN</span>
            <span className="text-5xl font-[1000] tracking-tighter text-yellow-400 italic">
              IDR {total.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isPending || cart.length === 0}
            className="flex w-full items-center justify-center gap-3 bg-yellow-400 p-6 text-3xl font-black text-black uppercase italic shadow-[8px_8px_0_0_white] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-zinc-600 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={32} /> PROCESSING...
              </>
            ) : (
              'BAYAR_SEKARANG_→'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
