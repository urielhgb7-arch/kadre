// ==========================================
// HACKER TEXT DECRYPT & WAHOU BOOT SEQUENCE
// ==========================================
(function() {
    function initBootSequence() {
        // Only run boot sequence if it hasn't run in this session
        if (sessionStorage.getItem('kadre_booted')) {
            initHackerText();
            return;
        }
        sessionStorage.setItem('kadre_booted', 'true');

        // Inject Glitch CSS
        const style = document.createElement('style');
        style.innerHTML = `
            .kadre-boot-overlay {
                position: fixed;
                inset: 0;
                background: #050505;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'Space Grotesk', monospace;
                color: #ff2a2a;
                text-shadow: 0 0 10px rgba(255, 42, 42, 0.8), 2px 0 0 rgba(0,255,255,0.5), -2px 0 0 rgba(255,0,255,0.5);
                transition: opacity 0.8s cubic-bezier(0.86, 0, 0.07, 1), filter 0.8s;
            }
            .kadre-boot-overlay.fade-out {
                opacity: 0;
                pointer-events: none;
                filter: blur(20px) brightness(2);
            }
            .boot-line {
                font-size: clamp(1.2rem, 3vw, 2.5rem);
                font-weight: bold;
                letter-spacing: 2px;
                margin: 10px 0;
                opacity: 0;
                transform: translateY(20px);
            }
            .boot-line.glitch-heavy {
                animation: extremeGlitch 0.2s infinite;
                font-size: clamp(2rem, 5vw, 4rem);
                color: #fff;
                text-shadow: 0 0 20px #ff0000, 4px 0 0 cyan, -4px 0 0 magenta;
            }
            @keyframes extremeGlitch {
                0% { transform: translate(0) skew(0); }
                20% { transform: translate(-5px, 2px) skew(-20deg); color: red; }
                40% { transform: translate(5px, -2px) skew(20deg); color: white; }
                60% { transform: translate(-2px, 5px) skew(0); }
                80% { transform: translate(2px, -5px) skew(-10deg); color: cyan; }
                100% { transform: translate(0) skew(0); }
            }
            .boot-container { text-align: center; }
            .boot-cursor {
                display: inline-block;
                width: 15px;
                height: clamp(1.2rem, 3vw, 2.5rem);
                background: #ff2a2a;
                animation: blink 0.1s infinite;
                vertical-align: bottom;
                margin-left: 10px;
            }
            @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
            body.booting { overflow: hidden; }
        `;
        document.head.appendChild(style);

        document.body.classList.add('booting');
        const overlay = document.createElement('div');
        overlay.className = 'kadre-boot-overlay';
        
        const container = document.createElement('div');
        container.className = 'boot-container';
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        const lines = [
            "INITIALIZING KADRE PROTOCOL...",
            "BYPASSING SECURITY MAINFRAME...",
            "DECRYPTING NEURAL NETWORKS...",
            "ACCESS GRANTED."
        ];

        let lineIndex = 0;
        
        function typeLine() {
            if (lineIndex >= lines.length) {
                // Final explosive glitch
                container.innerHTML = `<div class="boot-line glitch-heavy" style="opacity:1; transform:none;">SYSTEM OVERRIDE</div>`;
                setTimeout(() => {
                    overlay.classList.add('fade-out');
                    document.body.classList.remove('booting');
                    setTimeout(() => {
                        overlay.remove();
                        initHackerText();
                    }, 1000);
                }, 800);
                return;
            }

            const lineEl = document.createElement('div');
            lineEl.className = 'boot-line';
            lineEl.style.opacity = '1';
            lineEl.style.transform = 'translateY(0)';
            container.appendChild(lineEl);
            
            const cursor = document.createElement('span');
            cursor.className = 'boot-cursor';
            lineEl.appendChild(cursor);

            let charIndex = 0;
            const text = lines[lineIndex];
            const isLast = lineIndex === lines.length - 1;

            const typeInterval = setInterval(() => {
                lineEl.textContent = text.substring(0, charIndex) + (Math.random() > 0.5 ? String.fromCharCode(33 + Math.random() * 60) : '');
                lineEl.appendChild(cursor);
                
                if (charIndex >= text.length) {
                    clearInterval(typeInterval);
                    lineEl.textContent = text;
                    if (isLast) lineEl.style.color = "#00ffcc"; // Green/cyan for granted
                    setTimeout(() => {
                        lineIndex++;
                        typeLine();
                    }, isLast ? 400 : 150);
                } else {
                    charIndex += Math.floor(Math.random() * 3) + 1; // Speed variation
                }
            }, 30);
        }

        setTimeout(typeLine, 200);
    }

    function initHackerText() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|[]<>";
        const targets = document.querySelectorAll('.hero-title, .section-title, .project-card h3, .terminal-prompt span');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.decrypted) {
                    entry.target.dataset.decrypted = "true";
                    let iteration = 0;
                    const el = entry.target;
                    const originalText = el.dataset.value || el.innerText;
                    if (!el.dataset.value) el.dataset.value = originalText;
                    
                    clearInterval(el.interval);
                    
                    el.interval = setInterval(() => {
                        el.innerText = originalText
                            .split("")
                            .map((letter, index) => {
                                if(index < iteration) return originalText[index];
                                if(letter === ' ') return ' ';
                                return letters[Math.floor(Math.random() * letters.length)];
                            })
                            .join("");
                        
                        if(iteration >= originalText.length){ 
                            clearInterval(el.interval);
                        }
                        
                        iteration += 1 / 2; // Speed up decryption slightly
                    }, 30);
                }
            });
        }, { threshold: 0.1 });

        targets.forEach(target => {
            target.style.minHeight = target.offsetHeight + 'px';
            observer.observe(target);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBootSequence);
    } else {
        initBootSequence();
    }
})();
