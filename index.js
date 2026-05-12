// TIMER
const targetDate = new Date("2026-10-31T00:00:00").getTime(); 
setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('chaos-timer').innerText = `${d}:${h}:${m}:${s}`;
}, 1000);

// BUTTONS
document.getElementById('buy-btn').onclick = () => alert('SYSTEM_ERROR: LIQUIDITY_VALVE_STUCK.');
document.getElementById('wallet-btn').onclick = function() {
    this.innerText = "> UPLOADING...";
    setTimeout(() => {
        alert("👽: 'YOUR WALLET IS TOO SMALL.'");
        this.innerText = "[ ACCESS_DENIED ]";
    }, 1000);
};

// LOGS
const logs = ["VOID_STABILITY: 44%", "ALIEN_TECH_DETECTED", "BYPASSING_SANITY..."];
setInterval(() => {
    const logContainer = document.getElementById('system-log');
    const p = document.createElement('p');
    p.innerText = `> ${logs[Math.floor(Math.random() * logs.length)]}`;
    logContainer.prepend(p);
    if (logContainer.children.length > 5) logContainer.removeChild(logContainer.lastChild);
}, 3000);
