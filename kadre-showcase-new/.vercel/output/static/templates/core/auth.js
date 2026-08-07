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
 * CORE AUTHENTICATION MANAGER (SUPABASE AUTH + SECRET GESTURE)
 * Partagé par tous les templates du pack portfolio.
 */

// ─── KADRE ADMIN SECRET (HASHED) ─────────────────────────────────────────────
// Plus aucun secret hardcodé. L'admin DOIT définir un secret via le CMS.
// Le secret est hashé (SHA-256) et stocké en localStorage.
// Le bypass ?admin= est DESACTIVE PAR DEFAUT. Activable depuis CMS → Sécurité.
const LS_SECRET_KEY = 'kadre_admin_secret_hash';
const LS_BYPASS_KEY = 'kadre_admin_bypass_enabled';
const LS_RATE_LIMIT_KEY = 'kadre_rate_limit';
const RATE_MAX_ATTEMPTS = 5;
const RATE_WINDOW_MS = 60000;
const RATE_BLOCK_MS = 300000;
// ────────────────────────────────────────────────────────────────────────────

let isAuthInitialized = false;

function getRateLimitState() {
  try {
    const raw = localStorage.getItem(LS_RATE_LIMIT_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
}

function saveRateLimitState(state) {
  try { localStorage.setItem(LS_RATE_LIMIT_KEY, JSON.stringify(state)); } catch(e) {}
}

function checkRateLimit() {
  const state = getRateLimitState();
  const now = Date.now();
  if (state.blockedUntil > now) {
    return { blocked: true, remaining: Math.ceil((state.blockedUntil - now) / 1000) };
  }
  if (now - state.firstAttempt > RATE_WINDOW_MS) {
    state.attempts = 0;
    state.firstAttempt = now;
  }
  return { blocked: false, state, now };
}

function recordFailedAttempt() {
  const { blocked, state, now } = checkRateLimit();
  if (blocked) return;
  state.attempts = (state.attempts || 0) + 1;
  if (state.attempts === 1) state.firstAttempt = now;
  if (state.attempts >= RATE_MAX_ATTEMPTS) {
    state.blockedUntil = now + RATE_BLOCK_MS;
    state.attempts = 0;
  }
  saveRateLimitState(state);
}

function isAdminBypassEnabled() {
  try { return localStorage.getItem(LS_BYPASS_KEY) === 'true'; } catch(e) { return false; }
}

async function hashSecret(secret) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch(e) {
    return secret;
  }
}

function getStoredSecretHash() {
  try { return localStorage.getItem(LS_SECRET_KEY); } catch(e) { return null; }
}

async function setStoredSecretHash(secret) {
  const hash = await hashSecret(secret);
  try { localStorage.setItem(LS_SECRET_KEY, hash); } catch(e) { /* silent */ }
  return hash;
}

async function verifyAdminSecret(input) {
  const stored = getStoredSecretHash();
  if (!stored) return false;
  const inputHash = await hashSecret(input);
  return inputHash === stored;
}

window.isAdminBypassEnabled = isAdminBypassEnabled;
window.setAdminBypassEnabled = function(val) {
  try { localStorage.setItem(LS_BYPASS_KEY, val ? 'true' : 'false'); } catch(e) {}
};

document.addEventListener('DOMContentLoaded', () => {
  initCoreAuthListeners();

  // Sandbox "Personnaliser" button → bypass direct vers CMS sans config
  try {
    if (isSandboxContext()) {
      window.addEventListener('message', (e) => {
        if (!e.data || e.data.type !== 'kadre-open-admin') return;
        // Retry jusqu'à 5x si openHubModal pas encore chargé
        let tries = 0;
        const tryOpen = () => {
          if (window.openHubModal) { window.openHubModal(); return; }
          if (window.openAdminModal) { window.openAdminModal(); return; }
          if (++tries < 5) setTimeout(tryOpen, 200);
        };
        tryOpen();
      });
    }
  } catch(e) { /* silent */ }

  // Auto-open admin if bypass enabled and URL secret matches
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('admin') && isAdminBypassEnabled()) {
      verifyAdminSecret(params.get('admin')).then(match => {
        if (match) setTimeout(() => handleSecretGestureTrigger(), 500);
        else recordFailedAttempt();
      });
    }
  } catch(e) { /* silent */ }
});

// Handle back/forward cache (bfcache) — multi-page navigation
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    try {
      const saved = localStorage.getItem('portfolio_custom_config_v4');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.theme) {
          window.applySavedThemeGlobally(data);
        }
      }
    } catch(e) { /* silent */ }
  }
});

