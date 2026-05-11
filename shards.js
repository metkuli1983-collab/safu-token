// shards.js
function createShard() {
    const symbols = ['✦', '☄️', 'SAFU', 'LUNC', '💖', '?', '!', '👽', '🛸'];
    const shard = document.createElement('div');
    shard.className = 'shard';
    shard.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    
    shard.style.left = Math.random() * 100 + 'vw';
    shard.style.top = '-5vh';
    shard.style.fontSize = Math.random() * 20 + 12 + 'px';
    shard.style.opacity = Math.random() * 0.7;
    
    document.body.appendChild(shard);

    const duration = 5000 + Math.random() * 3000;
    
    shard.animate([
        { top: '-5vh', transform: 'rotate(0deg)' },
        { top: '105vh', transform: `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)` }
    ], {
        duration: duration,
        easing: 'linear'
    });

    setTimeout(() => shard.remove(), duration);
}

// Start the madness
setInterval(createShard, 500);
