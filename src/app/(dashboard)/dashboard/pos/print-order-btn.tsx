'use client';

import { useRef } from 'react';

import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

import { Receipt } from '../receipt';

export function PrintOrderButton({ order }: { order: any }) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `ORDER_${order.id.slice(-8)}`,
  });

  return (
    <>
      <button
        onClick={() => handlePrint()}
        className="group flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-[10px] font-black text-black uppercase italic transition-all hover:bg-black hover:text-white"
      >
        <Printer size={14} className="transition-transform group-hover:rotate-12" />
        Print_Receipt
      </button>

      {/* CONTAINER HIDDEN DI LAYAR TAPI ADA DI DOM */}
      <div style={{ display: 'none' }}>
        <div className="print-section">
          <Receipt ref={componentRef} order={order} />
        </div>
      </div>
    </>
  );
}
