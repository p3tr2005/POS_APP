// src/app/(dashboard)/settings/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import LogoutButton from '@/ui/components/logout-btn';
import { Bell, HardDrive, LogOut, Shield } from 'lucide-react';

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <div className="space-y-16 pb-20">
      {/* HEADER */}
      <div className="border-b-[10px] border-black pb-10">
        <h2 className="text-[10rem] leading-[0.7] font-black tracking-tighter uppercase italic">
          Account
        </h2>
        <p className="mt-6 text-xs font-black tracking-[0.5em] uppercase italic opacity-40">
          System_Preference_Configuration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* KIRI: PROFILE CARD */}
        <div className="space-y-8 lg:col-span-1">
          <div className="border-[6px] border-black bg-white p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 flex h-32 w-32 items-center justify-center bg-black">
              <span className="text-6xl font-black text-white italic">
                {user.name?.[0].toUpperCase()}
              </span>
            </div>
            <h3 className="text-4xl leading-tight font-black tracking-tighter uppercase italic">
              {user.name}
            </h3>
            <p className="mb-8 border-b-2 border-zinc-100 pb-4 font-mono text-sm opacity-50">
              {user.email}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-40">
                  Role
                </span>
                <span className="bg-black px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase italic">
                  ADMIN_STAFF
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-40">
                  Store_Access
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase italic">
                  MAIN_BRANCH_01
                </span>
              </div>
            </div>
          </div>

          <LogoutButton />
        </div>

        {/* KANAN: SETTINGS LIST */}
        <div className="space-y-4 lg:col-span-2">
          {[
            {
              title: 'Security_&_Access',
              desc: 'Manage password and two-factor authentication',
              icon: Shield,
            },
            {
              title: 'Notification_Alerts',
              desc: 'Configure sound and visual cues for incoming orders',
              icon: Bell,
            },
            {
              title: 'Data_Management',
              desc: 'Export sales report and clear transaction logs',
              icon: HardDrive,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex cursor-pointer items-center justify-between border-b-4 border-black p-8 transition-all hover:bg-black hover:text-white"
            >
              <div className="flex items-center gap-8">
                <item.icon
                  size={32}
                  strokeWidth={3}
                  className="opacity-20 group-hover:opacity-100"
                />
                <div>
                  <h4 className="mb-2 text-3xl leading-none font-black tracking-tighter uppercase italic">
                    {item.title}
                  </h4>
                  <p className="text-xs font-bold tracking-tight uppercase italic opacity-50 group-hover:opacity-80">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center border-4 border-current text-xl font-black italic transition-transform group-hover:translate-x-2">
                →
              </div>
            </div>
          ))}

          {/* TOGGLE EXAMPLE */}
          <div className="mt-12 border-4 border-dashed border-black bg-zinc-50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black tracking-tighter uppercase italic">
                  Automatic_Sync
                </h4>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-40">
                  Sync with kitchen display every 5s
                </p>
              </div>
              <div className="flex h-8 w-16 items-center justify-end bg-black p-1">
                <div className="h-full w-6 bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
