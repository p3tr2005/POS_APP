// src/components/inventory/UpdateProductDialog.tsx
'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/components/dialog';
import { Edit2 } from 'lucide-react';

import UpdateProductForm from './update-product-form';

export function UpdateProductDialog({ product }: { product: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="border-2 border-black p-3 transition-all group-hover:border-white hover:bg-zinc-100 group-hover:hover:bg-zinc-800">
          <Edit2 size={20} strokeWidth={3} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg overflow-hidden rounded-none border-none bg-white p-0 outline-none">
        <div className="border-[6px] border-black">
          <DialogHeader className="hidden border-none">
            <DialogTitle>UPDATE PRODUCT</DialogTitle>
          </DialogHeader>
          <UpdateProductForm product={product} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
