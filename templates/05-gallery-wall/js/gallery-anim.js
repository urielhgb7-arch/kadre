// Gallery Wall - Editorial Wahoo Animations

document.addEventListener('DOMContentLoaded', () => {
    // 1. Blend Mode Inverse Cursor
    const cursor = document.getElementById('gallery-cursor');

    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        let posX = 0, posY = 0;
        let cursorX = 0, cursorY = 0;

        window.addEventListener('mousemove', (e) => {
            posX = e.clientX;
            posY = e.clientY;
        });

        function animateCursor() {
            // Very snappy easing for the single dot
            cursorX += (posX - cursorX) * 0.3;
            cursorY += (posY - cursorY) * 0.3;
            
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects (grow on interactive elements)
        const interactiveEls = document.querySelectorAll('a, button, .project-card, .skill-tag');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '64px';
                cursor.style.height = '64px';
                cursor.style.backgroundColor = '#FFFFFF'; // Pure white to ensure difference mode inverses perfectly
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '16px';
                cursor.style.height = '16px';
                cursor.style.backgroundColor = 'var(--text-primary)';
            });
        });
    }

    // 2. Art Gallery Tilt for Project Cards
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const newCards = document.querySelectorAll('.project-card:not(.tilt-applied)');
                if (newCards.length > 0 && typeof VanillaTilt !== 'undefined') {
                    VanillaTilt.init(newCards, {
                        max: 8,               // Like looking at a canvas
                        speed: 1000,          // Very smooth and slow
                        glare: true,
                        "max-glare": 0.15,    // Glass reflection
                        scale: 1.02           // Subtle zoom
                    });
                    newCards.forEach(c => c.classList.add('tilt-applied'));
                }
            }
        });
    });

    const projectsContainer = document.getElementById('projects-preview') || document.getElementById('projects-container');
    if (projectsContainer) {
        observer.observe(projectsContainer, { childList: true, subtree: true });
    }
});
