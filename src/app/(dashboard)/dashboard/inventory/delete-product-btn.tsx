// src/components/inventory/DeleteProductButton.tsx
'use client';

import { useTransition } from 'react';

import { deleteProductAction } from '@/app/actions/product.action';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/components/alert-dialog';
import { Trash2 } from 'lucide-react';

export function DeleteProductButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProductAction(id);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="border-2 border-red-600 p-3 text-red-600 transition-all hover:bg-red-600 hover:text-white disabled:opacity-50">
          <Trash2 size={20} strokeWidth={3} />
        </button>
      </AlertDialogTrigger>

      {/* Styling Adidas: Rounded-none & Thick Borders */}
      <AlertDialogContent className="rounded-none border-4 border-black bg-white p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-black tracking-tighter uppercase italic">
            Confirm Removal
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Are you sure you want to delete{' '}
            <span className="font-black text-black italic underline underline-offset-2">
              "{title}"
            </span>{' '}
            from the inventory? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex gap-2">
          <AlertDialogCancel className="rounded-none border-2 border-black text-xs font-black tracking-widest uppercase transition-all hover:bg-zinc-100">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="rounded-none border-2 border-red-600 bg-red-600 px-8 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-red-700"
          >
            {isPending ? 'REMOVING...' : 'YES, DELETE IT'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
