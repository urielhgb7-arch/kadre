/**
 * 04 — QUIET SYSTEM : PORTFOLIO JS (Multi-Pages + Animations)
 */

const DEFAULT_DATA = {
    hero: {
        name: "Sarah Hoffmann",
        subtitle: "Designer UX & Minimaliste Digital",
        ctaText: "Découvrir mon travail ➔",
        label: "● Disponible pour missions",
        logo: "SARAH HOFFMANN",
        favicon: ""
    },
    about: {
        content: "Le design est silence. Je conçois des interfaces qui disparaissent pour laisser place à l'essentiel. 6 ans d'expérience en UX design produit.",
        photo: ""
    },
    skills: [
        {
            category: "Design",
            items: [
                {
                    name: "UX Research",
                    level: 90
                },
                {
                    name: "UI Design",
                    level: 88
                },
                {
                    name: "Figma",
                    level: 95
                }
            ]
        },
        {
            category: "Code",
            items: [
                {
                    name: "HTML / CSS",
                    level: 80
                },
                {
                    name: "React",
                    level: 70
                }
            ]
        }
    ],
    projects: [
        {
            title: "Mono Bank",
            desc: "Refonte complète de l'application mobile bancaire avec approche minimaliste.",
            tags: [
                "UX Research",
                "Figma",
                "Design System"
            ],
            live: "#"
        },
        {
            title: "Zen Read",
            desc: "Application de lecture épurée avec typographie optimisée et mode nuit.",
            tags: [
                "UI Design",
                "Typography",
                "Accessibilité"
            ],
            github: "https://github.com/sarah/zen-read"
        }
    ],
    experience: [
        {
            role: "Senior UX Designer",
            company: "Design Studio Berlin",
            date: "2021 - Présent",
            desc: "Lead UX sur des projets SaaS B2B et B2C."
        },
        {
            role: "UI Designer",
            company: "Startup München",
            date: "2019 - 2021",
            desc: "Design d'interfaces pour applications web et mobiles."
        }
    ],
    contact: {
        email: "sarah@quiet-system.design",
        github: "https://github.com/sarahh",
        linkedin: "https://linkedin.com/in/sarahh",
        whatsapp: "",
        twitter: "",
        instagram: "https://instagram.com/sarahh.design",
        youtube: ""
    },
    theme: {
        customAnim: {
            'grain-color': "#ffffff",
            'grain-intensity': "0.03",
            'blur-intro': "8"
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
    setTextById('hero-subtitle', data.hero.subtitle || 'Développeurs Minimalistes');
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