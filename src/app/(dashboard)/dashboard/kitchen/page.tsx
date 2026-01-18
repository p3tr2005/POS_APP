import { markOrderAsReadyAction } from '@/app/actions/kitchen.action';
import { db } from '@/database';
import { orders } from '@/database/models';
import { asc, eq } from 'drizzle-orm';

import OrderCard from './order-card';

export default async function KitchenPage() {
  const activeOrders = await db.query.orders.findMany({
    where: eq(orders.status, 'PENDING'),
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
    orderBy: [asc(orders.createdAt)],
  });

  // Server Action Bridge
  const handleOrderComplete = async (id: string) => {
    'use server';
    await markOrderAsReadyAction(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b-[10px] border-black pb-6">
        <h1 className="text-8xl font-black tracking-tighter uppercase italic">Kitchen</h1>
        <div className="text-right">
          <p className="text-xs font-black tracking-widest text-zinc-400">AUTO_REFRESH: ACTIVE</p>
          <p className="text-2xl font-black text-red-600 uppercase italic">
            {activeOrders.length} ORDERS_LEFT
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {activeOrders.map((order) => (
          <OrderCard
            key={order.id}
            id={order.id}
            orderNumber={order.id.slice(-4).toUpperCase()}
            type={order.type ?? 'TAKEAWAY'}
            tableNumber={order.tableNumber}
            items={order.items.map((item: any) => ({
              id: item.id,
              name: item.product.title,
              quantity: item.quantity,
              category: item.product.category,
              modifiers: item.modifiers,
              notes: item.notes,
            }))}
            onComplete={handleOrderComplete}
          />
        ))}
      </div>
    </div>
  );
}
