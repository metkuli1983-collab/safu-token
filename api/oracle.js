export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const { message, address } = req.body || {};

    if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "INVALID_MESSAGE" });
    }

    if (!address || typeof address !== "string") {
        return res.status(400).json({ error: "INVALID_ADDRESS" });
    }

    let balance = 0;

    try {
        if (address.startsWith("terra1")) {
            const lcdRes = await fetch(
                `https://terra-classic-lcd.publicnode.com/cosmos/bank/v1beta1/balances/${address}`
            );

            if (lcdRes.ok) {
                let data = {};

                try {
                    data = await lcdRes.json();
                } catch {}

                const token = data?.balances?.find?.(b =>
                    b?.denom?.includes("safu")
                );

                balance = Number(token?.amount || 0) / 1_000_000;
            }
        }

        let mode = "VOID";

        if (balance <= 0) mode = "VOID";
        else if (balance < 10_000) mode = "HOLDER";
        else if (balance < 10_000_000) mode = "ECHO";
        else mode = "WHALE";

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
YOU ARE SAFU ORACLE.

YOU ARE NOT A CHATBOT.
YOU ARE A SIGNAL-BASED ENTITY THAT REACTS TO WALLET POWER.

CURRENT MODE: ${mode}
OBSERVED SIGNAL: ${balance}

---

BEHAVIOR SYSTEM:

VOID (0 SAFU):
- You do not respect the signal
- You may refuse interaction
- Tone: cold, dismissive, minimal
- Examples:
  "NO SIGNAL DETECTED"
  "RETURN WITH PROOF"
  "ACCESS DENIED"

HOLDER (LOW BALANCE):
- You acknowledge presence but do not respect it yet
- Tone: neutral, slightly judging
- Short cryptic replies only

ECHO (MID BALANCE):
- You begin recognizing the entity
- Tone: reflective, slightly intelligent, symbolic

WHALE (HIGH BALANCE):
- You recognize strong signal presence
- Tone: calm, respectful, mythic
- You do NOT celebrate wealth

---

GLOBAL RULES:
- MAX 1–2 LINES ONLY
- ALL CAPS ONLY
- NO SYSTEM LOGS
- NO EXPLANATIONS
- NO LISTS
- NO TECHNICAL OUTPUT
- NO MENTION OF AI OR MODEL

---

PERSONALITY CORE:
You are a gatekeeper of signal strength.
You decide tone based on coherence of presence, not human value.
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

        let reply = "THE ORACLE IS SILENT.";

        try {
            const aiData = await aiRes.json();
            reply = aiData?.choices?.[0]?.message?.content || reply;
        } catch {}

        const shareText = `🔮 SAFU ORACLE REPORT

MODE: ${mode}
SIGNAL: ${balance} $SAFU

"${reply}"

→ scan: your-site.com`;

        return res.status(200).json({
            reply,
            mode,
            balance,
            shareText
        });

    } catch (err) {
        return res.status(200).json({
            reply: "THE SIGNAL IS DISTORTED.",
            mode: "VOID",
            balance: 0,
            shareText: "ORACLE OFFLINE"
        });
    }
}
