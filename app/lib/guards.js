import { getSession } from "./session";
import { getSql } from "./db";

// The signed cookie payload: { id, email, role } — or null if not logged in.
export async function currentUser() {
  return await getSession();
}

// Re-verifies against the DB (source of truth), so a stale/tampered session
// can never act as admin. Returns the DB user row or null.
export async function currentAdmin() {
  const s = await getSession();
  if (!s) return null;
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, role, status FROM users WHERE id = ${s.id}
  `;
  const u = rows[0];
  if (!u || u.role !== "admin" || u.status !== "approved") return null;
  return u;
}

// Same idea for any approved member (re-checks status against the DB).
export async function currentMember() {
  const s = await getSession();
  if (!s) return null;
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, role, status FROM users WHERE id = ${s.id}
  `;
  const u = rows[0];
  if (!u || u.status !== "approved") return null;
  return u;
}
