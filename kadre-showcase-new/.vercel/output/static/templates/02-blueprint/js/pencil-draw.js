
(function() {
    function initPencil() {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'pencil-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let w, h;
        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
        let prevMouse = { x: -1000, y: -1000 };
        let points = [];
        const MAX_POINTS = 40; // How long the trail is

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function render() {
            ctx.clearRect(0, 0, w, h);

            if (mouse.x !== -1000) {
                const vx = mouse.x - prevMouse.x;
                const vy = mouse.y - prevMouse.y;
                points.push({ x: mouse.x, y: mouse.y, vx: vx, vy: vy });
                if (points.length > MAX_POINTS) {
                    points.shift();
                }
                prevMouse.x = mouse.x;
                prevMouse.y = mouse.y;
            }

            if (points.length > 2) {
                const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#2962ff';
                
                // Diffuse overlapping glowing strokes
                const strands = 8;
                
                // Configure glow/diffusion
                ctx.shadowColor = accent;
                ctx.shadowBlur = 30; // heavy blur for diffusion
                
                for (let s = 0; s < strands; s++) {
                    ctx.beginPath();
                    
                    const offsetMult = (s - strands/2) * 2; 
                    
                    for (let i = 1; i < points.length; i++) {
                        const p = points[i];
                        const prevP = points[i-1];
                        
                        const speed = Math.hypot(p.vx, p.vy);
                        // Thicker when slow, thinner when fast (fluid pen dynamics)
                        const thickness = Math.max(0.5, 20 - speed * 0.15); 
                        
                        let nx = -p.vy;
                        let ny = p.vx;
                        const len = Math.hypot(nx, ny);
                        if (len > 0) { nx /= len; ny /= len; } else { nx = 0; ny = 1; }
                        
                        const ox = nx * thickness * (offsetMult / strands);
                        const oy = ny * thickness * (offsetMult / strands);
                        
                        const targetX = p.x + ox;
                        const targetY = p.y + oy;
                        
                        if (i === 1) {
                            ctx.moveTo(targetX, targetY);
                        } else {
                            const xc = (prevP.x + targetX) / 2;
                            const yc = (prevP.y + targetY) / 2;
                            ctx.quadraticCurveTo(prevP.x, prevP.y, xc, yc);
                        }
                    }
                    
                    ctx.strokeStyle = accent;
                    // Outer strands are thicker and more transparent, inner strands are thinner and opaque
                    ctx.lineWidth = Math.abs(strands/2 - s) * 1.5 + 1;
                    
                    // Diffusion alpha curve
                    ctx.globalAlpha = 0.08 + (0.3 / (Math.abs(s - strands/2) + 1)); 
                    
                    ctx.globalCompositeOperation = document.documentElement.getAttribute('data-theme-mode') === 'light' ? 'multiply' : 'screen';
                    
                    ctx.stroke();
                }
                
                // Reset shadow for next frame to avoid bleeding
                ctx.shadowBlur = 0;
            }

            requestAnimationFrame(render);
        }
        render();

        // SVG Pencil Cursor
        const svgCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%232962ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
        const style = document.createElement('style');
        style.innerHTML = `
            body, a, button, .nav-link, .btn {
                cursor: url('${svgCursor}') 2 20, auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPencil);
    } else {
        initPencil();
    }
})();
