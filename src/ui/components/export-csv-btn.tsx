'use client';

import { Download } from 'lucide-react';

interface ExportCSVButtonProps {
  data: any[];
}

export function ExportCSVButton({ data }: ExportCSVButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Header CSV
    const headers = ['Order_ID,Date,Status,Total_Price\n'];

    // Baris Data
    const rows = data.map((order) => {
      const id = order.id.slice(-8).toUpperCase();
      const date = new Date(order.createdAt).toLocaleString('id-ID');
      const status = order.status;
      const total = order.totalPrice;
      return `${id},${date},${status},${total}\n`;
    });

    const csvContent = headers.concat(rows).join('');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Boba_Station_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 border-[3px] border-black bg-white px-4 py-2 text-[10px] font-black text-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-black hover:text-white active:shadow-none"
    >
      <Download size={14} />
      Export_to_CSV
    </button>
  );
}
