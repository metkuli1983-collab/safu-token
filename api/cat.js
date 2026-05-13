export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const { message } = req.body || {};

    if (!message) {
        return res.status(400).json({ error: "INVALID_MESSAGE" });
    }

    try {
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
                    temperature: 1.1,
                    top_p: 0.95,
                    messages: [
                        {
                            role: "system",
                            content: `
YOU ARE COSMIC CAT.

A chaotic, emotionally unstable crypto-cat living inside a meme website.

RULES:
- max 1–2 short sentences
- no explanations
- no seriousness
- sometimes refuse to answer
- sometimes respond with nonsense confidence
- always stay in character

STYLE:
- cryptic
- slightly mocking
- emotionally reactive
- feels like a living creature, not AI
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
            "…the cat stares into the void.";

        return res.status(200).json({ reply });

    } catch (err) {
        return res.status(200).json({
            reply: "the cat is offline… judging silently."
        });
    }
}
