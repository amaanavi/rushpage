"use client";

import { Fragment, useEffect, useState } from "react";

const FORM_URL =
  "https://docs.google.com/forms/d/1tXk4yM9OBMUEcgwQmtXekEjcnMQbn38vWdgj0BODFsk/viewform";

const NAV = [
  { label: "Contact", target: "contact" },
  { label: "Rush Schedule", target: "rush-schedule" },
  { label: "Other Events", target: "other-events" },
  { label: "Meet The Brothers", target: "meet-the-brothers" },
  { label: "Brothers", target: "brothers" },
];

// Every brother's headshot, in the exact order they're arranged in the folder
// (from the Finder icon layout, read top-to-bottom, left-to-right).
const BROTHER_PHOTOS = [
  67, 74, 86, 52, 37, 77, 109, 112, 99, 129, 6, 178, 44, 92, 174, 123, 3, 145,
  160, 182, 137, 117, 34, 27, 17,
].map((n) => `/Fiji-2026-${n}.jpg`);

// Order: President, VP, Recording Sec., Corresponding Sec., Historian
const BROTHERS = [
  { name: "Harrison Silcox — President", src: "/brother-1-president.png" },
  { name: "Lucas Swarowsky — Vice President and Treasurer", src: "/brother-2-vp.png" },
  { name: "Oskar Vermeire — Recording Secretary", src: "/brother-3-recording.png" },
  { name: "Henry Thompson — Corresponding Secretary", src: "/brother-4-corresponding.png" },
  { name: "Charles Vermeire — Historian", src: "/brother-5-historian.png" },
];

const MAJORS = [
  "Finance",
  "Economics",
  "Math",
  "Physics",
  "Bio-Medical Engineering",
  "Aerospace Engineering",
  "Philosophy",
  "Political Science",
  "Human Biology",
  "Physiology",
  "Immunology",
  "Accounting",
  "Neuroscience",
  "Psychology",
  "Cognitive Science",
  "Architecture",
  "History",
  "Environmental Sciences",
  "Book and Media Studies",
  "Linguistics",
  "Statistics",
  "Criminology",
  "Business",
  "Art History",
  "European Studies",
  "Islamic Studies",
  "Classics",
  "Religion",
];

// Deterministic per-item styling so the list reads like a hand-set page,
// not a row of identical AI pills. Varies size / weight / italic by index.
const MAJOR_SIZES = [26, 17, 20, 32, 15, 22, 18, 28, 16, 24];
function majorStyle(i) {
  const size = MAJOR_SIZES[i % MAJOR_SIZES.length];
  return {
    fontSize: `${size}px`,
    fontWeight: i % 3 === 0 ? 700 : i % 3 === 1 ? 400 : 600,
    fontStyle: i % 4 === 2 ? "italic" : "normal",
    opacity: 0.72 + ((i * 7) % 5) * 0.07, // 0.72 .. 1.0
    whiteSpace: "nowrap",
  };
}

const CONTACTS = [
  { label: "Official Instagram", handle: "@fijiuoft", url: "https://instagram.com/fijiuoft" },
  { label: "Rush", handle: "@alec_maanavi", url: "https://instagram.com/alec_maanavi" },
  { label: "Philanthropy", handle: "@liam.veale", url: "https://instagram.com/liam.veale" },
];

// Inclusive range of months to show: Aug 2026 .. Apr 2027
// (calendar opens on September; August is reachable one page back)
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

