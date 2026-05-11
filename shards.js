// SAFU GLOBAL LOGIC
function createShard() {
    const symbols = ['SAFU', 'LUNC', '👽', '🛸', '📉', '🔥'];
    const shard = document.createElement('div');
    shard.className = 'shard'; // Make sure your CSS has .shard defined
    shard.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    shard.style.left = Math.random() * 100 + 'vw';
    shard.style.top = '-10vh';
    shard.style.fontSize = Math.random() * 20 + 10 + 'px';
    shard.style.position = 'fixed';
    shard.style.pointerEvents = 'none';
    shard.style.zIndex = '1';
    shard.style.color = '#ff007f';
    shard.style.fontWeight = 'bold';

    document.body.appendChild(shard);

    const duration = 4000 + Math.random() * 4000;
    shard.animate([
        { transform: `translateY(0) rotate(0deg)` }, 
        { transform: `translateY(110vh) rotate(360deg)` }
    ], { duration: duration });

    setTimeout(() => shard.remove(), duration);
}

// Start the rain
setInterval(createShard, 400)
