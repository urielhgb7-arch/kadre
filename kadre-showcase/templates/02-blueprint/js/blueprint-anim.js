/**
 * 02 - BLUEPRINT: CANVAS ANIMATION & SMOOTH SCROLL (ISOMETRIC 3D + HOUSE PLAN)
 * REFACTORED: Object-Oriented Deep Module
 */

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    
    const canvas = document.getElementById('blueprint-canvas');
    if (canvas) {
        const rootStyles = getComputedStyle(document.documentElement);
        const blueprint = new IsometricBlueprint(canvas, {
            gridColor: rootStyles.getPropertyValue('--blueprint-grid-color').trim() || '#FFA726',
            glowColor: rootStyles.getPropertyValue('--neon-glow-color').trim() || 'rgba(255, 255, 255, 0.8)',
            showLights: rootStyles.getPropertyValue('--blueprint-lights').trim() !== 'false',
            numLights: 100,
            gridSize: 60,
            majorGridSize: 300
        });
        blueprint.start();

        // Update scroll position dynamically
        window.addEventListener('scroll', () => {
            blueprint.setScrollY(window.scrollY);
        });
    }
});

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
    }
}

/**
 * Deep Module: Encapsulates all isometric rendering logic behind a simple interface.
 */
class IsometricBlueprint {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = Object.assign({
            gridColor: '#FFA726',
            glowColor: 'rgba(255, 255, 255, 0.8)',
            showLights: true,
            numLights: 100,
            gridSize: 60,
            majorGridSize: 300
        }, config);

        this.scrollY = 0;
        this.lights = [];
        this.width = 0;
        this.height = 0;
        this.isRunning = false;

