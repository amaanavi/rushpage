import { neon } from "@neondatabase/serverless";

// Single Neon SQL client, reused across route handlers.
export const sql = neon(process.env.DATABASE_URL);
