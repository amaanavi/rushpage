import { neon } from "@neondatabase/serverless";

// Lazily create the Neon client at request time — NOT at module load —
// so `next build` (which imports route modules) doesn't require DATABASE_URL.
let client;

export function getSql() {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}
