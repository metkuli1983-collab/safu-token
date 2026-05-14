// ==========================================
// WALL OF ECHOES SYSTEM
// ==========================================

// Load existing echoes
let echoes = JSON.parse(localStorage.getItem("echoes") || "[]");


// ==========================================
// SUBMIT INTEL
// ==========================================

function submitIntel() {

    const intelInput = document.getElementById("intel-input");
    const statusMsg = document.getElementById("status-msg");

    if (!intelInput) return;

    const val = intelInput.value.toLowerCase().trim();


    // SECRET DEVROOM TRIGGER
    if (val === "lunc") {

        if (statusMsg) {
            statusMsg.innerText = ">> TRUTH_FOUND. RELOCATING...";
        }

        setTimeout(() => {
            window.location.href = "dev-room.html";
        }, 600);

        return;
    }


    // NORMAL ECHO LOGIC
    if (val.length > 2) {

        echoes.push({
            text: val,
            time: Date.now()
        });

        localStorage.setItem("echoes", JSON.stringify(echoes));

        if (statusMsg) {

            statusMsg.innerText = ">> ECHO STORED IN THE VOID";

            setTimeout(() => {
                statusMsg.innerText = ">> MEMORY LEAK STABLE";
                intelInput.value = "";
            }, 2000);
        }

        renderEchoes();
    }
}


// ==========================================
// RENDER ECHOES
// ==========================================

function renderEchoes() {

    const container = document.querySelector("section");

    if (!container) return;

    // Remove old rendered echoes first
    document.querySelectorAll(".generated-echo").forEach(e => e.remove());

    const echoes = JSON.parse(localStorage.getItem("echoes") || "[]");

    echoes.slice(-5).reverse().forEach(e => {

        const div = document.createElement("div");

        div.className =
            "generated-echo border-2 border-[#ff007f] p-6 bg-black shadow-[10px_10px_0px_0px_#444]";

        div.innerHTML = `
            <h2 class="text-2xl font-black text-[#ff007f] italic mb-3">
                ECHO
            </h2>

            <p class="text-xs tracking-widest text-zinc-300 italic">
                "${e.text}"
            </p>
        `;

        container.prepend(div);
    });
}


// ==========================================
// INIT
// ==========================================

window.submitIntel = submitIntel;

window.addEventListener("load", renderEchoes);
