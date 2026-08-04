/**
 * 05 — GALLERY WALL : PORTFOLIO JS (Multi-Pages + Animations)
 */

const DEFAULT_DATA = {
    hero: {
        name: "Emma Fontaine",
        subtitle: "Photographe & Artiste Visuelle",
        ctaText: "Explorer la Galerie ➔",
        label: "PORTFOLIO 2026",
        logo: "EMMA FONTAINE",
        favicon: ""
    },
    about: {
        content: "Photographe basée à Paris, spécialisée dans le portrait artistique et la photographie de paysage. Chaque image raconte une histoire silencieuse.",
        photo: ""
    },
    skills: [
        {
            category: "Photographie",
            items: [
                {
                    name: "Portrait",
                    level: 95
                },
                {
                    name: "Paysage",
                    level: 88
                },
                {
                    name: "Studio",
                    level: 85
                }
            ]
        },
        {
            category: "Post-Production",
            items: [
                {
                    name: "Lightroom",
                    level: 92
                },
                {
                    name: "Photoshop",
                    level: 80
                }
            ]
        }
    ],
    projects: [
        {
            title: "Silhouettes Urbaines",
            desc: "Série photographique sur l'architecture et l'humain dans les grandes villes.",
            tags: [
                "Photographie",
                "Urbain",
                "Noir & Blanc"
            ],
            live: "#"
        },
        {
            title: "Portraits Vol. II",
            desc: "Galerie de portraits en lumière naturelle.",
            tags: [
                "Portrait",
                "Lumière naturelle"
            ],
            live: "#"
        }
    ],
    experience: [
        {
            role: "Photographe Indépendante",
            company: "Freelance",
            date: "2019 - Présent",
            desc: "Photographie éditoriale et portrait pour magazines et marques."
        }
    ],
    contact: {
        email: "emma@gallery-wall.art",
        github: "",
        linkedin: "https://linkedin.com/in/emmaf",
        whatsapp: "",
        twitter: "https://twitter.com/emmaf",
        instagram: "https://instagram.com/emmaf.photo",
        youtube: ""
    },
    theme: {
        customAnim: {
            'gallery-bg': true,
            'gallery-layout': false
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
    setTextById('hero-subtitle', data.hero.subtitle || 'Designers & Photographes');
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

    // Direct observer for skill bars
    const skillObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const fill = e.target.querySelector('.skill-bar-fill');
                if (fill) fill.style.width = (fill.getAttribute('data-level') || 0) + '%';
                skillObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-bar-bg').forEach(el => skillObs.observe(el));
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

// Initialize Background Marquee
async function initBackgroundMarquee() {
    const track = document.getElementById('marquee-track');
    if (!track) return;
    
    try {
        let galleryImages = [];
        let projectItems = [];
        
        // 1. Get Gallery Images
        try {
            const galleryRaw = localStorage.getItem('kadre_gallery_images_v1');
            if (galleryRaw) {
                const galleryArr = JSON.parse(galleryRaw);
                if (Array.isArray(galleryArr) && galleryArr.length > 0) {
                    galleryImages = galleryArr.map(g => ({ type: 'image', title: g.title || '', url: g.url }));
                }
            }
        } catch(e) {}
        
        // Fallbacks for Gallery Images
        if (galleryImages.length === 0) {
            galleryImages = [
                { type: 'image', title: 'Abstrait', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
                { type: 'image', title: 'Montagne', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop' },
                { type: 'image', title: 'Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
                { type: 'image', title: 'Architecture', url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=600&auto=format&fit=crop' }
            ];
        }

        // 2. Get Project Items
        if (window.kadre && window.kadre.supabase) {
            try {
                const { data, error } = await window.kadre.supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(6);
                if (!error && data && data.length > 0) projectItems = data.map(p => ({ type: 'project', title: p.title, desc: p.description, url: p.image_url }));
            } catch(e) {}
        }
        if (projectItems.length === 0) {
            try {
                const saved = localStorage.getItem('portfolio_data_v4');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.projects && parsed.projects.length > 0) {
                        projectItems = parsed.projects.map(p => ({ type: 'project', title: p.title, desc: p.description, url: p.image_url }));
                    }
                }
            } catch(e) {}
        }
        if (projectItems.length === 0 && typeof DEFAULT_DATA !== 'undefined' && DEFAULT_DATA.projects) {
            projectItems = DEFAULT_DATA.projects.map(p => ({ type: 'project', title: p.title, desc: p.description, url: p.image_url }));
        }

        // 3. Check Mode
        const mode = localStorage.getItem('kadre_marquee_mode_v1') || 'mixed';
        let itemsToRender = [];
        
        if (mode === 'images') {
            itemsToRender = galleryImages;
        } else if (mode === 'projects') {
            itemsToRender = projectItems.length > 0 ? projectItems : galleryImages;
        } else {
            // Mixed
            let mixed = [];
            const maxLength = Math.max(galleryImages.length, projectItems.length);
            for(let i=0; i<maxLength; i++) {
                if(i < galleryImages.length) mixed.push(galleryImages[i]);
                if(i < projectItems.length) mixed.push(projectItems[i]);
            }
            itemsToRender = mixed;
        }
        
        if (itemsToRender.length === 0) return;

        // Duplicate for smooth infinite scroll
        const display = [...itemsToRender, ...itemsToRender, ...itemsToRender];
        
        track.innerHTML = display.map(item => {
            const safeUrl = item.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
            if (item.type === 'project') {
                return `
                <div class="marquee-project-card">
                    <img src="${safeUrl}" alt="${item.title}">
                    <div class="marquee-project-card-body">
                        <h4>${item.title || 'Projet'}</h4>
                        <p>${item.desc || '...'}</p>
                    </div>
                </div>`;
            } else {
                return `<div class="marquee-item"><img src="${safeUrl}" alt="${item.title}"></div>`;
            }
        }).join('');
        
    } catch(e) {
        console.warn("Marquee error:", e);
    }
}



document.addEventListener('DOMContentLoaded', initBackgroundMarquee);
