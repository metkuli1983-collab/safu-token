function debug(msg) {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.bottom = "0";
    el.style.left = "0";
    el.style.right = "0";
    el.style.background = "black";
    el.style.color = "#00ff99";
    el.style.fontSize = "10px";
    el.style.padding = "6px";
    el.style.zIndex = "99999";
    el.innerText = msg;
    document.body.appendChild(el);
}

debug("HOLDERS JS LOADED");

const scanBtn = document.getElementById("scan-btn");

const walletInput = document.getElementById("wallet-input");
const chatBox = document.getElementById("chat-box");
const shareBtn = document.getElementById("share-btn");

let currentAddress = null;
let lastData = null;

if (shareBtn) shareBtn.style.display = "none";

function add(msg) {
    if (!chatBox) return;
    chatBox.innerHTML += `<p>${msg}</p>`;
}

scanBtn?.addEventListener("click", async () => {

    const addr = walletInput?.value?.trim();
    if (!addr) return;

    currentAddress = addr;

    scanBtn.innerText = "SCANNING...";

    try {

        const res = await fetch("/api/oracle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: addr, message: "scan" })
        });

        const data = await res.json();
        lastData = data;

        if (shareBtn) shareBtn.style.display = "block";

        add(`MODE: ${data.mode}`);
        add(`BALANCE: ${data.balance}`);
        add(`REPLY: ${data.reply}`);

    } catch (e) {
        add("SCAN FAILED");
    }

    scanBtn.innerText = "SCAN";
});

shareBtn?.addEventListener("click", async () => {

    if (!lastData?.shareText) return;

    await navigator.clipboard.writeText(lastData.shareText);

    add("COPIED");
});
