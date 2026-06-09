import { useState, useEffect, useRef } from "react";
import api from "../services/api";

const LANGUAGES = ["English", "Telugu", "Hindi"];

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
  }, [audio]);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await api.post("/chat/", { question, language });
      setAnswer(res.data.response);
    } catch (err) {
      setAnswer("⚠️ Could not reach the AI advisor. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === "Telugu" ? "te-IN" : language === "Hindi" ? "hi-IN" : "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      setQuestion(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.start();
  };

  const speakResponse = async () => {
    if (!answer) return;
    try {
      const res = await api.post("/tts/", {
        text: answer,
        language: language === "Telugu" ? "te" : language === "Hindi" ? "hi" : "en"
      }, { responseType: "blob" });
      const audioUrl = URL.createObjectURL(res.data);
      const newAudio = new Audio(audioUrl);
      newAudio.playbackRate = 1.3;
      newAudio.onended = () => setPlaying(false);
      setAudio(newAudio);
      setPlaying(true);
      newAudio.play();
    } catch (err) { console.error(err); }
  };

  const stopAudio = () => {
    if (audio) { audio.pause(); audio.currentTime = 0; setPlaying(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) askAI();
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(34,197,94,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🤖</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1f3518", letterSpacing: "-0.03em" }}>AI Farming Advisor</h1>
            <p style={{ fontSize: 13, color: "#5b7050" }}>Ask in English or Telugu — voice or text</p>
          </div>
        </div>
      </div>

      {/* Language selector */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", marginBottom: 10 }}>Language</p>
        <div style={{ display: "flex", gap: 8 }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                border: language === lang ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.08)",
                background: language === lang ? "rgba(34,197,94,0.1)" : "transparent",
                color: language === lang ? "#86efac" : "#475569",
                transition: "all 0.2s",
              }}
            >{lang}</button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="glass-card" style={{ borderRadius: 16, padding: 4, marginBottom: 16 }}>
        <textarea
          ref={textareaRef}
          className="input-field"
          rows={5}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask a farming question… e.g. When should I irrigate cotton in humid weather?"
          style={{ borderRadius: 12, border: "none", resize: "vertical", minHeight: 120 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px" }}>
          <button
            onClick={startListening}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
              background: listening ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
              border: listening ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: listening ? "#fca5a5" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 15 }}>🎤</span>
            {listening ? "Listening…" : "Speak"}
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#556d45" }}>⌘ + Enter to send</span>
            <button className="btn-primary" onClick={askAI} disabled={loading || !question.trim()}>
              {loading ? "Thinking…" : "Ask AI"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass-card" style={{ borderRadius: 16, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌿</div>
          <p style={{ color: "#475569", fontSize: 14 }}>Analyzing your question…</p>
        </div>
      )}

      {/* Answer */}
      {answer && !loading && (
        <div className="glass-card animate-fade-up" style={{ borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>🌱</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#85b26a" }}>AI Response</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {playing ? (
                <button className="btn-ghost" onClick={stopAudio} style={{ padding: "6px 14px", fontSize: 13 }}>
                  ⏹ Stop
                </button>
              ) : (
                <button className="btn-ghost" onClick={speakResponse} style={{ padding: "6px 14px", fontSize: 13 }}>
                  🔊 Listen
                </button>
              )}
            </div>
          </div>
          <pre style={{ fontSize: 14, color: "#4a6641", lineHeight: 1.75, fontFamily: "inherit" }}>{answer.replace(/\*\*/g, "").replace(/^\d+\.\s+/gm, "")}</pre>
        </div>
      )}
    </div>
  );
}
