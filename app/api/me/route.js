import { getSession } from "../../lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSession();
  return Response.json({
    user: s ? { email: s.email, role: s.role } : null,
  });
}
