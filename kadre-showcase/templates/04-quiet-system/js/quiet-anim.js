// Quiet System - Subtle Wahoo Animations

document.addEventListener('DOMContentLoaded', () => {
    // 1. Magnetic Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        let posX = 0, posY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            posX = e.clientX;
            posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        });

        function animateOutline() {
            // Easing for the outline
            outlineX += (posX - outlineX) * 0.15;
            outlineY += (posY - outlineY) * 0.15;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover effects
        const interactiveEls = document.querySelectorAll('a, button, .project-card, .skill-tag');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.backgroundColor = 'rgba(117, 146, 128, 0.1)'; // Sage green translucent
                cursorOutline.style.borderColor = 'transparent';
                cursorDot.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '36px';
                cursorOutline.style.height = '36px';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.borderColor = 'var(--accent-primary)';
                cursorDot.style.opacity = '1';
            });
        });
    }

    // 2. Subtle 3D Tilt for Project Cards
    // Observe DOM mutations to apply tilt to dynamically injected projects
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const newCards = document.querySelectorAll('.project-card:not(.tilt-applied)');
                if (newCards.length > 0 && typeof VanillaTilt !== 'undefined') {
                    VanillaTilt.init(newCards, {
                        max: 5,               // Very subtle tilt
                        speed: 800,           // Smooth
                        glare: true,
                        "max-glare": 0.1,     // Barely visible glare
                        scale: 1.01           // Tiny lift
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
