'use client';

import { useState } from 'react';

import { Check, Clock, Flame, Loader2, MessageSquare, Snowflake } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  category: 'FOOD' | 'DRINK';
  modifiers?: string[] | null;
  notes?: string | null;
}

interface OrderCardProps {
  id: string; // UUID asli dari DB
  orderNumber: string; // Nomor singkat untuk display
  type: string; // DINE_IN atau TAKEAWAY
  tableNumber?: string | null;
  items: OrderItem[];
  onComplete: (id: string) => Promise<any>;
}

export default function OrderCard({
  id,
  orderNumber,
  type,
  tableNumber,
  items,
  onComplete,
}: OrderCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(id);
      toast.success(`ORDER #${orderNumber} READY!`);
    } catch (error) {
      toast.error('FAILED TO UPDATE ORDER');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col border-[6px] border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      {/* HEADER: KODE ANTRIAN & TIPE */}
      <div className="flex items-center justify-between border-b-[6px] border-black bg-black p-4 text-white">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            {type} {tableNumber ? `// TABLE ${tableNumber}` : ''}
          </p>
          <h3 className="text-4xl font-black tracking-tighter uppercase italic">#{orderNumber}</h3>
        </div>
        <div className="animate-pulse border-2 border-zinc-600 bg-zinc-800 p-2">
          <Clock size={20} className="text-yellow-400" />
        </div>
      </div>

      {/* BODY: DAFTAR PESANAN */}
      <div className="flex-1 divide-y-[4px] divide-black">
        {items.map((item) => (
          <div key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  {item.category === 'FOOD' ? (
                    <Flame size={16} className="text-red-600" fill="currentColor" />
                  ) : (
                    <Snowflake size={16} className="text-blue-400" fill="currentColor" />
                  )}
                  <h4 className="text-2xl leading-none font-black uppercase italic">{item.name}</h4>
                </div>

                {/* MODIFIERS BADGES */}
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.modifiers.map((mod, idx) => (
                      <span
                        key={idx}
                        className="bg-black px-2 py-0.5 text-[10px] font-black tracking-tighter text-white uppercase"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                )}

                {/* NOTES AREA (Sangat Mencolok) */}
                {item.notes && (
                  <div className="flex items-start gap-2 border-l-8 border-red-600 bg-red-50 p-3">
                    <MessageSquare size={16} className="mt-1 flex-shrink-0 text-red-600" />
                    <p className="text-xs leading-tight font-black text-red-900 uppercase italic">
                      CATATAN: "{item.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* QUANTITY BOX */}
              <div className="border-[4px] border-black bg-yellow-400 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-3xl font-black italic">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ACTION: TOMBOL SELESAI */}
      <div className="border-t-[6px] border-black bg-zinc-50 p-4">
        <button
          onClick={handleComplete}
          disabled={isSubmitting}
          className={`group flex w-full items-center justify-center gap-3 border-4 border-black p-5 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${
            isSubmitting ? 'cursor-not-allowed bg-zinc-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={28} />
          ) : (
            <>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Mark_Ready
              </span>
              <Check
                size={32}
                strokeWidth={4}
                className="transition-transform group-hover:scale-125"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
