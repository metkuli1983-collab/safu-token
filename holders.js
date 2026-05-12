let currentAddress = null;

// -----------------------------
// 1. SCAN / VERIFY SIGNAL
// -----------------------------
document.getElementById("scan-btn").addEventListener("click", async () => {
    const addr = document.getElementById("wallet-input").value.trim();

    if (!addr.startsWith("terra1")) {
        alert("INVALID_SIGNAL");
        return;
    }

    currentAddress = addr;

    const btn = document.getElementById("scan-btn");
    btn.innerText = "SCANNING SIGNAL...";

    try {
        const res = await fetch("/api/oracle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address: addr,
                message: "INIT_SIGNAL_SCAN"
            })
        });

        const data = await res.json();

        renderBadge(addr, data.balance, data.mode);
        addMessage("SYSTEM", `SIGNAL LOCKED: ${data.balance} $SAFU`, "text-green-400");
        addMessage("ORACLE", data.reply, "text-pink-400");

    } catch (err) {
        addMessage("SYSTEM", "SIGNAL FAILURE", "text-red-500");
    } finally {
        btn.innerText = "SCAN SIGNAL";
    }
});


// -----------------------------
// 2. CHAT WITH ORACLE
// -----------------------------
document.getElementById("chat-input").addEventListener("keypress", async (e) => {
    if (e.key !== "Enter") return;
    if (!currentAddress) return alert("NO_SIGNAL_ACTIVE");

    const msg = e.target.value.trim();
    if (!msg) return;

    addMessage("YOU", msg, "text-white");
    e.target.value = "";

    try {
        const res = await fetch("/api/oracle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address: currentAddress,
                message: msg
            })
        });

        const data = await res.json();

        addMessage(
            "ORACLE",
            data.reply || "THE ORACLE IS SILENT.",
            "text-pink-400"
        );

    } catch (err) {
        addMessage("SYSTEM", "ORACLE DISCONNECTED", "text-red-500");
    }
});


// -----------------------------
// 3. BADGE RENDER (DISPLAY ONLY)
// -----------------------------
function renderBadge(addr, balance, mode) {
    const container = document.getElementById("badge-container");
    container.classList.remove("hidden");

    let tier = "VOID SIGNAL";
    let color = "#444";

    if (mode === "HOLDER") {
        tier = "RECOGNIZED SIGNAL";
        color = "#00ff99";
    }

    if (mode === "ECHO") {
        tier = "ECHO ENTITY";
        color = "#7c3aed";
    }

    if (mode === "WHALE") {
        tier = "DISTORTION ENTITY";
        color = "#ff007f";
    }

    container.innerHTML = `
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
// 4. CHAT UI
// -----------------------------
function addMessage(sender, text, colorClass) {
    const box = document.getElementById("chat-box");

    const el = document.createElement("p");
    el.className = `${colorClass} uppercase font-semibold`;

    el.innerHTML = `<span class="opacity-50">[${sender}]</span> ${text}`;

    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}
