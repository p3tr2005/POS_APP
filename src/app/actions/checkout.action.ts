// src/actions/checkout.action.ts
'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/auth';
import { db } from '@/database';
import { orderItems, orders, ordersRelations } from '@/database/models/product.model';
import { eq } from 'drizzle-orm';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

export async function processCheckoutAction(cart: any[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'UNAUTHORIZED' };

  try {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return await db.transaction(async (tx) => {
      // 1. Buat Header Order
      const [newOrder] = await tx.insert(orders).values({
        userId: session.user.id,
        totalPrice: total,
        status: 'PENDING',
      });

      const orderId = (
        await tx.query.orders.findFirst({
          orderBy: (o, { desc }) => [desc(o.createdAt)],
        })
      )?.id;

      // 2. Masukkan Item Keranjang
      for (const item of cart) {
        await tx.insert(orderItems).values({
          orderId: orderId!,
          productId: item.id,
          productTitle: item.title, // TAMBAHKAN INI (Sesuai skema kamu)
          quantity: item.qty,
          priceAtPointOfSale: item.price, // UBAH INI (Tadinya priceAtOrder)
          modifiers: item.modifiers || [],
          notes: item.notes || '',
        });
      }

      return { success: true };
    });
  } catch (err) {
    return { success: false, error: 'DATABASE_ERROR' };
  }
}

// src/actions/checkout.action.ts (Tambahkan di bawah action yang sudah ada)

export async function updateOrderStatusAction(orderId: string, status: 'COMPLETED' | 'CANCELLED') {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'NOT AUTHORIZED' };

  try {
    await db.update(orders).set({ status: status }).where(eq(orders.id, orderId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    return { error: 'FAILED TO UPDATE STATUS' };
  }
}
