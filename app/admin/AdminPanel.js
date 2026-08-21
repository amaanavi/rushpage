"use client";

import { useState } from "react";

const PURPLE = "#4E2C84";

export default function AdminPanel({ adminEmail, initialPending, members }) {
  const [pending, setPending] = useState(initialPending);
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
      setNote(kind === "approve" ? "Approved." : "Rejected.");
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
  const btn = (bg, color) => ({
    padding: "7px 14px",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    background: bg,
    color,
    fontSize: "13px",
    fontWeight: 700,
    marginRight: "8px",
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
          <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 700 }}>
            Admin
          </h1>
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

        {/* Pending approvals */}
        <section style={card}>
          <h2 style={{ margin: "0 0 6px", fontSize: "20px" }}>
            Pending approvals{" "}
            <span style={{ opacity: 0.6, fontWeight: 400 }}>
              ({pending.length})
            </span>
          </h2>
          {note && (
            <p style={{ margin: "6px 0", fontSize: "13px", opacity: 0.9 }}>
              {note}
            </p>
          )}
          {pending.length === 0 ? (
            <p style={{ margin: "10px 0 0", opacity: 0.7 }}>
              No accounts waiting for approval.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={th}>Email</th>
                  <th style={th}>Requested</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {pending.map((u) => (
                  <tr key={u.id}>
                    <td style={td}>{u.email}</td>
                    <td style={td}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        disabled={busyId === u.id}
                        onClick={() => act(u.id, "approve")}
                        style={btn("#ffffff", PURPLE)}
                      >
                        Approve
                      </button>
                      <button
                        disabled={busyId === u.id}
                        onClick={() => act(u.id, "reject")}
                        style={btn("transparent", "#fff")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Current members */}
        <section style={card}>
          <h2 style={{ margin: "0 0 6px", fontSize: "20px" }}>
            Members{" "}
            <span style={{ opacity: 0.6, fontWeight: 400 }}>
              ({members.length})
            </span>
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
    </main>
  );
}
