
// ==========================================
// TERMINAL CRAFT AI COMPANION (DESIGN MONSTER)
// ==========================================
class TerminalAI {
    constructor() {
        this.introPlayed = sessionStorage.getItem('ai_intro_played') === 'true';
        this.userName = "l'Administrateur";
        this.dialogQueue = [];
        this.isTyping = false;
        
        this.initDOM();
        this.fetchName().then(() => {
            if (!this.introPlayed) {
                this.playCinematic();
            } else {
                this.setupPersistent();
            }
        });
    }

    async fetchName() {
        try {
            if (window.getPortfolioDataAsync) {
                const data = await window.getPortfolioDataAsync({});
                if (data && data.hero && data.hero.name) {
                    this.userName = data.hero.name;
                }
            }
        } catch (e) { console.error(e); }
    }

    initDOM() {
        // Overlay for intro
        this.overlay = document.createElement('div');
        this.overlay.className = 'ai-overlay hidden';
        
        this.skipBtn = document.createElement('button');
        this.skipBtn.className = 'ai-skip-btn';
        this.skipBtn.innerText = 'Passer [ESC]';
        this.skipBtn.onclick = () => this.endCinematic();
        this.overlay.appendChild(this.skipBtn);
        
        document.body.appendChild(this.overlay);

        // AI Container
        this.container = document.createElement('div');
        this.container.className = 'ai-container';
        
        this.orb = document.createElement('div');
        this.orb.className = 'ai-orb';
        this.orb.onclick = () => this.pokeOrb();
        
        this.dialog = document.createElement('div');
        this.dialog.className = 'ai-dialog';
        this.dialogText = document.createElement('span');
        this.dialogCursor = document.createElement('span');
        this.dialogCursor.className = 'ai-cursor';
        this.dialog.appendChild(this.dialogText);
        this.dialog.appendChild(this.dialogCursor);
        
        this.container.appendChild(this.orb);
        this.container.appendChild(this.dialog);
        document.body.appendChild(this.container);
        
        // Listen for ESC to skip
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.introPlayed) this.endCinematic();
        });
    }

    async playCinematic() {
        this.overlay.classList.remove('hidden');
        this.container.classList.add('center');
        
        // Disable scroll
        document.body.style.overflow = 'hidden';

        await this.sleep(1000);
        await this.speak(`Initialisation de l'environnement...`);
        await this.sleep(500);
        await this.speak(`Bonjour, vous êtes sur le portfolio de ${this.userName}.`);
        await this.sleep(1000);
        await this.speak(`Analyse des paquets en cours...`);
        await this.sleep(500);
        
        // THE HACK
        this.orb.classList.add('hacked');
        document.body.classList.add('glitch-mode');
        this.showHackGlitch();
        await this.speak(`!#%&* ERREUR 0x98A. INTRUSION DÉTECTÉE &%#@!`, 30);
        await this.sleep(2000);
        
        // THE RECOVERY
        this.hideHackGlitch();
        document.body.classList.remove('glitch-mode');
        this.orb.classList.remove('hacked');
        await this.speak(`Menace neutralisée. Systèmes purgés.`);
        await this.sleep(800);
        await this.speak(`J'ai repris le contrôle du terminal.`);
        await this.sleep(1500);
        
        this.endCinematic();
    }

    showHackGlitch() {
        const SKULL_SVG = `<svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#ff2b2b" stroke-width="3">
    <path d="M110 18c-46 0-80 34-80 82 0 26 12 46 30 60l-8 30c-2 6 4 11 10 9l22-8 8 22c2 6 11 6 13 0l10-26h-10l10-26 8 22c2 6 11 6 13 0l22-8 8 30c2 6 8 3 10-3l-8-30c18-14 30-34 30-60 0-48-34-82-80-82z" fill="#0a0000"/>
    <circle cx="80" cy="112" r="16" fill="#ff2b2b"/>
    <circle cx="140" cy="112" r="16" fill="#ff2b2b"/>
    <path d="M78 112l4 4 4-4 4 4 4-4" stroke-linecap="round"/>
    <path d="M138 112l4 4 4-4 4 4 4-4" stroke-linecap="round"/>
    <path d="M96 140h28M96 140v8M110 140v12M124 140v8" stroke-linecap="round"/>
    <path d="M86 176h48M86 176v12h48v-12" stroke-linecap="round"/>
    <path d="M94 188v8M104 188v10M116 188v10M126 188v8" stroke-linecap="round"/>
  </g>
</svg>`;

        this.hackLayer = document.createElement('div');
        this.hackLayer.className = 'hack-glitch';
        this.hackLayer.innerHTML = `
            <div class="hack-red"></div>
            <div class="hack-scanlines"></div>
            <div class="hack-slice"></div><div class="hack-slice"></div><div class="hack-slice"></div><div class="hack-slice"></div><div class="hack-slice"></div>
            <div class="hack-skull">${SKULL_SVG}</div>
            <div class="hack-skull-ghost red">${SKULL_SVG}</div>
            <div class="hack-skull-ghost cyan">${SKULL_SVG}</div>
            <div class="hack-label">ERREUR 0x98A — INTRUSION DÉTECTÉE</div>
            <div class="hack-status">> intrusion détectée<br>&gt; bypassing firewall.... FAIL<br>&gt; root access: DENIED<br>&gt; deploying counter-measures</div>
        `;
        document.body.appendChild(this.hackLayer);
    }

    hideHackGlitch() {
        if (this.hackLayer) {
            this.hackLayer.remove();
            this.hackLayer = null;
        }
    }

    endCinematic() {
        if (this.introPlayed) return;
        this.introPlayed = true;
        sessionStorage.setItem('ai_intro_played', 'true');
        
        document.body.classList.remove('glitch-mode');
        this.orb.classList.remove('hacked');
        this.hideHackGlitch();
        
        this.overlay.classList.add('hidden');
        this.container.classList.remove('center');
        this.container.classList.add('corner');
        document.body.style.overflow = ''; // restore scroll
        
        this.dialog.classList.remove('active');
        
        // After settling in corner, say welcome
        setTimeout(() => {
            this.speak(`Vous êtes sur la page : Accueil`);
        }, 1500);
    }

    setupPersistent() {
        this.overlay.style.display = 'none';
        this.container.classList.add('corner');
        
        // Determine context based on title or URL
        const title = document.title.toLowerCase();
        const url = window.location.href.toLowerCase();
        let pageName = "Accueil";
        
        if (title.includes('projet') || url.includes('projet')) pageName = "Projets";
        else if (title.includes('comp') || url.includes('comp')) pageName = "Compétences";
        else if (title.includes('contact') || url.includes('contact')) pageName = "Contact";
        else if (title.includes('propos') || url.includes('propos')) pageName = "À Propos";
        
        setTimeout(() => {
            this.speak(`Vous êtes sur la page : ${pageName}`);
        }, 1000);
    }
    
    pokeOrb() {
        const pokes = [
            "Ne me touchez pas, je calcule.",
            "Système stable.",
            "Surveillance réseau activée.",
            "Je suis une IA de classe 4.",
            "Veuillez vous concentrer sur le portfolio."
        ];
        if(!this.isTyping && this.introPlayed) {
            this.speak(pokes[Math.floor(Math.random() * pokes.length)]);
        }
    }

    async speak(text, speed = 50) {
        return new Promise(resolve => {
            this.dialogQueue.push({ text, speed, resolve });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isTyping || this.dialogQueue.length === 0) return;
        
        this.isTyping = true;
        this.dialog.classList.add('active');
        const current = this.dialogQueue.shift();
        
        this.dialogText.innerText = '';
        const chars = current.text.split('');
        
        for (let i = 0; i < chars.length; i++) {
            this.dialogText.innerText += chars[i];
            await this.sleep(current.speed + (Math.random() * 20)); // Humanize typing slightly
        }
        
        await this.sleep(2000); // Wait after finishing sentence
        
        if (this.dialogQueue.length === 0) {
            this.dialog.classList.remove('active');
            await this.sleep(300); // Wait for fade out
        }
        
        this.isTyping = false;
        current.resolve();
        this.processQueue();
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.terminalAI = new TerminalAI());
} else {
    window.terminalAI = new TerminalAI();
}
