import { db } from '@/database';
import { orders } from '@/database/models/product.model';
import { desc, eq } from 'drizzle-orm';

import KitchenCard from './kitchen-card';

export const dynamic = 'force-dynamic'; // Paksa Next.js untuk tidak men-cache halaman ini
export const revalidate = 0; // Pastikan data diambil setiap kali request datang

export default async function KitchenPage() {
  // Ambil pesanan yang belum selesai (Pending atau sedang diproses)
  const incomingOrders = await db.query.orders.findMany({
    where: eq(orders.status, 'PENDING'),
    with: {
      items: true, // Sekarang ini pasti akan mengembalikan array, bukan undefined
    },
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div className="space-y-12">
      {/* HEADER KDS */}
      <div className="flex items-center justify-between border-b-[10px] border-black pb-8">
        <div>
          <h2 className="text-8xl leading-none font-black tracking-tighter uppercase italic">
            Kitchen
          </h2>
          <p className="mt-2 text-xs font-black tracking-[0.4em] text-zinc-400 uppercase italic">
            Active_Production_Line
          </p>
        </div>
        <div className="bg-black p-6 text-2xl font-black text-white italic shadow-[8px_8px_0px_0px_rgba(255,0,0,1)]">
          {incomingOrders.length} ORDERS_WAITING
        </div>
      </div>

      {/* KITCHEN GRID */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {incomingOrders.map((order) => (
          <KitchenCard key={order.id} order={order} />
        ))}

        {incomingOrders.length === 0 && (
          <div className="col-span-full flex items-center justify-center border-8 border-dashed border-zinc-100 py-40">
            <p className="text-center text-4xl leading-tight font-black tracking-widest text-zinc-200 uppercase italic">
              No_Orders_In_Queue
              <br />
              <span className="text-sm">Kitchen is clear. Rest or Clean up.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
