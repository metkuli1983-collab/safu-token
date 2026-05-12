export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "METHOD_NOT_ALLOWED"
        });
    }

    return res.status(200).json({
        reply: "ORACLE ONLINE",
        mode: "TEST",
        balance: 123,
        shareText: "TEST SIGNAL"
    });
}
