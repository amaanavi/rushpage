import fs from "fs/promises";
import path from "path";
import { currentMember } from "../../../lib/guards";

export const dynamic = "force-dynamic";

// Only these exact filenames may be served — prevents path traversal.
const ALLOWED = new Set(
  [
    67, 74, 86, 52, 37, 77, 109, 112, 99, 129, 6, 178, 44, 92, 174, 123, 3, 145,
    160, 182, 137, 117, 34, 27, 17,
  ].map((n) => `Fiji-2026-${n}.jpg`)
);

export async function GET(request, { params }) {
  // Gate: must be an approved, logged-in member (admins included).
  const member = await currentMember();
  if (!member) {
    return new Response("Forbidden", { status: 403 });
  }

  const { file } = params;
  if (!ALLOWED.has(file)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const buf = await fs.readFile(
      path.join(process.cwd(), "brother-photos", file)
    );
    return new Response(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        // private: cache only in the member's own browser, never shared caches
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
