
// ==========================================
// MONSTER EFFECTS (MAGNETIC, GLOW, 3D SCROLL)
// ==========================================
(function() {
    function initMonsterEffects() {
        // 1. Cursor Glow
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        // Track mouse globally
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                glow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
            });
        });

        // 2. Magnetic Elements
        const magneticElements = document.querySelectorAll('.btn, .nav-link, .social-link, .hero-btn');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate(0px, 0px)`;
            });
            // Ensure smooth transition back
            el.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s, color 0.3s';
        });

        // 3. 3D Scroll Parallax
        const parallaxElements = document.querySelectorAll('.project-card, .feature-card, .glass-card');
        function handleScroll() {
            const windowCenter = window.innerHeight / 2;
            parallaxElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const elCenter = rect.top + rect.height / 2;
                // Calculate distance from center (-1 to 1)
                const dist = (elCenter - windowCenter) / window.innerHeight;
                // Clamp it
                const clampedDist = Math.max(-1, Math.min(1, dist));
                // Rotate X based on distance
                const rotateX = clampedDist * -15; // Max 15 degrees
                el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) translateY(${clampedDist * 20}px)`;
                el.style.transition = 'transform 0.1s linear';
            });
        }
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleScroll);
        });
        // Init once
        handleScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMonsterEffects);
    } else {
        initMonsterEffects();
    }
})();
