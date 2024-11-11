// ./pages/api/interpretDream.js

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { dreamText, interpretationMode } = req.body;

  if (!dreamText || !interpretationMode) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const prompt =
      interpretationMode === "extended"
        ? `Przeanalizuj poniższy sen w sposób profesjonalny, uwzględniając psychologiczne, emocjonalne i symboliczne znaczenie opisanych motywów oraz ich możliwy wpływ na życie osoby śniącej. Skoncentruj się na głębszych aspektach symbolicznych oraz możliwych podświadomych przesłaniach tego snu: ${dreamText} Zinterpretuj każdy istotny symbol lub wydarzenie, uwzględniając jego możliwe znaczenie psychologiczne.`
        : `Podaj krótką, ogólną interpretację poniższego snu, skupiając się na głównym przesłaniu lub możliwym znaczeniu emocjonalnym dla osoby śniącej: ${dreamText} Wyjaśnij, co ten sen może symbolizować w prosty sposób, unikając głębokiej analizy psychologicznej.`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 100,
    });

    const interpretation = response.data.choices[0].text.trim();
    res.status(200).json({ interpretation });
  } catch (err) {
    console.error(err);  // Logowanie błędu
    res.status(500).json({ message: "Internal Server Error" });
  }
}
