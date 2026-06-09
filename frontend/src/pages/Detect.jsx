import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
  }, [audio]);

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const analyze = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await api.post("/detect/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Detection failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result) return;
    const playAudio = async () => {
      try {
        const text = `Disease detected: ${result.disease}`;
        const res = await api.post("/tts/", { text, language: "en" }, { responseType: "blob" });
        const audioUrl = URL.createObjectURL(res.data);
        const a = new Audio(audioUrl);
        a.playbackRate = 1.3;
        a.onended = () => setPlaying(false);
        setAudio(a);
        a.play();
      } catch (err) { console.error(err); }
    };
    playAudio();
  }, [result]);

  const speakResult = async () => {
    if (!result) return;
    try {
      const text = `Disease: ${result.disease}. Confidence: ${((result.confidence || 0) * 100).toFixed(0)} percent. Symptoms: ${result.symptoms}. Recommendation: ${result.recommendation}. Warning: ${result.warning}.`;
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

  const confidence = result ? ((result.confidence || 0) * 100).toFixed(1) : 0;
  const confClass = confidence >= 80 ? "badge-green" : confidence >= 50 ? "badge-amber" : "badge-red";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(34,197,94,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🔬</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1f3518", letterSpacing: "-0.03em" }}>Crop Disease Detection</h1>
            <p style={{ fontSize: 13, color: "#5b7050" }}>Upload a leaf photo for instant AI diagnosis</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Upload column */}
        <div>
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            style={{
              border: `2px dashed ${dragOver ? "rgba(34,197,94,0.6)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 16, padding: 32, textAlign: "center", cursor: "pointer",
              background: dragOver ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)",
              transition: "all 0.2s", marginBottom: 16,
              minHeight: preview ? 0 : 220,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
            }}
          >
            {preview ? (
              <img src={preview} alt="Leaf preview" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 10, objectFit: "contain" }} />
            ) : (
              <>
                <div style={{ fontSize: 36 }}>🌿</div>
                <div>
                  <p style={{ color: "#3a5f36", fontSize: 14, fontWeight: 500 }}>Drop a leaf image here</p>
                  <p style={{ color: "#5b7050", fontSize: 12, marginTop: 4 }}>or click to browse · JPG, PNG, WEBP</p>
                </div>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); }}
          />

          {file && (
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <button
                className="btn-ghost"
                onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                style={{ flex: 1, padding: "10px 0" }}
              >Clear</button>
              <button
                className="btn-primary"
                onClick={analyze}
                disabled={loading}
                style={{ flex: 2, padding: "10px 0" }}
              >
                {loading ? "Analyzing…" : "Analyze Leaf →"}
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="glass" style={{ borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#334155", marginBottom: 10 }}>Photo tips</p>
            {["Capture the affected leaf clearly", "Ensure good lighting", "Include the full leaf in frame", "Avoid blurry or shadowed shots"].map(tip => (
              <div key={tip} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                <span style={{ color: "#22c55e", fontSize: 11, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results column */}
        <div>
          {loading && (
            <div className="glass-card" style={{ borderRadius: 16, padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <p style={{ color: "#475569", fontSize: 14 }}>Analyzing leaf patterns…</p>
              <div className="progress-bar" style={{ marginTop: 16 }}>
                <div className="progress-fill" style={{ width: "70%" }}></div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="glass" style={{ borderRadius: 16, padding: 40, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ fontSize: 40 }}>🌱</div>
              <p style={{ color: "#334155", fontSize: 14 }}>Results appear here after analysis</p>
            </div>
          )}

          {result && !loading && (
            <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Disease card */}
              <div className="glass-card" style={{ borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569" }}>Detected</p>
                  <span className={`badge ${confClass}`}>{confidence}% confidence</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#1f3518", letterSpacing: "-0.02em" }}>{result.disease}</p>
                <div className="progress-bar" style={{ marginTop: 10 }}>
                  <div className="progress-fill" style={{ width: `${confidence}%` }}></div>
                </div>
              </div>

              {/* Detail cards */}
              {[
                { label: "Symptoms", value: result.symptoms, icon: "🔎" },
                { label: "Recommendation", value: result.recommendation, icon: "💊" },
                { label: "Warning", value: result.warning, icon: "⚠️" },
              ].map(({ label, value, icon }) => value && (
                <div key={label} className="glass-card" style={{ borderRadius: 14, padding: 16 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <span>{icon}</span>
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569" }}>{label}</p>
                  </div>
                  <p style={{ fontSize: 13, color: "#546a48", lineHeight: 1.6 }}>{value}</p>
                </div>
              ))}

              {/* Audio controls */}
              <div style={{ display: "flex", gap: 10 }}>
                {playing ? (
                  <button className="btn-ghost" onClick={stopAudio} style={{ flex: 1, padding: "10px 0" }}>⏹ Stop Audio</button>
                ) : (
                  <button className="btn-ghost" onClick={speakResult} style={{ flex: 1, padding: "10px 0" }}>🔊 Listen to Analysis</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
