// src/app/(dashboard)/layout.tsx
import { headers } from 'next/headers';

import { auth } from '@/auth';
import Sidebar from '@/ui/components/sidebar';

// Pastikan pathnya benar

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR: Tetap di kiri, lebar 72 (sekitar 280px) */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72">
        <Sidebar user={session?.user} />
      </aside>

      {/* MAIN CONTENT: Berikan margin-left sebesar lebar sidebar */}
      <main className="relative ml-72 min-h-screen flex-1">
        {/* Kontainer Utama dengan Padding Besar ala Adidas */}
        <div className="mx-auto max-w-[1600px] p-8 md:p-12 lg:p-16">{children}</div>
      </main>
    </div>
  );
}
