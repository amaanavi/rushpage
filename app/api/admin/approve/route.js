import { currentAdmin } from "../../../lib/guards";
import { getSql } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const admin = await currentAdmin();
  if (!admin) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await request.json().catch(() => ({}));
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });

  // Admit = approved general MEMBER. Force role to 'member' so this path can
  // never grant admin. Only pending accounts can be admitted here.
  await getSql()`
    UPDATE users
    SET status = 'approved', role = 'member'
    WHERE id = ${id} AND status = 'pending'
  `;
  return Response.json({ ok: true });
}
