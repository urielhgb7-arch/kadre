
// ==========================================
// HACKER TEXT DECRYPT ANIMATION
// ==========================================
(function() {
    function initHackerText() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
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
                        
                        iteration += 1 / 3; // Speed of decryption
                    }, 30);
                }
            });
        }, { threshold: 0.1 });

        targets.forEach(target => {
            // Fix height/width to prevent layout shift during scramble
            target.style.minHeight = target.offsetHeight + 'px';
            observer.observe(target);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHackerText);
    } else {
        initHackerText();
    }
})();
