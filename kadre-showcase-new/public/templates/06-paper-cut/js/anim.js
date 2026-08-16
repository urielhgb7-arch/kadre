document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initPaperCut();
    initParallax();
    initFoldedNav();
    initSecretCMS();
});

function initLenis() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ duration: 1.2, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }
}

function initPaperCut() {
    const rootStyles = getComputedStyle(document.documentElement);
    // Depth (Box Shadows)
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        // card logic if needed
    });
}

function initParallax() {
    const hero = document.getElementById('hero-parallax');
    if (!hero) return;

    const layers = hero.querySelectorAll('.layer, .layer-text');

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 100;
        const y = (window.innerHeight / 2 - e.pageY) / 100;

        layers.forEach((layer) => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0.5;
            // Reverse direction for foreground elements for stronger parallax
            const dir = depth > 0.8 ? -1 : 1; 
            layer.style.transform = `translate(${x * depth * dir * 20}px, ${y * depth * dir * 20}px)`;
        });
    });
}

function initFoldedNav() {
    const trigger = document.getElementById('nav-trigger');
    const menu = document.getElementById('nav-menu');
    
    if (trigger && menu) {
        trigger.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
        
        // Close menu on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
            });
        });
    }
}

function initSecretCMS() {
    const trigger = document.getElementById('cms-secret-trigger');
    if (trigger) {
        trigger.addEventListener('dblclick', () => {
            if (typeof window.showLoginModal === 'function') {
                window.showLoginModal();
            } else {
                console.log("CMS Auth Module not loaded or showLoginModal not found.");
                // Fallback check
                const authModal = document.getElementById('auth-modal');
                if(authModal) {
                    authModal.style.display = 'flex';
                }
            }
        });
    }
}
