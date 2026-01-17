import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { db } from '@/database';

import { UserTable } from './user-table';

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Security Gate: Hanya ADMIN yang boleh masuk
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Ambil data user dari database
  const allUsers = await db.query.user.findMany({
    orderBy: (user, { desc }) => [desc(user.createdAt)],
  });

  return (
    <div className="space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-6 border-b-[10px] border-black pb-8 md:flex-row md:items-end">
        <div>
          <h1 className="text-8xl leading-none font-black tracking-tighter uppercase italic">
            Personnel
          </h1>
          <p className="mt-2 text-xs font-black tracking-[0.4em] text-zinc-400 uppercase italic">
            Authorized_Access_Control
          </p>
        </div>
        <div className="bg-black p-6 text-2xl font-black text-white italic shadow-[8px_8px_0px_0px_rgba(255,0,0,1)]">
          {allUsers.length} REGISTERED_STAFF
        </div>
      </div>

      {/* USER TABLE COMPONENT */}
      <UserTable data={allUsers} currentAdminId={session.user.id} />
    </div>
  );
}
