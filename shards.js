// ==========================================
// 1. THE SECRET GATEWAY (lunc)
// ==========================================
let secretBuffer = "";
window.addEventListener('keydown', (e) => {
    secretBuffer += e.key.toLowerCase();
    if (secretBuffer.length > 4) secretBuffer = secretBuffer.substring(1);
    
    // Typing 'lunc' anywhere on the site flashes green and redirects
    if (secretBuffer === "lunc") {
        document.body.style.filter = "invert(1) sepia(1) saturate(5) hue-rotate(90deg)";
        setTimeout(() => { window.location.href = "dev-room.html"; }, 400);
        secretBuffer = "";
    }
});

// ==========================================
// 2. GLOBAL VISUALS: RAIN & HERO FLICKER
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
        { transform: 'translateY(0) rotate(0deg)' }, 
        { transform: 'translateY(110vh) rotate(360deg)' }
    ], { duration: duration });

    setTimeout(() => shard.remove(), duration);
}
setInterval(createShard, 400);

// Neon Logo Pulse/Flicker
const hero = document.querySelector('.safu-neon') || document.querySelector('h1');
if (hero) {
    setInterval(() => {
        hero.style.opacity = Math.random() > 0.98 ? "0.3" : "1";
        if(Math.random() > 0.96) {
            hero.style.textShadow = "0 0 20px #00ff80, 0 0 30px #00ff80"; // Green Glitch
        } else {
            hero.style.textShadow = "0 0 10px #ff007f, 0 0 20px #ff007f"; // Classic Pink
        }
    }, 120);
}

// ==========================================
// 3. HOME PAGE: TIMER & ALIEN BOSS
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
    const logs = ["VOID_STABILITY: 44%", "HINT: lunc", "ALIEN_TECH_DETECTED", "BYPASSING_SANITY..."];
    setInterval(() => {
        const p = document.createElement('p');
        p.innerText = `> ${logs[Math.floor(Math.random() * logs.length)]}`;
        logContainer.prepend(p);
        if (logContainer.children.
