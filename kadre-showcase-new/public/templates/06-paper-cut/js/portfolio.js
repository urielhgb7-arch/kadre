/**
 * 06 — PAPER CUT : PORTFOLIO JS (Multi-Pages + Animations)
 */

const DEFAULT_DATA = {
    hero: {
        name: "Léa Morel",
        subtitle: "Directrice Artistique & Illustratrice",
        ctaText: "Voir les Créations ➔",
        label: "FAIT MAIN",
        logo: "LÉA MOREL",
        favicon: ""
    },
    about: {
        content: "Je donne vie aux idées avec du papier, des ciseaux et beaucoup de patience. Lauréate du Prix International d'Illustration 2024.",
        photo: ""
    },
    skills: [
        {
            category: "Illustration",
            items: [
                {
                    name: "Paper Cut",
                    level: 98
                },
                {
                    name: "Cyanotype",
                    level: 80
                },
                {
                    name: "Sérigraphie",
                    level: 75
                }
            ]
        },
        {
            category: "Digital",
            items: [
                {
                    name: "Procreate",
                    level: 88
                },
                {
                    name: "Illustrator",
                    level: 85
                }
            ]
        }
    ],
    projects: [
        {
            title: "Bestiaire de Papier",
            desc: "Collection de 30 animaux en paper-cut, exposée à la Galerie Vivienne.",
            tags: [
                "Paper Cut",
                "Exposition"
            ],
            live: "#"
        },
        {
            title: "Édition Limitée",
            desc: "Série de prints sérigraphiés en édition limitée.",
            tags: [
                "Illustration",
                "Sérigraphie"
            ],
            github: "#"
        }
    ],
    experience: [
        {
            role: "Directrice Artistique",
            company: "Studio Papier",
            date: "2020 - Présent",
            desc: "Direction artistique et création d'illustrations pour l'édition et la publicité."
        }
    ],
    contact: {
        email: "lea@paper-cut.art",
        github: "https://github.com/leam",
        linkedin: "https://linkedin.com/in/leam",
        whatsapp: "",
        twitter: "",
        instagram: "https://instagram.com/lea.papercut",
        youtube: ""
    },
    theme: {
        customAnim: {
            'paper-crease': true,
            'paper-depth': "25"
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const data = await getPortfolioDataAsync(DEFAULT_DATA);
    renderPage(data);
    initScrollAnimations();
});

function renderPage(data) {
    setTextById('hero-name', data.hero.name);
    setTextById('hero-subtitle', data.hero.subtitle || 'Illustrateurs & Créatifs');
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
            <div class="project-card" style="transition-delay: ${i * 0.1}s;">
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