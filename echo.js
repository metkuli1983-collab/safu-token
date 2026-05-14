// ==========================================
// ECHO SYSTEM (CLEAN)
// ==========================================

// Load echoes
let echoes = JSON.parse(localStorage.getItem("echoes") || "[]");


// ==========================================
// SUBMIT INTEL
// ==========================================

function submitIntel() {

    const input = document.getElementById("intel-input");
    const status = document.getElementById("status-msg");

    if (!input) return;

    const val = input.value.toLowerCase().trim();


    // DEVROOM TRIGGER
    if (val === "lunc") {

        if (status) {
            status.innerText = ">> TRUTH_FOUND. RELOCATING...";
        }

        setTimeout(() => {
            window.location.href = "dev-room.html";
        }, 600);

        return;
    }


    // NORMAL ECHO FLOW
    if (val.length > 2) {

        // store locally
        echoes.push({
            text: val,
            time: Date.now()
        });

        localStorage.setItem("echoes", JSON.stringify(echoes));

        // feedback
        if (status) {
            status.innerText = ">> ECHO REGISTERED";
            setTimeout(() => {
                status.innerText = "";
                input.value = "";
            }, 1500);
        }

        // inject into wall boxes
        injectEcho(val);
    }
}


// ==========================================
// INJECT INTO EXISTING BOXES
// ==========================================

function injectEcho(text) {

    const targets = [
        document.getElementById("echo-text-1"),
        document.getElementById("echo-text-2")
    ];

    // remove invalid targets
    const valid = targets.filter(Boolean);
    if (valid.length === 0) return;

    // pick random box
    const target = valid[Math.floor(Math.random() * valid.length)];

    // slight corruption effect (important for your vibe)
    const variants = [
        `"${text}"`,
        `"${text}..."`,
        `...${text}...`,
        text.toUpperCase(),
        `// ${text}`
    ];

    target.innerText =
        variants[Math.floor(Math.random() * variants.length)];
}


// ==========================================
// OPTIONAL: REPLAY STORED ECHOES ON LOAD
// ==========================================

window.addEventListener("load", () => {

    const stored = JSON.parse(localStorage.getItem("echoes") || "[]");
    if (stored.length === 0) return;

    const last = stored.slice(-1)[0];

    if (last?.text) {
        injectEcho(last.text);
    }
});


// ==========================================
// EXPORT
// ==========================================

window.submitIntel = submitIntel;
