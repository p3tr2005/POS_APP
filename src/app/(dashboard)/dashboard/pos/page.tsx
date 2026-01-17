// src/app/(dashboard)/pos/page.tsx
import { db } from '@/database';
import { productModel } from '@/database/models';
import { desc } from 'drizzle-orm';

import POSClient from './pos-client';

export default async function POSPage() {
  // Ambil menu asli dari database
  const products = await db.select().from(productModel).orderBy(desc(productModel.createdAt));

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden">
      <POSClient initialProducts={products} />
    </div>
  );
}
