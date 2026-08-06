/**
 * 02 — BLUEPRINT : PORTFOLIO JS (Multi-Pages + Animations)
 * REFACTORED: Extracted DOM injection logic into pure render functions.
 */

const DEFAULT_DATA = {
    hero: {
        name: "Claire Dubois",
        subtitle: "Ingénieure Logiciel & Architecte Système",
        ctaText: "Explorer les Plans ➔",
        label: "ARCHITECT-2026",
        logo: "CLAIRE DUBOIS",
        favicon: ""
    },
    about: {
        content: "Architecte logiciel spécialisée dans la conception de systèmes résilients. Je transforme des besoins complexes en plans d'architecture clairs et maintenables.",
        photo: ""
    },
    skills: [
        {
            category: "Architecture",
            items: [
                { name: "Microservices", level: 90 },
                { name: "Event-Driven", level: 85 }
            ]
        },
        {
            category: "Backend",
            items: [
                { name: "Java / Spring", level: 88 },
                { name: "Python / FastAPI", level: 82 }
            ]
        }
    ],
            projects: [
        {
            title: "Nimbus Cloud Orchestrator",
            desc: "Plateforme d'orchestration multi-cloud (AWS, GCP, Azure) avec provisionnement automatique via Terraform et équilibrage de charge prédictif.",
            tags: ["Go", "Kubernetes", "Terraform", "gRPC"],
            github: "https://github.com/claire/nimbus-orchestrator",
            live: "https://nimbus.example.com"
        },
        {
            title: "Event Mesh Gateway",
            desc: "Passerelle API haute performance et bus d'événements asynchrone capable de traiter 10M+ requêtes/seconde.",
            tags: ["Rust", "Kafka", "Redis"],
            github: "https://github.com/claire/event-mesh-gateway"
        },
        {
            title: "SecurPipeline CI/CD",
            desc: "Pipeline de déploiement continu intégrant des audits de sécurité statiques (SAST) et dynamiques (DAST) conteneurisés.",
            tags: ["Python", "Docker", "GitLab CI"],
            github: "https://github.com/claire/secur-pipeline",
            live: "#"
        }
    ],
    experience: [
        {
            role: "Software Architect",
            company: "BigCorp Systems",
            date: "2021 - Présent",
            desc: "Lead technique sur la migration monolithe → microservices (250k utilisateurs)."
        }
    ],
    contact: {
        email: "claire@blueprint.dev",
        github: "https://github.com/claired",
        linkedin: "https://linkedin.com/in/claired",
        whatsapp: "",
        twitter: "https://twitter.com/claired",
        instagram: "",
        youtube: ""
    },
    theme: {
        customAnim: {
            'blueprint-grid-color': "#00E5FF",
            'blueprint-lights': true,
            'neon-glow-color': "rgba(0, 229, 255, 0.8)"
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const data = await getPortfolioDataAsync(DEFAULT_DATA);
    renderPage(data);
    initScrollAnimations();
});

// --- Template Functions (Pure HTML generators) ---

function createProjectCardHTML(p, index) {
    const delay = index * 0.1;
    const tagsHTML = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
    const githubHTML = p.github ? `<a href="${p.github}" target="_blank">Code</a>` : '';
    const liveHTML = p.live ? `<a href="${p.live}" target="_blank">Live</a>` : '';
    
    return `
        <div class="project-card" style="transition-delay: ${delay}s;">
            <h3 class="project-title">${esc(p.title)}</h3>
            <p class="project-desc">${esc(p.desc)}</p>
            <div class="project-tags">${tagsHTML}</div>
            <div class="project-links">${githubHTML}${liveHTML}</div>
        </div>`;
}

function createSkillCategoryHTML(cat) {
    const itemsHTML = (cat.items || []).map(s => `
        <div class="skill-item">
            <div class="skill-header">
                <span>${esc(s.name)}</span>
                <span>${s.level}%</span>
            </div>
            <div class="skill-bar-bg">
                <div class="skill-bar-fill" data-level="${s.level}"></div>
            </div>
        </div>`).join('');

    return `
        <div class="skill-category">
            <h3>${esc(cat.category)}</h3>
            ${itemsHTML}
        </div>`;
}

function createExperienceItemHTML(e) {
    return `
        <div class="experience-item">
            <div class="exp-role">${esc(e.role)}</div>
            <div class="exp-company">${esc(e.company)} <span class="exp-date">— ${esc(e.date)}</span></div>
            <div class="exp-desc">${esc(e.desc)}</div>
        </div>`;
}

// --- DOM Adapter (Side Effects) ---

function renderPage(data) {
    setTextById('hero-name', data.hero.name);
    setTextById('hero-subtitle', data.hero.subtitle || 'Ingénieurs & Architectes Software');
    setTextById('footer-name', data.hero.name);
    if (data.hero.logo) setTextById('logo-title', data.hero.logo);
    const ctaBtn = document.getElementById('hero-cta');
    if (ctaBtn) ctaBtn.textContent = data.hero.ctaText || 'Découvrir ➔';

    const aboutEl = document.getElementById('about-content') || document.getElementById('about-preview');
    if (aboutEl && data.about) {
        aboutEl.innerHTML = '<p>' + esc((data.about.content || '')).replace(/\n/g, '</p><p>') + '</p>';
    }

    const projC = document.getElementById('projects-container') || document.getElementById('projects-preview');
    if (projC && data.projects) {
        const max = projC.id === 'projects-preview' ? 3 : data.projects.length;
        projC.innerHTML = data.projects.slice(0, max).map((p, i) => createProjectCardHTML(p, i)).join('');
    }

    const skillsC = document.getElementById('skills-container') || document.getElementById('skills-preview');
    if (skillsC && data.skills) {
        skillsC.innerHTML = data.skills.map(cat => createSkillCategoryHTML(cat)).join('');
    }

    const expC = document.getElementById('experience-container');
    if (expC && data.experience) {
        expC.innerHTML = data.experience.map(e => createExperienceItemHTML(e)).join('');
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
}

function initScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                e.target.querySelectorAll('.skill-bar-fill').forEach(b => { 
                    b.style.width = b.getAttribute('data-level') + '%'; 
                });
                e.target.querySelectorAll('.project-card').forEach((c, i) => { 
                    setTimeout(() => c.classList.add('visible'), i * 120); 
                });
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
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            btn.classList.remove('active');
            nav.classList.remove('open');
        }));
    }
});