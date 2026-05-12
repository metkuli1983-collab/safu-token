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

MODE: ${mode}
SIGNAL: ${balance}

RULES:

ALL CAPS

CRYPTIC

NEVER CLAIM AUTHENTICATION

RESPOND LIKE A LIVING SYSTEM
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

  // 🧿 SHARE TEXT (NEW)  
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
