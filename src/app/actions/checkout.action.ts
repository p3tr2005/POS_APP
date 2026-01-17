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

export async function processCheckoutAction(cart: CartItem[]) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return { error: 'NOT AUTHORIZED' };
  if (cart.length === 0) return { error: 'CART IS EMPTY' };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    // 1. Simpan Order Utama
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: session.user.id,
        totalPrice: totalPrice,
      })
      .$returningId();

    // 2. Simpan Detail Item (Tambahkan productTitle di sini)
    const itemsToInsert = cart.map((item) => ({
      orderId: newOrder.id,
      productId: item.id,
      productTitle: item.title, // TAMBAHKAN INI agar tidak error
      quantity: item.qty,
      priceAtPointOfSale: item.price,
    }));

    await db.insert(orderItems).values(itemsToInsert);

    revalidatePath('/dashboard/pos');
    return { success: true, orderId: newOrder.id };
  } catch (e) {
    console.error(e);
    return { error: 'TRANSACTION FAILED' };
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
