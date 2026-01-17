// src/actions/public-order.action.ts
'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/database';
import { orderItems, orders } from '@/database/models/product.model';
import { eq } from 'drizzle-orm';

export async function createPublicOrderAction(cart: any[]) {
  if (cart.length === 0) return { error: 'EMPTY_CART' };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    // 1. Simpan Order dengan status PENDING
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: 'CUSTOMER_SELF_SERVICE', // Penanda order dari luar
        totalPrice: total,
        status: 'PENDING',
      })
      .$returningId();

    // 2. Simpan Detail Item
    const items = cart.map((item) => ({
      orderId: newOrder.id,
      productId: item.id,
      productTitle: item.title,
      quantity: item.qty,
      priceAtPointOfSale: item.price,
    }));

    await db.insert(orderItems).values(items);

    // Trigger revalidate agar dashboard kasir tahu ada data baru
    revalidatePath('/dashboard');

    return { success: true, orderId: newOrder.id };
  } catch (e) {
    return { error: 'ORDER_FAILED' };
  }
}

// src/actions/order.action.ts (Review)
export async function completeOrderAction(orderId: string) {
  try {
    await db.update(orders).set({ status: 'COMPLETED' }).where(eq(orders.id, orderId));

    revalidatePath('/dashboard');

    // KEMBALIKAN OBJEK INI
    return { success: true };
  } catch (error) {
    console.error('FAILED_TO_COMPLETE_ORDER:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function cancelOrderAction(orderId: string) {
  try {
    await db.update(orders).set({ status: 'CANCELLED' }).where(eq(orders.id, orderId));

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/orders');

    return { success: true };
  } catch (error) {
    console.error('FAILED_TO_CANCEL_ORDER:', error);
    return { success: false };
  }
}
