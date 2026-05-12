export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const { address, message } = req.body || {};

    let balance = 0;

    try {

        if (address && address.startsWith("terra1")) {

            const r = await fetch(
                `https://terra-classic-lcd.publicnode.com/cosmos/bank/v1beta1/balances/${address}`
            );

            const data = await r.json();

            const token = data?.balances?.find(b =>
                b.denom?.includes("safu")
            );

            balance = Number(token?.amount || 0) / 1_000_000;
        }

        let mode = "VOID";
        if (balance > 0 && balance < 10000) mode = "HOLDER";
        if (balance >= 10000 && balance < 10000000) mode = "ECHO";
        if (balance >= 10000000) mode = "WHALE";

        const reply = `MODE: ${mode}`;

        return res.status(200).json({
            reply,
            mode,
            balance,
            shareText: `SAFU ORACLE: ${mode} | ${balance}`
        });

    } catch (e) {
        return res.status(200).json({
            reply: "ORACLE OFFLINE",
            mode: "VOID",
            balance: 0,
            shareText: "ORACLE OFFLINE"
        });
    }
}
