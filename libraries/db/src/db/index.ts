import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export const db = drizzle(databaseUrl);