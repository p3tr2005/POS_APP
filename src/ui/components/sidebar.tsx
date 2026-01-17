'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChefHat, LayoutDashboard, Package, Settings, ShoppingBag, Users, Zap } from 'lucide-react';

import LogoutButton from './logout-btn';

// Definisikan tipe User agar TypeScript senang
interface SidebarProps {
  user: {
    name: string;
    role: string;
  } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  // Ambil role, default ke CASHIER jika data tidak ada (fallback)
  const userRole = user?.role || 'CASHIER';

  // Konfigurasi Menu
  const menuItems = [
    { name: 'STATUS', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'CASHIER'] },
    { name: 'CASHIER', path: '/dashboard/pos', icon: ShoppingBag, roles: ['ADMIN', 'CASHIER'] },
    { name: 'ORDERS', path: '/dashboard/orders', icon: ShoppingBag, roles: ['ADMIN'] },
    { name: 'KITCHEN', path: '/dashboard/kitchen', icon: ChefHat, roles: ['ADMIN', 'KITCHEN'] },
    { name: 'INVENTORY', path: '/dashboard/inventory', icon: Package, roles: ['ADMIN'] },
    { name: 'USERS', path: '/dashboard/users', icon: Users, roles: ['ADMIN'] },
    { name: 'PREFERENCE', path: '/dashboard/settings', icon: Settings, roles: ['ADMIN'] },
  ];

  return (
    <div className="sticky top-0 flex h-screen w-72 flex-col overflow-hidden border-r-4 border-zinc-900 bg-black p-8 text-white">
      {/* BRAND LOGO */}
      <div className="group mb-20 cursor-default">
        <div className="mb-2 flex items-center gap-3">
          <Zap size={32} fill="white" strokeWidth={0} />
          <h1 className="text-4xl leading-none font-black tracking-tighter italic">POS_V1</h1>
        </div>
        <div className="flex gap-1">
          <div className="h-1.5 w-12 bg-white transition-all group-hover:w-16"></div>
          <div className="h-1.5 w-6 bg-zinc-700"></div>
        </div>

        {/* INFO USER: Muncul Instan tanpa loading */}
        <div className="mt-6 border-l-2 border-zinc-800 pl-4">
          <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase italic">
            Active_Operator
          </p>
          <p className="truncate text-sm font-black uppercase">{user?.name || 'Guest'}</p>
          <p
            className={`mt-1 inline-block rounded px-2 py-0.5 text-[8px] font-black uppercase ${
              userRole === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {userRole}
          </p>
        </div>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          // FILTER ROLE: Hanya tampilkan menu yang diizinkan untuk role tersebut
          if (!item.roles.includes(userRole)) return null;

          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 p-4 text-xs font-black tracking-[0.2em] uppercase italic transition-all ${
                isActive
                  ? 'translate-x-2 bg-white text-black shadow-[-8px_0px_0px_0px_rgba(255,255,255,0.3)]'
                  : 'opacity-50 hover:translate-x-1 hover:bg-zinc-900 hover:opacity-100'
              } `}
            >
              <item.icon size={18} strokeWidth={3} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM ACTION */}
      <div className="border-t border-zinc-800 pt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
