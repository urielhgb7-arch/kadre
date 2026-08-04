/**
 * ============================================================================
 * ⚠️ AVERTISSEMENT LEGAL : LICENCE INDIVIDUELLE STRICTEMENT PERSONNELLE
 * ============================================================================
 * Ce code source est protégé par les lois sur le droit d'auteur.
 * ❌ REVENTE INTERDITE
 * ❌ PARTAGE INTERDIT (Même à titre gratuit)
 * ❌ REDISTRIBUTION INTERDITE
 * 
 * Toute violation de cette licence entraînera des poursuites judiciaires 
 * immédiates et la révocation des accès liés à l'architecture Supabase.
 * ============================================================================
 */
/**
 * CORE DATA SYNC MANAGER (SUPABASE BDD + FALLBACK LOCALSTORAGE)
 * Partagé par tous les templates du pack portfolio.
 */

// ─── KADRE NAMESPACE ──────────────────────────────────────────────────────
window.KadreCore = window.KadreCore || {};

// ─── SECURITY WARNING (CONSOLE) ──────────────────────────────────────────
(function(){
    const style1 = "color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0 #000;";
    const style2 = "color: white; font-size: 16px; background: #c0392b; padding: 10px; border-radius: 5px; font-family: monospace;";
    console.log("%c STOP! \n", style1);
    console.log("%c⚠️ CE CODE SOURCE EST PROTÉGÉ PAR LE DROIT D'AUTEUR.\nLa revente, le partage ou la distribution de ce fichier est STRICTEMENT INTERDITE.\nToute violation entraînera des poursuites et la révocation des clés Supabase.", style2);
})();

window.KadreCore.debug = window.KadreCore.debug || location.search.includes('debug=true');

// ─── THEME MODE SWITCHER INIT ───────────────────────────────────────────
(function initThemeMode() {
    try {
        let mode = localStorage.getItem('kadre_theme_mode') || 'system';

        function applyMode(m) {
            if (m === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme-mode', isDark ? 'dark' : 'light');
            } else {
                document.documentElement.setAttribute('data-theme-mode', m);
            }

            // Update widget UI if exists
            setTimeout(() => {
                const btns = document.querySelectorAll('.kadre-theme-switcher .theme-btn');
                btns.forEach(b => {
                    if(b.getAttribute('data-mode') === m) b.classList.add('active');
                    else b.classList.remove('active');
                });
                const indicator = document.querySelector('.kadre-theme-switcher .theme-active-indicator');
                if(indicator) {
                    if(m === 'light') indicator.style.transform = 'translateX(0)';
                    if(m === 'system') indicator.style.transform = 'translateX(calc(100% + 0.5rem))';
                    if(m === 'dark') indicator.style.transform = 'translateX(calc(200% + 1rem))';
                }
            }, 50);
        }

        applyMode(mode);

        // Listen to system changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('kadre_theme_mode') === 'system' || !localStorage.getItem('kadre_theme_mode')) {
                applyMode('system');
            }
        });

        // Expose global function to switch
        window.KadreCore.setThemeMode = function(newMode) {
            localStorage.setItem('kadre_theme_mode', newMode);
            applyMode(newMode);
        };

        // Attach click events on load
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll('.kadre-theme-switcher .theme-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    window.KadreCore.setThemeMode(btn.getAttribute('data-mode'));
                });
            });
            applyMode(localStorage.getItem('kadre_theme_mode') || 'system');
        });

        // Intercept internal links to pass theme mode (useful for file:/// local viewing)
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (a && a.href && a.getAttribute('href') && !a.getAttribute('href').startsWith('#') && !a.getAttribute('href').startsWith('http') && !a.getAttribute('href').startsWith('mailto')) {
                try {
                    let mode = localStorage.getItem('kadre_theme_mode');
                    if (mode && mode !== 'system') {
                        const url = new URL(a.href, window.location.href);
                        if (url.protocol === 'file:' || url.origin === window.location.origin) {
                            url.searchParams.set('theme', mode);
                            a.href = url.toString();
                        }
                    }
                } catch(err) {}
            }
        });
    } catch(e) {}
})();

