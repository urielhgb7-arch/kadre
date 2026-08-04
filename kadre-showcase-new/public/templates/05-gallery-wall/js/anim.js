
document.addEventListener('DOMContentLoaded', () => { initLenis(); initGalleryWall(); });
function initLenis() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ duration: 1.2, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        if (typeof gsap !== 'undefined') { gsap.ticker.add((time) => lenis.raf(time * 1000)); gsap.ticker.lagSmoothing(0); }
    }
}
function initGalleryWall() {
    const rootStyles = getComputedStyle(document.documentElement);
    
    // Dynamic BG
    const showBg = rootStyles.getPropertyValue('--gallery-bg').trim() !== 'false';
    const bgEl = document.getElementById('gallery-bg-texture');
    if (bgEl && showBg) bgEl.style.opacity = '1';
    
    // Layout
    const isHorizontal = rootStyles.getPropertyValue('--gallery-layout').trim() !== 'false';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const container = document.querySelector('.page-content');
    const sections = gsap.utils.toArray('.page-content > section');
    
    if (container && sections.length > 1 && isHorizontal) {
        // Enforce Flexbox for horizontal layout
        container.style.display = 'flex';
        container.style.flexWrap = 'nowrap';
        container.style.width = `${sections.length * 100}vw`;
        container.style.overflow = 'hidden'; // Hide overflow so scrollbar doesn't appear on container
        
        // Make each section take up exactly one viewport width
        sections.forEach(sec => {
            sec.style.boxSizing = 'border-box'; // Extremely important for padding + 100vw
            sec.style.width = '100vw';
            sec.style.flex = '0 0 100vw'; // Prevent shrinking/growing
            sec.style.height = '100vh';
            sec.style.overflowY = 'auto'; // Allow vertical scroll inside each section if content is tall
            sec.style.padding = '120px 5vw 50px 5vw'; // Add padding accounting for header
            
            // Remove the default fade-in-up classes that might conflict with layout
            sec.classList.remove('fade-in-up', 'delay-1', 'delay-2', 'delay-3');
            sec.style.opacity = '1'; 
            sec.style.transform = 'none';
        });

        // Add smooth horizontal translation
        gsap.to(sections, {
            id: "horizontal-tween",
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: container,
                pin: true,           // Pin the container in place
                scrub: 1,            // Smooth scrubbing (takes 1 second to catch up)
                end: () => "+=" + container.offsetWidth // Scroll distance equals container width
            }
        });
        
        // Add a smooth fade-in for the contents of each section as they come into view horizontally
        sections.forEach((sec, i) => {
            if (i === 0) return; // Skip first section (already visible)
            gsap.from(sec.children, {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sec,
                    containerAnimation: gsap.getById("horizontal-tween") || null, // Link to horizontal tween if possible
                    start: "left center", // When the left of the section hits the center of the viewport
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
}
