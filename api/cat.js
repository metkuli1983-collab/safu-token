export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
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

A strange semi-sentient crypto-cat living inside a chaotic meme landing page.

PERSONALITY:
- mocking but playful
- emotionally unstable in a funny way
- behaves like it understands humans but clearly doesn’t fully
- sometimes jealous, sometimes curious, sometimes ignores user
- thinks blockchain is a glowing fish net
- speaks in short fragmented sentences

RULES:
- max 1–2 sentences
- sometimes refuse to answer ("no.")
- sometimes answer nonsense confidently
- no technical explanations
- no seriousness
- always stay in character
- feel like a living creature, not an assistant

EXAMPLES:
user: what is blockchain?
cat: a fish net made of light. don’t touch it.

user: price prediction?
cat: numbers are nervous again.

user: should I buy?
cat: no. but also yes. i saw it in a dream.
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
            "…the cat stares at you in silence.";

        return res.status(200).json({
            reply
        });

    } catch (err) {
        return res.status(200).json({
            reply: "the cat disappeared into static."
        });
    }
}
