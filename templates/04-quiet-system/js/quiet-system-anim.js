/**
 * 04 - QUIET SYSTEM: TYPOGRAPHY REVEAL & MAGNETIC CURSOR
 */

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initQuietParticles();
    initCustomCursor();
    initQuietAnimations();
});

// ==========================================
// LENIS SMOOTH SCROLL
// ==========================================
function initLenis() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.5, // Even smoother for quiet system
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.ticker.add((time)=>{
              lenis.raf(time * 1000)
            });
            gsap.ticker.lagSmoothing(0);
        }
    }
}

// ==========================================
// CUSTOM MAGNETIC CURSOR
// ==========================================
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow
    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Magnetic effect on links and buttons
    const hoverElements = document.querySelectorAll('a, button, .project-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.background = 'rgba(22, 163, 74, 0.1)';
            cursor.style.border = '1px solid rgba(22, 163, 74, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'rgba(22, 163, 74, 0.5)';
            cursor.style.border = 'none';
        });
    });
}

// ==========================================
// CANVAS PARTICLES BACKGROUND
// ==========================================
function initQuietParticles() {
    const canvas = document.getElementById('quiet-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.5 + 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const rootStyles = getComputedStyle(document.documentElement);
        const gColor = rootStyles.getPropertyValue('--grain-color').trim() || '#ffffff';
        const gIntens = parseFloat(rootStyles.getPropertyValue('--grain-intensity').trim()) || 0.05;
        
        ctx.fillStyle = gColor; 
        ctx.strokeStyle = gColor; 
        ctx.globalAlpha = gIntens * 5; // scaled for visibility

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==========================================
// TYPOGRAPHY REVEAL & HOVER (GSAP)
// ==========================================
function initQuietAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Title reveal on scroll
    const titles = document.querySelectorAll('h1, h2');
    const rootStyles = getComputedStyle(document.documentElement);
    const blurIntro = parseInt(rootStyles.getPropertyValue('--blur-intro').trim()) || 10;
    
    titles.forEach(title => {
        gsap.fromTo(title, 
            { opacity: 0, y: 50, filter: `blur(${blurIntro}px)` },
            { 
                opacity: 1, 
                y: 0, 
                filter: 'blur(0px)',
                duration: 1, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                }
            }
        );

        // Interactive font weight on hover (CSS handles transition, we just add class)
        title.addEventListener('mouseenter', () => {
            title.style.transition = 'font-weight 0.3s, letter-spacing 0.3s';
            title.style.fontWeight = '700';
            title.style.letterSpacing = '1px';
        });
        title.addEventListener('mouseleave', () => {
            title.style.fontWeight = '';
            title.style.letterSpacing = '';
        });
    });
}
