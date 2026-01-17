// src/app/(dashboard)/products/page.tsx
import { db } from '@/database';
import { productModel } from '@/database/models';
import { desc } from 'drizzle-orm';
import { Edit2, Trash2 } from 'lucide-react';

import { AddProductDialog } from './add-product-dialog';
import { DeleteProductButton } from './delete-product-btn';
import { UpdateProductDialog } from './update-product-dialog';

export default async function InventoryPage() {
  // 1. Ambil data langsung dari DB (Server Side)
  // Kita urutkan dari yang terbaru (desc)
  const products = await db.select().from(productModel).orderBy(desc(productModel.createdAt));

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between border-b-8 border-black pb-8">
        <div>
          <h2 className="text-8xl leading-none font-black tracking-tighter text-black uppercase italic">
            Menu
          </h2>
          <p className="mt-4 text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
            Total Inventory: {products.length} Items
          </p>
        </div>
        <AddProductDialog />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {products.length === 0 ? (
          <div className="col-span-2 border-4 border-dashed border-zinc-300 p-20 text-center">
            <p className="text-2xl font-black tracking-widest text-zinc-400 uppercase italic">
              No Products Registered
            </p>
          </div>
        ) : (
          products.map((item) => (
            <div
              key={item.id}
              className="group relative flex gap-6 overflow-hidden border-4 border-black bg-white p-6 transition-all hover:bg-black hover:text-white"
            >
              {/* Background Stripe Accent ala Adidas */}
              <div className="absolute -right-4 -bottom-4 opacity-5 transition-opacity group-hover:opacity-10">
                <h1 className="text-9xl font-black tracking-tighter italic">POS</h1>
              </div>

              {/* Product Image Placeholder */}
              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden border-2 border-black bg-zinc-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] font-black uppercase italic opacity-20">
                    No Image
                  </div>
                )}
              </div>

              <div className="z-10 flex flex-1 flex-col justify-between py-2">
                <div>
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase italic opacity-50">
                    {/* Nanti category bisa diambil dari kolom category kalau sudah ada */}
                    Product Item
                  </span>
                  <h4 className="text-3xl leading-tight font-black uppercase italic decoration-4 underline-offset-4 group-hover:underline">
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-baseline gap-4">
                  <p className="text-2xl font-black italic">
                    IDR {Number(item.price).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Kita buat komponen Delete terpisah agar bisa pakai Server Action */}
              <div className="z-10 flex flex-col justify-center gap-2">
                {/* INI TOMBOL UPDATE-NYA */}
                <UpdateProductDialog product={item} />

                <DeleteProductButton id={item.id} title={item.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
