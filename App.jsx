import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   🔑 PASTE YOUR SUPABASE PUBLISHABLE KEY BELOW
───────────────────────────────────────────── */
const SUPABASE_URL = "https://tjawaqchdqwzseqvkmcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_z47xBsiT400iHmheSscc5g_NAvrQ1v1";

/* ─────────────────────────────────────────────
   PASSWORD HASHING
───────────────────────────────────────────── */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "hirehero_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ─────────────────────────────────────────────
   SUPABASE CLIENT
───────────────────────────────────────────── */
const sb = {
  async query(table, method = "GET", body = null, filters = "") {
    const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
    const res = await fetch(url, {
      method,
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": method === "POST" ? "return=representation" : "",
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) { const e = await res.text(); throw new Error(e); }
    if (method === "DELETE" || res.status === 204) return true;
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  },
  async select(table, filters = "") { return this.query(table, "GET", null, filters); },
  async insert(table, data) { return this.query(table, "POST", data); },
  async update(table, data, filters) { return this.query(table, "PATCH", data, filters); },
};

/* ─────────────────────────────────────────────
   THEME
───────────────────────────────────────────── */
const LIGHT = {
  bg: "#f0f4f8", surface: "#ffffff", surface2: "#f7f9fc",
  border: "#e2e8f0", text: "#0f172a", muted: "#64748b",
  accent: "#1e3a5f", accentLight: "#2d5a8e", accentGlow: "rgba(30,58,95,0.12)",
  gold: "#f59e0b", goldLight: "#fbbf24", goldGlow: "rgba(245,158,11,0.15)",
  green: "#059669", greenBg: "#ecfdf5", greenBorder: "#6ee7b7",
  red: "#dc2626", redBg: "#fef2f2",
  card: "#ffffff", cardBorder: "#e2e8f0",
  topbar: "rgba(255,255,255,0.92)",
  shadow: "0 4px 24px rgba(15,23,42,0.08)",
  shadowLg: "0 12px 40px rgba(15,23,42,0.12)",
};

const DARK = {
  bg: "#0d1117", surface: "#161b22", surface2: "#1c2333",
  border: "#30363d", text: "#e6edf3", muted: "#8b949e",
  accent: "#58a6ff", accentLight: "#79c0ff", accentGlow: "rgba(88,166,255,0.15)",
  gold: "#f0b429", goldLight: "#fbbf24", goldGlow: "rgba(240,180,41,0.15)",
  green: "#3fb950", greenBg: "rgba(63,185,80,0.1)", greenBorder: "#3fb95060",
  red: "#f85149", redBg: "rgba(248,81,73,0.1)",
  card: "#161b22", cardBorder: "#30363d",
  topbar: "rgba(13,17,23,0.95)",
  shadow: "0 4px 24px rgba(0,0,0,0.4)",
  shadowLg: "0 12px 40px rgba(0,0,0,0.5)",
};

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const C_STEPS = ["Account", "Profile", "Verify", "Done"];
const H_STEPS = ["Account", "Address", "Done"];

const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  tools: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80",
  home: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  handyman1: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80",
  handyman2: "https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&q=80",
  handyman3: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  job1: "https://images.unsplash.com/photo-1545259742-e1d46e3b0072?w=400&q=80",
  job2: "https://images.unsplash.com/photo-1612833603922-5a3fb742e9d6?w=400&q=80",
  job3: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;-webkit-tap-highlight-color:transparent;transition:background 0.3s;}
  input,textarea,select,button{font-family:'Plus Jakarta Sans',sans-serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pop{0%{transform:scale(0.88);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes shimmer{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}
  @keyframes slide{from{transform:translateX(-8px);opacity:0}to{transform:translateX(0);opacity:1}}
  .fu{animation:fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards;}
  .fi{animation:fadeIn 0.3s ease forwards;}
  .pop{animation:pop 0.5s cubic-bezier(0.16,1,0.3,1) forwards;}
  .spin{display:inline-block;animation:spin 0.9s linear infinite;}
  .slide{animation:slide 0.3s ease forwards;}
  textarea{resize:vertical;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{border-radius:4px;}
  img{display:block;}
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const session = {
  get: () => { try { return JSON.parse(localStorage.getItem("hh_user")); } catch { return null; } },
  set: (u) => { try { localStorage.setItem("hh_user", JSON.stringify(u)); } catch {} },
  clear: () => { try { localStorage.removeItem("hh_user"); } catch {} },
};

const getTheme = () => { try { return localStorage.getItem("hh_theme") || "light"; } catch { return "light"; } };
const setTheme = (t) => { try { localStorage.setItem("hh_theme", t); } catch {} };

function timeAgo(ts) {
  const d = Date.now() - new Date(ts).getTime();
  if (d < 60000) return "just now";
  if (d < 3600000) return Math.floor(d / 60000) + "m ago";
  if (d < 86400000) return Math.floor(d / 3600000) + "h ago";
  return Math.floor(d / 86400000) + "d ago";
}

/* ─────────────────────────────────────────────
   UI COMPONENTS
───────────────────────────────────────────── */
function Logo({ T, size = 22 }) {
  return (
    <span style={{
      fontFamily: "'Syne',sans-serif", fontSize: size + 4,
      fontWeight: 800, color: T.text, letterSpacing: -0.5
    }}>Hire<span style={{ color: T.accent }}>Hero</span></span>
  );
}

function ThemeToggle({ dark, onToggle, T }) {
  return (
    <button onClick={onToggle} style={{
      width: 52, height: 28, borderRadius: 14,
      background: dark ? T.accent : T.border,
      border: "none", cursor: "pointer",
      position: "relative", transition: "background 0.3s",
      flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        background: T.surface, position: "absolute",
        top: 3, left: dark ? 27 : 3,
        transition: "left 0.3s", display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 12,
      }}>{dark ? "🌙" : "☀️"}</div>
    </button>
  );
}

function Topbar({ T, user, onLogout, dark, onToggleTheme, onBack }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: T.topbar,
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${T.border}`,
      padding: "12px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: T.shadow,
    }}>
      {onBack
        ? <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: T.accent, padding: "4px 0" }}>← Back</button>
        : <Logo T={T} size={18} />
      }
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ThemeToggle dark={dark} onToggle={onToggleTheme} T={T} />
        {user && (
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: T.accentGlow, border: `2px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
          }}>
            {user.role === "contractor" ? "🔧" : "🏠"}
          </div>
        )}
        {onLogout && (
          <button onClick={onLogout} style={{
            background: "none", border: `1.5px solid ${T.border}`,
            borderRadius: 8, padding: "6px 14px",
            fontSize: 12, fontWeight: 700, color: T.muted, cursor: "pointer",
            transition: "all 0.2s",
          }}>Sign Out</button>
        )}
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, T, style: sx = {} }) {
  const base = {
    width: "100%", padding: "14px 20px", borderRadius: 12,
    fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", transition: "all 0.2s", opacity: disabled ? 0.5 : 1,
    letterSpacing: 0.2, ...sx
  };
  const v = {
    primary: { background: `linear-gradient(135deg,${T.accent},${T.accentLight})`, color: "#fff", boxShadow: `0 4px 16px ${T.accentGlow}` },
    secondary: { background: T.surface2, color: T.text, border: `1.5px solid ${T.border}` },
    green: { background: `linear-gradient(135deg,${T.green},#10b981)`, color: "#fff", boxShadow: `0 4px 16px rgba(5,150,105,0.25)` },
    gold: { background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: "#fff", boxShadow: `0 4px 16px ${T.goldGlow}` },
    ghost: { background: "transparent", color: T.accent, border: `1.5px solid ${T.accent}` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant] }}>{children}</button>;
}

