/**
 * 01 - TERMINAL CRAFT: MATRIX RAIN & SNAKE GAME
 * Refactored using Deep Modules & Codebase Design principles.
 */

class LenisScroll {
    constructor() {
        if (typeof Lenis !== 'undefined') {
            this.lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });
            this.raf = this.raf.bind(this);
            requestAnimationFrame(this.raf);
        }
    }
    raf(time) {
        this.lenis.raf(time);
        requestAnimationFrame(this.raf);
    }
}

class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.chars = '01';
        this.fontSize = 14;
        this.drops = [];
        this.intervalId = null;
        this.draw = this.draw.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        
        this.mouseX = -1000;
        this.mouseY = -1000;
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.start();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const columns = this.canvas.width / this.fontSize;
        if (columns > this.drops.length) {
            for (let i = this.drops.length; i < columns; i++) {
                this.drops[i] = 1;
            }
        }
    }

    draw() {
        // Obtenir la couleur de fond actuelle
        const bodyBg = getComputedStyle(document.body).getPropertyValue('--bg-primary').trim() || '#0D1117';
        // Convertir en version translucide grossièrement, ou utiliser directement rgba pour matrix
        const isLight = document.documentElement.getAttribute('data-theme-mode') === 'light';
        this.ctx.fillStyle = isLight ? 'rgba(250, 250, 250, 0.05)' : 'rgba(13, 17, 23, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const dynColor = getComputedStyle(document.documentElement).getPropertyValue('--matrix-color').trim() || '#00F0FF';
        this.ctx.fillStyle = dynColor;
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            let text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
            let color = dynColor;
            
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            const dist = Math.hypot(x - this.mouseX, y - this.mouseY);
            if (dist < 100) {
                color = '#FFFFFF';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = dynColor;
                text = '!@#$%^&*()'.charAt(Math.floor(Math.random() * 10));
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        // Glitch trail at mouse position (Liquid Code)
        if (this.mouseX > 0) {
            for (let m = 0; m < 5; m++) {
                // Snap to grid
                const col = Math.floor((this.mouseX + (Math.random() - 0.5) * 120) / this.fontSize);
                const row = Math.floor((this.mouseY + (Math.random() - 0.5) * 120) / this.fontSize);
                const mx = col * this.fontSize;
                const my = row * this.fontSize;
                
                const mtext = '!@#$%^&*()<>{}[]'.charAt(Math.floor(Math.random() * 16));
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = dynColor;
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillText(mtext, mx, my);
            }
            this.ctx.shadowBlur = 0;
        }
    }

    start() {
        if (!this.intervalId) {
            this.intervalId = setInterval(this.draw, 50);
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

class TerminalSnakeGame {
    constructor(canvasId, overlayId, scoreId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById(overlayId);
        this.scoreEl = document.getElementById(scoreId);
        
        this.gridSize = 20;
        this.snake = [];
        this.food = {};
        this.dx = this.gridSize;
        this.dy = 0;
        this.score = 0;
        this.isPlaying = false;
        this.gameLoop = null;

        this.bindEvents();
    }

    bindEvents() {
        this.overlay.addEventListener('click', () => this.start());
        this.overlay.addEventListener('touchstart', (e) => { e.preventDefault(); this.start(); }, { passive: false });
        this.overlay.addEventListener('touchend', (e) => { e.preventDefault(); }, { passive: false });
        
        document.addEventListener('keydown', (e) => {
            if (this.isPlaying && [37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
                this.handleInput(e.keyCode);
            }
        });

        // ─── CONTRÔLES TACTILES (Swipe) ───
        this.touchStart = null;
        this.canvas.addEventListener('touchstart', (e) => {
            if (!this.isPlaying) return;
            const t = e.touches[0];
            this.touchStart = { x: t.clientX, y: t.clientY };
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (!this.isPlaying || !this.touchStart) return;
            e.preventDefault();
            const t = e.touches[0];
            const dx = t.clientX - this.touchStart.x;
            const dy = t.clientY - this.touchStart.y;
            const threshold = 24;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;

            const goingUp = this.dy === -this.gridSize;
            const goingDown = this.dy === this.gridSize;
            const goingRight = this.dx === this.gridSize;
            const goingLeft = this.dx === -this.gridSize;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && !goingRight) { this.dx = this.gridSize; this.dy = 0; }
                else if (dx < 0 && !goingLeft) { this.dx = -this.gridSize; this.dy = 0; }
            } else {
                if (dy > 0 && !goingDown) { this.dx = 0; this.dy = this.gridSize; }
                else if (dy < 0 && !goingUp) { this.dx = 0; this.dy = -this.gridSize; }
            }
            this.touchStart = { x: t.clientX, y: t.clientY };
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => { this.touchStart = null; }, { passive: true });

        // ─── BOUTONS D-PAD (Écran tactile) ───
        document.querySelectorAll('[data-snake-dir]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const map = { up: 38, down: 40, left: 37, right: 39 };
                if (this.isPlaying) this.handleInput(map[btn.dataset.snakeDir]);
            });
        });
    }

    handleInput(keyCode) {
        const goingUp = this.dy === -this.gridSize;
        const goingDown = this.dy === this.gridSize;
        const goingRight = this.dx === this.gridSize;
        const goingLeft = this.dx === -this.gridSize;

        if (keyCode === 37 && !goingRight) { this.dx = -this.gridSize; this.dy = 0; }
        if (keyCode === 38 && !goingDown) { this.dx = 0; this.dy = -this.gridSize; }
        if (keyCode === 39 && !goingLeft) { this.dx = this.gridSize; this.dy = 0; }
        if (keyCode === 40 && !goingUp) { this.dx = 0; this.dy = this.gridSize; }
    }

    reset() {
        this.snake = [
            { x: 160, y: 140 },
            { x: 140, y: 140 },
            { x: 120, y: 140 }
        ];
        this.dx = this.gridSize;
        this.dy = 0;
        this.score = 0;
        this.scoreEl.innerText = `SCORE: ${this.score}`;
        this.spawnFood();
    }

    spawnFood() {
        this.food.x = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
        this.food.y = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
        
        for (let part of this.snake) {
            if (part.x === this.food.x && part.y === this.food.y) {
                return this.spawnFood();
            }
        }
    }

    clearCanvas() {
        const isLight = document.documentElement.getAttribute('data-theme-mode') === 'light';
        this.ctx.fillStyle = isLight ? '#FAFAFA' : '#0D1117';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSnake() {
        const customChar = getComputedStyle(document.documentElement).getPropertyValue('--snake-char').trim();
        this.snake.forEach((part, index) => {
            this.ctx.fillStyle = index === 0 ? '#58A6FF' : '#3FB950';
            if (customChar && customChar.length > 0) {
                this.ctx.font = (this.gridSize - 2) + "px monospace";
                this.ctx.fillText(customChar.charAt(0), part.x, part.y + this.gridSize - 4);
            } else {
                this.ctx.fillRect(part.x, part.y, this.gridSize - 2, this.gridSize - 2);
            }
        });
    }

    drawFood() {
        this.ctx.fillStyle = '#FF5F56';
        this.ctx.fillRect(this.food.x, this.food.y, this.gridSize - 2, this.gridSize - 2);
    }

    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreEl.innerText = `SCORE: ${this.score}`;
            this.spawnFood();
        } else {
            this.snake.pop();
        }
    }

    checkCollision() {
        const head = this.snake[0];
        if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height) return true;
        for (let i = 4; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) return true;
        }
        return false;
    }

    update() {
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }
        this.clearCanvas();
        this.drawFood();
        this.moveSnake();
        this.drawSnake();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.isPlaying = false;
        this.overlay.style.display = 'block';
        this.overlay.innerText = '$ GAME_OVER / RESTART';
    }

    start() {
        this.overlay.style.display = 'none';
        this.isPlaying = true;
        this.reset();
        clearInterval(this.gameLoop);
        const dynSpeed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--snake-speed').trim()) || 80;
        this.gameLoop = setInterval(() => this.update(), dynSpeed);
    }

    init() {
        this.clearCanvas();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LenisScroll();
    new MatrixRain('matrix-bg');
    const snakeGame = new TerminalSnakeGame('snake-canvas', 'snake-overlay', 'snake-score');
    if (snakeGame.canvas) snakeGame.init();
});
