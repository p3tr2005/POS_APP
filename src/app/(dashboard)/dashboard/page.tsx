import { getDashboardStats } from '@/app/actions/analytics.action';
import { DollarSign, Package, TrendingUp, Zap } from 'lucide-react';

import DashboardFilter from './dashboard-filter';
import { OrderFeed } from './orders/order-feed';
import SalesChart from './sales-charts';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const stats = await getDashboardStats((range as any) || 'day');

  return (
    <div className="min-h-screen space-y-8 bg-[#f8f8f8] p-4 font-sans md:p-8">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col items-start justify-between gap-6 border-b-[8px] border-black pb-10 lg:flex-row lg:items-end">
        <div className="space-y-2">
          <div className="flex w-fit items-center gap-3 bg-black px-3 py-1 text-white">
            <Zap size={16} fill="white" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">System_Active</span>
          </div>
          <h1 className="text-7xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-8xl">
            OPERATIONS
            <br />
            <span className="text-zinc-400">CENTER</span>
          </h1>
        </div>

        <DashboardFilter />
      </div>

      {/* --- METRIC CARDS --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group border-[6px] border-black bg-white p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-[10px] font-black tracking-widest text-red-600 uppercase italic opacity-40">
            Total_Revenue_Live
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black italic">Rp</span>
            <h2 className="text-6xl font-black tracking-tighter italic tabular-nums">
              {stats.revenue.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="border-[6px] border-black bg-white p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-[10px] font-black tracking-widest uppercase italic opacity-40">
            Total_Orders
          </p>
          <h2 className="text-6xl font-black tracking-tighter italic tabular-nums">
            {stats.orderCount}
          </h2>
          <p className="mt-2 text-[10px] font-bold uppercase opacity-60">Transactions_Processed</p>
        </div>

        <div className="flex flex-col justify-between bg-black p-8 text-white shadow-[10px_10px_0px_0px_rgba(0,255,65,0.2)]">
          <p className="mb-2 text-[10px] font-black tracking-widest uppercase italic opacity-40">
            Basket_Size
          </p>
          <h2 className="text-5xl font-black tracking-tighter italic">
            Rp
            {(stats.revenue / (stats.orderCount || 1)).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h2>
          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
            <span className="text-[10px] font-black tracking-widest text-green-400 uppercase">
              Health: Optimal
            </span>
            <TrendingUp size={20} className="text-green-400" />
          </div>
        </div>
      </div>

      {/* --- MAIN ANALYTICS GRID --- */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* LEFT & CENTER: CHART & BEST SELLERS (Span 2) */}
        <div className="space-y-10 lg:col-span-2">
          {/* SALES CHART */}
          <div className="border-[6px] border-black bg-white p-8">
            <div className="mb-10 flex items-center gap-4">
              <div className="shrink-0 bg-black p-2 text-white">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase italic underline decoration-zinc-200 decoration-4 underline-offset-8">
                Product_Performance
              </h3>
            </div>
            <div className="h-[400px]">
              <SalesChart data={stats.topProducts} />
            </div>
          </div>

          {/* BEST SELLERS LIST */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border-[6px] border-black bg-white p-6">
              <h4 className="mb-6 flex items-center gap-2 text-xl font-black uppercase italic">
                <Package size={20} /> Top_5_Products
              </h4>
              <div className="space-y-4">
                {stats.topProducts.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b-2 border-zinc-100 pb-2"
                  >
                    <span className="text-sm font-black tracking-tight uppercase italic">
                      {p.name}
                    </span>
                    <span className="font-black tabular-nums">{p.totalSold}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-[6px] border-black bg-zinc-900 p-6 text-center text-white">
              <p className="mb-2 text-2xl font-black tracking-tighter uppercase italic">
                Boba_POS_v1.0
              </p>
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">
                Analytics_Module_Loaded
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE ORDER FEED (Span 1) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="sticky top-6 border-[6px] border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-8 flex items-center justify-between border-b-4 border-black pb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-red-600"></div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">Live_Feed</h3>
              </div>
              <span className="text-[10px] font-black italic opacity-30">AUTO_REFRESH</span>
            </div>

            <OrderFeed />

            <div className="mt-8 border-2 border-black bg-zinc-100 p-4">
              <p className="text-[10px] leading-relaxed font-black uppercase italic">
                Note: Orders marked in <span className="text-green-600">GREEN</span> are ready for
                pickup at the counter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- DECORATIVE FOOTER --- */}
      <div className="flex items-center justify-between pt-10 opacity-20">
        <div className="flex gap-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-8 w-1 bg-black"></div>
          ))}
        </div>
        <p className="text-xs font-black tracking-[0.5em] uppercase italic">
          Internal_Admin_Use_Only
        </p>
      </div>
    </div>
  );
}