function isSandboxContext() {
  const hostname = window.location.hostname;
  const isShowcase = hostname.includes('kadre') || hostname.includes('kadrify') || hostname === 'localhost' || hostname === '127.0.0.1';
  if (!isShowcase) return false;

  try {
    if (window.self !== window.top) return true;
  } catch(e) { return true; }
  try {
    const parentHref = String(window.parent.location.href || '').toLowerCase();
    if (parentHref.includes('sandbox') || parentHref.includes('preview')) return true;
  } catch(e) {}
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('sandbox') === 'true' || urlParams.get('preview') === 'true';
}
function initCoreAuthListeners() {
  if (isAuthInitialized) return;
  isAuthInitialized = true;

  // Disable triple-click in sandbox context
  if (isSandboxContext()) return;

  let clickCount = 0;
  let clickTimer = null;

  document.addEventListener('click', (e) => {
    const logoTarget = e.target.closest('.nav-logo, .brand-logo, #nav-logo, .terminal-title, .logo');
    if (logoTarget) {
      e.preventDefault();
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);

      if (clickCount >= 3 || (e.detail && e.detail >= 3)) {
        e.stopPropagation();
        clickCount = 0;

        const { blocked, remaining } = checkRateLimit();
        if (blocked) {
          alert(`🔒 Trop de tentatives. Réessayez dans ${Math.ceil(remaining / 60)} min.`);
          return;
        }
        handleSecretGestureTrigger();
      } else {
        clickTimer = setTimeout(() => {
          if (clickCount > 0 && clickCount < 3) {
            if (logoTarget.tagName.toLowerCase() === 'a' && logoTarget.href && logoTarget.getAttribute('href') !== '#') {
                window.location.href = logoTarget.href;
            }
          }
          clickCount = 0; 
        }, 350);
      }
    }
  }, true);
}

async function handleSecretGestureTrigger() {
  // Check ?admin= bypass (only if enabled)
  const adminParam = new URLSearchParams(location.search).get('admin');
  if (adminParam && isAdminBypassEnabled()) {
    if (await verifyAdminSecret(adminParam)) {
      if (window.openHubModal) { window.openHubModal(); }
      return;
    } else {
      recordFailedAttempt();
    }
  }

  // If no secret hash is set, show first-time setup
  if (!getStoredSecretHash()) {
    if (window.openSetupWizardModal) {
      window.openSetupWizardModal();
    } else {
      alert('⚙️ Bienvenue ! Configurez votre mot de passe admin via le CMS.');
    }
    return;
  }

  const creds = getSupabaseCredentials();

  if (!creds) {
    if (window.openSetupWizardModal) {
      window.openSetupWizardModal();
    } else {
      alert('⚙️ Assistant d\'installation Supabase non initialisé.');
    }
    return;
  }

  const client = await getSupabaseClient();
  if (client) {
    const { data: { session } } = await client.auth.getSession();
    if (session) {
      if (window.openHubModal) {
        window.openHubModal();
      } else if (window.openAdminModal) {
        window.openAdminModal();
      }
    } else {
      if (window.openAuthLoginModal) {
        window.openAuthLoginModal();
      }
    }
  } else {
    if (window.openSetupWizardModal) {
      window.openSetupWizardModal();
    }
  }
}

async function loginWithSupabase(email, password) {
  const client = await getSupabaseClient();
  if (!client) return { error: "Client Supabase non prêt" };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { data };
}

async function signUpOwnerWithSupabase(email, password) {
  const client = await getSupabaseClient();
  if (!client) return { error: "Client Supabase non prêt" };
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) return { error: error.message };
  return { data };
}

async function logoutSupabaseOwner() {
  const client = await getSupabaseClient();
  if (client) await client.auth.signOut();
}

window.loginWithSupabase = loginWithSupabase;
window.signUpOwnerWithSupabase = signUpOwnerWithSupabase;
window.logoutSupabaseOwner = logoutSupabaseOwner;
window.handleSecretGestureTrigger = handleSecretGestureTrigger;
window.hashSecret = hashSecret;
window.setStoredSecretHash = setStoredSecretHash;
window.verifyAdminSecret = verifyAdminSecret;
window.recordFailedAttempt = recordFailedAttempt;

KadreCore.auth = { login: loginWithSupabase, signUp: signUpOwnerWithSupabase, logout: logoutSupabaseOwner };
KadreCore.triggerAdmin = handleSecretGestureTrigger;
KadreCore.secret = { hash: hashSecret, set: setStoredSecretHash, verify: verifyAdminSecret };