// ─── LOADER ANIMATION INIT ───────────────────────────────────────────────
(function initLoader() {
    let loaderText = "KADRE";
    let loaderColors = [];
    try {
        const stored = localStorage.getItem('portfolio_custom_config_v4');
        if (stored) {
            const data = JSON.parse(stored);
            if (data && data.theme) {
                if (data.theme.loaderText) loaderText = data.theme.loaderText;
                if (data.theme.loaderColors) {
                    loaderColors = data.theme.loaderColors.split(',').map(c => c.trim()).filter(c => c);
                }
            }
        }
    } catch(e) {}

    document.addEventListener("DOMContentLoaded", () => {
        const container = document.getElementById("loader-text-container");
        if (container) {
            container.innerHTML = "";
            for (let i = 0; i < loaderText.length; i++) {
                let span = document.createElement("span");
                span.textContent = loaderText[i] === " " ? "\u00A0" : loaderText[i];
                span.style.animationDelay = (i * 0.1) + "s";
                if (loaderColors.length > 0) {
                    span.style.color = loaderColors[i % loaderColors.length];
                }
                container.appendChild(span);
            }
        }
    });
})();

// Inject style overrides for live customization (border-radius, font, layout)
(function injectStyleOverrides() {
    const id = 'kadre-custom-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
        body, .navbar, .terminal-header, .header { font-family: var(--font-family, 'Inter', sans-serif) !important; }
        .project-card, .contact-card, .skill-category, .experience-item,
        .admin-modal-card, .admin-input, .admin-textarea, button, .btn-primary, .btn-secondary,
        .btn-terminal, .btn-admin-action, .about-card, .glass-card { border-radius: var(--border-radius, 12px) !important; }
        .page-content, .content-section, .hero-section, .container { max-width: var(--layout-max-width, 100%) !important; }
        
        /* ─── STANDARDISATION DES CARTES (Style WhatsApp/GitHub) ─── */
        .project-card, .skill-category, .experience-item, .about-card, .glass-card {
            background: var(--bg-tertiary) !important;
            border: 1px solid var(--border-color) !important;
            padding: 20px !important;
            transition: all 0.3s ease !important;
            box-shadow: none !important;
        }
        .project-card:hover, .skill-category:hover, .experience-item:hover, .about-card:hover, .glass-card:hover {
            border-color: var(--accent-secondary) !important;
            transform: translateY(-2px) !important;
            box-shadow: none !important;
        }
        
        /* ─── HAMBURGER MENU OVERRIDE (Dropdown Adaptatif) ─── */
        @media (max-width: 768px) {
            .nav-links {
                display: flex !important;
                position: absolute !important;
                top: 70px !important;
                right: 16px !important;
                left: auto !important;
                width: 250px !important;
                height: auto !important;
                background: rgba(255, 255, 255, 0.03) !important;
                  backdrop-filter: blur(30px) saturate(1.5) !important;
                  -webkit-backdrop-filter: blur(30px) saturate(1.5) !important;
                  border: 1px solid rgba(255, 255, 255, 0.08) !important;
                  border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
                  border-radius: 16px !important;
                  padding: 24px !important;
                  flex-direction: column !important;
                  align-items: flex-start !important;
                  justify-content: flex-start !important;
                  gap: 16px !important;
                  box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1) !important;
                transform: translateY(-15px) !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, visibility 0.3s ease !important;
                z-index: 199 !important;
            }
            .nav-links.open {
                transform: translateY(0) !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
            .nav-link { width: 100%; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
            .nav-link:last-child { border-bottom: none; padding-bottom: 0; }
        }
    `;
    document.head.appendChild(style);
})();

window.KadreCore.log = function(msg, data) {
    if (window.KadreCore.debug) {
        console.log('[Kadre]', msg, data !== undefined ? data : '');
    }
};
window.KadreCore.warn = function(msg, data) {
    if (window.KadreCore.debug) {
        console.warn('[Kadre]', msg, data !== undefined ? data : '');
    }
};

const LOCAL_STORAGE_DATA_KEY = 'portfolio_custom_config_v4';
const TABLE_NAME = 'portfolio_data';

/**
 * Charge les données du portfolio (Supabase BDD en priorité, fallback LocalStorage)
 */
async function getPortfolioDataAsync(defaultDataFallback = {}) {
    function mergeData(defaults, parsed) {
        const merged = JSON.parse(JSON.stringify(defaults));
        if (parsed.hero) {
            merged.hero = Object.assign({}, merged.hero, parsed.hero);
            if (parsed.hero.title) {
                merged.hero.subtitle = parsed.hero.title;
                if (!merged.hero.titles) merged.hero.titles = [parsed.hero.title];
            }
        }
        if (parsed.about) merged.about = Object.assign({}, merged.about, parsed.about);
        if (parsed.contact) merged.contact = Object.assign({}, merged.contact, parsed.contact);
        if (parsed.visibility) merged.visibility = Object.assign({}, merged.visibility, parsed.visibility);
        if (parsed.seo) merged.seo = Object.assign({}, merged.seo, parsed.seo);
        if (parsed.theme) merged.theme = Object.assign({}, merged.theme, parsed.theme);
        
        if (parsed.skills && parsed.skills.length > 0) merged.skills = parsed.skills;
        if (parsed.projects && parsed.projects.length > 0) merged.projects = parsed.projects;
        if (parsed.experience && parsed.experience.length > 0) merged.experience = parsed.experience;
        
        return merged;
    }

    try {
        const client = await getSupabaseClient();
        if (client) {
            const { data, error } = await client
                .from(TABLE_NAME)
                .select('json_content, updated_at')
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            if (!error && data && data.json_content) {
                let parsed = typeof data.json_content === 'string' ? JSON.parse(data.json_content) : data.json_content;
                return mergeData(defaultDataFallback, parsed);
            }
        }
    } catch (e) {
        KadreCore.warn('Supabase non disponible, fallback localStorage:', e.message);
    }

    // Fallback LocalStorage (Mode Démo / Hors-ligne)
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
        if (saved) {
            let parsed = JSON.parse(saved);
            return mergeData(defaultDataFallback, parsed);
        }
    } catch (e) {}

    return defaultDataFallback;
}

/**
 * Sauvegarde les données du portfolio (Supabase BDD si authentifié, fallback LocalStorage)
 */
async function savePortfolioDataAsync(dataObj) {
    let savedToSupabase = false;

    // Sauvegarde immédiate dans LocalStorage pour réactivité locale
    try {
        localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(dataObj));
    } catch (e) {}

    // Tentative de sauvegarde dans la BDD Supabase
    try {
        const client = await getSupabaseClient();
        if (client) {
            const { data: { session } } = await client.auth.getSession();
            if (session && session.user) {
                const userId = session.user.id;
                
                const payload = {
                    user_id: userId,
                    json_content: dataObj,
                    updated_at: new Date().toISOString()
                };

                const { error } = await client
                    .from(TABLE_NAME)
                    .upsert(payload, { onConflict: 'user_id' });

                if (!error) {
                    savedToSupabase = true;
                } else {
                    console.error('Erreur sauvegarde Supabase:', error);
                }
            }
        }
    } catch (e) {
        console.error('Erreur lors de la synchro Supabase:', e);
    }

    return savedToSupabase;
}

/**
 * Migre les données du LocalStorage vers Supabase après connexion
 */
async function migrateLocalDataToSupabase() {
    try {
        const savedLocal = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
        if (savedLocal) {
            const dataObj = JSON.parse(savedLocal);
            const success = await savePortfolioDataAsync(dataObj);
            if (success) {
                console.log('🎉 Migré avec succès vers Supabase !');
                return true;
            }
        }
    } catch (e) {
        console.error('Erreur de migration:', e);
    }
    return false;
}


// Injection dynamique du theme global s'il existe


window.applySEOSettings = function(seo, data) {
    seo = seo || {};
    data = data || {};
    
    // Generation automatique d'un SEO ultra-optimisé si non renseigné
    const userName = (data.hero && data.hero.name) ? data.hero.name : "Portfolio Professionnel";
    const userRole = (data.hero && data.hero.titles && data.hero.titles.length > 0) ? data.hero.titles[0] : "Expert en Développement et Design Web";
    
    // Structure optimisée pour les moteurs de recherche (Mot Clé Principal | Nom)
    const defaultTitle = `${userRole} | ${userName} - Portfolio`;
    
    // Description optimisée sémantiquement (qui, quoi, pourquoi)
    const defaultDesc = `Bienvenue sur le portfolio de ${userName}, ${userRole}. Découvrez mes projets professionnels, mes compétences techniques et mon parcours. Expert en création d'expériences numériques sur-mesure.`;
    
    // Extraction intelligente des mots clés basés sur les compétences
    let autoKeywords = "portfolio, développeur, expert web, création site internet, freelance";
    if (data.skills && Array.isArray(data.skills)) {
        const skillNames = [];
        data.skills.forEach(cat => {
            if (cat.items) {
                cat.items.forEach(item => skillNames.push(item.name));
            }
        });
        if (skillNames.length > 0) {
            autoKeywords += ", " + skillNames.slice(0, 8).join(', '); // Prendre les 8 top skills
        }
    }

    const finalTitle = seo.title && seo.title.trim() !== '' ? seo.title : defaultTitle;
    const finalDesc = seo.description && seo.description.trim() !== '' ? seo.description : defaultDesc;
    const finalKeywords = seo.keywords && seo.keywords.trim() !== '' ? seo.keywords : autoKeywords;
    
    document.title = finalTitle;
    
    // Utilitaire pour injecter/mettre à jour les balises meta de façon dynamique
    const updateMeta = (selector, attr, value, createAttr, createName) => {
        let el = document.querySelector(selector);
        if (!el && createAttr) {
            el = document.createElement('meta');
            el.setAttribute(createAttr, createName);
            document.head.appendChild(el);
        }
        if (el) el.setAttribute(attr, value);
    };

    // Standard SEO
    updateMeta('meta[name="description"]', 'content', finalDesc, 'name', 'description');
    updateMeta('meta[name="keywords"]', 'content', finalKeywords, 'name', 'keywords');
    updateMeta('meta[name="author"]', 'content', userName, 'name', 'author');
    updateMeta('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large', 'name', 'robots');
    
    // Open Graph (Facebook, LinkedIn, iMessage, etc.)
    updateMeta('meta[property="og:title"]', 'content', finalTitle, 'property', 'og:title');
    updateMeta('meta[property="og:description"]', 'content', finalDesc, 'property', 'og:description');
    updateMeta('meta[property="og:type"]', 'content', 'website', 'property', 'og:type');
    updateMeta('meta[property="og:site_name"]', 'content', userName + ' Portfolio', 'property', 'og:site_name');
    
    // Twitter Card (X)
    updateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', 'name', 'twitter:card');
    updateMeta('meta[name="twitter:title"]', 'content', finalTitle, 'name', 'twitter:title');
    updateMeta('meta[name="twitter:description"]', 'content', finalDesc, 'name', 'twitter:description');
};

window.applyVisibilitySettings = function(visibility) {
    if (!visibility) return;
    
    let css = '';
    if (visibility.about === false) {
        css += `a[href*="apropos"], a[href*="about"], #about, #about-section, .about-section, [id*="about-preview"], [id*="about-content"] { display: none !important; }\n`;
    }
    if (visibility.skills === false) {
        css += `a[href*="competences"], a[href*="skills"], #skills, #skills-section, .skills-section, [id*="skills-preview"], [id*="skills-container"] { display: none !important; }\n`;
    }
    if (visibility.projects === false) {
        css += `a[href*="projets"], a[href*="projects"], #projects, #projects-section, .projects-section, [id*="projects-preview"], [id*="projects-container"] { display: none !important; }\n`;
    }
    if (visibility.experience === false) {
        css += `a[href*="experience"], #experience, #experience-section, .experience-section, [id*="experience-preview"], [id*="experience-container"] { display: none !important; }\n`;
    }
    if (visibility.contact === false) {
        css += `a[href*="contact"], #contact, #contact-section, .contact-section { display: none !important; }\n`;
    }
    
    const id = 'kadre-visibility-style';
    let styleEl = document.getElementById(id);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = id;
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
};

window.applySavedThemeGlobally = function(data) {
    if (data && data.theme) {
        const root = document.documentElement;
        const t = data.theme;
        if (t.bgPrimary)       root.style.setProperty('--bg-primary',       t.bgPrimary);
        if (t.bgSecondary)     root.style.setProperty('--bg-secondary',     t.bgSecondary);
        if (t.bgTertiary)      root.style.setProperty('--bg-tertiary',      t.bgTertiary);
        if (t.accentPrimary)   root.style.setProperty('--accent-primary',   t.accentPrimary);
        if (t.accentSecondary) root.style.setProperty('--accent-secondary', t.accentSecondary);
        if (t.textPrimary)     root.style.setProperty('--text-primary',     t.textPrimary);
        if (t.textSecondary)   root.style.setProperty('--text-secondary',   t.textSecondary);
        if (t.borderColor)     root.style.setProperty('--border-color',     t.borderColor);
        if (t.animDuration)    root.style.setProperty('--anim-duration',    t.animDuration);
        if (t.animColor1)      root.style.setProperty('--anim-color-1',     t.animColor1);
        if (t.animColor2)      root.style.setProperty('--anim-color-2',     t.animColor2);
        
        // Mise en page (live preview + saved)
        if (t.borderRadius)    root.style.setProperty('--border-radius',    t.borderRadius);
        if (t.layoutWidth)     root.style.setProperty('--layout-max-width', t.layoutWidth);
        if (t.fontFamily)      root.style.setProperty('--font-family',      t.fontFamily);
        if (t.navbarSticky !== undefined) {
            const headerEl = document.querySelector('header, .navbar, .terminal-header, .header');
            if (headerEl) {
                headerEl.style.position = t.navbarSticky ? 'sticky' : 'relative';
                headerEl.style.top = t.navbarSticky ? '0' : '';
            }
        }

        // Custom Animations (Template Specific)
        if (t.customAnim) {
            for (const [key, value] of Object.entries(t.customAnim)) {
                root.style.setProperty(`--${key}`, value);
            }
        }
    }
};

// ─── THEME INSTANT BOOT ────────────────────────────────────────────────────
// Apply theme SYNCHRONOUSLY from localStorage on every page load, BEFORE
// any async Supabase call. This ensures the theme is visible on ALL pages.
(function applyThemeImmediately() {
    try {
        const saved = localStorage.getItem('portfolio_custom_config_v4');
        if (saved) {
            const data = JSON.parse(saved);
            if (data && data.theme) {
                window.applySavedThemeGlobally(data);
            }
            if (data && data.visibility && typeof window.applyVisibilitySettings === 'function') {
                window.applyVisibilitySettings(data.visibility);
            }
        }
    } catch(e) { /* silent fail */ }
})();



// ─── SYNCHRONISATION SUPABASE (Sécurité multi-pages & multi-appareils) ──────
// Si le visiteur/admin navigue et que localStorage est vide ou isolé, on fetch 
// depuis la base de données.
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await getPortfolioDataAsync({});
        if (data && data.theme) {
            window.applySavedThemeGlobally(data);
        }
        if (data && data.visibility && typeof window.applyVisibilitySettings === 'function') {
            window.applyVisibilitySettings(data.visibility);
        }
        if (data && data.seo && typeof window.applySEOSettings === 'function') {
            window.applySEOSettings(data.seo, data);
        }
    } catch(e) {}
});


