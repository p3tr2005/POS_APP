// src/components/inventory/AddProductDialog.tsx
'use client';

// Form yang kita buat tadi
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/components/dialog';
import { Plus } from 'lucide-react';

import AddProductForm from './add-product-form';

export function AddProductDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 bg-black px-8 py-4 text-xs font-black tracking-[0.2em] text-white uppercase transition-all hover:bg-zinc-800">
          <Plus size={16} strokeWidth={3} />
          ADD NEW PRODUCT
        </button>
      </DialogTrigger>

      {/* Kita paksa border-none dan rounded-none di sini */}
      <DialogContent className="max-w-lg overflow-hidden rounded-none border-none bg-white p-0 outline-none">
        <div className="border-[6px] border-black">
          {' '}
          {/* Double border style ala Adidas */}
          <DialogHeader className="hidden">
            {/* Sembunyikan header default shadcn karena kita pakai header custom di form */}
            <DialogTitle>ADD PRODUCT</DialogTitle>
          </DialogHeader>
          <AddProductForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
