import { currentAdmin } from "../../../lib/guards";
import { getSql } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }
  const pending = await getSql()`
    SELECT id, email, created_at FROM users
    WHERE status = 'pending' ORDER BY created_at ASC
  `;
  return Response.json({ pending });
}
