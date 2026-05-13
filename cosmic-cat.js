if (!window.__CAT_INIT__) {
    window.__CAT_INIT__ = true;

    const cat = document.getElementById("cat-boss");
    const bubble = document.getElementById("cat-bubble");
    const input = document.getElementById("cat-input");
    const chat = document.getElementById("cat-chat");

    function showBubble(text) {
        if (!bubble) return;
        bubble.innerText = text;
        bubble.classList.remove("hidden");

        setTimeout(() => {
            bubble.classList.add("hidden");
        }, 3500);
    }

    function addChat(sender, text) {
        if (!chat) return;

        const el = document.createElement("p");
        el.innerHTML = `<span class="opacity-50">[${sender}]</span> ${text}`;
        chat.appendChild(el);
        chat.scrollTop = chat.scrollHeight;
    }

    // ---------------- USER CHAT ----------------
    if (input) {
        input.addEventListener("keypress", async (e) => {
            if (e.key !== "Enter") return;

            const msg = input.value.trim();
            if (!msg) return;

            addChat("YOU", msg);
            input.value = "";

            try {
                const res = await fetch("/api/cat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: msg })
                });

                const data = await res.json();
                addChat("CAT", data.reply);
                showBubble(data.reply);
            } catch {
                addChat("CAT", "...");
            }
        });
    }

    // ---------------- IDLE SPEECH ----------------
    async function catSpeakIdle() {
        try {
            const res = await fetch("/api/cat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: "say something random as cosmic cat"
                })
            });

            const data = await res.json();
            showBubble(data.reply);
        } catch {}
    }

    setInterval(() => {
        if (Math.random() < 0.35) {
            catSpeakIdle();
        }
    }, 20000);

    // ---------------- CLICK ANIMATION ----------------
    if (cat) {
        cat.addEventListener("click", () => {
            cat.style.transition = "transform 0.6s ease";
            cat.style.transform = "scale(4) rotate(360deg)";

            setTimeout(() => {
                cat.style.transform = "scale(1) rotate(0deg)";
            }, 900);

            showBubble("...");
        });
    }
}
