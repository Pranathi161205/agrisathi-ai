import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/", label: "Home", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  )},
  { to: "/chat", label: "AI Advisor", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  )},
  { to: "/detect", label: "Disease Scan", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  )},
  { to: "/weather", label: "Weather Intel", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
  )},
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(7, 15, 9, 0.92)", backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(78, 115, 75, 0.18)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 32 }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #2f5a2e 0%, #4f7c3f 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🌱</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#e9f4d9", letterSpacing: "-0.02em" }}>
              AgriSathi <span style={{ color: "#a9d48a" }}>AI</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            {NAV.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link${pathname === to ? " active" : ""}`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right: badge */}
          <div style={{ marginLeft: "auto" }}>
            <span className="stat-pill" style={{ background: "rgba(83, 122, 60, 0.18)", borderColor: "rgba(90, 147, 76, 0.26)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9fcd88", display: "inline-block" }}></span>
              Powered by Groq
            </span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        padding: "20px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center",
        color: "#334155",
        fontSize: 12,
      }}>
        AgriSathi AI — AI-generated recommendations. Consult agricultural experts for critical decisions.
      </footer>
    </div>
  );
}