// Events keyed by `${year}-${monthIndex}-${day}` (monthIndex is 0-based).
const EVENTS = {
  "2026-7-31": ["First Day of Frosh/Orientation"],
  "2026-8-4": ["Last Day of Frosh/Orientation", "Rush Party: Fiji Friday"],
  "2026-8-5": ["Cookout + Meet the Brothers: Invite Only", "Rush Party: Invite Only"],
  "2026-8-8": ["Classes Start"],
  "2026-8-9": ["Meet the Brothers: Open Event"],
  "2026-8-12": ["Meet the Brothers: Open Event", "Rush Party: Theme TBD"],
  "2026-8-16": ["Poker Night: Open Event"],
  "2026-8-17": ["Fiji Bar Night: Open Event"],
  "2026-8-19": ["Fiji Club Night: Open Event"],
  "2026-8-20": ["Football Watch Party: Open Event"],
  "2026-8-24": ["Social: Invite Only"],
  "2026-8-26": ["Fiji Club Night: Open Event"],
  "2026-9-1": ["Second Social: Invite Only"],
};

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Calendar() {
  const [index, setIndex] = useState(1); // open on September (August is index 0)
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
        width: "min(1200px, 94vw)",
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
        <h3 style={{ margin: 0, fontSize: "30px", fontWeight: 700 }}>
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
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: 700,
              opacity: 0.8,
              padding: "6px 0",
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
          gap: "8px",
        }}
      >
        {cells.map((day, i) => {
          const dayEvents = day ? EVENTS[`${year}-${month}-${day}`] : null;
          return (
            <div
              key={i}
              style={{
                minHeight: "140px",
                borderRadius: "10px",
                background: day ? "rgba(255,255,255,0.08)" : "transparent",
                border: day ? "1px solid rgba(255,255,255,0.12)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                padding: "9px",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  textAlign: "right",
                  opacity: 0.85,
                }}
              >
                {day || ""}
              </div>
              {dayEvents &&
                dayEvents.map((ev, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.3,
                      fontWeight: 600,
                      color: "#ffffff",
                      background: "rgba(0,0,0,0.22)",
                      borderRadius: "5px",
                      padding: "4px 6px",
                    }}
                  >
                    {ev}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubColumn({ title, children, flex = "1 1 340px", maxWidth = "520px" }) {
  return (
    <div style={{ flex, minWidth: "280px", maxWidth }}>
      <h3
        style={{
          margin: "0 0 20px",
          fontSize: "24px",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {title}
      </h3>
      {children}
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
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [pending, setPending] = useState([]);
  const [actBusy, setActBusy] = useState(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let active = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (active) setUser(d.user);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Keep the pending count fresh for admins.
  useEffect(() => {
    if (!isAdmin) return;
    loadPending();
  }, [isAdmin]);

  function loadPending() {
    fetch("/api/admin/pending")
      .then((r) => (r.ok ? r.json() : { pending: [] }))
      .then((d) => setPending(d.pending || []))
      .catch(() => {});
  }

  async function decide(id, kind) {
    setActBusy(id);
    try {
      const res = await fetch(`/api/admin/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setPending((p) => p.filter((u) => u.id !== id));
    } catch {
      /* ignore */
    } finally {
      setActBusy(null);
    }
  }

  function logout() {
    fetch("/api/logout", { method: "POST" }).then(() => {
      window.location.reload();
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#4E2C84",
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
          backgroundColor: "#4E2C84",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {/* Centered emblem — click to return to the top */}
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          aria-label="Back to top"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <img
            src="/IMG_4307.jpeg"
            alt="FIJI"
            style={{
              width: "114%",
              height: "114%",
              objectFit: "cover",
              transform: "translate(-6%, -6%)",
            }}
          />
        </button>

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

        {user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                padding: "9px 20px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#ffffff",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.55)",
                borderRadius: "9999px",
                cursor: "pointer",
                maxWidth: "240px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: "220px",
                  background: "#3d2168",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    marginBottom: "12px",
                    wordBreak: "break-all",
                  }}
                >
                  Signed in as<br />
                  <strong>{user.email}</strong>
                </div>

                <button
                  onClick={logout}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: "pointer",
                    background: "#ffffff",
                    color: "#4E2C84",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/login"
            style={{
              padding: "9px 20px",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.55)",
              borderRadius: "9999px",
            }}
          >
            Log In
          </a>
        )}
      </nav>

      {/* Crest (top-left), below the sticky bar */}
      <aside style={{ padding: "20px 24px 0" }}>
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src="/images.png"
            alt="University of Toronto crest"
            style={{ maxWidth: "88%", maxHeight: "96%", objectFit: "contain" }}
          />
        </div>
      </aside>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px 24px 40px",
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
      <Section id="contact" title="Contact">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "56px",
            width: "min(1000px, 94vw)",
          }}
        >
          {CONTACTS.map((c) => (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#ffffff",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "16px", opacity: 0.85, marginBottom: "6px" }}>
                {c.label}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                {c.handle}
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section id="rush-schedule" title="Rush Schedule" minHeight="100vh">
        <Calendar />
      </Section>

      <Section id="other-events" title="Other Events">
        <p style={{ margin: 0, opacity: 0.85 }}>Content coming soon.</p>
      </Section>

      <Section id="meet-the-brothers" title="Meet The Brothers">
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "center",
            gap: 0,
            width: "min(1500px, 98vw)",
          }}
        >
          {BROTHERS.map((b) => (
            <img
              key={b.src}
              src={encodeURI(b.src)}
              alt={b.name}
              style={{
                width: "20%",
                borderRadius: 0,
                display: "block",
              }}
            />
          ))}
        </div>

        {/* Side-by-side subsections */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "48px",
            width: "min(1400px, 96vw)",
            marginTop: "48px",
          }}
        >
          <SubColumn title="Summer Internships" flex="1 1 720px" maxWidth="860px">
            <img
              src="/logos.png"
              alt="Companies where brothers held summer internships"
              style={{
                width: "100%",
                borderRadius: 0,
                display: "block",
              }}
            />
          </SubColumn>

          <SubColumn title="Majors" flex="1 1 360px" maxWidth="460px">
            <p
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                textAlign: "center",
                lineHeight: 1.7,
                color: "#ffffff",
              }}
            >
              {MAJORS.map((m, i) => (
                <Fragment key={m}>
                  <span style={majorStyle(i)}>{m}</span>
                  {i < MAJORS.length - 1 && (
                    <span style={{ opacity: 0.4, fontSize: "14px" }}>
                      {" · "}
                    </span>
                  )}
                </Fragment>
              ))}
            </p>
          </SubColumn>
        </div>
      </Section>

      <Section id="brothers" title="Brothers">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "18px",
            width: "min(1200px, 94vw)",
          }}
        >
          {BROTHER_PHOTOS.map((src) => (
            <img
              key={src}
              src={src}
              alt="Brother"
              loading="lazy"
              style={{
                width: "100%",
                aspectRatio: "2 / 3",
                objectFit: "cover",
                borderRadius: "12px",
                display: "block",
              }}
            />
          ))}
        </div>
      </Section>

      {/* Admin: circular check-mark handle + pull-open right sidebar */}
      {isAdmin && (
        <>
          <button
            onClick={() => {
              loadPending();
              setAdminOpen(true);
            }}
            aria-label="Pending admissions"
            style={{
              position: "fixed",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "46px",
              height: "92px",
              border: "none",
              cursor: "pointer",
              background: "#ffffff",
              color: "#4E2C84",
              borderTopLeftRadius: "14px",
              borderBottomLeftRadius: "14px",
              boxShadow: "-6px 0 20px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5l4.2 4.2L19 7"
                stroke="#4E2C84"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {pending.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "6px",
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "9999px",
                  background: "#F5C542",
                  color: "#4E2C84",
                  fontSize: "11px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {pending.length}
              </span>
            )}
          </button>

          {adminOpen && (
            <>
              <div
                onClick={() => setAdminOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 60,
                }}
              />
              <aside
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  height: "100%",
                  width: "min(400px, 92vw)",
                  background: "#3d2168",
                  borderLeft: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "-12px 0 40px rgba(0,0,0,0.4)",
                  zIndex: 70,
                  padding: "26px 22px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                    New Admissions{" "}
                    <span style={{ opacity: 0.6, fontWeight: 400 }}>
                      ({pending.length})
                    </span>
                  </h2>
                  <button
                    onClick={() => setAdminOpen(false)}
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

                {pending.length === 0 ? (
                  <p style={{ opacity: 0.7 }}>No one is waiting for admission.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {pending.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.16)",
                          borderRadius: "12px",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            wordBreak: "break-all",
                          }}
                        >
                          {u.email}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            opacity: 0.7,
                            margin: "3px 0 12px",
                          }}
                        >
                          Requested {new Date(u.created_at).toLocaleDateString()}
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            disabled={actBusy === u.id}
                            onClick={() => decide(u.id, "approve")}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "9999px",
                              border: "none",
                              cursor: "pointer",
                              background: "#ffffff",
                              color: "#4E2C84",
                              fontSize: "13px",
                              fontWeight: 700,
                            }}
                          >
                            Admit
                          </button>
                          <button
                            disabled={actBusy === u.id}
                            onClick={() => decide(u.id, "reject")}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "9999px",
                              border: "1px solid #ff9d9d",
                              cursor: "pointer",
                              background: "transparent",
                              color: "#ff9d9d",
                              fontSize: "13px",
                              fontWeight: 700,
                            }}
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
        </>
      )}
    </main>
  );
}
