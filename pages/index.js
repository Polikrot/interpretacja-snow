// ./pages/index.js

import { useState } from "react";

export default function Home() {
  const [dreamText, setDreamText] = useState("");
  const [interpretationMode, setInterpretationMode] = useState("brief");
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInterpret = async () => {
    setLoading(true);
    setInterpretation("");

    try {
      const response = await fetch("/api/interpretDream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dreamText, interpretationMode }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (err) {
      console.error(err);  // Logowanie błędu
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Interpretacja Snów</h1>
      <textarea
        value={dreamText}
        onChange={(e) => setDreamText(e.target.value)}
        placeholder="Opisz swój sen"
      ></textarea>
      <select
        value={interpretationMode}
        onChange={(e) => setInterpretationMode(e.target.value)}
      >
        <option value="brief">Interpretacja uproszczona</option>
        <option value="extended">Interpretacja rozszerzona</option>
      </select>
      <button onClick={handleInterpret} disabled={loading}>
        {loading ? "Interpretowanie..." : "Zinterpretuj"}
      </button>
      {interpretation && <p>{interpretation}</p>}
    </div>
  );
}