        this._initCanvasStyles();
        this._bindEvents();
        this.resize();
        this._initLights();
    }

    _initCanvasStyles() {
        this.canvas.style.zIndex = '0';
        this.canvas.style.transform = 'none';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';

        const navbar = document.querySelector('.navbar');
        if (navbar) { navbar.style.position = 'relative'; navbar.style.zIndex = '10'; }
        const pageContent = document.querySelector('.page-content');
        if (pageContent) { pageContent.style.position = 'relative'; pageContent.style.zIndex = '10'; }
    }

    _bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this._initLights();
        });
    }

    _initLights() {
        this.lights = [];
        const drawSize = Math.max(this.width, this.height) * 3;
        const linesCount = Math.ceil(drawSize / this.config.gridSize);
        
        for (let i = 0; i < this.config.numLights; i++) {
            const isHorizontal = i < this.config.numLights / 2;
            this.lights.push({
                horizontal: isHorizontal,
                lineIndex: Math.floor(Math.random() * linesCount) - Math.floor(linesCount / 2),
                linePos: (Math.random() - 0.5) * drawSize,
                speed: (0.8 + Math.random() * 2.0) * (Math.random() > 0.5 ? 1 : -1),
                length: 15 + Math.random() * 30
            });
        }
    }

    // --- Public API ---

    setScrollY(y) {
        this.scrollY = y;
    }

    resize(w = window.innerWidth, h = window.innerHeight) {
        this.width = w;
        this.height = h;
        this.canvas.width = w;
        this.canvas.height = h;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._renderLoop();
    }

    stop() {
        this.isRunning = false;
    }

    // --- Utilities ---

    _colorWithAlpha(color, alpha) {
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
        };

        const rgbaMatch = color.match(/rgba?\(([^)]+)\)/);
        if (rgbaMatch) {
            const parts = rgbaMatch[1].split(',').map(s => s.trim());
            return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
        }
        const rgb = hexToRgb(color);
        if (rgb) return `rgba(${rgb}, ${alpha})`;
        return color;
    }

    // --- Rendering ---
    _applyDistortion(x, y, mx, my) {
        if (mx === -1000) return { x, y };
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.hypot(dx, dy);
        const radius = 600; 
        if (dist < radius && dist > 1) {
            const force = Math.pow((radius - dist) / radius, 2);
            const push = force * 150; // Max displacement
            return { x: x + (dx / dist) * push, y: y + (dy / dist) * push };
        }
        return { x, y };
    }


    _drawHousePlan(ox, oy, gridColor) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(ox, oy);
        
        const wallColor = this._colorWithAlpha(gridColor, 0.6);
        const doubleWallColor = this._colorWithAlpha(gridColor, 0.4);
        
        ctx.strokeStyle = wallColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'square';

        ctx.strokeRect(-300, -240, 600, 480);
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = doubleWallColor;
        ctx.strokeRect(-306, -246, 612, 492); 

        ctx.strokeStyle = wallColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-60, -240); ctx.lineTo(-60, 240);
        ctx.moveTo(60, -240); ctx.lineTo(60, 240);
        ctx.moveTo(-300, 0); ctx.lineTo(-60, 0);
        ctx.moveTo(60, -60); ctx.lineTo(300, -60);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this._colorWithAlpha(gridColor, 0.5);
        ctx.beginPath();
        ctx.moveTo(-60, 40); ctx.lineTo(-100, 40);
        ctx.arc(-60, 40, 40, Math.PI, Math.PI*1.5);
        ctx.moveTo(60, -20); ctx.lineTo(100, -20);
        ctx.arc(60, -20, 40, Math.PI*1.5, Math.PI*2);
        ctx.moveTo(-20, 240); ctx.lineTo(-20, 280);
        ctx.arc(-20, 240, 40, Math.PI*0.5, 0, true);
        ctx.stroke();
        
        ctx.fillStyle = this._colorWithAlpha(gridColor, 0.75);
        ctx.font = '16px "Space Grotesk", monospace';
        ctx.fillText('LIVING AREA', -260, 100);
        ctx.font = '12px "Space Grotesk", monospace';
        ctx.fillText('32.0 SQ M', -260, 120);
        
        ctx.font = '16px "Space Grotesk", monospace';
        ctx.fillText('MASTER BDRM', -260, -120);
        ctx.font = '12px "Space Grotesk", monospace';
        ctx.fillText('24.5 SQ M', -260, -100);
        
        ctx.font = '16px "Space Grotesk", monospace';
        ctx.fillText('KITCHEN', 100, 80);
        ctx.font = '16px "Space Grotesk", monospace';
        ctx.fillText('BATH', 100, -140);
        
        ctx.restore();
    }

    _drawHUD(gridColor) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = this._colorWithAlpha(gridColor, 0.35);
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, this.width - 60, this.height - 60);

        const tbX = this.width - 290;
        const tbY = this.height - 130;
        ctx.fillStyle = this._colorWithAlpha(gridColor, 0.05);
        ctx.fillRect(tbX, tbY, 260, 100);
        ctx.strokeRect(tbX, tbY, 260, 100);
        ctx.strokeRect(tbX + 5, tbY + 5, 250, 25);
        ctx.font = '12px "Space Grotesk", monospace';
        ctx.fillStyle = this._colorWithAlpha(gridColor, 0.8);
        ctx.fillText('PROJECT: PORTFOLIO', tbX + 15, tbY + 22);
        ctx.fillText('SCALE: 1:1', tbX + 15, tbY + 50);
        ctx.fillText('DATE: 2026', tbX + 15, tbY + 70);
        ctx.fillText('REV: A', tbX + 15, tbY + 90);

        const cx = 80, cy = 80;
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 40); ctx.lineTo(cx, cy + 40);
        ctx.moveTo(cx - 40, cy); ctx.lineTo(cx + 40, cy);
        ctx.stroke();
        ctx.font = 'bold 14px "Space Grotesk", monospace';
        ctx.fillText('N', cx - 5, cy - 45);

        ctx.restore();
    }

    _drawGridLines(start, end, gridRgba, majorRgba, mx, my) {
        const ctx = this.ctx;
        
        // Minor grid
        ctx.beginPath();
        ctx.strokeStyle = gridRgba;
        ctx.lineWidth = 1;
        for (let x = start; x <= end; x += this.config.gridSize) { 
            let p = this._applyDistortion(x, start, mx, my);
            ctx.moveTo(p.x, p.y);
            for (let y = start + this.config.gridSize; y <= end; y += this.config.gridSize) {
                p = this._applyDistortion(x, y, mx, my);
                ctx.lineTo(p.x, p.y);
            }
        }
        for (let y = start; y <= end; y += this.config.gridSize) { 
            let p = this._applyDistortion(start, y, mx, my);
            ctx.moveTo(p.x, p.y);
            for (let x = start + this.config.gridSize; x <= end; x += this.config.gridSize) {
                p = this._applyDistortion(x, y, mx, my);
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();
        
        // Major grid
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = majorRgba; 
        for (let x = start; x <= end; x += this.config.majorGridSize) { 
            let p = this._applyDistortion(x, start, mx, my);
            ctx.moveTo(p.x, p.y);
            for (let y = start + this.config.gridSize; y <= end; y += this.config.gridSize) {
                p = this._applyDistortion(x, y, mx, my);
                ctx.lineTo(p.x, p.y);
            }
        }
        for (let y = start; y <= end; y += this.config.majorGridSize) { 
            let p = this._applyDistortion(start, y, mx, my);
            ctx.moveTo(p.x, p.y);
            for (let x = start + this.config.gridSize; x <= end; x += this.config.gridSize) {
                p = this._applyDistortion(x, y, mx, my);
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();
    }

    _renderLoop() {
        if (!this.isRunning) return;
        
        if (this.timeOffset === undefined) this.timeOffset = 0;
        this.timeOffset += 1.0; // Vitesse du pan continu

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        
        const gridColor = this.config.gridColor;
        const gridRgba = this._colorWithAlpha(gridColor, 0.15);
        const majorRgba = this._colorWithAlpha(gridColor, 0.3);
        const lightWhite = 'rgba(255, 255, 255, 1)';
        
        // Oblique pan looping over tileSize (1200)
        const panX = (this.timeOffset * 0.8) % 1200;
        const panY = this.timeOffset % 1200;
        
        ctx.save();
        const moveY = (this.scrollY * 0.8) + panY;
        const moveX = panX;
        
        ctx.translate(this.width / 2 + moveX, this.height / 2 + moveY);
        ctx.scale(1, 0.5);
        ctx.rotate(45 * Math.PI / 180);
        
        const drawSize = Math.max(this.width, this.height) * 3;
        const start = -drawSize / 2;
        const end = drawSize / 2;
        
        const tileSize = 1200;
        const startTileX = Math.floor(start / tileSize) * tileSize;
        const startTileY = Math.floor(start / tileSize) * tileSize;
        
        for (let tx = startTileX; tx <= end; tx += tileSize) {
            for (let ty = startTileY; ty <= end; ty += tileSize) {
                this._drawHousePlan(tx, ty, gridColor);
            }
        }
        
        
        // Inverse transform mouse position to grid space
        const ux = this.mouseX - (this.width / 2 + moveX);
        const uy = this.mouseY - (this.height / 2 + moveY);
        const uy2 = uy * 2; // inverse scale
        // inverse rotation (-45 deg)
        const cos = 0.70710678;
        const sin = -0.70710678;
        const mx = ux * cos - uy2 * sin;
        const my = ux * sin + uy2 * cos;
        
        this._drawGridLines(start, end, gridRgba, majorRgba, mx, my);

        if (this.config.showLights) {
            this.lights.forEach(l => {
                l.linePos += l.speed;
                if (l.linePos > end) l.linePos = start;
                if (l.linePos < start) l.linePos = end;

                const pos = l.linePos;
                const halfLen = l.length / 2;
                
                ctx.save();
                ctx.shadowColor = this.config.glowColor;
                ctx.shadowBlur = 10;

                if (l.horizontal) {
                    const y = Math.round(l.lineIndex) * this.config.gridSize;
                    if (y >= start && y <= end) {
                        const grad = ctx.createLinearGradient(pos - halfLen, y, pos + halfLen, y);
                        grad.addColorStop(0, 'rgba(255,255,255,0)');
                        grad.addColorStop(0.3, lightWhite);
                        grad.addColorStop(0.7, lightWhite);
                        grad.addColorStop(1, 'rgba(255,255,255,0)');
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(pos - halfLen, y);
                        ctx.lineTo(pos + halfLen, y);
                        ctx.stroke();
                    }
                } else {
                    const x = Math.round(l.lineIndex) * this.config.gridSize;
                    if (x >= start && x <= end) {
                        const grad = ctx.createLinearGradient(x, pos - halfLen, x, pos + halfLen);
                        grad.addColorStop(0, 'rgba(255,255,255,0)');
                        grad.addColorStop(0.3, lightWhite);
                        grad.addColorStop(0.7, lightWhite);
                        grad.addColorStop(1, 'rgba(255,255,255,0)');
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(x, pos - halfLen);
                        ctx.lineTo(x, pos + halfLen);
                        ctx.stroke();
                    }
                }
                ctx.restore();
            });
        }
        
        ctx.restore(); 
        this._drawHUD(gridColor);
        
        requestAnimationFrame(() => this._renderLoop());
    }
}
