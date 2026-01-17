import { defineConfig } from 'drizzle-kit';

import { env } from '@/utils/validators/env.validator';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/database/models',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
