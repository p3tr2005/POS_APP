// src/components/inventory/UpdateProductForm.tsx
'use client';

import { useActionState, useEffect } from 'react';

import { updateProductAction } from '@/app/actions/product.action';

export default function UpdateProductForm({
  product,
  onSuccess,
}: {
  product: any;
  onSuccess: () => void;
}) {
  // Kita bind ID produk ke action supaya server tau mana yang diupdate
  const updateWithId = updateProductAction.bind(null, product.id);
  const [state, action, isPending] = useActionState(updateWithId, null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <div className="bg-white p-10">
      <div className="mb-8 border-b-8 border-black pb-4">
        <h3 className="text-5xl font-black tracking-tighter text-black uppercase italic">
          Edit Item
        </h3>
        <p className="text-[10px] font-black tracking-[0.3em] opacity-40">
          ID: {product.id.slice(0, 8)}
        </p>
      </div>

      <form action={action} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black tracking-[0.3em] uppercase">Item Designation</label>
          <input
            name="title"
            defaultValue={product.title}
            required
            className="w-full rounded-none border-4 border-black p-4 text-xl font-black uppercase italic transition-all outline-none focus:bg-black focus:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black tracking-[0.3em] uppercase">Price (IDR)</label>
            <input
              name="price"
              type="number"
              defaultValue={product.price}
              required
              className="w-full rounded-none border-4 border-black p-4 text-xl font-black italic transition-all outline-none focus:bg-black focus:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black tracking-[0.3em] uppercase">Category</label>
            <select
              name="category"
              defaultValue={product.category || 'DRINKS'}
              className="w-full appearance-none rounded-none border-4 border-black p-4 text-sm font-black tracking-widest uppercase outline-none"
            >
              <option value="DRINKS">DRINKS</option>
              <option value="FOOD">FOOD</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black tracking-[0.3em] uppercase">Image URL</label>
          <input
            name="image"
            defaultValue={product.image}
            className="w-full rounded-none border-4 border-black p-4 font-mono text-sm font-black italic transition-all outline-none focus:bg-black focus:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black py-6 text-lg font-black tracking-[0.3em] text-white uppercase italic transition-all hover:bg-zinc-900 disabled:bg-zinc-400"
        >
          {isPending ? 'SAVING CHANGES...' : 'Update Inventory'}
        </button>
      </form>
    </div>
  );
}
