"use client";

import { useState } from "react";

const FORM_URL =
  "https://docs.google.com/forms/d/1tXk4yM9OBMUEcgwQmtXekEjcnMQbn38vWdgj0BODFsk/viewform";

const NAV = [
  { label: "Rush Schedule", target: "rush-schedule" },
  { label: "Other Events", target: "other-events" },
  { label: "Meet The Brothers", target: "meet-the-brothers" },
];

// Inclusive range of months to show: Aug 2026 .. Apr 2027
const MONTHS = [
  { year: 2026, month: 7 }, // August (0-indexed month)
  { year: 2026, month: 8 }, // September
  { year: 2026, month: 9 }, // October
  { year: 2026, month: 10 }, // November
  { year: 2026, month: 11 }, // December
  { year: 2027, month: 0 }, // January
  { year: 2027, month: 1 }, // February
  { year: 2027, month: 2 }, // March
  { year: 2027, month: 3 }, // April
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Calendar() {
  const [index, setIndex] = useState(0);
  const { year, month } = MONTHS[index];

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build the grid cells (leading blanks + days)
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const atStart = index === 0;
  const atEnd = index === MONTHS.length - 1;

  const arrowStyle = (disabled) => ({
    appearance: "none",
    border: "1px solid rgba(255,255,255,0.4)",
    background: "transparent",
    color: "#ffffff",
    borderRadius: "9999px",
    width: "40px",
    height: "40px",
    fontSize: "18px",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.3 : 1,
  });

  return (
    <div
      style={{
        width: "min(680px, 92vw)",
        margin: "0 auto",
        color: "#ffffff",
      }}
    >
      {/* Header with month name + arrows */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => !atStart && setIndex(index - 1)}
          disabled={atStart}
          aria-label="Previous month"
          style={arrowStyle(atStart)}
        >
          ‹
        </button>
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={() => !atEnd && setIndex(index + 1)}
          disabled={atEnd}
          aria-label="Next month"
          style={arrowStyle(atEnd)}
        >
          ›
        </button>
      </div>

      {/* Weekday header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          marginBottom: "6px",
        }}
      >
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 700,
              opacity: 0.8,
              padding: "4px 0",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
        }}
      >
        {cells.map((day, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: "8px",
              background: day ? "rgba(255,255,255,0.08)" : "transparent",
              border: day ? "1px solid rgba(255,255,255,0.12)" : "none",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              padding: "6px 8px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ id, title, children, minHeight }) {
  return (
    <section
      id={id}
      style={{
        minHeight: minHeight || "auto",
        padding: "72px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
        borderTop: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "30px", fontWeight: 700 }}>{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#6C3BAA",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* Top bar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#6C3BAA",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {NAV.map((item) => (
          <button
            key={item.target}
            onClick={() => scrollToId(item.target)}
            style={{
              appearance: "none",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "10px 18px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            {item.label}
          </button>
        ))}

        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: "auto",
            padding: "10px 18px",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
            color: "#ffffff",
            background: "transparent",
          }}
        >
          Interested In Joining?
        </a>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "calc(100vh - 65px)",
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
            width: "min(40vh, 80vw)",
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
      </section>

      {/* Sections */}
      <Section id="rush-schedule" title="Rush Schedule" minHeight="100vh">
        <Calendar />
      </Section>

      <Section id="other-events" title="Other Events">
        <p style={{ margin: 0, opacity: 0.85 }}>Content coming soon.</p>
      </Section>

      <Section id="meet-the-brothers" title="Meet The Brothers">
        <p style={{ margin: 0, opacity: 0.85 }}>Content coming soon.</p>
      </Section>
    </main>
  );
}
