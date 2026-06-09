import { useState, useEffect } from "react";
import api from "../services/api";

export default function Detect() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
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

  const analyze = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post(
  "/detect/",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

console.log("API Response:", res.data);

setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Detection failed");
    } finally {
      setLoading(false);
    }
  };

  const speakResult = async () => {
    if (!result) return;

    try {
      const text = `
      Disease: ${result.disease}.
      Confidence: ${((result.confidence || 0) * 100).toFixed(0)} percent.
      Symptoms: ${result.symptoms}.
      Recommendation: ${result.recommendation}.
      Warning: ${result.warning}.
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

  useEffect(() => {
    if (!result) return;

    const text = `Disease detected: ${result.disease}`;

    const playAutoAudio = async () => {
      try {
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

    playAutoAudio();
  }, [result]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>🌿 Crop Disease Detection</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={analyze}>
        {loading ? "Analyzing..." : "Analyze Leaf"}
      </button>

      {result && (
  <div
    style={{
      marginTop: "20px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px"
    }}
  >
    <h2>🌿 Disease Analysis</h2>

    <p>
      <strong>Disease:</strong> {result.disease}
    </p>

    <p>
      <strong>Confidence:</strong>{" "}
      {((result.confidence || 0) * 100).toFixed(2)}%
    </p>

    <p>
      <strong>Symptoms:</strong> {result.symptoms}
    </p>

    <p>
      <strong>Recommendation:</strong> {result.recommendation}
    </p>

    <p>
      <strong>Warning:</strong> {result.warning}
    </p>

    <button onClick={speakResult}>
      🔊 Listen Analysis
    </button>
    <button onClick={stopAudio}>
      ⏹ Stop Audio
    </button>

    {result.analysis && (
      <>
        <hr />
        <h4>Raw AI Output</h4>
        <pre>{result.analysis}</pre>
      </>
    )}
  </div>
)}
    </div>
  );
}