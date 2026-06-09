import { useState, useEffect } from "react";
import api from "../services/api";

export default function Chat() {

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("English");
  const [audio, setAudio] = useState(null);

  const askAI = async () => {

    const res = await api.post("/chat/", {
      question,
      language
    });

    setAnswer(res.data.response);
  };

  const startListening = () => {
    const recognition =
      new window.webkitSpeechRecognition();

    recognition.lang =
      language === "Telugu"
        ? "te-IN"
        : "en-US";

    recognition.onresult = (event) => {
      setQuestion(
        event.results[0][0].transcript
      );
    };

    recognition.start();
  };

  const speakResponse = async () => {
    if (!answer) return;

    try {
      const res = await api.post(
        "/tts/",
        {
          text: answer,
          language:
            language === "Telugu"
              ? "te"
              : language === "Hindi"
              ? "hi"
              : "en"
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

      <h2>AI Farming Advisor</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Language:{" "}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Telugu</option>
          </select>
        </label>
      </div>

      <textarea
        rows="4"
        cols="60"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask farming question..."
      />

      <br />

      <button onClick={startListening}>
        🎤 Speak Question
      </button>

      <br />
      <br />

      <button onClick={askAI}>
        Ask AI
      </button>

      <div style={{ marginTop: "30px" }}>
        {answer && (
          <div>
            <h3>AI Response</h3>
            <pre>{answer}</pre>
            <button onClick={speakResponse}>
              🔊 Listen
            </button>
            <button onClick={stopAudio}>
              ⏹ Stop Audio
            </button>
          </div>
        )}
      </div>

    </div>
  );
}