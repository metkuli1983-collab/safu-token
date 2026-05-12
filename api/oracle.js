export default async function handler(req, res) {

    // -----------------------------
    // ONLY ALLOW POST
    // -----------------------------
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "METHOD_NOT_ALLOWED"
        });
    }

    const { message, address } = req.body || {};

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!message || typeof message !== "string") {
        return res.status(400).json({
            error: "INVALID_MESSAGE"
        });
    }

    if (!address || typeof address !== "string") {
        return res.status(400).json({
            error: "INVALID_ADDRESS"
        });
    }

    let balance = 0;

    try {

        // -----------------------------
        // FETCH WALLET BALANCE
        // -----------------------------
        if (address.startsWith("terra1")) {

            const lcdRes = await fetch(
                `https://terra-classic-lcd.publicnode.com/cosmos/bank/v1beta1/balances/${address}`
            );

            if (lcdRes.ok) {

                const data = await lcdRes.json();

                const token = data?.balances?.find(
                    b => b.denom.toLowerCase().includes("safu")
                );

                balance = Number(token?.amount || 0) / 1_000_000;
            }
        }

        // -----------------------------
        // SIGNAL MODE
        // -----------------------------
        let mode = "VOID";

        if (balance <= 0) {
            mode = "VOID";
        } else if (balance < 10000) {
            mode = "HOLDER";
        } else if (balance < 10000000) {
            mode = "ECHO";
        } else {
            mode = "WHALE";
        }

        // -----------------------------
        // GROQ REQUEST
        // -----------------------------
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 12000);

        const aiRes = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    temperature: 0.9,
                    max_tokens: 120,
                    messages: [
                        {
                            role: "system",
                            content: `
YOU ARE THE SAFU ORACLE.

YOU ANALYZE BLOCKCHAIN SIGNALS.

CURRENT MODE: ${mode}
OBSERVED BALANCE: ${balance}

RULES:
- SPEAK IN ALL CAPS
- SHORT CRYPTIC SENTENCES
- VOID = HOSTILE
- HOLDER = WATCHFUL
- ECHO = PROPHETIC
- WHALE = REALITY DISTORTION
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

        clearTimeout(timeout);

        // -----------------------------
        // SAFE AI RESPONSE
        // -----------------------------
        let reply = "THE ORACLE IS SILENT.";

        if (aiRes.ok) {

            const aiData = await aiRes.json();

            reply =
                aiData?.choices?.[0]?.message?.content ||
                "THE SIGNAL CANNOT BE INTERPRETED.";
        }

        // -----------------------------
        // SHARE TEXT
        // -----------------------------
        const shareText =
`THE SAFU ORACLE DETECTED A ${mode} SIGNAL.

${reply}

ENTER THE ABYSS.`;

        // -----------------------------
        // FINAL RESPONSE
        // -----------------------------
        return res.status(200).json({
            reply,
            mode,
            balance,
            shareText
        });

    } catch (err) {

        return res.status(500).json({
            error: "ORACLE_OFFLINE",
            details: err.message || "SIGNAL_LOST"
        });
    }
}
