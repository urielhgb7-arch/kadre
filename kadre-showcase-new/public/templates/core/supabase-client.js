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
 * CORE SUPABASE CLIENT INITIALIZER
 * Partagé par tous les templates du pack portfolio.
 */

// ==========================================
// CONFIGURATION SUPABASE (COLLEZ VOS CLÉS ICI UNE SEULE FOIS)
// Laissez ces valeurs vides pour configurer vos clés depuis le CMS (triple-clic).
// ==========================================
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
// ==========================================

const SUPABASE_URL_KEY = 'portfolio_supabase_url_v2';
const SUPABASE_ANON_KEY_LS = 'portfolio_supabase_anon_key_v2';


// KadreCore namespace (backward compat)
window.KadreCore = window.KadreCore || {};
KadreCore.supabase = { getClient: () => supabaseClient, setClient: (c) => { supabaseClient = c; } };

let supabaseClient = null;

/**
 * Charge le SDK Supabase v2 s'il n'est pas présent
 */
async function loadSupabaseSDK() {
    if (window.supabase) return true;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Impossible de charger le SDK Supabase JS'));
        document.head.appendChild(script);
    });
}

/**
 * Récupère les clés Supabase enregistrées
 */
function getSupabaseCredentials() {
    // 1. Priorité aux clés hardcodées en haut du fichier (Configuration finale)
    if (SUPABASE_URL && SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 50) {
        return { url: SUPABASE_URL.trim(), key: SUPABASE_ANON_KEY.trim() };
    }

    // 2. Fallback sur le localStorage (pour rétrocompatibilité si déjà configuré avant)
    try {
        const url = localStorage.getItem(SUPABASE_URL_KEY);
        const key = localStorage.getItem(SUPABASE_ANON_KEY_LS);
        if (url && key) {
            return { url: url.trim(), key: key.trim() };
        }
    } catch (e) { KadreCore.warn('getSupabaseCredentials fallback silent:', e.message); }

    return null;
}

/**
 * Enregistre les clés Supabase
 */
function saveSupabaseCredentials(url, key) {
    try {
        localStorage.setItem(SUPABASE_URL_KEY, url.trim());
        localStorage.setItem(SUPABASE_ANON_KEY_LS, key.trim());
        return true;
    } catch (e) {
        KadreCore.warn('Erreur sauvegarde clés Supabase:', e.message);
        return false;
    }
}

/**
 * Initialise le client Supabase
 */
async function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    const creds = getSupabaseCredentials();
    if (!creds) return null;

    try {
        await loadSupabaseSDK();
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(creds.url, creds.key);
            return supabaseClient;
        }
    } catch (e) {
        console.error('Erreur initialisation Supabase Client:', e);
    }
    return null;
}

/**
 * Réinitialise le client Supabase avec de nouvelles clés
 */
async function setSupabaseCredentialsAndInit(url, key) {
    saveSupabaseCredentials(url, key);
    supabaseClient = null;
    return await getSupabaseClient();
}
