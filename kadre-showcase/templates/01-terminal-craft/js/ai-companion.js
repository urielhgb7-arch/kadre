
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
        await this.speak(`!#%&* ERREUR 0x98A. INTRUSION DÉTECTÉE &%#@!`, 30);
        await this.sleep(2000);
        
        // THE RECOVERY
        document.body.classList.remove('glitch-mode');
        this.orb.classList.remove('hacked');
        await this.speak(`Menace neutralisée. Systèmes purgés.`);
        await this.sleep(800);
        await this.speak(`J'ai repris le contrôle du terminal.`);
        await this.sleep(1500);
        
        this.endCinematic();
    }

    endCinematic() {
        if (this.introPlayed) return;
        this.introPlayed = true;
        sessionStorage.setItem('ai_intro_played', 'true');
        
        document.body.classList.remove('glitch-mode');
        this.orb.classList.remove('hacked');
        
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
