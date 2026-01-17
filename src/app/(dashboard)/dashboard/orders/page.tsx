import Link from 'next/link';

import { db } from '@/database';
import { orders } from '@/database/models';
import { ExportCSVButton } from '@/ui/components/export-csv-btn';
import { and, count, desc, eq } from 'drizzle-orm';

import { PrintOrderButton } from '../pos/print-order-btn';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page, status } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  // Logic Filter Dinamis
  const filterStatus = status && status !== 'ALL' ? eq(orders.status, status) : undefined;

  // 1. Ambil Data dengan Filter, Limit, & Offset
  const allOrders = await db.query.orders.findMany({
    where: filterStatus,
    with: { items: true },
    orderBy: [desc(orders.createdAt)],
    limit: pageSize,
    offset: offset,
  });

  // 2. Hitung Total Data (untuk pagination yang akurat saat difilter)
  const totalCountResult = await db.select({ value: count() }).from(orders).where(filterStatus);

  const totalOrders = totalCountResult[0].value;
  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 border-b-[10px] border-black pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-7xl leading-none font-black tracking-tighter uppercase italic">
            Order_Logs
          </h1>
          <p className="mt-2 text-xs font-black tracking-[0.4em] text-zinc-400 uppercase italic">
            Database_Filter_Active
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Tombol Export */}
          <ExportCSVButton data={allOrders} />
          {/* --- UI FILTER STATUS --- */}
          <div className="flex border-2 border-black bg-zinc-200 p-1">
            {['ALL', 'PENDING', 'READY', 'COMPLETED', 'CANCELLED'].map((s) => {
              const isActive = (status || 'ALL') === s;
              return (
                <Link
                  key={s}
                  href={`?status=${s}&page=1`} // Reset ke page 1 tiap ganti filter
                  className={`px-4 py-2 text-[10px] font-black tracking-widest transition-all ${
                    isActive ? 'bg-black text-white' : 'text-black hover:bg-zinc-300'
                  }`}
                >
                  {s}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="border-[6px] border-black bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-black text-[10px] font-black tracking-widest text-white uppercase italic">
              <th className="border-r border-zinc-800 p-4">Date_Time</th>
              <th className="border-r border-zinc-800 p-4">Order_ID</th>
              <th className="border-r border-zinc-800 p-4 text-center">Status</th>
              <th className="border-r border-zinc-800 p-4 text-right">Amount</th>
              <th className="p-4 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold">
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center font-black italic opacity-30">
                  NO_RECORDS_FOUND_FOR_THIS_FILTER
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b-2 border-zinc-100 transition-colors hover:bg-zinc-50"
                >
                  <td className="border-r border-zinc-100 p-4 font-mono text-xs italic opacity-50">
                    {new Date(order.createdAt).toLocaleString('id-ID')}
                  </td>
                  <td className="border-r border-zinc-100 p-4 font-black tracking-tighter">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="border-r border-zinc-100 p-4 text-center">
                    <span
                      className={`border-2 px-2 py-1 text-[9px] font-black uppercase ${
                        order.status === 'COMPLETED'
                          ? 'border-green-500 text-green-500'
                          : order.status === 'READY'
                            ? 'border-blue-500 text-blue-500'
                            : order.status === 'CANCELLED'
                              ? 'border-red-500 text-red-500'
                              : 'border-black'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="border-r border-zinc-100 p-4 text-right font-black">
                    Rp{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <PrintOrderButton order={order} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
        <div className="flex items-center justify-between border-t-[6px] border-black bg-zinc-50 p-6">
          <p className="text-[10px] font-black uppercase italic opacity-40">
            Records: {totalOrders} | Page {currentPage} of {totalPages || 1}
          </p>

          <div className="flex gap-2">
            <Link
              href={`?status=${status || 'ALL'}&page=${currentPage - 1}`}
              className={`border-4 border-black px-6 py-2 text-xs font-black uppercase italic transition-all ${
                currentPage <= 1
                  ? 'pointer-events-none opacity-20'
                  : 'bg-white hover:bg-black hover:text-white'
              }`}
            >
              Prev
            </Link>
            <Link
              href={`?status=${status || 'ALL'}&page=${currentPage + 1}`}
              className={`border-4 border-black px-6 py-2 text-xs font-black uppercase italic transition-all ${
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-20'
                  : 'bg-white hover:bg-black hover:text-white'
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
