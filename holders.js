let lastOracleData = null;
let currentAddress = null;

// -----------------------------
// ELEMENTS
// -----------------------------
const scanBtn = document.getElementById("scan-btn");
const walletInput = document.getElementById("wallet-input");
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");
const badgeContainer = document.getElementById("badge-container");
const oracleState = document.getElementById("oracle-state");
const shareBtn = document.getElementById("share-btn");

// -----------------------------
// SAFE INIT
// -----------------------------
if (shareBtn) {
    shareBtn.style.display = "none";
}

// -----------------------------
// ORACLE STATUS
// -----------------------------
function setState(text) {
    if (oracleState) {
        oracleState.innerText = `ORACLE_STATUS: ${text}`;
    }
}

// -----------------------------
// ADD CHAT MESSAGE
// -----------------------------
function addMessage(sender, text, colorClass = "text-white") {

    if (!chatBox) return;

    const el = document.createElement("p");

    el.className = `${colorClass} uppercase font-semibold mb-2`;

    el.innerHTML = `
        <span class="opacity-50">[${sender}]</span> ${text}
    `;

    chatBox.appendChild(el);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// -----------------------------
// BADGE RENDER
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
        <div class="border-2 p-6 text-center bg-black"
             style="border-color:${color}">

            <p class="text-xs uppercase mb-2"
               style="color:${color}">
               SIGNAL_CLASSIFICATION
            </p>

            <h2 class="text-2xl font-bold mb-4"
                style="color:${color}">
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
// SCAN SIGNAL
// -----------------------------
scanBtn?.addEventListener("click", async () => {

    const addr = walletInput?.value?.trim();

    if (!addr || !addr.startsWith("terra1")) {
        alert("INVALID_SIGNAL");
        return;
    }

    currentAddress = addr;

    scanBtn.innerText = "SCANNING_SIGNAL...";
    setState("
