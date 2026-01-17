'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get('range') || 'day';

  const filters = [
    { label: 'TODAY', value: 'day' },
    { label: '7_DAYS', value: 'week' },
    { label: '30_DAYS', value: 'month' },
  ];

  return (
    <div className="mb-6 flex w-fit border-2 border-black bg-zinc-200 p-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => router.push(`?range=${f.value}`)}
          className={`px-6 py-2 text-[10px] font-black tracking-widest transition-all ${
            currentRange === f.value
              ? 'bg-black text-white'
              : 'bg-transparent text-black hover:bg-zinc-300'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
