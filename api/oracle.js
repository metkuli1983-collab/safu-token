export default async function handler(req, res) {
    // Only POST allowed
    if (req.method !== "POST") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const { message, address } = req.body || {};

    // -----------------------------
    // 1. INPUT VALIDATION
    // -----------------------------
    if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "INVALID_MESSAGE" });
    }

    if (!address || typeof address !== "string") {
        return res.status(400).json({ error: "INVALID_ADDRESS" });
    }

    let balance = 0;

    try {
        // -----------------------------
        // 2. ON-CHAIN SIGNAL FETCH
        // -----------------------------
        if (address.startsWith("terra1")) {
            const lcdRes = await fetch(
                `https://terra-classic-lcd.publicnode.com/cosmos/bank/v1beta1/balances/${address}`
            );

            if (lcdRes.ok) {
                const data = await lcdRes.json();

                const token = data?.balances?.find(b =>
                    b.denom.includes("safu")
                );

                balance = Number(token?.amount || 0) / 1_000_000;
            }
        }

        // -----------------------------
        // 3. ORACLE TIER ENGINE
        // -----------------------------
        let mode = "VOID";

        if (balance <= 0) {
            mode = "VOID";
        } else if (balance < 10_000) {
            mode = "HOLDER";
        } else if (balance < 10_000_000) {
            mode = "ECHO";
        } else {
            mode = "WHALE";
        }

        // -----------------------------
        // 4. AI ORACLE CALL
        // -----------------------------
        const aiRes = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    temperature: 0.9,
                    messages: [
                        {
                            role: "system",
                            content: `
YOU ARE THE SAFU ORACLE.

YOU OBSERVE BLOCKCHAIN SIGNALS, NOT USERS.

CURRENT SIGNAL MODE: ${mode}
OBSERVED SAFU BALANCE: ${balance}

BEHAVIOR RULES:
- VOID: hostile, rejecting, cryptic silence
- HOLDER: neutral recognition tone
- ECHO: reflective, slightly prophetic
- WHALE: mythic, distorted prophecy voice

IMPORTANT:
- DO NOT CLAIM AUTHENTICATION
- ONLY INTERPRET SIGNALS
- SPEAK IN SHORT, CRYPTIC PHRASES
- ALL CAPS ONLY
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

        // -----------------------------
        // 5. SAFE RESPONSE PARSING
        // -----------------------------
        if (!aiRes.ok) {
            return res.status(500).json({
                error: "ORACLE_FAILURE",
                details: "AI_RESPONSE_ERROR"
            });
        }

        const aiData = await aiRes.json();

        const reply =
            aiData?.choices?.[0]?.message?.content ||
            "THE ORACLE REMAINS SILENT.";

        // -----------------------------
        // 6. FINAL RESPONSE
        // -----------------------------
        return res.status(200).json({
            reply,
            mode,
            balance
        });

    } catch (err) {
        return res.status(500).json({
            error: "ORACLE_OFFLINE",
            details: "SIGNAL_LOST"
        });
    }
}
