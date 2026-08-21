import { redirect } from "next/navigation";
import { currentMember } from "../lib/guards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Members — Rushpage" };

const PURPLE = "#4E2C84";

export default async function MembersPage() {
  const user = await currentMember();
  if (!user) redirect("/login");

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: PURPLE,
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 700 }}>
            Members Area
          </h1>
          <nav style={{ display: "flex", gap: "18px", fontSize: "14px" }}>
            {user.role === "admin" && (
              <a href="/admin" style={{ color: "#fff" }}>
                Admin
              </a>
            )}
            <a href="/" style={{ color: "#fff", opacity: 0.85 }}>
              ← Back to site
            </a>
          </nav>
        </div>

        <p style={{ marginTop: "16px", opacity: 0.85 }}>
          Signed in as <strong>{user.email}</strong>.
        </p>

        <div
          style={{
            marginTop: "28px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "14px",
            padding: "28px",
          }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>
            Brothers-only content
          </h2>
          <p style={{ margin: 0, opacity: 0.85 }}>
            This area is only visible to approved brothers. Tell me what should
            live here (internal calendar, documents, contacts, etc.) and I'll
            build it out.
          </p>
        </div>
      </div>
    </main>
  );
}
