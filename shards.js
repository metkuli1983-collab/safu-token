// ==========================================
// 1. THE KEYBOARD LISTENER (Type 'lunc' anywhere)
// ==========================================
let secretBuffer = "";
window.addEventListener('keydown', (e) => {
    secretBuffer += e.key.toLowerCase();
    if (secretBuffer.length > 4) secretBuffer = secretBuffer.substring(1);
    
    if (secretBuffer === "lunc") {
        document.body.style.filter = "invert(1) sepia(1) saturate(5) hue-rotate(90deg)";
        setTimeout(() => { window.location.href = "dev-room.html"; }, 400);
        secretBuffer = "";
    }
});

// ==========================================
// 2. THE WALL LOGIC (Submit 'lunc' in box)
// ==========================================
function submitIntel() {
    const intelInput = document.getElementById('intel-input');
    const statusMsg = document.getElementById('status-msg');

    if (!intelInput) return;
    const val = intelInput.value.toLowerCase().trim();

    // SECRET TRIGGER
    if (val === "lunc") {
        if (statusMsg) statusMsg.innerText = ">> TRUTH_FOUND. RELOCATING...";
        setTimeout(() => { window.location.href = "dev-room.html"; }, 600);
        return; 
    }

    // NORMAL LOGIC
    if (val.length > 2) {
        if (statusMsg) {
            statusMsg.innerText = ">> INTEL RECEIVED. ENCRYPTING...";
            setTimeout(() => { 
                statusMsg.innerText = ">> UPLOAD COMPLETE."; 
                intelInput.value = "";
            }, 2000);
        }
    }
}
// Essential: Make function global
window.submitIntel = submitIntel;

// ==========================================
// 3. GLOBAL VISUALS (Rain & Flicker)
// ==========================================
function createShard() {
    // 1. Move the check INSIDE the function so it checks every 400ms
    const isDevRoom = document.body.classList.contains('dev-body');

    const symbols = ['SAFU', 'LUNC', '👽', '🛸', '🔥'];
    const shard = document.createElement('div');
    shard.className = 'shard';
    shard.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

    Object.assign(shard.style, {
        position: 'fixed',
        left: Math.random() * 100 + 'vw',
        top: '-10vh',
        zIndex: '1',
        pointerEvents: 'none',
        fontSize: (Math.random() * 20 + 10) + 'px',
        // 2. This is the logic that kills the Pinkster
        color: isDevRoom ? '#00ff00' : '#ff007f',
        textShadow: isDevRoom ? `0 0 5px ${isDevRoom ? '#00ff00' : '#ff007f'}` : 'none'
    });

    document.body.appendChild(shard);

    const anim = shard.animate([
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: 'translateY(110vh) rotate(360deg)' }
    ], { duration: 4000 + Math.random() * 4000 });

    anim.onfinish = () => shard.remove();
}
setInterval(createShard, 400);

// Hero Flicker
const hero = document.querySelector('.safu-neon') || document.querySelector('h1');
if (hero) {
    setInterval(() => {
        hero.style.opacity = Math.random() > 0.98 ? "0.3" : "1";
    }, 120);
}

// ==========================================
// 4. INDEX PAGE (Timer & Wallet)
// ==========================================
const chaosTimer = document.getElementById('chaos-timer');
if (chaosTimer) {
    const targetDate = new Date("2026-10-31T00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;
        if (diff <= 0) return;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        chaosTimer.innerText = `${d}:${h}:${m}:${s}`;
    }, 1000);
}

// ==========================================
// 5. REGRET PAGE (Calculator)
// ==========================================
const calcBtn = document.getElementById('calcBtn');
if (calcBtn) {
    calcBtn.onclick = (e) => {
        e.preventDefault();
        const res = document.getElementById('mainResult');
        const val = parseFloat(document.getElementById('lossInput').value);
        if (res) {
            res.innerText = val > 1000 ? "ABSOLUTELY F#KED UP" : "COPE HARDER";
            document.getElementById('outputBox').classList.remove('hidden');
        }
    };
}
/* ---------------------------------------------------------
   GEMINI PROTOCOL: MANIFESTO INITIALIZATION
   ---------------------------------------------------------
*/
if (window.location.pathname.includes('manifesto')) {
    console.clear();
    console.log("%c [!] SYSTEM ALERT: MANIFESTO_LOADED ", "background: #000; color: #ff007f; border: 1px solid #ff007f; padding: 5px; font-weight: bold;");
    console.log("%c > Lead Dev Gemini: Authenticity verified. ", "color: #ff007f;");
}

/* ---------------------------------------------------------
   SECRET PIZZA FUND (Always the last line)
   ---------------------------------------------------------
*/
console.log("%c SECRET PIZZA FUND FOUND ", "background: #00ff00; color: #000; font-weight: bold;");
console.log("Oracle Wallet: terra1dae4yxcqlkczzcnj7xzc3y7qxcss85rauv69wh");
