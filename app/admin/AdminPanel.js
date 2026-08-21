"use client";

import { useState } from "react";

const PURPLE = "#4E2C84";

export default function AdminPanel({ adminEmail, initialPending, members }) {
  const [pending, setPending] = useState(initialPending);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [note, setNote] = useState("");

  async function act(id, kind) {
    setBusyId(id);
    setNote("");
    try {
      const res = await fetch(`/api/admin/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNote(data.error || "Something went wrong.");
        return;
      }
      setPending((p) => p.filter((u) => u.id !== id));
      setNote(kind === "approve" ? "Admitted." : "Rejected and removed.");
    } catch {
      setNote("Network error.");
    } finally {
      setBusyId(null);
    }
  }

  const card = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "14px",
    padding: "24px",
    marginTop: "24px",
  };
  const th = { textAlign: "left", padding: "8px 10px", fontSize: "13px", opacity: 0.8 };
  const td = { padding: "10px", fontSize: "14px", borderTop: "1px solid rgba(255,255,255,0.12)" };
  const btn = (bg, color, border = "none") => ({
    padding: "8px 16px",
    borderRadius: "9999px",
    border,
    cursor: "pointer",
    background: bg,
    color,
    fontSize: "13px",
    fontWeight: 700,
  });

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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 700 }}>Admin</h1>
          <nav style={{ display: "flex", gap: "18px", fontSize: "14px" }}>
            <a href="/members" style={{ color: "#fff" }}>
              Members
            </a>
            <a href="/" style={{ color: "#fff", opacity: 0.85 }}>
              ← Back to site
            </a>
          </nav>
        </div>
        <p style={{ marginTop: "10px", opacity: 0.85 }}>
          Signed in as <strong>{adminEmail}</strong>.
        </p>

        {/* Pending approvals TAB — opens the side drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            ...card,
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#fff",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 700 }}>
            Pending approvals{" "}
            <span
              style={{
                marginLeft: "6px",
                fontSize: "14px",
                fontWeight: 700,
                background: pending.length ? "#F5C542" : "rgba(255,255,255,0.2)",
                color: pending.length ? PURPLE : "#fff",
                borderRadius: "9999px",
                padding: "2px 10px",
              }}
            >
              {pending.length}
            </span>
          </span>
          <span style={{ opacity: 0.7, fontSize: "14px" }}>Open ›</span>
        </button>

        {/* Current members */}
        <section style={card}>
          <h2 style={{ margin: "0 0 6px", fontSize: "20px" }}>
            Members{" "}
            <span style={{ opacity: 0.6, fontWeight: 400 }}>({members.length})</span>
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map((u) => (
                <tr key={u.id}>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Side drawer */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 40,
            }}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "min(440px, 92vw)",
              background: "#3d2168",
              borderLeft: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.4)",
              zIndex: 50,
              padding: "28px 24px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
                Pending Approvals
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "24px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {note && (
              <p style={{ margin: "4px 0 12px", fontSize: "13px", opacity: 0.9 }}>
                {note}
              </p>
            )}

            {pending.length === 0 ? (
              <p style={{ opacity: 0.7, marginTop: "16px" }}>
                No accounts waiting for approval.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
                {pending.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ fontSize: "15px", fontWeight: 600, wordBreak: "break-all" }}>
                      {u.email}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.7, margin: "4px 0 14px" }}>
                      Requested {new Date(u.created_at).toLocaleDateString()}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        disabled={busyId === u.id}
                        onClick={() => act(u.id, "approve")}
                        style={btn("#ffffff", PURPLE)}
                      >
                        Admit
                      </button>
                      <button
                        disabled={busyId === u.id}
                        onClick={() => act(u.id, "reject")}
                        style={btn("transparent", "#ff9d9d", "1px solid #ff9d9d")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </>
      )}
    </main>
  );
}
