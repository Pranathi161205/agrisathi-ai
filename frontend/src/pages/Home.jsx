import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4fdf6",
        padding: "40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: "#2e7d32",
            fontSize: "3rem",
          }}
        >
          🌱 AgriSathi AI
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#555",
          }}
        >
          Smart Agriculture Intelligence Platform
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/chat"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <h2>🤖 AI Advisor</h2>

            <p>
              Ask farming questions and receive
              AI-powered recommendations.
            </p>
          </div>
        </Link>

        <Link
          to="/detect"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <h2>🌿 Disease Detector</h2>

            <p>
              Upload a crop image and detect
              diseases instantly.
            </p>
          </div>
        </Link>

        <Link
          to="/weather"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <h2>🌦 Weather Advisor</h2>

            <p>
              Get weather-based farming
              recommendations for your location.
            </p>
          </div>
        </Link>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "#777",
        }}
      >
        ⚠️ AI-generated recommendations.
        Consult agricultural experts for
        critical decisions.
      </div>
    </div>
  );
}