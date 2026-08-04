/**
 * 03 - MOTION STACK: 3D HOVERS & SCROLL TRIGGERED MOTION
 */

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initMotionStack();
    initMorphingText();
    initGradientMesh();
    initCardStack();
    initTechMarquee();
});

// ==========================================
// LENIS SMOOTH SCROLL
// ==========================================
function initLenis() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
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
// MOTION STACK ANIMATIONS
// ==========================================
function initMotionStack() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Generative Background Blobs Parallax
    const rootStyles = getComputedStyle(document.documentElement);
    const stackDir = parseFloat(rootStyles.getPropertyValue('--stack-dir').trim()) || 1;
    
    gsap.to('.blob-1', {
        yPercent: 50 * stackDir,
        xPercent: 30 * stackDir,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 }
    });
    gsap.to('.blob-2', {
        yPercent: -50 * stackDir,
        xPercent: -30 * stackDir,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 }
    });

    // 1.5 Skew on scroll effect for premium dynamic feel
    let skewProxy = { skew: 0 };
    let skewSetter = gsap.quickSetter(".project-card, .feat-image-wrap, .skill-tag", "skewY", "deg");
    let clamp = gsap.utils.clamp(-6, 6); // Subtle skew
    
    ScrollTrigger.create({
        onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -400);
            if (Math.abs(skew) > Math.abs(skewProxy.skew)) {
                skewProxy.skew = skew;
                gsap.to(skewProxy, {
                    skew: 0, 
                    duration: 0.8, 
                    ease: "power3", 
                    overwrite: true, 
                    onUpdate: () => skewSetter(skewProxy.skew)
                });
            }
        }
    });


    // 2. 3D Hover on Cards (Cards popping out of the screen)
    const cards = document.querySelectorAll('.project-card, .terminal-block');
    cards.forEach(card => {
        // Add perspective to parent
        if (card.parentElement) {
            card.parentElement.style.perspective = '1000px';
        }
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card, {
                duration: 0.5,
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out',
                boxShadow: `${-rotateY}px ${rotateX}px 20px rgba(124, 58, 237, 0.4)`
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            });
        });
        
        // Interactive Feedback on Click (Neon burst)
        card.addEventListener('mousedown', () => {
            gsap.to(card, { 
                scale: 0.95, 
                duration: 0.1,
                boxShadow: '0 0 30px rgba(0, 240, 255, 0.8), 0 0 60px rgba(124, 58, 237, 0.6)',
                borderColor: 'rgba(0, 240, 255, 1)'
            });
        });
        card.addEventListener('mouseup', () => {
            gsap.to(card, { 
                scale: 1, 
                duration: 0.4, 
                ease: 'elastic.out(1, 0.3)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            });
        });
    });

    // 3. Levitation effect for cards (floating/sinusoidal)
    const levitation = rootStyles.getPropertyValue('--stack-levitation').trim() !== 'false';
    if (levitation) {
        const levItems = document.querySelectorAll('.project-card, .terminal-block:not(.hero-section)');
        levItems.forEach((el, i) => {
            gsap.to(el, {
                y: 8 + i * 2,
                duration: 2.5 + i * 0.3,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
                delay: i * 0.2
            });
        });
    }

    // 4. Scroll Triggered 360 Rotation for specific elements (if any icons exist)
    const icons = document.querySelectorAll('.block-icon');
    icons.forEach(icon => {
        gsap.to(icon, {
            rotation: 360 * (stackDir < 0 ? -1 : 1),
            scrollTrigger: {
                trigger: icon,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

// ==========================================
// HERO MORPHING TEXT
// ==========================================
function initMorphingText() {
    const el = document.querySelector('.morph-text');
    if (!el) return;
    const rootStyles = getComputedStyle(document.documentElement);
    const wordsRaw = rootStyles.getPropertyValue('--morph-words').trim() || '"Motion Stack","Full-Stack Dev","UI Architect","Creative Coder"';
    const words = JSON.parse(`[${wordsRaw}]`);
    if (words.length < 2) return;

    let idx = 0;
    const cycle = () => {
        idx = (idx + 1) % words.length;
        el.classList.add('morphing');
        setTimeout(() => {
            el.textContent = words[idx];
            el.classList.remove('morphing');
        }, 400);
    };
    setInterval(cycle, 3500);
}

// ==========================================
// GRADIENT MESH — Enhanced Animated Blobs
// ==========================================
function initGradientMesh() {
    const rootStyles = getComputedStyle(document.documentElement);
    const meshEnabled = rootStyles.getPropertyValue('--mesh-blob-enable').trim() !== 'false';
    if (!meshEnabled) return;
    const bg = document.getElementById('generative-bg');
    if (!bg || typeof gsap === 'undefined') return;

    // Create extra blobs for richer mesh
    const extraColors = [
        'rgba(124, 58, 237, 0.25)',  // purple
        'rgba(236, 72, 153, 0.2)',   // pink
        'rgba(0, 240, 255, 0.15)',   // cyan
        'rgba(251, 191, 36, 0.12)',  // amber
    ];
    const positions = [
        { top: '10%', left: '10%', w: 500, h: 500 },
        { top: '70%', left: '20%', w: 350, h: 350 },
        { top: '40%', left: '60%', w: 450, h: 450 },
        { top: '80%', left: '80%', w: 300, h: 300 },
    ];

    // Remove static blobs, replace with animated ones
    bg.querySelectorAll('.blob').forEach(b => b.remove());

    const blobs = [];
    positions.forEach((pos, i) => {
        const blob = document.createElement('div');
        blob.className = 'gradient-blob';
        Object.assign(blob.style, {
            top: pos.top, left: pos.left,
            width: pos.w + 'px', height: pos.h + 'px',
            background: extraColors[i % extraColors.length],
        });
        bg.appendChild(blob);
        blobs.push(blob);

        // Fade in after append
        requestAnimationFrame(() => blob.classList.add('active'));

        // Continuous floating animation
        gsap.to(blob, {
            x: () => gsap.utils.random(-80, 80),
            y: () => gsap.utils.random(-60, 60),
            scale: 1.2,
            duration: 6 + i * 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.8,
        });
    });

    // Scroll-reactive parallax for the mesh container
    gsap.to(bg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
        }
    });
}

// ==========================================
// 3D CARD STACK SCROLL
// ==========================================
function initCardStack() {
    const container = document.getElementById('projects-container');
    if (!container || typeof ScrollTrigger === 'undefined') return;

    const rootStyles = getComputedStyle(document.documentElement);
    const angleStep = parseFloat(rootStyles.getPropertyValue('--card-stack-angle').trim()) || 3;
    const zStep = parseFloat(rootStyles.getPropertyValue('--card-stack-z').trim()) || 40;

    container.classList.add('card-stack-container');
    const cards = container.querySelectorAll('.project-card');
    if (cards.length < 2) return;

    // Stack: each card is spread apart in Z, then fanned on scroll
    const total = cards.length;

    gsap.set(cards[0], { z: 0, rotationX: 0 });

    for (let i = 1; i < total; i++) {
        const zOffset = -i * zStep;
        const rotX = i * angleStep;
        gsap.set(cards[i], { z: zOffset, rotationX: rotX });
    }

    // On scroll, compress the stack (cards come together)
    ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;
            cards.forEach((card, i) => {
                if (i === 0) return;
                const zTarget = -i * zStep * (1 - progress);
                const rotTarget = i * angleStep * (1 - progress);
                gsap.to(card, {
                    z: zTarget,
                    rotationX: rotTarget,
                    duration: 0.1,
                    overwrite: 'auto',
                });
            });
        }
    });

    // Restore on leave
    ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        end: 'bottom bottom',
        onLeaveBack: () => {
            cards.forEach((card, i) => {
                if (i === 0) return;
                gsap.to(card, {
                    z: -i * zStep,
                    rotationX: i * angleStep,
                    duration: 0.4,
                });
            });
        }
    });
}

