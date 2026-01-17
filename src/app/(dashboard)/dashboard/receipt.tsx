'use client';

import React from 'react';

interface ReceiptProps {
  order: any;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ order }, ref) => {
  if (!order) return null;

  return (
    <div
      ref={ref}
      className="w-[300px] bg-white p-4 font-mono text-[12px] leading-tight text-black print:block"
    >
      {/* LOGO & HEADER */}
      <div className="mb-6 space-y-1 text-center">
        <h2 className="text-2xl font-black tracking-tighter uppercase italic">KEDAI DANKJE</h2>
        <p className="text-[9px] leading-none tracking-widest uppercase">
          JL Ahmad Yani, Depan RRI, 97127
        </p>
        <p className="text-[9px]">TEL: 0812-3456-7890</p>
      </div>

      {/* INFO TRANSAKSI */}
      <div className="mb-4 flex flex-col gap-1 border-t border-b border-dashed border-black py-2 text-[10px] uppercase">
        <div className="flex justify-between">
          <span>Order_ID:</span>
          <span className="font-black">#{order.id.slice(-8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier:</span>
          <span>SYSTEM_ADMIN</span>
        </div>
      </div>

      {/* DAFTAR ITEM */}
      <div className="mb-6 space-y-3">
        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex flex-col">
            <div className="flex justify-between font-bold">
              <span className="uppercase">{item.productTitle}</span>
              <span>{(item.quantity * item.priceAtPointOfSale).toLocaleString()}</span>
            </div>
            <div className="text-[10px] opacity-70">
              {item.quantity} x {item.priceAtPointOfSale.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL SECTION */}
      <div className="space-y-1 border-t-2 border-black pt-2">
        <div className="flex justify-between text-base font-black italic">
          <span>TOTAL</span>
          <span>Rp{order.totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[10px] opacity-70">
          <span>PAYMENT_METHOD</span>
          <span>CASH/QRIS</span>
        </div>
      </div>

      {/* FOOTER QR/GREETINGS */}
      <div className="mt-10 space-y-4 text-center">
        <div className="flex justify-center gap-1">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`h-4 w-[2px] bg-black ${i % 3 === 0 ? 'h-6' : 'h-4'}`}></div>
          ))}
        </div>
        <p className="text-[9px] font-black tracking-[0.2em] uppercase italic">
          Keep_It_Fresh_Keep_It_Bold
        </p>
        <p className="text-[8px] opacity-40">** Thank You For Your Visit **</p>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';
