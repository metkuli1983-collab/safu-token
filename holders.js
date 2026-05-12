export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "METHOD_NOT_ALLOWED"
        });
    }

    const { address, message } = req.body || {};

    // -----------------------------
    // SAFE DEFAULTS
    // -----------------------------
    let balance = 0;
    let mode = "VOID";

    try {

        // -----------------------------
        // WALLET CHECK (SAFE)
        // -----------------------------
        if (address && address.startsWith("terra1")) {

            const lcdRes = await fetch(
                `https://terra-classic-lcd.publicnode.com/cosmos/bank/v1beta1/balances/${address}`
            );

            if (lcdRes.ok) {
                const data = await lcdRes.json();

                const token = data?.balances?.find(b =>
                    b.denom?.includes("safu")
                );

                balance = Number(token?.amount || 0) / 1_000_000;
            }
        }

        // -----------------------------
        // MODE LOGIC
        // -----------------------------
        if (balance <= 0) mode = "VOID";
        else if (balance < 10000) mode = "HOLDER";
        else if (balance < 10000000) mode = "ECHO";
        else mode = "WHALE";

        // -----------------------------
        // SIMPLE ORACLE (NO AI = NO BREAKS)
        // -----------------------------
        let reply = "";

        if (mode === "VOID") reply = "NO SIGNAL DETECTED.";
        if (mode === "HOLDER") reply = "MINOR SIGNAL REGISTERED.";
        if (mode === "ECHO") reply = "SIGNAL REFLECTS BACK.";
        if (mode === "WHALE") reply = "REALITY DISTORTION ACTIVE.";

        // -----------------------------
        // SHARE TEXT (ALWAYS SAFE)
        // -----------------------------
        const shareText =
`$SAFU ORACLE REPORT

MODE: ${mode}
BALANCE: ${balance}

${reply}`;

        // -----------------------------
        // RESPONSE
        // -----------------------------
        return res.status(200).json({
            reply,
            mode,
            balance,
            shareText
        });

    } catch (err) {

        return res.status(200).json({
            reply: "ORACLE TEMPORARILY SILENT.",
            mode: "VOID",
            balance: 0,
            shareText: "ORACLE DOWN"
        });
    }
}
