// src/app/page.tsx
import Link from 'next/link';

import { ArrowRight, Coffee, ShoppingBag, Utensils } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white font-sans text-black selection:bg-black selection:text-white">
      {/* BACKGROUND TEXT DECORATION */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.03] select-none">
        <h1 className="text-[40vw] leading-none font-black tracking-tighter italic">POS</h1>
      </div>

      <main className="relative z-10 flex min-h-screen flex-col p-6 md:p-12">
        {/* TOP NAV */}
        <nav className="mb-20 flex items-start justify-between">
          <div className="group cursor-default">
            <h2 className="text-5xl leading-none font-black tracking-tighter italic">DANKJE</h2>
            <div className="mt-1 flex gap-1">
              <div className="h-1.5 w-8 bg-black transition-all group-hover:w-12"></div>
              <div className="h-1.5 w-8 bg-black"></div>
              <div className="h-1.5 w-8 bg-black transition-all group-hover:w-4"></div>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="border-4 border-black px-6 py-2 text-xs font-black tracking-widest uppercase italic transition-all hover:bg-black hover:text-white"
          >
            Staff_Portal
          </Link>
        </nav>

        {/* HERO SECTION */}
        <div className="flex max-w-5xl flex-1 flex-col justify-center">
          <h1 className="mb-8 text-[12vw] leading-[0.85] font-black tracking-tighter uppercase italic md:text-[8vw]">
            Fueling Your <br />
            <span className="bg-black px-4 text-white">Daily Hustle</span>
          </h1>

          <p className="mb-12 max-w-2xl text-xl leading-tight font-bold tracking-tight uppercase italic md:text-2xl">
            Premium Boba, Sharp Coffee, and Authentic Street Food. Crafted for the bold.
          </p>

          <div className="flex flex-col gap-6 md:flex-row">
            <Link
              href="/menu/public"
              className="group flex items-center justify-between bg-black p-8 text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-900 md:w-96"
            >
              <span className="text-3xl font-black tracking-tighter uppercase italic">
                Order Now
              </span>
              <ArrowRight
                className="transition-transform group-hover:translate-x-2"
                size={32}
                strokeWidth={3}
              />
            </Link>

            <div className="flex items-center gap-4 px-4">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-none border-4 border-white bg-zinc-200 font-black italic"
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black tracking-widest uppercase opacity-60">
                Join 2k+ <br /> Happy Customers
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER STRIPE */}
        <footer className="mt-20 grid grid-cols-2 gap-1 border-4 border-black bg-black md:grid-cols-4">
          {[
            { label: 'AUTHENTIC', icon: Utensils },
            { label: 'ENERGIZED', icon: Coffee },
            { label: 'EFFICIENT', icon: ShoppingBag },
            { label: 'STREET_READY', icon: ArrowRight },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex cursor-default flex-col items-start gap-4 bg-white p-6 transition-all hover:bg-black hover:text-white"
            >
              <item.icon size={20} strokeWidth={3} />
              <span className="text-xs font-black tracking-[0.3em] uppercase italic">
                {item.label}
              </span>
            </div>
          ))}
        </footer>
      </main>
    </div>
  );
}
