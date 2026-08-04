/**
 * 01 — TERMINAL CRAFT : PORTFOLIO JS
 * Refactored to separate DOM injection logic into pure functions.
 */

const DEFAULT_DATA = {
    hero: {
        username: "votre-username",
        host: "localhost",
        name: "Votre Nom",
        titles: ["Dev Full-Stack", "Architecte Backend", "Open Source Contributor"],
        ctaText: "./voir-mes-projets.sh",
        label: "./greet --name=\"Votre Nom\"",
        logo: "votre-username@localhost:~$",
        favicon: ""
    },
    about: { content: "Développeur passionné par les architectures logicielles propres...", file: "about.md", photo: "" },
    skills: [
        { category: "Langages & Frameworks", items: [{ name: "TypeScript / JS", level: 95 }, { name: "Rust / Go", level: 80 }, { name: "React / Next.js", level: 88 }] },
        { category: "Infrastructure", items: [{ name: "Docker / K8s", level: 85 }, { name: "CI/CD Pipelines", level: 90 }] }
    ],
    projects: [
        { title: "Terminal-UI Engine", desc: "Framework de composants web simulant un terminal CLI interactif avec animations ascii.", tags: ["TypeScript", "Web Components", "CSS"], github: "#", live: "#" },
        { title: "API Monitor Pro", desc: "Surveillance temps réel d'APIs avec tableaux de bord customisables.", tags: ["Node.js", "Redis", "WebSocket"], github: "#", live: "#" },
        { title: "Dotfiles Manager", desc: "Outil CLI pour synchroniser ses dotfiles.", tags: ["Rust", "CLI"], github: "#" }
    ],
    experience: [
        { role: "Lead Developer", company: "Tech Solutions", date: "2022 - Présent", desc: "Architecture microservices." },
        { role: "Full-Stack Developer", company: "Startup Lab", date: "2019 - 2022", desc: "Développement d'apps web." }
    ],
    contact: { email: "hello@votre-domaine.com", github: "https://github.com/votre-username", linkedin: "https://linkedin.com/in/votre-username", whatsapp: "", twitter: "", instagram: "", youtube: "" }
};

// ==========================================
// PURE HTML GENERATORS
// ==========================================

