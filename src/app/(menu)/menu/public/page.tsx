// src/app/menu/public/page.tsx
import { db } from '@/database';
import { productModel } from '@/database/models';
import { desc } from 'drizzle-orm';

import PublicMenuClient from './public-menu-client';

export default async function PublicMenuPage() {
  const products = await db.select().from(productModel).orderBy(desc(productModel.createdAt));

  return (
    <div className="min-h-screen bg-white">
      <PublicMenuClient products={products} />
    </div>
  );
}