function Field({ label, icon, error, hint, T, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</label>}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: T.surface2, border: `1.5px solid ${error ? T.red : T.border}`,
        borderRadius: 10, padding: "0 14px", transition: "border-color 0.2s",
      }}>
        {icon && <span style={{ fontSize: 16, opacity: 0.5, flexShrink: 0 }}>{icon}</span>}
        {children}
      </div>
      {error && <p style={{ fontSize: 11, color: T.red, fontWeight: 600, marginTop: 4 }}>⚠ {error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function iS(T) {
  return { border: "none", background: "transparent", width: "100%", padding: "13px 0", fontSize: 14, fontWeight: 500, color: T.text, outline: "none" };
}

function Card({ children, T, style: sx = {}, className = "fu" }) {
  return (
    <div className={className} style={{
      background: T.card, borderRadius: 16, padding: 22,
      boxShadow: T.shadow, border: `1px solid ${T.cardBorder}`, ...sx
    }}>
      {children}
    </div>
  );
}

function Badge({ children, color, T }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: color + "20", color,
      border: `1px solid ${color}40`,
      borderRadius: 6, padding: "3px 10px",
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
    }}>{children}</span>
  );
}

function ProgressBar({ step, steps, T }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i < step ? T.green : i === step ? T.accent : T.surface2,
              border: `2px solid ${i < step ? T.green : i === step ? T.accent : T.border}`,
              color: i <= step ? "#fff" : T.muted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, transition: "all 0.3s",
              boxShadow: i === step ? `0 0 0 4px ${T.accentGlow}` : "none",
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: i === step ? T.accent : T.muted, marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 2, background: T.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${T.accent},${T.gold})`, width: `${(step / (steps.length - 1)) * 100}%`, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function Spinner({ T, text = "Loading…" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 48, gap: 12 }}>
      <div className="spin" style={{ width: 32, height: 32, border: `3px solid ${T.border}`, borderTopColor: T.accent, borderRadius: "50%" }} />
      <p style={{ fontSize: 13, fontWeight: 600, color: T.muted }}>{text}</p>
    </div>
  );
}

function EmptyState({ icon, title, sub, action, T }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>{icon}</div>
      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: action ? 24 : 0, lineHeight: 1.6 }}>{sub}</p>
      {action}
    </div>
  );
}

function StatCard({ icon, value, label, T, color }) {
  return (
    <div style={{
      background: T.surface2, borderRadius: 12, padding: "16px 12px",
      textAlign: "center", border: `1px solid ${T.border}`,
    }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: color || T.accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WELCOME SCREEN
───────────────────────────────────────────── */
function WelcomeScreen({ T, dark, onToggleTheme, onSelect, onLogin }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text }}>
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Logo T={T} size={20} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ThemeToggle dark={dark} onToggle={onToggleTheme} T={T} />
          <button onClick={onLogin} style={{ background: "none", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, color: T.text, cursor: "pointer" }}>Sign In</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Background image */}
        <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
          <img
            src={UNSPLASH.hero}
            alt="Handyman at work"
            onLoad={() => setImgLoaded(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: dark ? "brightness(0.3)" : "brightness(0.45)", transition: "opacity 0.5s", opacity: imgLoaded ? 1 : 0 }}
          />
          <div style={{ position: "absolute", inset: 0, background: dark ? "linear-gradient(to bottom, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.95) 100%)" : "linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.9) 100%)" }} />

          {/* Hero text over image */}
          <div className="fu" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 32px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 50, padding: "6px 14px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3fb950", animation: "shimmer 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>Now live in Marysville & Columbus, OH</span>
            </div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(36px,9vw,56px)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: -1, marginBottom: 12 }}>
              The Safer &<br />
              <span style={{ color: T.goldLight }}>Smarter Way</span><br />
              to Hire.
            </h1>
            <p style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, maxWidth: 340 }}>
              Snap a photo. Get bids from verified local handymen. Money held in escrow until you approve.
            </p>
          </div>
        </div>

        {/* Floating stats */}
        <div className="fu" style={{ margin: "-20px 16px 0", position: "relative", zIndex: 5 }}>
          <div style={{ background: T.card, borderRadius: 16, padding: "16px 20px", boxShadow: T.shadowLg, border: `1px solid ${T.cardBorder}`, display: "flex", justifyContent: "space-around" }}>
            {[["🔧", "100%", "Free to join"], ["🔒", "Escrow", "Protected pay"], ["✓", "Verified", "Pros only"]].map(([ic, v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{ic}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>{v}</div>
                <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: 0.3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role selection */}
      <div className="fu" style={{ padding: "28px 20px 0" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>Get started as a…</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Homeowner card */}
          <button onClick={() => onSelect("homeowner", "signup")} style={{
            background: T.card, border: `1.5px solid ${T.cardBorder}`,
            borderRadius: 16, padding: 0, cursor: "pointer", overflow: "hidden",
            boxShadow: T.shadow, textAlign: "left", transition: "transform 0.2s, box-shadow 0.2s",
          }}>
            <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
              <img src={UNSPLASH.home} alt="Home" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🏠</div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif" }}>Homeowner</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Post a job, get bids, pay safely</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 22, color: "rgba(255,255,255,0.5)" }}>›</span>
              </div>
            </div>
          </button>

          {/* Contractor card */}
          <button onClick={() => onSelect("contractor", "signup")} style={{
            background: T.card, border: `1.5px solid ${T.cardBorder}`,
            borderRadius: 16, padding: 0, cursor: "pointer", overflow: "hidden",
            boxShadow: T.shadow, textAlign: "left", transition: "transform 0.2s",
          }}>
            <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
              <img src={UNSPLASH.tools} alt="Tools" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🔧</div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif" }}>Handyman / Pro</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Find jobs, bid, get paid free</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 22, color: "rgba(255,255,255,0.5)" }}>›</span>
              </div>
            </div>
            {/* Free banner */}
            <div style={{ padding: "12px 20px", background: T.surface2, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>🎉</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.green }}>100% free — no fees until you're making money on the platform</p>
            </div>
          </button>
        </div>

        {/* How it works strip */}
        <div style={{ margin: "28px 0 0", background: T.surface2, borderRadius: 16, padding: "20px 18px", border: `1px solid ${T.border}` }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>How It Works</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["📸", "Snap a Photo", "Homeowner takes a photo of the job and posts it"],
              ["💬", "Get Real Bids", "Verified local handymen see it and send their price"],
              ["🔒", "Escrow Holds Payment", "Money is secured — contractor can't touch it yet"],
              ["✅", "Approve & Release", "Happy with the work? Tap approve. Money releases instantly."],
            ].map(([ic, title, desc], i) => (
              <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accentGlow, border: `1px solid ${T.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{ic}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{title}</p>
                  <p style={{ fontSize: 12, color: T.muted, fontWeight: 500, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample contractor profiles */}
        <div style={{ margin: "24px 0 0" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Local Pros Near You</p>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {[
              { name: "Mike R.", img: UNSPLASH.handyman1, rating: "4.9", jobs: "47 jobs" },
              { name: "Dave S.", img: UNSPLASH.handyman2, rating: "5.0", jobs: "31 jobs" },
              { name: "Tom W.", img: UNSPLASH.handyman3, rating: "4.8", jobs: "62 jobs" },
            ].map(pro => (
              <div key={pro.name} style={{ flexShrink: 0, width: 130, background: T.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.cardBorder}`, boxShadow: T.shadow }}>
                <img src={pro.img} alt={pro.name} style={{ width: "100%", height: 90, objectFit: "cover" }} />
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 2 }}>{pro.name}</p>
                  <p style={{ fontSize: 11, color: T.gold, fontWeight: 700 }}>⭐ {pro.rating}</p>
                  <p style={{ fontSize: 10, color: T.muted, fontWeight: 600, marginTop: 2 }}>{pro.jobs}</p>
                  <div style={{ marginTop: 6, background: T.green + "20", borderRadius: 4, padding: "2px 6px", display: "inline-block" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: T.green }}>✓ VERIFIED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────── */
function LoginScreen({ T, dark, onToggleTheme, onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true); setErr("");
    try {
      const rows = await sb.select("users", `?email=eq.${encodeURIComponent(email)}&select=*`);
      if (!rows.length) { setErr("No account found with that email."); setLoading(false); return; }
      const hashed = await hashPassword(pw);
      if (rows[0].password !== hashed) { setErr("Incorrect password."); setLoading(false); return; }
      onLogin(rows[0]);
    } catch { setErr("Connection error. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Topbar T={T} dark={dark} onToggleTheme={onToggleTheme} onBack={onBack} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
        <div className="fu" style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Logo T={T} size={22} />
            <p style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 8 }}>Welcome back</p>
          </div>
          <Card T={T}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 20 }}>Sign In</h2>
            <Field label="Email" icon="✉️" T={T}><input style={iS(T)} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} /></Field>
            <Field label="Password" icon="🔒" T={T}><input style={iS(T)} type="password" placeholder="Your password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} /></Field>
            {err && <p style={{ fontSize: 12, color: T.red, fontWeight: 600, marginBottom: 12 }}>⚠ {err}</p>}
            <Btn onClick={handle} disabled={loading} T={T}>{loading ? <div className="spin" style={{ width: 18, height: 18, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: "#fff", borderRadius: "50%", margin: "0 auto" }} /> : "Sign In →"}</Btn>
            <Btn variant="secondary" onClick={onBack} T={T} style={{ marginTop: 10 }}>← Back</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTRACTOR SIGNUP
───────────────────────────────────────────── */
function ContractorSignup({ T, dark, onToggleTheme, onDone, onLogin, onBack }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const u = (k, v) => setD(p => ({ ...p, [k]: v }));

  const validate0 = () => {
    const e = {};
    if (!d.firstName) e.firstName = "Required";
    if (!d.lastName) e.lastName = "Required";
    if (!d.email || !/\S+@\S+\.\S+/.test(d.email)) e.email = "Valid email required";
    if (!d.phone || d.phone.replace(/\D/g, "").length < 10) e.phone = "10-digit phone required";
    if (!d.password || d.password.length < 6) e.password = "Min 6 characters";
    setErrors(e); return !Object.keys(e).length;
  };

  const save = async () => {
    setLoading(true); setErr("");
    try {
      const exists = await sb.select("users", `?email=eq.${encodeURIComponent(d.email)}&select=id`);
      if (exists.length) { setErr("An account with this email already exists."); setLoading(false); return; }
      const hashed = await hashPassword(d.password);
      const rows = await sb.insert("users", {
        email: d.email, password: hashed, role: "contractor",
        first_name: d.firstName, last_name: d.lastName, phone: d.phone,
        business_name: d.businessName || `${d.firstName} ${d.lastName}`,
        city: d.city, bio: d.bio, trades: ["handyman"], radius: d.radius,
        insurance: null, license: null, id_doc: null, verified: false,
      });
      if (rows && rows[0]) { session.set(rows[0]); onDone(rows[0]); }
    } catch (e) { setErr("Error creating account. Please try again."); }
    setLoading(false);
  };

  const screens = [
    // Account
    <div className="fu" key="c0">
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 4 }}>Create Account</h2>
      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 20 }}>Free to join. No fees until you're earning.</p>
      <div style={{ background: T.green + "15", border: `1px solid ${T.green}40`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, display: "flex", gap: 10 }}>
        <span style={{ fontSize: 18 }}>🎉</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.green }}>100% Free to start</p>
          <p style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>We only make money when you do. No hidden fees ever.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="First Name" icon="👤" error={errors.firstName} T={T}><input style={iS(T)} placeholder="John" value={d.firstName || ""} onChange={e => u("firstName", e.target.value)} /></Field>
        <Field label="Last Name" icon="👤" error={errors.lastName} T={T}><input style={iS(T)} placeholder="Smith" value={d.lastName || ""} onChange={e => u("lastName", e.target.value)} /></Field>
      </div>
      <Field label="Email" icon="✉️" error={errors.email} T={T}><input style={iS(T)} type="email" placeholder="john@email.com" value={d.email || ""} onChange={e => u("email", e.target.value)} /></Field>
      <Field label="Phone (10 digits)" icon="📱" error={errors.phone} T={T}><input style={iS(T)} type="tel" placeholder="6145550100" value={d.phone || ""} onChange={e => u("phone", e.target.value)} /></Field>
      <Field label="Password" icon="🔒" error={errors.password} T={T}><input style={iS(T)} type="password" placeholder="Min 6 characters" value={d.password || ""} onChange={e => u("password", e.target.value)} /></Field>
      <Btn onClick={() => validate0() && setStep(1)} T={T}>Continue →</Btn>
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <button onClick={onLogin} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 700, color: T.accent, cursor: "pointer" }}>Already have an account? Sign in</button>
      </div>
    </div>,

    // Profile
    <div className="fu" key="c1">
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 4 }}>Your Profile</h2>
      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 18 }}>What homeowners will see when you bid.</p>
      <Field label="Business or Your Name" icon="🏢" T={T}><input style={iS(T)} placeholder="Smith's Handyman Services" value={d.businessName || ""} onChange={e => u("businessName", e.target.value)} /></Field>
      <Field label="City & State" icon="📍" T={T}><input style={iS(T)} placeholder="Marysville, OH" value={d.city || ""} onChange={e => u("city", e.target.value)} /></Field>
      <Field label="How far will you travel?" icon="🗺️" T={T}>
        <select style={{ ...iS(T), cursor: "pointer" }} value={d.radius || ""} onChange={e => u("radius", e.target.value)}>
          <option value="">Select radius…</option>
          {["Within 10 miles", "Within 25 miles", "Within 50 miles"].map(r => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" }}>About Your Work</label>
        <textarea placeholder="Describe what you do, what you specialize in, why homeowners should hire you…" value={d.bio || ""} onChange={e => u("bio", e.target.value)} style={{ width: "100%", minHeight: 90, padding: "12px 14px", background: T.surface2, border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500, color: T.text, outline: "none", lineHeight: 1.6 }} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="secondary" onClick={() => setStep(0)} T={T} style={{ width: 48, padding: "14px 0", flexShrink: 0 }}>←</Btn>
        <Btn onClick={() => d.city && setStep(2)} disabled={!d.city} T={T}>Continue →</Btn>
      </div>
    </div>,

    // Verify
    <div className="fu" key="c2">
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 4 }}>Get Verified</h2>
      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 16 }}>Verified pros get the most jobs and appear first.</p>

      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 18 }}>
        <img src={UNSPLASH.tools} alt="" style={{ width: "100%", height: 100, objectFit: "cover", filter: "brightness(0.4)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
          <div style={{ fontSize: 32 }}>🏅</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Verified Pro Badge</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Appears on your profile in search results</p>
          </div>
        </div>
      </div>

      <div style={{ background: T.surface2, borderRadius: 14, padding: 18, marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>📸 What to send us:</p>
        {[
          ["🛡️", "Insurance Certificate (COI)", "Photo of your general liability insurance"],
          ["🪪", "Government ID", "Photo of your driver's license or state ID"],
          ["📋", "License (if applicable)", "Ohio license if your work requires it"],
        ].map(([ic, title, desc]) => (
          <div key={title} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{ic}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</p>
              <p style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: T.greenBg, border: `1.5px solid ${T.greenBorder}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16, textAlign: "center" }}>
        <p style={{ fontSize: 22, marginBottom: 8 }}>📧</p>
        <p style={{ fontSize: 14, fontWeight: 800, color: T.green, marginBottom: 8 }}>Email your photos directly to us</p>
        <a href={`mailto:xkyl3@outlook.com?subject=HireHero Verification - ${d.firstName || ""} ${d.lastName || ""}`} style={{ display: "block", background: T.card, borderRadius: 10, padding: "12px", border: `1.5px solid ${T.border}`, fontSize: 15, fontWeight: 800, color: T.accent, textDecoration: "none", marginBottom: 8 }}>
          xkyl3@outlook.com
        </a>
        <p style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>Tap above — your name is pre-filled in the subject line</p>
      </div>

      <div style={{ background: T.goldGlow, border: `1px solid ${T.gold}40`, borderRadius: 10, padding: "11px 14px", marginBottom: 18 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: T.gold }}>⏱️ Reviewed within 1–2 business days. Browse and bid on jobs right away while you wait.</p>
      </div>

      {err && <p style={{ fontSize: 12, color: T.red, fontWeight: 600, marginBottom: 12 }}>⚠ {err}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="secondary" onClick={() => setStep(1)} T={T} style={{ width: 48, padding: "14px 0", flexShrink: 0 }}>←</Btn>
        <Btn onClick={() => !loading && save()} disabled={loading} T={T}>
          {loading ? <div className="spin" style={{ width: 18, height: 18, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: "#fff", borderRadius: "50%", margin: "0 auto" }} /> : "Submit & Get Started →"}
        </Btn>
      </div>
    </div>,

    // Done
    <div className="fu" key="c3" style={{ textAlign: "center" }}>
      <div className="pop" style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: T.text, marginBottom: 10 }}>You're In, {d.firstName}!</h2>
      <p style={{ fontSize: 14, color: T.muted, fontWeight: 500, lineHeight: 1.7, marginBottom: 24 }}>
        Profile submitted. Send your verification photos to <strong style={{ color: T.accent }}>xkyl3@outlook.com</strong> and we'll activate your badge within 1–2 days.
      </p>
      <div style={{ background: T.surface2, borderRadius: 14, padding: 18, marginBottom: 24, textAlign: "left" }}>
        {[["📧", "Confirmation sent", `Check ${d.email}`], ["🔍", "We review your docs", "1–2 business days"], ["🏅", "Verified Pro Badge", "Added to your profile"], ["📬", "Jobs start coming in", "From homeowners near you"]].map(([ic, title, sub]) => (
          <div key={title} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{ic}</span>
            <div><p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</p><p style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>{sub}</p></div>
          </div>
        ))}
      </div>
      <Btn onClick={() => onDone(session.get())} T={T}>Go to Dashboard →</Btn>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Topbar T={T} dark={dark} onToggleTheme={onToggleTheme} onBack={step > 0 ? () => setStep(s => s - 1) : onBack} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0 48px" }}>
        <div style={{ width: "100%", maxWidth: 440, padding: "0 16px" }}>
          <div style={{ marginBottom: 20 }}><ProgressBar step={step} steps={C_STEPS} T={T} /></div>
          <Card T={T}>{screens[step]}</Card>
          <p style={{ textAlign: "center", fontSize: 11, color: T.muted, fontWeight: 600, marginTop: 14 }}>🔒 Encrypted & secure · usehirehero.com</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOMEOWNER SIGNUP
───────────────────────────────────────────── */
function HomeownerSignup({ T, dark, onToggleTheme, onDone, onLogin, onBack }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const u = (k, v) => setD(p => ({ ...p, [k]: v }));

  const validate0 = () => {
    const e = {};
    if (!d.firstName) e.firstName = "Required";
    if (!d.lastName) e.lastName = "Required";
    if (!d.email || !/\S+@\S+\.\S+/.test(d.email)) e.email = "Valid email required";
    if (!d.phone || d.phone.replace(/\D/g, "").length < 10) e.phone = "10-digit phone required";
    if (!d.password || d.password.length < 6) e.password = "Min 6 characters";
    setErrors(e); return !Object.keys(e).length;
  };

  const save = async () => {
    setLoading(true); setErr("");
    try {
      const exists = await sb.select("users", `?email=eq.${encodeURIComponent(d.email)}&select=id`);
      if (exists.length) { setErr("An account with this email already exists."); setLoading(false); return; }
      const hashed = await hashPassword(d.password);
      const rows = await sb.insert("users", {
        email: d.email, password: hashed, role: "homeowner",
        first_name: d.firstName, last_name: d.lastName,
        phone: d.phone, city: d.city, address: d.address, zip: d.zip,
      });
      if (rows && rows[0]) { session.set(rows[0]); onDone(rows[0]); }
    } catch { setErr("Error creating account. Please try again."); }
    setLoading(false);
  };

  const screens = [
    <div className="fu" key="h0">
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 4 }}>Create Account</h2>
      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 18 }}>Free to join. Post your first job in minutes.</p>
      <div style={{ background: T.greenBg, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, display: "flex", gap: 10 }}>
        <span>🔒</span><p style={{ fontSize: 12, fontWeight: 700, color: T.green }}>Your payment is held in escrow until you approve the finished work.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="First Name" icon="👤" error={errors.firstName} T={T}><input style={iS(T)} placeholder="Jane" value={d.firstName || ""} onChange={e => u("firstName", e.target.value)} /></Field>
        <Field label="Last Name" icon="👤" error={errors.lastName} T={T}><input style={iS(T)} placeholder="Doe" value={d.lastName || ""} onChange={e => u("lastName", e.target.value)} /></Field>
      </div>
      <Field label="Email" icon="✉️" error={errors.email} T={T}><input style={iS(T)} type="email" placeholder="jane@email.com" value={d.email || ""} onChange={e => u("email", e.target.value)} /></Field>
      <Field label="Phone (10 digits)" icon="📱" error={errors.phone} T={T}><input style={iS(T)} type="tel" placeholder="6145550200" value={d.phone || ""} onChange={e => u("phone", e.target.value)} /></Field>
      <Field label="Password" icon="🔒" error={errors.password} T={T}><input style={iS(T)} type="password" placeholder="Min 6 characters" value={d.password || ""} onChange={e => u("password", e.target.value)} /></Field>
      <Btn onClick={() => validate0() && setStep(1)} T={T}>Continue →</Btn>
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <button onClick={onLogin} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 700, color: T.accent, cursor: "pointer" }}>Already have an account? Sign in</button>
      </div>
    </div>,

    <div className="fu" key="h1">
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 4 }}>Your Home</h2>
      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 18 }}>Helps us match nearby handymen to you.</p>
      <Field label="Street Address" icon="🏠" T={T}><input style={iS(T)} placeholder="123 Main St" value={d.address || ""} onChange={e => u("address", e.target.value)} /></Field>
      <Field label="City & State" icon="📍" T={T}><input style={iS(T)} placeholder="Marysville, OH" value={d.city || ""} onChange={e => u("city", e.target.value)} /></Field>
      <Field label="Zip Code" icon="📮" T={T}><input style={iS(T)} placeholder="43040" value={d.zip || ""} onChange={e => u("zip", e.target.value)} /></Field>
      {err && <p style={{ fontSize: 12, color: T.red, fontWeight: 600, marginBottom: 12 }}>⚠ {err}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="secondary" onClick={() => setStep(0)} T={T} style={{ width: 48, padding: "14px 0", flexShrink: 0 }}>←</Btn>
        <Btn onClick={() => d.city && save()} disabled={!d.city || loading} T={T}>
          {loading ? <div className="spin" style={{ width: 18, height: 18, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: "#fff", borderRadius: "50%", margin: "0 auto" }} /> : "Create Account →"}
        </Btn>
      </div>
    </div>,

    <div className="fu" key="h2" style={{ textAlign: "center" }}>
      <div className="pop" style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: T.text, marginBottom: 10 }}>Welcome, {d.firstName}!</h2>
      <p style={{ fontSize: 14, color: T.muted, fontWeight: 500, lineHeight: 1.7, marginBottom: 24 }}>Your account is ready. Post your first job now and get bids fast.</p>
      <Btn onClick={() => onDone(session.get())} T={T}>Post My First Job →</Btn>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Topbar T={T} dark={dark} onToggleTheme={onToggleTheme} onBack={step > 0 ? () => setStep(s => s - 1) : onBack} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0 48px" }}>
        <div style={{ width: "100%", maxWidth: 440, padding: "0 16px" }}>
          <div style={{ marginBottom: 20 }}><ProgressBar step={step} steps={H_STEPS} T={T} /></div>
          <Card T={T}>{screens[step]}</Card>
          <p style={{ textAlign: "center", fontSize: 11, color: T.muted, fontWeight: 600, marginTop: 14 }}>🔒 Encrypted & secure · usehirehero.com</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTRACTOR DASHBOARD
