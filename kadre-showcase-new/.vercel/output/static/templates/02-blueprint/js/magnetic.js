/**
 * Magnetic Button Effect
 * Attracts buttons towards the cursor when hovering nearby.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Only apply on fine pointer devices (desktop)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .social-icon');

    magneticElements.forEach(btn => {
        // Create an inner wrapper for the text/content to move independently
        if (!btn.querySelector('.magnetic-inner')) {
            const inner = document.createElement('span');
            inner.className = 'magnetic-inner';
            inner.style.display = 'inline-block';
            inner.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
            inner.innerHTML = btn.innerHTML;
            btn.innerHTML = '';
            btn.appendChild(inner);
            btn.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
        }

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const v = rect.height / 2;
            
            // Calculate distance from center
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - v;
            
            // Move button slightly
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            
            // Move inner content even more for parallax
            const inner = btn.querySelector('.magnetic-inner');
            if (inner) {
                inner.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            const inner = btn.querySelector('.magnetic-inner');
            if (inner) {
                inner.style.transform = 'translate(0px, 0px)';
            }
        });
    });
});
