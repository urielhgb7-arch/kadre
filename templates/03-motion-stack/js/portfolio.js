/**
 * 03 — MOTION STACK : PORTFOLIO JS (Multi-Pages + Animations)
 */

const DEFAULT_DATA = {
    hero: {
        name: "Lucas Moreau",
        subtitle: "Créateur UI & Développeur d'Animations",
        ctaText: "Voir la Stack ➔",
        label: "CREATIVE ENGINEER",
        logo: "LUCAS MOREAU",
        favicon: ""
    },
    about: {
        content: "Je crée des expériences web immersives où l'animation raconte une histoire. Spécialiste GSAP, Three.js et Framer Motion.",
        photo: ""
    },
    skills: [
        {
            category: "Animation",
            items: [
                {
                    name: "GSAP / ScrollTrigger",
                    level: 95
                },
                {
                    name: "Three.js / WebGL",
                    level: 80
                },
                {
                    name: "Framer Motion",
                    level: 85
                }
            ]
        },
        {
            category: "Frontend",
            items: [
                {
                    name: "React / Next.js",
                    level: 90
                },
                {
                    name: "CSS / SASS",
                    level: 92
                }
            ]
        }
    ],
        projects: [
        {
            title: "Neural Canvas WebGL",
            desc: "Expérience interactive 3D générative qui réagit à la musique et aux mouvements de la souris.",
            tags: ["Three.js", "React", "GLSL"],
            github: "https://github.com/lucas/neural-canvas",
            live: "https://neural-canvas.example.com"
        },
        {
            title: "Vibe AI Dashboard",
            desc: "Interface utilisateur fluide pour un agent IA avec animations de transition complexes et micro-interactions.",
            tags: ["Next.js", "Framer Motion", "Tailwind"],
            live: "#"
        },
        {
            title: "Scroll Odyssey",
            desc: "Narration visuelle immersive au scroll pour une marque de luxe avec séquençage d'images.",
            tags: ["GSAP", "ScrollTrigger", "Lottie"],
            github: "https://github.com/lucas/scroll-odyssey"
        }
    ],
    experience: [
        {
            role: "Creative Developer",
            company: "Agence Wavy",
            date: "2023 - Présent",
            desc: "Conception et développement d'expériences web animées pour des clients premium."
        },
        {
            role: "Frontend Developer",
            company: "Digital Studio",
            date: "2020 - 2023",
            desc: "Intégration de maquettes complexes avec animations CSS/JS."
        }
    ],
    contact: {
        email: "lucas@motion-stack.io",
        github: "https://github.com/lucasm",
        linkedin: "https://linkedin.com/in/lucasm",
        whatsapp: "https://wa.me/33611111111",
        twitter: "https://twitter.com/lucasm",
        instagram: "https://instagram.com/lucasmotion",
        youtube: "https://youtube.com/@lucasmotion"
    },
    theme: {
        customAnim: {
            'stack-light-color': "#B24CFF",
            'stack-dir': "1",
            'stack-levitation': true,
            'mesh-blob-enable': true,
            'morph-words': "\"Creative Engineer\",\"UI Architect\",\"Motion Designer\",\"WebGL Artist\"",
            'card-stack-angle': "3",
            'card-stack-z': "40",
            'marquee-speed': "30s"
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const data = await getPortfolioDataAsync(DEFAULT_DATA);
    renderPage(data);
    initScrollAnimations();
});

function renderPage(data) {
    const morphEl = document.querySelector('.morph-text');
    if (morphEl) {
        morphEl.textContent = data.hero.name;
    } else {
        setTextById('hero-name', data.hero.name);
    }
    setTextById('hero-subtitle', data.hero.subtitle || 'Full-Stack & Creators');
    setTextById('footer-name', data.hero.name);
    if (data.hero.logo) setTextById('logo-title', data.hero.logo);
    const ctaBtn = document.getElementById('hero-cta');
    if (ctaBtn) ctaBtn.textContent = data.hero.ctaText || 'Découvrir ➔';

    const aboutEl = document.getElementById('about-content') || document.getElementById('about-preview');
    if (aboutEl && data.about) aboutEl.innerHTML = '<p>' + esc((data.about.content || '')).replace(/\n/g, '</p><p>') + '</p>';

    const projC = document.getElementById('projects-container') || document.getElementById('projects-preview');
    if (projC && data.projects) {
        const max = projC.id === 'projects-preview' ? 3 : data.projects.length;
        projC.innerHTML = data.projects.slice(0, max).map((p, i) => `
            <div class="project-card" data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.15" data-tilt-perspective="1000" style="transition-delay: ${i * 0.1}s;">
                <h3 class="project-title">${esc(p.title)}</h3>
                <p class="project-desc">${esc(p.desc)}</p>
                <div class="project-tags">${(p.tags||[]).map(t=>'<span class="tag">'+esc(t)+'</span>').join('')}</div>
                <div class="project-links">
                    ${p.github ? '<a href="'+p.github+'" target="_blank">Code</a>' : ''}
                    ${p.live ? '<a href="'+p.live+'" target="_blank">Live</a>' : ''}
                </div>
            </div>`).join('');
    }

    const skillsC = document.getElementById('skills-container') || document.getElementById('skills-preview');
    if (skillsC && data.skills) {
        skillsC.innerHTML = data.skills.map(cat => `
            <div class="skill-category">
                <h3>${esc(cat.category)}</h3>
                ${(cat.items||[]).map(s=>`<div class="skill-item"><div class="skill-header"><span>${esc(s.name)}</span><span>${s.level}%</span></div><div class="skill-bar-bg"><div class="skill-bar-fill" data-level="${s.level}"></div></div></div>`).join('')}
            </div>`).join('');
    }

    
    // --- TECH STACK MARQUEE SYNC ---
    const marqueeC = document.getElementById('marquee-content');
    if (marqueeC && data.skills) {
        const skillNames = [];
        data.skills.forEach(c => {
            if (c.items) c.items.forEach(i => skillNames.push(i.name));
        });
        if (skillNames.length > 0) {
            const renderSet = (arr) => arr.map(t => {
                let slug = t.toLowerCase().split('/')[0].trim().replace(/\s+/g, '');
                if(slug === 'three.js' || slug.includes('three')) slug = 'threedotjs';
                if(slug === 'node.js' || slug.includes('node')) slug = 'nodedotjs';
                if(slug === 'next.js' || slug.includes('next')) slug = 'nextdotjs';
                if(slug === 'c++') slug = 'cplusplus';
                if(slug === 'c#') slug = 'csharp';
                if(slug.includes('framer')) slug = 'framer';
                if(slug.includes('gsap')) slug = 'greensock';
                return `<span class="marquee-item" style="display:inline-flex; align-items:center; gap:8px;"><img src="https://cdn.simpleicons.org/${slug}/white" alt="" onerror="this.style.display='none'" style="height:24px; opacity:0.8;" />${esc(t)}</span>`;
            }).join('');
            marqueeC.innerHTML = renderSet(skillNames) + renderSet(skillNames);
        }
    }

    const expC = document.getElementById('experience-container');
    if (expC && data.experience) {
        expC.innerHTML = data.experience.map(e => `
            <div class="experience-item">
                <div class="exp-role">${esc(e.role)}</div>
                <div class="exp-company">${esc(e.company)} <span class="exp-date">— ${esc(e.date)}</span></div>
                <div class="exp-desc">${esc(e.desc)}</div>
            </div>`).join('');
    }

        setContactLink('contact-email', 'contact-email-text', data.contact.email);
    setContactLink('contact-github', 'contact-github-text', data.contact.github);
    setContactLink('contact-linkedin', 'contact-linkedin-text', data.contact.linkedin);
    setContactLink('contact-whatsapp', 'contact-whatsapp-text', data.contact.whatsapp);
    setContactLink('contact-twitter', 'contact-twitter-text', data.contact.twitter);
    setContactLink('contact-instagram', 'contact-instagram-text', data.contact.instagram);
    setContactLink('contact-youtube', 'contact-youtube-text', data.contact.youtube);
    setFavicon(data.hero.favicon);
    hideSpinner();
    setTimeout(() => { if(window.VanillaTilt) VanillaTilt.init(document.querySelectorAll(".project-card")); }, 100);
}

function initScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                e.target.querySelectorAll('.skill-bar-fill').forEach(b => { b.style.width = b.getAttribute('data-level') + '%'; });
                e.target.querySelectorAll('.project-card').forEach((c, i) => { setTimeout(() => c.classList.add('visible'), i * 120); });
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in-up, .content-section').forEach(el => obs.observe(el));
}

function setTextById(id, t) { const e=document.getElementById(id); if(e && t!==undefined) e.textContent=t; }
function setAttr(id, a, v) { const e=document.getElementById(id); if(e && v) e.setAttribute(a, v); }
function esc(s) { const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }


// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('hamburger-btn');
    const nav = document.querySelector('.nav-links');
    if (btn && nav) {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            nav.classList.toggle('open');
        });
        // Close menu on link click
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            btn.classList.remove('active');
            nav.classList.remove('open');
        }));
    }
});