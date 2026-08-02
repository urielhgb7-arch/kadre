
// ==========================================
// ULTIMATE GLASS & LIGHT TRAILS
// ==========================================
(function() {
    function initUltimateGlass() {
        // Load custom CMS variables for metal and glass
        try {
            const conf = JSON.parse(localStorage.getItem('portfolio_custom_config_v4'));
            if (conf && conf.theme) {
                if (conf.theme.metalSpeed) document.documentElement.style.setProperty('--metal-speed', conf.theme.metalSpeed + 's');
                if (conf.theme.glassOpacity !== undefined) document.documentElement.style.setProperty('--glass-opacity', conf.theme.glassOpacity);
            }
        } catch(e) {}
    
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // 1. Light Trails Canvas
        const canvas = document.getElementById('light-trail');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width, height;
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: width/2, y: height/2 };
        let puddleX = width/2;
        let puddleY = height/2;

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function renderTrails() {
            ctx.clearRect(0, 0, width, height);
            
            // Fluid LERP (delay) for the puddle
            puddleX += (mouse.x - puddleX) * 0.05;
            puddleY += (mouse.y - puddleY) * 0.05;

            // Draw puddle of light
            const rootStyles = getComputedStyle(document.documentElement);
            const accentColor = rootStyles.getPropertyValue('--accent-primary').trim() || '#a8c0ff';
            
            const radius = 150;
            const gradient = ctx.createRadialGradient(puddleX, puddleY, 0, puddleX, puddleY, radius);
            
            // Need to convert hex to rgba for gradient transparency
            function hexToRgba(hex, alpha) {
                const r = parseInt(hex.slice(1, 3), 16) || 168;
                const g = parseInt(hex.slice(3, 5), 16) || 192;
                const b = parseInt(hex.slice(5, 7), 16) || 255;
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }

            gradient.addColorStop(0, hexToRgba(accentColor, 0.4));
            gradient.addColorStop(0.5, hexToRgba(accentColor, 0.1));
            gradient.addColorStop(1, hexToRgba(accentColor, 0));

            ctx.globalCompositeOperation = document.documentElement.getAttribute('data-theme-mode') === 'light' ? 'multiply' : 'screen';
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(puddleX, puddleY, radius, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(renderTrails);
        }
        renderTrails();

        // 2. Liquid Metal Cursor Tracker
        const cursor = document.getElementById('liquid-cursor');
        if (cursor) {
            document.addEventListener('mousemove', (e) => {
                // Using transform for performance, matching mouse exactly
                cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            });
            
            // Interactive states
            const interactables = document.querySelectorAll('a, button, .btn');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUltimateGlass);
    } else {
        initUltimateGlass();
    }
})();
