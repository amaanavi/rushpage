"use client";

import { useState } from "react";

const PURPLE = "#4E2C84";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (isSignup && password !== confirm) {
      setMsg("Passwords don't match.");
      return;
    }
    // No backend yet — this is a UI preview. Wire up to Neon later.
    setMsg("Accounts aren't connected yet — this is a preview of the form.");
  }

  const label = { display: "block", fontSize: "14px", fontWeight: 600, margin: "0 0 6px" };
  const input = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(0,0,0,0.1)",
    fontSize: "15px",
    marginBottom: "18px",
    background: "#ffffff",
    color: "#1a1a1a",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: PURPLE,
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          width: "min(420px, 92vw)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        <h1 style={{ margin: "0 0 24px", fontSize: "26px", fontWeight: 700 }}>
          {isSignup ? "Create account" : "Log in"}
        </h1>

        <form onSubmit={onSubmit}>
          <label style={label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <label style={label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          {isSignup && (
            <>
              <label style={label} htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={input}
              />
            </>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              background: "#ffffff",
              color: PURPLE,
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            {isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        {msg && (
          <p style={{ margin: "16px 0 0", fontSize: "14px", opacity: 0.9 }}>{msg}</p>
        )}

        <p style={{ margin: "22px 0 0", fontSize: "14px" }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <a
            href={isSignup ? "/login" : "/signup"}
            style={{ color: "#ffffff", fontWeight: 700 }}
          >
            {isSignup ? "Log in" : "Create one"}
          </a>
        </p>

        <p style={{ margin: "18px 0 0", fontSize: "13px" }}>
          <a href="/" style={{ color: "#ffffff", opacity: 0.75 }}>
            ← Back to site
          </a>
        </p>
      </div>
    </main>
  );
}
