import { redirect } from "next/navigation";
import { currentAdmin } from "../lib/guards";
import { getSql } from "../lib/db";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Rushpage" };

export default async function AdminPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/"); // members & public get bounced

  const sql = getSql();
  const pending = await sql`
    SELECT id, email, created_at FROM users
    WHERE status = 'pending' ORDER BY created_at ASC
  `;
  const members = await sql`
    SELECT id, email, role, status, created_at FROM users
    WHERE status = 'approved' ORDER BY email ASC
  `;

  return (
    <AdminPanel
      adminEmail={admin.email}
      initialPending={pending}
      members={members}
    />
  );
}