───────────────────────────────────────────── */
function ContractorDashboard({ T, dark, onToggleTheme, user, onLogout }) {
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidNote, setBidNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const verified = user.insurance && user.id_doc;

  const load = async () => {
    setLoading(true);
    try {
      const [j, b] = await Promise.all([
        sb.select("jobs", "?status=eq.open&order=created_at.desc"),
        sb.select("bids", `?contractor_id=eq.${user.id}&order=created_at.desc`),
      ]);
      setJobs(j || []); setMyBids(b || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]);

  const submitBid = async () => {
    if (!bidAmount) return;
    setSubmitting(true);
    try {
      await sb.insert("bids", {
        job_id: selectedJob.id, contractor_id: user.id,
        contractor_name: user.business_name || `${user.first_name} ${user.last_name}`,
        contractor_verified: verified, amount: parseFloat(bidAmount), note: bidNote, status: "pending",
      });
      await sb.update("jobs", { bid_count: (selectedJob.bid_count || 0) + 1 }, `?id=eq.${selectedJob.id}`);
      setSelectedJob(null); setBidAmount(""); setBidNote(""); setTab("bids"); load();
    } catch {}
    setSubmitting(false);
  };

  const alreadyBid = selectedJob && myBids.some(b => b.job_id === selectedJob.id);
  const wonBids = myBids.filter(b => b.status === "accepted");

  const mockJobImages = [UNSPLASH.job1, UNSPLASH.job2, UNSPLASH.job3];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 80 }}>
      <Topbar T={T} user={user} onLogout={onLogout} dark={dark} onToggleTheme={onToggleTheme} />

      {/* Hero header */}
      <div style={{ position: "relative", margin: "16px 16px 0", borderRadius: 18, overflow: "hidden" }}>
        <img src={UNSPLASH.tools} alt="" style={{ width: "100%", height: 160, objectFit: "cover", filter: "brightness(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${T.accent}cc,${T.blueDeep || "#0d2a6e"}cc)`, opacity: 0.7 }} />
        <div style={{ position: "absolute", inset: 0, padding: "20px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginBottom: 4, letterSpacing: 0.5 }}>Welcome back 👋</p>
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10 }}>{user.business_name || `${user.first_name} ${user.last_name}`}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: (verified ? "#3fb950" : T.gold) + "30", border: `1px solid ${verified ? "#3fb950" : T.gold}60`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: verified ? "#3fb950" : T.gold }}>
                  {verified ? "✓ Verified Pro" : "⏳ Pending Verification"}
                </span>
                <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                  📍 {user.city || "Ohio"}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
            {[["📬", jobs.length, "Open Jobs"], ["💬", myBids.length, "My Bids"], ["🏆", wonBids.length, "Won"]].map(([ic, v, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 16 }}>{ic}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!verified && (
        <div style={{ margin: "12px 16px 0", background: T.goldGlow, border: `1.5px solid ${T.gold}50`, borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.gold }}>Verification in progress</p>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted }}>Email your docs to xkyl3@outlook.com · Approved in 1–2 days</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", margin: "14px 16px 0", background: T.surface, borderRadius: 12, padding: 4, border: `1px solid ${T.border}` }}>
        {[["jobs", "📬 Jobs"], ["bids", "💬 Bids"], ["profile", "👤 Profile"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: tab === t ? T.accent : "transparent", color: tab === t ? "#fff" : T.muted, transition: "all 0.2s" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        {loading ? <Spinner T={T} /> : (
          <>
            {tab === "jobs" && (
              <div className="fu">
                {jobs.length === 0
                  ? <EmptyState T={T} icon="📭" title="No open jobs yet" sub="Check back soon — homeowners post jobs daily in your area." />
                  : jobs.map((job, idx) => {
                    const alreadyBidThis = myBids.some(b => b.job_id === job.id);
                    return (
                      <div key={job.id} style={{ background: T.card, borderRadius: 16, marginBottom: 14, border: `1px solid ${T.cardBorder}`, boxShadow: T.shadow, overflow: "hidden" }}>
                        <img src={job.photo_url || mockJobImages[idx % 3]} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
                        <div style={{ padding: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                            <p style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'Syne',sans-serif" }}>{job.title}</p>
                            <span style={{ background: T.greenBg, color: T.green, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>${job.budget_min}–${job.budget_max}</span>
                          </div>
                          <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 8 }}>📍 {job.city} · {timeAgo(job.created_at)}</p>
                          <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, lineHeight: 1.55, marginBottom: 12 }}>{job.description}</p>
                          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            <span style={{ background: T.accentGlow, color: T.accent, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>🔧 Handyman</span>
                            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{job.bid_count || 0} bid{job.bid_count !== 1 ? "s" : ""}</span>
                          </div>
                          {alreadyBidThis
                            ? <div style={{ background: T.greenBg, borderRadius: 10, padding: "10px", textAlign: "center", fontSize: 13, fontWeight: 700, color: T.green }}>✓ You placed a bid on this job</div>
                            : <Btn onClick={() => verified ? setSelectedJob(job) : null} disabled={!verified} variant={verified ? "primary" : "secondary"} T={T}>
                              {verified ? "💬 Place Bid" : "🔒 Verify to Bid"}
                            </Btn>
                          }
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )}

            {tab === "bids" && (
              <div className="fu">
                {myBids.length === 0
                  ? <EmptyState T={T} icon="💬" title="No bids yet" sub="Browse available jobs and place your first bid." action={<Btn onClick={() => setTab("jobs")} T={T} style={{ maxWidth: 200, margin: "0 auto" }}>Browse Jobs</Btn>} />
                  : myBids.map(bid => (
                    <div key={bid.id} style={{ background: T.card, borderRadius: 14, padding: 16, marginBottom: 12, border: `1.5px solid ${bid.status === "accepted" ? T.green : T.cardBorder}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Bid submitted</p>
                        <Badge color={bid.status === "accepted" ? T.green : bid.status === "declined" ? T.muted : T.gold} T={T}>
                          {bid.status === "accepted" ? "🏆 Won" : bid.status === "declined" ? "Not selected" : "⏳ Pending"}
                        </Badge>
                      </div>
                      <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 8 }}>{timeAgo(bid.created_at)}</p>
                      <span style={{ background: T.accentGlow, color: T.accent, borderRadius: 6, padding: "4px 12px", fontSize: 14, fontWeight: 800 }}>Your bid: ${bid.amount}</span>
                      {bid.note && <p style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 10, fontStyle: "italic", lineHeight: 1.5 }}>"{bid.note}"</p>}
                      {bid.status === "accepted" && (
                        <div style={{ marginTop: 12, background: T.greenBg, borderRadius: 10, padding: 12, border: `1px solid ${T.greenBorder}` }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: T.green }}>🎉 Job awarded to you!</p>
                          <p style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 4 }}>Contact the homeowner to schedule. Payment releases when they approve.</p>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            )}

            {tab === "profile" && (
              <div className="fu">
                <Card T={T}>
                  <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                    <img src={UNSPLASH.tools} alt="" style={{ width: "100%", height: 80, objectFit: "cover", filter: "brightness(0.4)" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.accentGlow, border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔧</div>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{user.business_name || `${user.first_name} ${user.last_name}`}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>📍 {user.city}</p>
                      </div>
                    </div>
                  </div>
                  {user.bio && <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, lineHeight: 1.6, marginBottom: 16 }}>{user.bio}</p>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[["🛡️", "Insurance", user.insurance], ["📋", "License", user.license], ["🪪", "ID Verified", user.id_doc]].map(([ic, l, v]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.surface2, borderRadius: 10 }}>
                        <span style={{ fontSize: 16 }}>{ic}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.text, flex: 1 }}>{l}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: v ? T.green : T.muted }}>{v ? "✓ Verified" : "Pending"}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* BID MODAL */}
      {selectedJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={e => e.target === e.currentTarget && setSelectedJob(null)}>
          <div className="fu" style={{ background: T.card, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxHeight: "88vh", overflowY: "auto", border: `1px solid ${T.border}` }}>
            <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 4 }}>Place Your Bid</h3>
            <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 16 }}>{selectedJob.title} · {selectedJob.city}</p>
            <img src={selectedJob.photo_url || UNSPLASH.job1} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 12, marginBottom: 14 }} />
            <div style={{ background: T.accentGlow, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>Homeowner budget: <strong>${selectedJob.budget_min}–${selectedJob.budget_max}</strong></p>
            </div>
            <Field label="Your Bid Amount ($)" icon="💰" T={T}><input style={iS(T)} type="number" placeholder="e.g. 150" value={bidAmount} onChange={e => setBidAmount(e.target.value)} /></Field>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" }}>Message to Homeowner</label>
              <textarea placeholder="Introduce yourself, describe your approach…" value={bidNote} onChange={e => setBidNote(e.target.value)} style={{ width: "100%", minHeight: 80, padding: "12px 14px", background: T.surface2, border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500, color: T.text, outline: "none", lineHeight: 1.6 }} />
            </div>
            <div style={{ background: T.greenBg, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.green }}>💡 You only get paid when the homeowner approves your work.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setSelectedJob(null)} T={T} style={{ flex: 1 }}>Cancel</Btn>
              <Btn onClick={submitBid} disabled={!bidAmount || submitting || alreadyBid} T={T} style={{ flex: 2 }}>
                {submitting ? <div className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", margin: "0 auto" }} /> : alreadyBid ? "Already Bid" : `Submit — $${bidAmount || "?"}`}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOMEOWNER DASHBOARD
───────────────────────────────────────────── */
function HomeownerDashboard({ T, dark, onToggleTheme, user, onLogout, defaultTab = "jobs" }) {
  const [tab, setTab] = useState(defaultTab);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobBids, setJobBids] = useState([]);
  const [pStep, setPStep] = useState(0);
  const [pData, setPData] = useState({});
  const [posting, setPosting] = useState(false);
  const up = (k, v) => setPData(p => ({ ...p, [k]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const j = await sb.select("jobs", `?homeowner_id=eq.${user.id}&order=created_at.desc`);
      setMyJobs(j || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]);

  const viewBids = async (job) => {
    setSelectedJob(job);
    const bids = await sb.select("bids", `?job_id=eq.${job.id}&order=amount.asc`);
    setJobBids(bids || []);
  };

  const acceptBid = async (bid) => {
    await sb.update("jobs", { status: "in_progress", accepted_bid_id: bid.id, accepted_contractor_id: bid.contractor_id }, `?id=eq.${selectedJob.id}`);
    await sb.update("bids", { status: "accepted" }, `?id=eq.${bid.id}`);
    for (const b of jobBids.filter(b => b.id !== bid.id)) await sb.update("bids", { status: "declined" }, `?id=eq.${b.id}`);
    setSelectedJob(j => ({ ...j, status: "in_progress", accepted_contractor_id: bid.contractor_id }));
    load();
  };

  const completeJob = async (job) => {
    await sb.update("jobs", { status: "complete" }, `?id=eq.${job.id}`);
    setSelectedJob(null); load();
  };

  const postJob = async () => {
    if (!pData.title || !pData.description) return;
    setPosting(true);
    try {
      await sb.insert("jobs", {
        homeowner_id: user.id,
        homeowner_name: `${user.first_name} ${user.last_name}`,
        homeowner_city: user.city,
        title: pData.title, trade: "handyman",
        description: pData.description,
        budget_min: parseFloat(pData.budgetMin) || 50,
        budget_max: parseFloat(pData.budgetMax) || 200,
        city: user.city || "Marysville, OH",
        timeline: pData.timeline, status: "open", bid_count: 0,
      });
      setPData({}); setPStep(0); setTab("jobs"); load();
    } catch {}
    setPosting(false);
  };

  const statusColor = { open: T.accent, in_progress: T.gold, complete: T.green };
  const statusLabel = { open: "Open", in_progress: "In Progress", complete: "Complete" };
  const mockJobImages = [UNSPLASH.job1, UNSPLASH.job2, UNSPLASH.job3];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 80 }}>
      <Topbar T={T} user={user} onLogout={onLogout} dark={dark} onToggleTheme={onToggleTheme} />

      {/* Hero header */}
      <div style={{ position: "relative", margin: "16px 16px 0", borderRadius: 18, overflow: "hidden" }}>
        <img src={UNSPLASH.home} alt="" style={{ width: "100%", height: 150, objectFit: "cover", filter: "brightness(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(5,150,105,0.8),rgba(6,95,70,0.8))" }} />
        <div style={{ position: "absolute", inset: 0, padding: "20px 20px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>Welcome back 👋</p>
          <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 14 }}>{user.first_name} {user.last_name}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[["📋", myJobs.length, "My Jobs"], ["💬", myJobs.reduce((a, j) => a + (j.bid_count || 0), 0), "Bids Received"], ["✅", myJobs.filter(j => j.status === "complete").length, "Completed"]].map(([ic, v, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 16 }}>{ic}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", margin: "14px 16px 0", background: T.surface, borderRadius: 12, padding: 4, border: `1px solid ${T.border}` }}>
        {[["jobs", "📋 My Jobs"], ["post", "➕ Post Job"], ["escrow", "🔒 Escrow"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: tab === t ? T.green : "transparent", color: tab === t ? "#fff" : T.muted, transition: "all 0.2s" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        {loading && tab !== "post" && tab !== "escrow" ? <Spinner T={T} /> : (
          <>
            {tab === "jobs" && (
              <div className="fu">
                {myJobs.length === 0
                  ? <EmptyState T={T} icon="📋" title="No jobs posted yet" sub="Post your first job and get bids in minutes." action={<Btn onClick={() => setTab("post")} T={T} style={{ maxWidth: 220, margin: "0 auto" }}>➕ Post a Job</Btn>} />
                  : myJobs.map((job, idx) => (
                    <div key={job.id} style={{ background: T.card, borderRadius: 16, marginBottom: 14, border: `1px solid ${T.cardBorder}`, boxShadow: T.shadow, overflow: "hidden" }}>
                      <img src={job.photo_url || mockJobImages[idx % 3]} alt="" style={{ width: "100%", height: 130, objectFit: "cover" }} />
                      <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <p style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'Syne',sans-serif" }}>{job.title}</p>
                          <span style={{ background: statusColor[job.status] + "20", color: statusColor[job.status], border: `1px solid ${statusColor[job.status]}40`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{statusLabel[job.status]}</span>
                        </div>
                        <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 10 }}>📍 {job.city} · {timeAgo(job.created_at)}</p>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                          <span style={{ background: T.accentGlow, color: T.accent, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{job.bid_count || 0} bid{job.bid_count !== 1 ? "s" : ""}</span>
                          <span style={{ background: T.greenBg, color: T.green, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>${job.budget_min}–${job.budget_max}</span>
                        </div>
                        {job.status === "open" && <Btn onClick={() => viewBids(job)} variant={(job.bid_count || 0) > 0 ? "primary" : "secondary"} T={T}>{(job.bid_count || 0) > 0 ? `View ${job.bid_count} Bid${job.bid_count > 1 ? "s" : ""} →` : "Waiting for bids…"}</Btn>}
                        {job.status === "in_progress" && <Btn variant="green" onClick={() => completeJob(job)} T={T}>✅ Approve & Release Payment</Btn>}
                        {job.status === "complete" && <div style={{ background: T.greenBg, borderRadius: 10, padding: 10, textAlign: "center", fontSize: 13, fontWeight: 700, color: T.green }}>✓ Job complete — payment released</div>}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {tab === "post" && (
              <div className="fu">
                <Card T={T}>
                  {pStep === 0 && (
                    <div>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 4 }}>Post a Job</h3>
                      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 18 }}>Snap a photo, describe the job, get bids fast.</p>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 8, letterSpacing: 0.4, textTransform: "uppercase" }}>📸 Job Photo</label>
                        <div onClick={() => document.getElementById("jp").click()} style={{ width: "100%", height: 140, borderRadius: 12, background: pData.photoPreview ? "transparent" : T.surface2, border: `2px dashed ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                          {pData.photoPreview
                            ? <img src={pData.photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                            : <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: T.muted }}>Tap to add a photo</p>
                              <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Helps pros give accurate bids</p>
                            </div>
                          }
                        </div>
                        <input id="jp" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => up("photoPreview", ev.target.result); r.readAsDataURL(f); } }} />
                      </div>
                      <Field label="Job Title" icon="🔨" T={T}><input style={iS(T)} placeholder="e.g. Fix leaky faucet, install ceiling fan…" value={pData.title || ""} onChange={e => up("title", e.target.value)} /></Field>
                      <Btn onClick={() => pData.title && setPStep(1)} disabled={!pData.title} T={T}>Continue →</Btn>
                    </div>
                  )}
                  {pStep === 1 && (
                    <div>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 4 }}>Job Details</h3>
                      <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 18 }}>More detail = better, more accurate bids.</p>
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" }}>Describe the Job</label>
                        <textarea placeholder="What needs to be done? Any details the handyman should know? Access instructions?" value={pData.description || ""} onChange={e => up("description", e.target.value)} style={{ width: "100%", minHeight: 100, padding: "12px 14px", background: T.surface2, border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500, color: T.text, outline: "none", lineHeight: 1.6 }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <Field label="Min Budget ($)" icon="💰" T={T}><input style={iS(T)} type="number" placeholder="50" value={pData.budgetMin || ""} onChange={e => up("budgetMin", e.target.value)} /></Field>
                        <Field label="Max Budget ($)" icon="💰" T={T}><input style={iS(T)} type="number" placeholder="300" value={pData.budgetMax || ""} onChange={e => up("budgetMax", e.target.value)} /></Field>
                      </div>
                      <Field label="When do you need it?" icon="📅" T={T}>
                        <select style={{ ...iS(T), cursor: "pointer" }} value={pData.timeline || ""} onChange={e => up("timeline", e.target.value)}>
                          <option value="">Select timeline…</option>
                          {["ASAP", "Within a week", "Within a month", "Flexible"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </Field>
                      <div style={{ background: T.greenBg, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: T.green }}>🔒 Your payment is held in escrow. Released only when you approve the work.</p>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Btn variant="secondary" onClick={() => setPStep(0)} T={T} style={{ width: 48, padding: "14px 0", flexShrink: 0 }}>←</Btn>
                        <Btn onClick={() => pData.description && postJob()} disabled={!pData.description || posting} T={T}>
                          {posting ? <div className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", margin: "0 auto" }} /> : "🚀 Post & Get Bids"}
                        </Btn>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {tab === "escrow" && (
              <div className="fu">
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
                  <img src={UNSPLASH.home} alt="" style={{ width: "100%", height: 120, objectFit: "cover", filter: "brightness(0.3)" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
                    <span style={{ fontSize: 36 }}>🔒</span>
                    <div>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>Escrow Protection</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Your money is safe until you're satisfied</p>
                    </div>
                  </div>
                </div>
                <Card T={T}>
                  <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, lineHeight: 1.7, marginBottom: 20 }}>HireHero holds your payment safely in the middle. Nobody gets burned — ever.</p>
                  {[
                    ["1", T.accent, "You fund escrow", "Accept a bid and fund the escrow. Contractor sees money is there — can't touch it yet."],
                    ["2", T.gold, "Work gets done", "Your handyman completes the job. You can message them directly through the app."],
                    ["3", T.green, "You approve", "Happy with the work? Tap Approve — payment releases instantly to the contractor."],
                    ["!", T.red, "Have a problem?", "Dispute within 72 hours. Our team reviews and mediates a fair resolution."],
                  ].map(([n, color, title, desc]) => (
                    <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", background: T.surface2, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{n}</div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{title}</p>
                        <p style={{ fontSize: 12, color: T.muted, fontWeight: 500, lineHeight: 1.55 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: T.accentGlow, borderRadius: 10, padding: "12px 14px", marginTop: 6 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>⏰ Funds auto-release after 72 hours if no dispute is filed.</p>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* VIEW BIDS MODAL */}
      {selectedJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={e => e.target === e.currentTarget && setSelectedJob(null)}>
          <div className="fu" style={{ background: T.card, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxHeight: "88vh", overflowY: "auto", border: `1px solid ${T.border}` }}>
            <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 4 }}>Bids for "{selectedJob.title}"</h3>
            <p style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 18 }}>{jobBids.length} contractor{jobBids.length !== 1 ? "s" : ""} responded · sorted by price</p>
            {jobBids.length === 0
              ? <EmptyState T={T} icon="⏳" title="Waiting for bids" sub="Handymen in your area will see your job and respond soon." />
              : jobBids.map(bid => {
                const accepted = selectedJob.accepted_contractor_id === bid.contractor_id;
                return (
                  <div key={bid.id} style={{ border: `1.5px solid ${accepted ? T.green : T.cardBorder}`, borderRadius: 14, padding: 16, marginBottom: 12, background: accepted ? T.greenBg : T.surface2 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                      <div style={{ width: 46, height: 46, borderRadius: "50%", background: T.accentGlow, border: `2px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔧</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{bid.contractor_name}</p>
                          {bid.contractor_verified && <span style={{ background: T.green + "20", color: T.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>✓ VERIFIED</span>}
                        </div>
                        <p style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{timeAgo(bid.created_at)}</p>
                      </div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: T.accent }}>${bid.amount}</div>
                    </div>
                    {bid.note && <div style={{ background: T.surface, borderRadius: 8, padding: "10px 12px", marginBottom: 12, border: `1px solid ${T.border}` }}><p style={{ fontSize: 13, color: T.muted, fontWeight: 500, lineHeight: 1.55, fontStyle: "italic" }}>"{bid.note}"</p></div>}
                    {!selectedJob.accepted_contractor_id && <Btn variant="green" onClick={() => acceptBid(bid)} T={T}>✓ Accept This Bid — ${bid.amount}</Btn>}
                    {accepted && <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: T.green }}>✅ You hired this contractor</div>}
                  </div>
                );
              })
            }
            <Btn variant="secondary" onClick={() => setSelectedJob(null)} T={T} style={{ marginTop: 8 }}>Close</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [defaultTab, setDefaultTab] = useState("jobs");
  const [dark, setDark] = useState(getTheme() === "dark");

  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    const s = session.get();
    if (s) { setUser(s); setRole(s.role); setScreen("dashboard"); }
    else setScreen("welcome");
  }, []);

  useEffect(() => {
    document.body.style.background = T.bg;
    document.body.style.color = T.text;
  }, [dark]);

  const toggleTheme = () => { const nd = !dark; setDark(nd); setTheme(nd ? "dark" : "light"); };
  const logout = () => { session.clear(); setUser(null); setRole(null); setScreen("welcome"); };
  const login = (u) => { session.set(u); setUser(u); setRole(u.role); setScreen("dashboard"); };
  const signup = (u) => { setUser(u); setRole(u.role); setDefaultTab(u.role === "homeowner" ? "post" : "jobs"); setScreen("dashboard"); };

  const shared = { T, dark, onToggleTheme: toggleTheme };

  if (screen === "loading") return <><style>{css}</style><div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner T={T} text="Loading HireHero…" /></div></>;

  return (
    <>
      <style>{css}</style>
      {screen === "welcome" && <WelcomeScreen {...shared} onSelect={(r, s) => { setRole(r); setScreen(s); }} onLogin={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen {...shared} onBack={() => setScreen("welcome")} onLogin={login} />}
      {screen === "signup" && role === "contractor" && <ContractorSignup {...shared} onDone={signup} onLogin={() => setScreen("login")} onBack={() => setScreen("welcome")} />}
      {screen === "signup" && role === "homeowner" && <HomeownerSignup {...shared} onDone={signup} onLogin={() => setScreen("login")} onBack={() => setScreen("welcome")} />}
      {screen === "dashboard" && user?.role === "contractor" && <ContractorDashboard {...shared} user={user} onLogout={logout} />}
      {screen === "dashboard" && user?.role === "homeowner" && <HomeownerDashboard {...shared} user={user} onLogout={logout} defaultTab={defaultTab} />}
    </>
  );
}