// ==========================================
// TECH STACK MARQUEE
// ==========================================
function initTechMarquee() {
    const container = document.getElementById('marquee-content');
    if (!container) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const speed = rootStyles.getPropertyValue('--marquee-speed').trim() || '30s';
    container.style.animationDuration = speed;

    const defaultItems = [
        'React', 'Node.js', 'TypeScript', 'GSAP',
        'Three.js', 'Tailwind', 'Python', 'Docker',
        'PostgreSQL', 'Figma', 'Next.js', 'Rust',
    ];

    // Get items from data attribute or use defaults
    const dataItems = container.getAttribute('data-items');
    const items = dataItems ? JSON.parse(dataItems) : defaultItems;

    // Render items twice for seamless loop
    const renderSet = (arr) => arr.map(t => `<span class="marquee-item">${t}</span>`).join('');
    container.innerHTML = renderSet(items) + renderSet(items);

    // Pause on hover
    container.addEventListener('mouseenter', () => container.classList.add('paused'));
    container.addEventListener('mouseleave', () => container.classList.remove('paused'));
}

// ==========================================
// WAHOO EFFECTS: MAGNETIC CURSOR
// ==========================================
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    
    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + "px";
        cursorDot.style.top = mouseY + "px";
        
        gsap.to(cursorOutline, {
            x: mouseX,
            y: mouseY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // Delegate events for hover states
    document.body.addEventListener("mouseover", (e) => {
        const target = e.target.closest("a, button, .project-card, .theme-btn");
        if (target) {
            gsap.to(cursorOutline, { scale: 1.5, backgroundColor: "rgba(180, 130, 255, 0.1)", duration: 0.2 });
        }
    });
    
    document.body.addEventListener("mouseout", (e) => {
        const target = e.target.closest("a, button, .project-card, .theme-btn");
        if (target) {
            gsap.to(cursorOutline, { scale: 1, backgroundColor: "transparent", duration: 0.2 });
        }
    });
}
