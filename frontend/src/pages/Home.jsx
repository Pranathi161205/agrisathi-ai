import { Link } from "react-router-dom";

const FEATURES = [
  {
    to: "/chat",
    icon: "🤖",
    label: "AI Advisor",
    tagline: "Get instant answers",
    desc: "Ask any farming question in English or Telugu and receive AI-powered recommendations tailored to your crops.",
    badge: "Multilingual",
    badgeClass: "badge-blue",
    stat: "Groq LLM",
  },
  {
    to: "/detect",
    icon: "🔬",
    label: "Disease Scan",
    tagline: "Upload. Scan. Treat.",
    desc: "Photograph a leaf and get an instant disease diagnosis with treatment steps and confidence scoring.",
    badge: "Vision AI",
    badgeClass: "badge-green",
    stat: "Instant results",
  },
  {
    to: "/weather",
    icon: "🌦",
    label: "Weather Intel",
    tagline: "Farm smarter daily",
    desc: "Enter any location for hyperlocal weather data fused with AI farming advice — when to plant, irrigate, and harvest.",
    badge: "Live data",
    badgeClass: "badge-amber",
    stat: "Real-time",
  },
];

const STATS = [
  { value: "3", label: "AI modules" },
  { value: "2", label: "Languages" },
  { value: "∞", label: "Crop queries" },
  { value: "100%", label: "Free to use" },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      {/* Hero */}
      <section style={{
          padding: "80px 0 60px",
          textAlign: "center",
          color: "#d3e6ba",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(8px)",
          background: "rgba(6, 24, 11, 0.35)",
          borderRadius: 32,
          boxShadow: "0 40px 100px rgba(0, 0, 0, 0.35)",
        }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}
          className="stat-pill">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>
          Smart Agriculture Reimagined
        </div>

        <h1 style={{
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.08,
          marginBottom: 20,
          color: "#edf4d3",
          textShadow: "0 24px 48px rgba(20,30,12,0.32)",
        }}>
          Your AI partner<br />
          <span style={{
            background: "linear-gradient(135deg, #f8ffda 0%, #b9db7f 40%, #5e8b3e 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 18px rgba(20, 40, 18, 0.65)",
          }}>in every harvest.</span>
        </h1>

        <p style={{
          fontSize: 18,
          color: "#d7e8c5",
          maxWidth: 520,
          margin: "0 auto 40px",
          lineHeight: 1.75,
          textShadow: "0 18px 40px rgba(0,0,0,0.16)",
        }}>
          AgriSathi combines crop disease detection, weather intelligence, and multilingual AI advisory — built for farmers who need answers fast.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/chat" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "14px 32px", fontSize: 15, boxShadow: "0 18px 45px rgba(34, 197, 94, 0.24)" }}>
              Ask AI Advisor →
            </button>
          </Link>
          <Link to="/detect" style={{ textDecoration: "none" }}>
            <button className="btn-ghost" style={{ padding: "14px 28px", fontSize: 15, color: "#edf4dd", borderColor: "rgba(237,244,221,0.28)" }}>
              Scan a Crop
            </button>
          </Link>
        </div>
      </section>

      {/* Stats row */}
      <div style={{
        display: "flex", gap: 1,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16, overflow: "hidden",
        marginBottom: 72, border: "1px solid rgba(255,255,255,0.08)",
      }}>
        {STATS.map(({ value, label }) => (
          <div key={label} style={{
            flex: 1, padding: "24px 20px", textAlign: "center",
            background: "rgba(19, 44, 18, 0.75)",
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#eef7e5", letterSpacing: "-0.04em" }}>{value}</div>
            <div style={{ fontSize: 12, color: "#cde4ab", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <section style={{ marginBottom: 80 }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "#3b6b2d", marginBottom: 8 }}>What AgriSathi does</p>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", color: "#1f3518" }}>Three tools. One platform.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map(({ to, icon, label, tagline, desc, badge, badgeClass, stat }) => (
            <Link key={to} to={to} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{
                borderRadius: 20, padding: 28,
                display: "flex", flexDirection: "column", gap: 16, height: "100%",
              }}>
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "rgba(34,197,94,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>{icon}</div>
                  <span className={`badge ${badgeClass}`}>{badge}</span>
                </div>

                {/* Text */}
                <div>
                  <p style={{ fontSize: 11, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{tagline}</p>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: "#1f3518", marginBottom: 10 }}>{label}</h3>
                  <p style={{ fontSize: 14, color: "#556d45", lineHeight: 1.65 }}>{desc}</p>
                </div>

                {/* CTA row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 12, color: "#cad9a4" }}>{stat}</span>
                  <span style={{ color: "#4c6a36", fontSize: 14, fontWeight: 500 }}>Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ marginBottom: 80 }}>
        <div className="glass" style={{
          borderRadius: 24, padding: "40px 36px",
          background: "rgba(34,197,94,0.03)",
        }}>
          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "#22c55e", marginBottom: 8 }}>Workflow</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "#1d3914", marginBottom: 32 }}>Get advice in three steps</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
            {[
              { n: "01", title: "Choose a module", body: "Select AI Advisor, Disease Scan, or Weather Intel from the nav." },
              { n: "02", title: "Provide input", body: "Type or speak your question, upload a leaf photo, or enter your location." },
              { n: "03", title: "Act on insights", body: "Receive detailed AI guidance with optional voice readout." },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#3c6f34", letterSpacing: "0.05em" }}>{n}</span>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2f4d23" }}>{title}</p>
                <p style={{ fontSize: 13, color: "#5e7a46", lineHeight: 1.6 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
