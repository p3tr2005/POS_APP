// import 'server-only';
import { headers } from 'next/headers';

import { db } from '@/database';
import * as authModels from '@/database/models/auth.model';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

const hashPassword = async (password: string) => {
  return Bun.password.hash(password);
};

const verifyPassword = async ({ hash, password }: { hash: string; password: string }) => {
  return Bun.password.verify(password, hash);
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: authModels,
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'CASHIER',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  plugins: [nextCookies()],
});

export const getSession = async () => {
  const header = await headers();
  const session = await auth.api.getSession(header);

  return session;
};
