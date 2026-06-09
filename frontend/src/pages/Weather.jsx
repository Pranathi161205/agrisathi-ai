import { useState, useEffect } from "react";
import api from "../services/api";

export default function Weather() {
  const [location, setLocation] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const fetchWeather = async () => {
    if (!location.trim()) {
      alert("Please enter a location");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/weather/${encodeURIComponent(location)}`
      );

      console.log(res.data);

      setData(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const speakWeather = async () => {
    if (!data) return;

    try {
      const text = `
      Location ${data.location}.
      Temperature ${data.temperature} degrees Celsius.
      Humidity ${data.humidity} percent.

      ${data.advice}
      `;

      const res = await api.post(
        "/tts/",
        {
          text: text,
          language: "en"
        },
        {
          responseType: "blob"
        }
      );

      const audioUrl = URL.createObjectURL(
        res.data
      );

      const newAudio = new Audio(audioUrl);

      newAudio.playbackRate = 1.3;

      setAudio(newAudio);

      newAudio.play();
    } catch (err) {
      console.error(err);
    }
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>🌦 Weather Intelligence</h1>

      <input
        type="text"
        placeholder="Enter city or address"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button onClick={fetchWeather}>
        {loading ? "Loading..." : "Get Weather Advice"}
      </button>

      {data && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h2>Weather Report</h2>

          <p>
            <strong>Location:</strong> {data.location}
          </p>

          <p>
            <strong>Temperature:</strong> {data.temperature}°C
          </p>

          <p>
            <strong>Humidity:</strong> {data.humidity}%
          </p>

          <h3>🌱 AI Farming Advice</h3>

          <pre style={{ whiteSpace: "pre-wrap" }}>
            {data.advice}
          </pre>

          <button onClick={speakWeather}>
            🔊 Listen Advice
          </button>
          <button onClick={stopAudio}>
            ⏹ Stop Audio
          </button>
        </div>
      )}
    </div>
  );
}