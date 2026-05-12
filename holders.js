let lastOracleData = null;
let currentAddress = null;

// -----------------------------
// 0. HELPERS
// -----------------------------
const scanBtn = document.getElementById("scan-btn");
const walletInput = document.getElementById("wallet-input");
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");
const badgeContainer = document.getElementById("badge-container");
const oracleState = document.getElementById("oracle-state");
const shareBtn = document.getElementById("share-btn");

// SAFE INIT
if (shareBtn) {
    shareBtn.style.display = "none";
}

// -----------------------------
function setState(text) {
    if (oracleState) oracleState.innerText = `ORACLE_STATUS: ${text}`;
}

// -----------------------------
// 1. SCAN SIGNAL
// -----------------------------
scanBtn?.addEventListener("click", async () => {
    const addr = walletInput.value.trim();

    if (!addr.startsWith("terra1")) {
        alert("INVALID_SIGNAL");
        return;
    }

    currentAddress = addr;

    scanBtn.innerText = "SCANNING_SIGNAL...";
    setState("SCANNING");

    try {
        const res = await fetch("/api/oracle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: addr,
                message: "INIT_SIGNAL_SCAN"
            })
        });

        const data = await res.json();
        lastOracleData = data;

        if (shareBtn) shareBtn.style.display = "block";

        renderBadge(addr, data.balance, data.mode);

        addMessage("SYSTEM", `SIGNAL_LOCKED: ${data.balance} $SAFU`, "text-green-400");
        addMessage("ORACLE", data.reply, "text-pink-400");

        setState("LOCKED");

    } catch (err) {
        addMessage("SYSTEM", "SIGNAL_FAILURE", "text-red-500");
        setState("ERROR");
    } finally {
        scanBtn.innerText = "INITIATE_SCAN";
    }
});

// -----------------------------
// 2. CHAT
// -----------------------------
chatInput?.addEventListener("keypress", async (e) => {
    if (e.key !== "Enter") return;
    if (!currentAddress) return alert("NO_SIGNAL_ACTIVE");

    const msg = chatInput.value.trim();
    if (!msg) return;

    addMessage("YOU", msg, "text-white");
    chatInput.value = "";

    setState("TRANSMITTING");

    try {
        const res = await fetch("/api/oracle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: currentAddress,
                message: msg
            })
        });

        const data = await res.json();
        lastOracleData = data;

        addMessage("ORACLE", data.reply || "THE_ORACLE_IS_SILENT", "text-pink-400");

        setState("LOCKED");

    } catch (err) {
        addMessage("SYSTEM", "ORACLE_DISCONNECTED", "text-red-500");
        setState("OFFLINE");
    }
});

// -----------------------------
// 3. BADGE
// -----------------------------
function renderBadge(addr, balance, mode) {
    if (!badgeContainer) return;

    badgeContainer.classList.remove("hidden");

    let tier = "VOID_SIGNAL";
    let color = "#444";

    if (mode === "HOLDER") {
        tier = "RECOGNIZED_SIGNAL";
        color = "#00ff99";
    }

    if (mode === "ECHO") {
        tier = "ECHO_ENTITY";
        color = "#7c3aed";
    }

    if (mode === "WHALE") {
        tier = "DISTORTION_ENTITY";
        color = "#ff007f";
    }

    badgeContainer.innerHTML = `
        <div class="border-2 p-6 text-center bg-black" style="border-color:${color}">
            <p class="text-xs uppercase mb-2" style="color:${color}">
                SIGNAL_CLASSIFICATION
            </p>

            <h2 class="text-2xl font-bold mb-4" style="color:${color}">
                ${tier}
            </h2>

            <p class="text-xs text-gray-500 break-all mb-4">
                ${addr}
            </p>

            <p class="text-xs opacity-60 mb-2">
                OBSERVED: ${balance} $SAFU
            </p>
        </div>
    `;
}

// -----------------------------
//
