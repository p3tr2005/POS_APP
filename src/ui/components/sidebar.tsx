// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChefHat, LayoutDashboard, Package, Settings, ShoppingBag, Zap } from 'lucide-react';

import LogoutButton from './logout-btn';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'STATUS', path: '/dashboard', icon: LayoutDashboard },
    { name: 'CASHIER', path: '/dashboard/pos', icon: ShoppingBag },
    { name: 'ORDERS', path: '/dashboard/orders', icon: ShoppingBag },
    { name: 'KITCHEN', path: '/dashboard/kitchen', icon: ChefHat },
    { name: 'INVENTORY', path: '/dashboard/inventory', icon: Package },
    { name: 'PREFERENCE', path: '/dashboard/settings', icon: Settings }, // INI YANG BARU
  ];

  return (
    <div className="sticky top-0 flex h-screen w-72 flex-col overflow-hidden bg-black p-8 text-white">
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
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
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
