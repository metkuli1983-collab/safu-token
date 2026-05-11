// ==========================================
// 1. GLOBAL SYSTEM: THE RAIN (Works Everywhere)
// ==========================================
function createShard() {
    const symbols = ['SAFU', 'LUNC', '👽', '🛸', '📉', '🔥'];
    const shard = document.createElement('div');
    shard.className = 'shard';
    shard.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    shard.style.left = Math.random() * 100 + 'vw';
    shard.style.top = '-10vh';
    shard.style.fontSize = Math.random() * 20 + 10 + 'px';
    document.body.appendChild(shard);

    const duration = 4000 + Math.random() * 4000;
    shard.animate([
        { transform: `translateY(0) rotate(0deg)` }, 
        { transform: `translateY(110vh) rotate(360deg)` }
    ], { duration: duration });

    setTimeout(() => shard.remove(), duration);
}
setInterval(createShard, 400);

// ==========================================
// 2. INDEX PAGE: COUNTDOWN & WALLET GLITCH
// ==========================================
const chaosTimer = document.getElementById('chaos-timer');
if (chaosTimer) {
    const targetDate = new Date("2026-10-31T00:00:00").getTime();
    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetDate - now;
        if (diff <= 0) return;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        chaosTimer.innerText = `${d.toString().padStart(3, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    setInterval(updateTimer, 1000);
}

const walletBtn = document.getElementById('wallet-btn');
const alienBoss = document.getElementById('alien-boss');
if (walletBtn && alienBoss) {
    walletBtn.addEventListener('click', function() {
        walletBtn.innerText = "> UPLOADING_CONSCIOUSNESS...";
        setTimeout(() => {
            document.body.classList.add('reality-glitch');
            alienBoss.style.transform = "scale(5) rotate(360deg)";
            alienBoss.style.zIndex = "1000";
            setTimeout(() => {
                alert("👽: 'YOUR WALLET IS TOO SMALL FOR THIS DIMENSION.'");
                document.body.classList.remove('reality-glitch');
                alienBoss.style.transform = "scale(1) rotate(0deg)";
                walletBtn.innerText = "[ ACCESS_DENIED ]";
            }, 2000);
        }, 1000);
    });
}

const logContainer = document.getElementById('system-log');
if (logContainer) {
    const logs = ["VOID_STABILITY: 44%", "HINT: lunc_lives", "ALIEN_TECH_DETECTED", "BYPASSING_SANITY..."];
    setInterval(() => {
        const p = document.createElement('p');
        p.innerText = `> ${logs[Math.floor(Math.random() * logs.length)]}`;
        logContainer.prepend(p);
        if (logContainer.children.length > 5) logContainer.removeChild(logContainer.lastChild);
    }, 3000);
}

// ==========================================
// 3. REGRET PAGE: LOSS CALCULATOR
// ==========================================
const calcBtn = document.getElementById('calcBtn');
const lossInput = document.getElementById('lossInput');
if (calcBtn && lossInput) {
    const mainRes = document.getElementById('mainResult');
    const subRes = document.getElementById('subResult');
    const outputBox = document.getElementById('outputBox');

    function runCalc() {
        const val = parseFloat(lossInput.value);
        if (!val || val <= 0) {
            mainRes.innerText = "ERROR: COWARD";
            subRes.innerText = "Input a real number.";
        } else if (val < 1000) {
            mainRes.innerText = "ROOKIE NUMBERS";
            subRes.innerText = "Buy $SAFU to experience real trauma.";
        } else {
            mainRes.innerText = "ABSOLUTELY F#KED UP";
            subRes.innerText = "You are officially SAFU.";
        }
        outputBox.classList.remove('hidden');
    }
    calcBtn.addEventListener('click', (e) => { e.preventDefault(); runCalc(); });
}

// ==========================================
// 4. WALL PAGE: INTEL SUBMISSION
// ==========================================
const intelInput = document.getElementById('intel-input');
const statusMsg = document.getElementById('status-msg');
function submitIntel() {
    if(intelInput && intelInput.value.length > 5) {
        statusMsg.innerText = ">> INTEL RECEIVED. ENCRYPTING...";
        statusMsg.style.opacity = "1";
        intelInput.value = "";
        setTimeout(() => { statusMsg.innerText = ">> UPLOAD COMPLETE."; }, 3000);
    }
}
// Attach to window so the HTML button 'onclick' can find it
window.submitIntel = submitIntel;
