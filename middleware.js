import { NextResponse } from "next/server";

// Fast first gate: bounce anyone with no session away from gated areas.
// The REAL authorization (member vs admin, approved status) is enforced
// server-side in each page/route via the guards in app/lib/guards.js.
export function middleware(req) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get("rp_session"));

  const gated =
    pathname.startsWith("/members") || pathname.startsWith("/admin");

  if (gated && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/members/:path*", "/admin/:path*"],
};
