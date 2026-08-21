import bcrypt from "bcryptjs";
import { sql } from "../../lib/db";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (email, password_hash, role, status)
      VALUES (${email}, ${hash}, 'member', 'pending')
    `;
  } catch (err) {
    if (String(err?.message || "").includes("duplicate")) {
      return Response.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }

  return Response.json({
    ok: true,
    message: "Account created. It's pending approval by an admin.",
  });
}
