// src/actions/product.action.ts
'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/auth';
import { db } from '@/database';
import { productModel } from '@/database/models';
import { and, eq } from 'drizzle-orm';

export async function createProductAction(_: unknown, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return { error: 'NOT AUTHORIZED' };

  const title = formData.get('title') as string;
  const price = parseInt(formData.get('price') as string);
  const image = formData.get('image') as string;
  const category = formData.get('category') as string;

  try {
    await db.insert(productModel).values({
      title: title.toUpperCase(), // Adidas style: All caps
      price,
      image,
      category,
      userId: session.user.id,
      // Jika tabelmu belum ada kolom category, abaikan ini atau tambah di schema
    });

    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (e) {
    return { error: 'FAILED TO CREATE PRODUCT' };
  }
}

// src/actions/product.action.ts

// Urutannya: 1. ID (dari bind), 2. prevState (dari actionState), 3. formData
export async function updateProductAction(id: string, prevState: any, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'NOT AUTHORIZED' };

  // Sekarang formData tidak akan null lagi
  const title = formData.get('title') as string;
  const price = parseInt(formData.get('price') as string);
  const image = formData.get('image') as string;
  const category = formData.get('category') as string;

  try {
    await db
      .update(productModel)
      .set({
        title: title.toUpperCase(),
        price,
        image,
        category,
      })
      .where(eq(productModel.id, id));

    revalidatePath('/dashboard/products');
    return { success: true, error: null };
  } catch (e) {
    return { success: false, error: 'FAILED TO UPDATE PRODUCT' };
  }
}

export async function deleteProductAction(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'NOT AUTHORIZED' };

  try {
    await db.delete(productModel).where(
      and(
        eq(productModel.id, id),
        eq(productModel.userId, session.user.id) // Hanya pemilik yang bisa hapus
      )
    );

    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (e) {
    return { error: 'FAILED TO DELETE PRODUCT' };
  }
}
