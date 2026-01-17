'use client';

import { useEffect, useState, useTransition } from 'react';

import { cancelOrderAction, completeOrderAction } from '@/app/actions/public-order.action';
// Shadcn Components
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
import { AlertTriangle, Bell, Check, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

export function OrderFeed() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // Polling data setiap 5 detik
  const fetchRecent = async () => {
    try {
      const res = await fetch('/api/orders/recent');
      const data = await res.json();
      setRecentOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('POLLING_ERROR');
    }
  };

  useEffect(() => {
    fetchRecent();
    const interval = setInterval(fetchRecent, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = (id: string) => {
    startTransition(async () => {
      const res = await completeOrderAction(id);
      if (res?.success) {
        toast.success(`ORDER_#${id.slice(-6)}_COMPLETED`);
        fetchRecent();
      }
    });
  };

  const handleCancel = (id: string) => {
    startTransition(async () => {
      const res = await cancelOrderAction(id);
      if (res?.success) {
        toast.error(`ORDER_#${id.slice(-6)}_CANCELLED`);
        fetchRecent();
      }
    });
  };

  return (
    <div className="custom-scrollbar max-h-[500px] space-y-4 overflow-y-auto pr-2">
      {recentOrders.length === 0 && (
        <div className="border-4 border-dashed border-zinc-200 py-20 text-center">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-20">
            No_Active_Orders
          </p>
        </div>
      )}

      {recentOrders.map((order) => (
        <div
          key={order.id}
          className={`group flex items-center gap-4 border-[4px] p-3 transition-all duration-300 ${
            order.status === 'READY'
              ? 'border-green-500 bg-green-50 shadow-[6px_6px_0px_0px_rgba(34,197,94,1)]'
              : 'border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
          }`}
        >
          {/* ICON STATUS */}
          <div
            className={`shrink-0 border-2 border-black p-2 transition-transform ${
              order.status === 'READY' ? 'animate-bounce bg-green-500' : 'bg-zinc-100'
            }`}
          >
            {order.status === 'READY' ? <Bell size={18} strokeWidth={3} /> : <Clock size={18} />}
          </div>

          {/* INFO ORDER */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <p className="truncate text-[10px] font-black tracking-tighter">
                #{order.id.slice(-8).toUpperCase()}
              </p>
              <span
                className={`border border-black px-1 text-[8px] font-black ${
                  order.status === 'READY' ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 truncate text-sm font-bold tracking-tighter uppercase italic">
              {order.items?.[0]?.productTitle || 'Unknown_Item'}
              {order.items?.length > 1 && (
                <span className="ml-1 text-[10px] lowercase opacity-50">
                  +{order.items.length - 1} more
                </span>
              )}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1">
            {/* ALERT DIALOG CANCEL */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="border-2 border-black bg-white p-2 text-red-600 transition-all group-hover:scale-110 hover:bg-red-600 hover:text-white">
                  <X size={16} strokeWidth={4} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[400px] rounded-none border-[8px] border-black bg-white shadow-[25px_25px_0px_0px_rgba(0,0,0,1)]">
                <AlertDialogHeader>
                  <div className="mb-2 flex items-center gap-3 text-red-600">
                    <div className="bg-red-600 p-1 text-white">
                      <AlertTriangle size={24} />
                    </div>
                    <AlertDialogTitle className="text-3xl font-black tracking-tighter uppercase italic">
                      Warning_!
                    </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="border-t-2 border-zinc-100 pt-2 text-[11px] leading-tight font-bold text-black uppercase">
                    Are you sure you want to void order{' '}
                    <span className="bg-black px-1 text-white">#{order.id.slice(-8)}</span>? This
                    action will be logged in the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8 flex gap-3">
                  <AlertDialogCancel className="flex-1 rounded-none border-[3px] border-black py-6 text-xs font-black uppercase italic hover:bg-zinc-100">
                    Go_Back
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleCancel(order.id)}
                    className="flex-1 rounded-none border-[3px] border-black bg-red-600 py-6 text-xs font-black text-white uppercase italic shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-black active:shadow-none"
                  >
                    Confirm_Void
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* COMPLETE BUTTON (HANYA MUNCUL JIKA READY) */}
            {order.status === 'READY' && (
              <button
                onClick={() => handleComplete(order.id)}
                disabled={isPending}
                className="border-2 border-black bg-black p-2 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:scale-110 hover:bg-green-600 active:shadow-none"
              >
                <Check size={16} strokeWidth={4} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
