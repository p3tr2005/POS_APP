// Don't used the server-only and env from validator cause it's use bun runtime.
// import 'server-only';
import * as models from '@/database/models';
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

// import { env } from '@/utils/validators/env.validator';

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  debug: process.env.NODE_ENV === 'development',
});

interface DatabaseImpl {
  connection: MySql2Database<typeof models>;
}

class Database implements DatabaseImpl {
  public connection!: MySql2Database<typeof models>;

  constructor() {
    this.connection = drizzle(connection, {
      schema: models,
      mode: 'default',
      logger: process.env.NODE_ENV === 'development',
    });

    console.log('[INFO]: Connection with mysql initialized.');
  }
}

const globalForDb = global as unknown as { db: DatabaseImpl['connection'] | undefined };

export const db = globalForDb.db || new Database().connection;

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
