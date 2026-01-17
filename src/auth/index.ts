import 'server-only';

import { headers } from 'next/headers';

import { db } from '@/database';
import * as authModels from '@/database/models/auth.model';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: authModels,
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'cashier',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export const getSession = async () => {
  const header = await headers();
  const session = await auth.api.getSession(header);

  return session;
};
