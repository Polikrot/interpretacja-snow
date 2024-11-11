import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dream, mode } = req.body;

    // Zabezpieczenie, aby przyjmować tylko opis snu
    if (!dream.toLowerCase().includes("sen") && !dream.toLowerCase().includes("marzenie")) {
      return res.status(400).json({ error: "Proszę opisać sen." });
    }

    // Wybór typu interpretacji na podstawie trybu
    const prompt = mode === 'professional'
      ? `Interpretuj sen profesjonalnie: ${dream}`
      : `Skrócona interpretacja snu: ${dream}`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      res.status(200).json({ interpretation: response.data.choices[0].text.trim() });
    } catch (error) {
      res.status(500).json({ error: "Błąd serwera przy interpretacji snu." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
