// src/actions/kitchen.action.ts
'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/database';
import { orders } from '@/database/models/product.model';
import { eq } from 'drizzle-orm';

export async function markOrderAsReadyAction(orderId: string) {
  try {
    await db
      .update(orders)
      .set({ status: 'READY' }) // Status baru: Pesanan siap diambil
      .where(eq(orders.id, orderId));

    revalidatePath('/dashboard/kitchen');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    return { error: 'FAILED_TO_UPDATE' };
  }
}
