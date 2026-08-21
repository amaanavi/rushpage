import bcrypt from "bcryptjs";
import { sql } from "../../lib/db";
import { setSessionCookie } from "../../lib/session";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  const rows = await sql`
    SELECT id, email, password_hash, role, status
    FROM users WHERE email = ${email}
  `;
  const user = rows[0];

  // Generic message so we don't reveal which emails exist.
  const invalid = () =>
    Response.json({ error: "Incorrect email or password." }, { status: 401 });

  if (!user) return invalid();

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return invalid();

  if (user.status !== "approved") {
    return Response.json(
      { error: "Your account is awaiting approval by an admin." },
      { status: 403 }
    );
  }

  await setSessionCookie({ id: user.id, email: user.email, role: user.role });

  return Response.json({ ok: true, role: user.role });
}