const escapeHTML = str => String(str).replace(/[&<>'"]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[tag] || tag));

function createProjectCardHTML(p, i) {
    return `
        <div class="project-card" style="transition-delay: ${i * 0.1}s;">
            <h3 class="project-title">${escapeHTML(p.title)}</h3>
            <p class="project-desc">${escapeHTML(p.desc)}</p>
            <div class="project-tags">${(p.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>
            <div class="project-links">
                ${p.github ? `<a href="${p.github}" target="_blank">⌘ Code</a>` : ''}
                ${p.live ? `<a href="${p.live}" target="_blank">⚡ Live</a>` : ''}
            </div>
        </div>
    `;
}

function createSkillCategoryHTML(cat) {
    return `
        <div class="skill-category">
            <h3>${escapeHTML(cat.category)}</h3>
            ${(cat.items || []).map(s => `
                <div class="skill-item">
                    <div class="skill-header"><span>${escapeHTML(s.name)}</span><span>${s.level}%</span></div>
                    <div class="skill-bar-bg"><div class="skill-bar-fill" data-level="${s.level}"></div></div>
                </div>
            `).join('')}
        </div>
    `;
}

function createExperienceItemHTML(e) {
    return `
        <div class="experience-item">
            <div class="exp-role">${escapeHTML(e.role)}</div>
            <div class="exp-company">${escapeHTML(e.company)} <span class="exp-date">— ${escapeHTML(e.date)}</span></div>
            <div class="exp-desc">${escapeHTML(e.desc)}</div>
        </div>
    `;
}

// ==========================================
// CORE LOGIC
// ==========================================

let typeTimeout;

async function loadData() {
    try {
        let data = null;
        if (typeof window.getPortfolioDataAsync === 'function') {
            data = await window.getPortfolioDataAsync(DEFAULT_DATA);
        }
        
        if (!data || (!data.projects && !data.hero?.name)) {
            console.warn('Données vides, injection des infos par défaut (Terminal Craft)...');
            renderData(DEFAULT_DATA);
        } else {
            renderData(data);
        }
    } catch (e) {
        console.warn('Could not load data, using fallback data.', e);
        renderData(DEFAULT_DATA);
    }
}

function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
}

function setContactLink(id, textId, url) {
    const el = document.getElementById(id);
    const textEl = document.getElementById(textId);
    if (el && textEl) {
        if (url) {
            el.href = url;
            textEl.textContent = url.replace(/^https?:\/\//, '').replace(/^mailto:/, '');
            el.parentElement.style.display = 'flex';
        } else {
            el.parentElement.style.display = 'none';
        }
    }
}

function renderData(data) {
    if (!data) return;

    if (data.hero) {
        setTextById('hero-username', data.hero.username);
        setTextById('hero-host', data.hero.host);
        setTextById('hero-name', data.hero.name);
        setTextById('hero-cta', data.hero.ctaText);
        setTextById('hero-label', data.hero.label);
        if (data.hero.logo) setTextById('logo-title', data.hero.logo);
        
        const typeEl = document.getElementById('hero-titles');
        if (typeEl && data.hero.titles && data.hero.titles.length) {
            startTypewriter(data.hero.titles, typeEl);
        }
    }

    // About Section
    const aboutPreview = document.getElementById('about-preview');
    if (aboutPreview) {
        if (data.about && data.about.content) {
            const lines = (data.about.content || '').split('\n').slice(0, 4);
            aboutPreview.innerHTML = lines.map((l, i) => `<p class="code-line"><span class="line-num">${i + 1}</span> ${escapeHTML(l)}</p>`).join('');
        } else {
            const wrapper = aboutPreview.closest('section');
            if (wrapper) wrapper.style.display = 'none';
        }
    }
    
    // About Full Page
    const aboutContent = document.getElementById('about-content');
    if (aboutContent) {
        if (data.about && data.about.content) {
            aboutContent.textContent = data.about.content;
            const photoEl = document.getElementById('about-photo');
            if (photoEl && data.about.photo) {
                photoEl.src = data.about.photo;
                photoEl.style.display = 'block';
            } else if (photoEl) {
                photoEl.style.display = 'none';
            }
        } else {
            const wrapper = aboutContent.closest('section');
            if (wrapper) wrapper.style.display = 'none';
        }
    }

    const projContainer = document.getElementById('projects-container') || document.getElementById('projects-preview');
    if (projContainer) {
        if (data.projects && data.projects.length > 0) {
            const max = projContainer.id === 'projects-preview' ? 3 : data.projects.length;
            projContainer.innerHTML = data.projects.slice(0, max).map(createProjectCardHTML).join('');
        } else {
            const wrapper = projContainer.closest('section');
            if (wrapper) wrapper.style.display = 'none';
        }
    }

    const skillsContainer = document.getElementById('skills-container') || document.getElementById('skills-preview');
    if (skillsContainer) {
        if (data.skills && data.skills.length > 0) {
            const maxCats = skillsContainer.id === 'skills-preview' ? 1 : data.skills.length;
            skillsContainer.innerHTML = data.skills.slice(0, maxCats).map(createSkillCategoryHTML).join('');
        } else {
            const wrapper = skillsContainer.closest('section');
            if (wrapper) wrapper.style.display = 'none';
        }
    }

    const expContainer = document.getElementById('experience-container');
    if (expContainer) {
        if (data.experience && data.experience.length > 0) {
            expContainer.innerHTML = data.experience.map(createExperienceItemHTML).join('');
        } else {
            const wrapper = expContainer.closest('section');
            if (wrapper) wrapper.style.display = 'none';
        }
    }

    if (data.contact) {
        setContactLink('contact-email', 'contact-email-text', data.contact.email);
        setContactLink('contact-github', 'contact-github-text', data.contact.github);
        setContactLink('contact-linkedin', 'contact-linkedin-text', data.contact.linkedin);
    }
    
    
    // --- EMPTY STATE CLEANUP ---
    // Hide parent sections if their container is empty
    ['projects-container', 'projects-preview', 'skills-container', 'skills-preview', 'experience-container', 'experience-preview', 'about-preview'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.innerHTML.trim() === '') {
            const wrapper = el.closest('section, article, .terminal-block, .content-section, .glass-panel, [class*="section"]');
            if (wrapper) {
                wrapper.style.display = 'none';
            } else {
                el.style.display = 'none';
            }
        }
    });



    setTimeout(() => {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.opacity = '0';
            setTimeout(() => { spinner.style.display = 'none'; }, 500);
        }
        initScrollAnimations();
    }, 600);
}

function startTypewriter(titles, el) {
    if (typeTimeout) clearTimeout(typeTimeout);
    let tIdx = 0, cIdx = 0, deleting = false;
    function step() {
        const current = titles[tIdx];
        el.textContent = deleting ? current.substring(0, cIdx - 1) : current.substring(0, cIdx + 1);
        cIdx += deleting ? -1 : 1;
        let speed = deleting ? 40 : 80;
        if (!deleting && cIdx === current.length) { speed = 2000; deleting = true; }
        else if (deleting && cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; speed = 500; }
        typeTimeout = setTimeout(step, speed);
    }
    step();
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('skill-bar-bg')) {
                    const fill = entry.target.querySelector('.skill-bar-fill');
                    if (fill) fill.style.width = fill.getAttribute('data-level') + '%';
                }
            }
        });
    }, { threshold: 0.1 });
    
    // Attendre un petit peu que les données soient injectées avant d'observer
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up, .skill-bar-bg, .project-card, .experience-item, .hero-name, .nav-link').forEach(el => observer.observe(el));
    }, 100);
}

function initMobileMenu() {
    const btn = document.getElementById('hamburger-btn');
    const links = document.querySelector('.nav-links');
    if (btn && links) {
        btn.addEventListener('click', () => {
            links.classList.toggle('open');
            btn.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initMobileMenu();
});
