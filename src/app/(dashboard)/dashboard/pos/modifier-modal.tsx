'use client';

import { useState } from 'react';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { Flame, MessageSquare, Plus, Snowflake } from 'lucide-react';

export default function ModifierModal({ product, onConfirm }: { product: any; onConfirm: any }) {
  const [modifiers, setModifiers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const isDrink = product.category === 'DRINKS' || product.title.toLowerCase().includes('boba');

  const toggleMod = (m: string) => {
    setModifiers((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  return (
    <DialogContent className="max-w-2xl gap-0 border-[6px] border-black bg-white p-0 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] focus:ring-0">
      <DialogHeader className="bg-black p-8 text-white">
        <DialogTitle className="text-5xl font-black tracking-tighter uppercase italic">
          Customize
        </DialogTitle>
        <DialogDescription className="font-bold tracking-widest text-zinc-400 uppercase">
          {product.title} — IDR {Number(product.price).toLocaleString()}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-8 p-8">
        {/* OPTION SELECTOR */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">
            {isDrink ? <Snowflake size={14} /> : <Flame size={14} />}
            Select_Preferences
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(isDrink
              ? ['LESS_ICE', 'NO_ICE', 'EXTRA_BOBA', 'HOT']
              : ['SEDANG', 'PEDAS', 'PEDAS_MAMPUS']
            ).map((m) => (
              <button
                key={m}
                onClick={() => toggleMod(m)}
                className={`border-4 border-black p-4 text-xs font-black transition-all ${
                  modifiers.includes(m)
                    ? 'bg-black text-white'
                    : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 active:translate-x-1 active:translate-y-1 active:shadow-none'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* NOTES */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">
            <MessageSquare size={14} /> Special_Instructions
          </label>
          <textarea
            placeholder="E.G. NO SUGAR, SEPARATE BOX..."
            className="min-h-[100px] w-full resize-none border-4 border-black p-4 text-sm font-black outline-none focus:bg-yellow-50"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* ACTION */}
        <button
          onClick={() => onConfirm({ modifiers, notes })}
          className="flex w-full items-center justify-center gap-3 border-4 border-black bg-green-500 p-6 text-2xl font-black text-white uppercase italic shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          Add_To_Cart <Plus strokeWidth={4} />
        </button>
      </div>
    </DialogContent>
  );
}
