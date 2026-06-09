import { useState, useEffect } from "react";
import api from "../services/api";

const WEATHER_ICONS = {
  hot: "☀️", warm: "🌤", mild: "⛅", cool: "🌥", cold: "❄️", default: "🌦",
};

function getWeatherIcon(temp) {
  if (temp === null || temp === undefined) return WEATHER_ICONS.default;
  if (temp >= 38) return WEATHER_ICONS.hot;
  if (temp >= 30) return WEATHER_ICONS.warm;
  if (temp >= 22) return WEATHER_ICONS.mild;
  if (temp >= 15) return WEATHER_ICONS.cool;
  return WEATHER_ICONS.cold;
}

const QUICK_LOCATIONS = ["Hyderabad", "Mumbai", "Delhi", "Bengaluru", "Chennai"];

export default function Weather() {
  const [location, setLocation] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
  }, [audio]);

  const fetchWeather = async (loc) => {
    const target = loc || location;
    if (!target.trim()) return;
    try {
      setLoading(true);
      const res = await api.get(`/weather/${encodeURIComponent(target)}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch weather. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const speakWeather = async () => {
    if (!data) return;
    try {
      const text = `Location ${data.location}. Temperature ${data.temperature} degrees Celsius. Humidity ${data.humidity} percent. ${data.advice}`;
      const res = await api.post("/tts/", { text, language: "en" }, { responseType: "blob" });
      const audioUrl = URL.createObjectURL(res.data);
      const a = new Audio(audioUrl);
      a.playbackRate = 1.3;
      a.onended = () => setPlaying(false);
      setAudio(a);
      setPlaying(true);
      a.play();
    } catch (err) { console.error(err); }
  };

  const stopAudio = () => {
    if (audio) { audio.pause(); audio.currentTime = 0; setPlaying(false); }
  };

  const icon = data ? getWeatherIcon(data.temperature) : WEATHER_ICONS.default;

  const humidityLabel = data?.humidity >= 80 ? { text: "High", cls: "badge-amber" }
    : data?.humidity >= 50 ? { text: "Moderate", cls: "badge-blue" }
    : { text: "Low", cls: "badge-green" };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(14,165,233,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🌦</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1f3518", letterSpacing: "-0.03em" }}>Weather Intelligence</h1>
            <p style={{ fontSize: 13, color: "#5b7050" }}>Hyperlocal weather fused with AI farming advice</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="glass-card" style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="input-field"
            type="text"
            placeholder="Enter city or address…"
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchWeather()}
            style={{ flex: 1 }}
          />
          <button
            className="btn-primary"
            onClick={() => fetchWeather()}
            disabled={loading || !location.trim()}
            style={{ whiteSpace: "nowrap" }}
          >
            {loading ? "Loading…" : "Get Advice →"}
          </button>
        </div>
        {/* Quick picks */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#4f6c43", alignSelf: "center", marginRight: 4 }}>Quick:</span>
          {QUICK_LOCATIONS.map(loc => (
            <button
              key={loc}
              onClick={() => { setLocation(loc); fetchWeather(loc); }}
              style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#5b7050", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#2f6233"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#5b7050"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >{loc}</button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card" style={{ borderRadius: 16, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌍</div>
          <p style={{ color: "#475569", fontSize: 14 }}>Fetching weather data…</p>
          <div className="progress-bar" style={{ maxWidth: 200, margin: "16px auto 0" }}>
            <div className="progress-fill" style={{ width: "60%" }}></div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && (
        <div className="glass" style={{ borderRadius: 16, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌤</div>
          <p style={{ color: "#334155", fontSize: 14 }}>Enter a location to get weather-based farming advice</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="animate-fade-up">
          {/* Metric cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
            {/* Location */}
            <div className="glass-card" style={{ borderRadius: 14, padding: "18px 20px", gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📍</span>
                <div>
                  <p style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Location</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#1f3518", letterSpacing: "-0.02em" }}>{data.location}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {playing ? (
                  <button className="btn-ghost" onClick={stopAudio} style={{ fontSize: 13, padding: "8px 14px" }}>⏹ Stop</button>
                ) : (
                  <button className="btn-ghost" onClick={speakWeather} style={{ fontSize: 13, padding: "8px 14px" }}>🔊 Listen</button>
                )}
              </div>
            </div>

            {/* Temperature */}
            <div className="glass-card" style={{ borderRadius: 14, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <p style={{ fontSize: 11, color: "#5b7050", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Temperature</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#1f3518", letterSpacing: "-0.04em" }}>{data.temperature}°C</p>
            </div>

            {/* Humidity */}
            <div className="glass-card" style={{ borderRadius: 14, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💧</div>
              <p style={{ fontSize: 11, color: "#5b7050", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Humidity</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#1f3518", letterSpacing: "-0.04em" }}>{data.humidity}%</p>
              <span className={`badge ${humidityLabel.cls}`} style={{ marginTop: 8, display: "inline-block" }}>{humidityLabel.text}</span>
            </div>

            {/* Wind / extra */}
            <div className="glass-card" style={{ borderRadius: 14, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌾</div>
              <p style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>AI Advisor</p>
              <p style={{ fontSize: 14, color: "#86efac", fontWeight: 600 }}>Active</p>
            </div>
          </div>

          {/* Advice */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span>🌱</span>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#22c55e", fontWeight: 600 }}>AI Farming Advice</p>
            </div>
            <pre style={{ fontSize: 14, color: "#5e7a46", lineHeight: 1.75, fontFamily: "inherit" }}>{data.advice}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
