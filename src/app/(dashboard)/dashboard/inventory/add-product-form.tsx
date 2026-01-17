// src/components/inventory/AddProductForm.tsx
'use client';

import { useActionState, useEffect } from 'react';

import { createProductAction } from '@/app/actions/product.action';

export default function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  // Hook untuk handle Server Action
  const [state, action, isPending] = useActionState(createProductAction, null);

  // Jika sukses, tutup dialog/modal-nya
  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <div className="bg-white p-10">
      <div className="mb-8 border-b-8 border-black pb-4">
        <h3 className="text-5xl font-black tracking-tighter uppercase italic">New Entry</h3>
      </div>

      {/* Tambahkan properti action di sini */}
      <form action={action} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black tracking-[0.3em] uppercase">Item Designation</label>
          <input
            name="title" // Harus ada!
            required
            className="w-full rounded-none border-4 border-black p-4 text-xl font-black uppercase italic transition-all outline-none focus:bg-black focus:text-white"
            placeholder="E.G. BOBA MILK TEA"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black tracking-[0.3em] uppercase">Price (IDR)</label>
            <input
              name="price" // Harus ada!
              required
              type="number"
              className="w-full rounded-none border-4 border-black p-4 text-xl font-black italic transition-all outline-none focus:bg-black focus:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black tracking-[0.3em] uppercase">Category</label>
            <select
              name="category" // Harus ada!
              className="w-full appearance-none rounded-none border-4 border-black p-4 text-sm font-black tracking-widest uppercase outline-none"
            >
              <option value="DRINKS">DRINKS</option>
              <option value="FOOD">FOOD</option>
            </select>
          </div>
        </div>

        {/* Input untuk Image URL (Opsional, tapi ada di Action kamu) */}
        <div className="space-y-2">
          <label className="text-xs font-black tracking-[0.3em] uppercase">Image URL</label>
          <input
            name="image"
            className="w-full rounded-none border-4 border-black p-4 font-mono text-sm font-black italic transition-all outline-none focus:bg-black focus:text-white"
            placeholder="https://..."
          />
        </div>

        {/* Status Error */}
        {state?.error && (
          <div className="bg-red-600 p-4 text-xs font-black tracking-widest text-white uppercase italic">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black py-6 text-lg font-black tracking-[0.3em] text-white uppercase italic transition-all hover:bg-zinc-900 disabled:bg-zinc-400"
        >
          {isPending ? 'PROCESSING...' : 'Confirm & Register'}
        </button>
      </form>
    </div>
  );
}
