import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // 💡 ১. স্কিমা ফাইলটি ইম্পোর্ট করুন

neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing!');
}

const sql = neon(process.env.DATABASE_URL);

// 💡 ২. drizzle-কে স্কিমা অবজেক্টটি চেনায়ে দিন
export const db = drizzle(sql, { schema });