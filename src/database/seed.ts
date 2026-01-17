// src/database/seed-admin.ts
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

import { db } from './index';
import { user } from './models';

async function createFirstAdmin() {
  try {
    console.log('[INFO]: Starting seed...');

    // 1. Biarkan Better-Auth membuat User + Account (Password Hash)
    const result = await auth.api.signUpEmail({
      body: {
        email: 'p3tr@gmail.com',
        password: 'p3tr_admin',
        name: 'peter',
      },
    });

    if (result) {
      // 2. Karena signUpEmail defaultnya role 'CASHIER', kita naikkan jadi 'ADMIN'
      await db.update(user).set({ role: 'ADMIN' }).where(eq(user.email, 'p3tr@gmail.com'));

      console.log('[SUCCESS]: Admin Peter created with Account Credentials.');
    }

    process.exit(0);
  } catch (error: any) {
    // Jika error karena user sudah ada, tampilkan pesannya
    console.error('[ERROR]:', error.message || error);
    process.exit(1);
  }
}

createFirstAdmin();