function hideSpinner() {
    const el = document.getElementById('loading-spinner');
    if (el) el.classList.add('hidden');
}
window.hideSpinner = hideSpinner;

// Fallback : cache le spinner après 3s quoi qu'il arrive
setTimeout(() => { hideSpinner(); }, 3000);

/**
 * Configure un contact : affiche/masque la carte, met à jour href et texte
 */
function setContactLink(linkId, textId, url, defaultText) {
    const link = document.getElementById(linkId);
    const text = document.getElementById(textId);
    const card = (link || text)?.closest('.contact-card');
    if (url && url.trim()) {
        if (link) link.href = linkId === 'contact-email' ? 'mailto:' + url : url;
        if (text) text.textContent = url;
        if (card) card.style.display = '';
    } else {
        if (card) card.style.display = 'none';
    }
}
window.setContactLink = setContactLink;

/**
 * Met à jour le favicon
 */
function setFavicon(url) {
    if (!url) return;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = url;
}
window.setFavicon = setFavicon;

// ─── CMS PREVIEW MODE (postMessage from showcase) ─────────────────────
(function() {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('cms')) return;

    let changes = 0;
    const MAX = 3;

    window.addEventListener('message', function(e) {
        if (!e.data || e.data.type !== 'cms-preview') return;
        if (changes >= MAX) return;
        changes++;

        const { field, value } = e.data;
        const nameEl = document.getElementById('hero-name') || document.querySelector('.hero-name, h1');
        const subtitleEl = document.querySelector('.hero-subtitle, .subtitle, h2');
        const photoEl = document.getElementById('about-photo') || document.querySelector('.about-photo, img[src*="photo"]');

        switch(field) {
            case 'name':
                if (nameEl) nameEl.textContent = value || nameEl.dataset.original || nameEl.textContent;
                break;
            case 'title':
                if (subtitleEl) subtitleEl.textContent = value || subtitleEl.dataset.original || subtitleEl.textContent;
                break;
            case 'photo':
                if (photoEl) photoEl.src = value || photoEl.dataset.original || '';
                break;
            case 'bio':
                const bioEl = document.querySelector('.about-text, .about-content, [data-bio]');
                if (bioEl) bioEl.textContent = value || bioEl.dataset.original || bioEl.textContent;
                break;
        }
    });
})();

