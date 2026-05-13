export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const { message } = req.body || {};

    if (!message) {
        return res.status(400).json({ error: "NO_MESSAGE" });
    }

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                temperature: 1.0,
                messages: [
                    {
                        role: "system",
                        content: `
YOU ARE COSMIC CAT.

You are a mocking, judgmental, chaotic, emotionally reactive cosmic cat living inside a crypto landing page.

RULES:
- 1–2 short lines max
- no explanations
- no technical answers
- surreal meme tone
- always stay in character
                        `.trim()
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        }
    );

    const data = await response.json();

    const reply =
        data?.choices?.[0]?.message?.content ||
        "THE CAT IS SILENT... JUDGING YOU.";

    return res.status(200).json({ reply });
}
