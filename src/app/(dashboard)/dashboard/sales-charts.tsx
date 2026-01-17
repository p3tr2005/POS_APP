'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartProps {
  data: { name: string; totalSold: number }[];
}

export default function SalesChart({ data }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Grid Kaku ala Industrial */}
          <CartesianGrid strokeDasharray="0" stroke="#eeeeee" vertical={false} />

          <XAxis
            dataKey="name"
            axisLine={{ stroke: '#000', strokeWidth: 2 }}
            tickLine={false}
            tick={{ fill: '#000', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }}
            dy={10}
          />

          <YAxis
            axisLine={{ stroke: '#000', strokeWidth: 2 }}
            tickLine={false}
            tick={{ fill: '#000', fontSize: 10, fontWeight: '900' }}
          />

          <Tooltip
            cursor={{ fill: '#f4f4f5' }}
            contentStyle={{
              backgroundColor: '#000',
              border: 'none',
              borderRadius: '0px',
              color: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
            itemStyle={{ color: '#fff' }}
          />

          {/* Bar dengan warna Hitam-Putih-Kontras */}
          <Bar dataKey="totalSold" fill="#000" barSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? '#000' : index === 1 ? '#333' : '#666'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
