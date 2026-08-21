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

  await getSql()`UPDATE users SET status = 'approved' WHERE id = ${id}`;
  return Response.json({ ok: true });
}
