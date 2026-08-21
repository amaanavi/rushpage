"use client";

import { useState } from "react";

const FORM_URL =
  "https://docs.google.com/forms/d/1tXk4yM9OBMUEcgwQmtXekEjcnMQbn38vWdgj0BODFsk/viewform";

const TABS = ["Rush Schedule", "Other Events", "Meet The Brothers"];

export default function Home() {
  const [active, setActive] = useState("Rush Schedule");

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#6C3BAA",
        display: "flex",
        flexDirection: "column",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* Top bar */}
      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                appearance: "none",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "10px 18px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#ffffff",
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",
              }}
            >
              {tab}
            </button>
          );
        })}

        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: "auto",
            padding: "10px 18px",
            borderRadius: "9999px",
            fontSize: "15px",
            fontWeight: 700,
            textDecoration: "none",
            color: "#4B286D",
            backgroundColor: "#F5C542",
          }}
        >
          Interested In Joining?
        </a>
      </nav>

      {/* Content */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 24px",
          gap: "24px",
        }}
      >
        <div
          style={{
            width: "min(28vh, 60vw)",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <img
            src="/IMG_4307.jpeg"
            alt="Emblem"
            style={{
              width: "114%",
              height: "114%",
              objectFit: "cover",
              transform: "translate(-6%, -6%)",
            }}
          />
        </div>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>{active}</h1>
        <p style={{ margin: 0, opacity: 0.85, maxWidth: "520px" }}>
          Content coming soon.
        </p>
      </section>
    </main>
  );
}
