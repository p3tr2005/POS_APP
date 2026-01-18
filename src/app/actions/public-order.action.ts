// src/actions/public-order.action.ts
'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/database';
import { orderItems, orders } from '@/database/models/product.model';
import { eq } from 'drizzle-orm';

export async function createPublicOrderAction(cart: any[]) {
  if (!cart || cart.length === 0) return { error: 'EMPTY_CART' };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    // Menggunakan TRANSACTION agar jika salah satu gagal, semua dibatalkan (Data Integrity)
    return await db.transaction(async (tx) => {
      // 1. Simpan Order Utama
      const [newOrder] = await tx
        .insert(orders)
        .values({
          userId: 'CUSTOMER_SELF_SERVICE',
          totalPrice: total,
          status: 'PENDING',
          // Tambahkan kolom 'type' jika ada di schema kamu (misal: TAKEAWAY)
        })
        .$returningId();

      // 2. Siapkan Detail Item termasuk Modifiers dan Notes
      const items = cart.map((item) => ({
        orderId: newOrder.id,
        productId: item.id,
        productTitle: item.title,
        quantity: item.qty,
        priceAtPointOfSale: item.price,
        // PASTIKAN kolom ini ada di schema orderItems kamu:
        modifiers: item.modifiers || [], // Menyimpan array ["Less Ice", "Normal Sugar"]
        notes: item.notes || '', // Menyimpan catatan "Jangan pakai sedotan"
      }));

      // 3. Simpan semua item sekaligus
      await tx.insert(orderItems).values(items);

      // 4. Revalidate cache agar dashboard kasir & kitchen terupdate
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/pos');

      return { success: true, orderId: newOrder.id };
    });
  } catch (e) {
    console.error('CREATE_ORDER_ERROR:', e);
    return { error: 'ORDER_FAILED_TO_SAVE' };
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
