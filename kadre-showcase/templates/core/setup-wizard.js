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
 * CORE SETUP WIZARD & UNIVERSAL NO-CODE CMS MODAL UI
 * Partagé par tous les templates du pack portfolio.
 */

// KadreCore namespace
window.KadreCore = window.KadreCore || {};
KadreCore.ui = {};

document.addEventListener('DOMContentLoaded', () => {
    injectSetupWizardDOM();
});

/**
 * Injecte la structure HTML des modales d'authentification, d'installation et du CMS complet
 */
function injectSetupWizardDOM() {
    if (document.getElementById('core-auth-modal-overlay')) return;

    const modalHTML = `
    <!-- MODALE UNIFIÉE D'AUTHENTIFICATION, SETUP ET CMS ADMIN FULL NO-CODE -->
    <div class="admin-modal-overlay" id="core-auth-modal-overlay">
        <div class="admin-modal-card" data-lenis-prevent style="max-width: 680px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
            <div class="admin-header" style="flex-shrink: 0;">
                <div class="admin-title" id="core-auth-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Connexion Propriétaire
                </div>
                <button type="button" class="btn-close-modal" onclick="closeCoreAuthModal()">✕</button>
            </div>
            
            <div class="admin-body" style="padding: 20px; overflow-y: auto; flex: 1;">
                <p id="core-auth-desc" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
                    Entrez vos identifiants administrateur Supabase.
                </p>

                <div id="core-auth-error" style="display: none; background: rgba(255, 123, 114, 0.1); border: 1px solid #FF7B72; color: #FF7B72; padding: 10px 14px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 16px;"></div>
                <div id="core-auth-success" style="display: none; background: rgba(63, 185, 80, 0.1); border: 1px solid #3FB950; color: #3FB950; padding: 10px 14px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 16px;"></div>

                <!-- VUE 1 : CONNEXION HABITUELLE (LOGIN) -->
                <div id="core-view-login">
                    <form onsubmit="event.preventDefault(); handleCoreLoginSubmit();">
                        <div class="admin-form-group">
                            <label>Email Admin :</label>
                            <input type="email" id="core-login-email" class="admin-input" placeholder="admin@exemple.com" required autocomplete="email">
                        </div>
                        <div class="admin-form-group">
                            <label>Mot de Passe Secret :</label>
                            <input type="password" id="core-login-pass" class="admin-input" placeholder="••••••••" required autocomplete="current-password">
                        </div>

                        <button type="submit" class="btn-admin-action btn-admin-primary" style="width: 100%; padding: 12px; margin-top: 10px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg> Se Connecter à L'Administration
                        </button>
                        

                        <div style="margin-top: 14px; text-align: center;">
                            <a href="#" onclick="event.preventDefault(); openSetupWizardModal();" style="font-size: 0.8rem; color: var(--text-secondary);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Reconfigurer les clés Supabase</a>
                        </div>
                    </form>
                </div>

                <!-- VUE 2 : ASSISTANT DE CONFIGURATION NO-CODE (SETUP WIZARD) -->
                <div id="core-view-wizard" style="display: none;">
                    <div class="wizard-step" id="wiz-step-1">
                        <h4 style="color: var(--accent-primary); margin-bottom: 8px;">1. Connecter votre base Supabase</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                            Créez un projet sur <a href="https://supabase.com" target="_blank" style="color: var(--accent-secondary);">supabase.com</a> (Gratuit) et collez vos 2 clés ci-dessous :
                        </p>
                        <div class="admin-form-group">
                            <label>Project URL (trouvé dans Settings <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin: 0 4px;"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> ➔ API) :</label>
                            <input type="url" id="wiz-supabase-url" class="admin-input" placeholder="https://xxxxxxxxx.supabase.co" required>
                        </div>
                        <div class="admin-form-group">
                            <label>Anon Public Key (onglet "anon public") :</label>
                            <input type="text" id="wiz-supabase-key" class="admin-input" placeholder="eyJhbGciOiJIUzI1Ni..." required>
                        </div>

                        <button type="button" class="btn-admin-action btn-admin-primary" style="width: 100%; padding: 12px;" onclick="goToWizStep(2)">
                            Étape Suivante ➔
                        </button>
                        

                    </div>

                    <div class="wizard-step" id="wiz-step-2" style="display: none;">
                        <h4 style="color: var(--accent-primary); margin-bottom: 8px;">2. Créer votre compte Admin</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                            Définissez vos identifiants personnels pour protéger l'accès à l'édition :
                        </p>
                        <div class="admin-form-group">
                            <label>Votre Email Admin :</label>
                            <input type="email" id="wiz-admin-email" class="admin-input" placeholder="votre@email.com" required>
                        </div>
                        <div class="admin-form-group">
                            <label>Mot de Passe Secret (Min 6 caractères) :</label>
                            <input type="password" id="wiz-admin-pass" class="admin-input" placeholder="••••••••" required>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button type="button" class="btn-admin-action" onclick="goToWizStep(1)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> Retour</button>
                            <button type="button" class="btn-admin-action btn-admin-primary" style="flex: 1; padding: 12px;" onclick="goToWizStep(3)">
                                Continuer vers Sécurité SQL ➔
                            </button>
                        </div>
                    </div>

                    <div class="wizard-step" id="wiz-step-3" style="display: none;">
                        <h4 style="color: var(--accent-primary); margin-bottom: 8px;">3. Activer la Sécurité SQL (RLS)</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                            Collez ce script SQL une seule fois dans l'éditeur SQL de votre Dashboard Supabase :
                        </p>
                        <button type="button" class="btn-admin-action" style="width: 100%; margin-bottom: 12px; padding: 10px;" onclick="copySqlScriptToClipboard()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copier le Script SQL de Sécurité
                        </button>
                        <div style="display: flex; gap: 10px;">
                            <button type="button" class="btn-admin-action" onclick="goToWizStep(2)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> Retour</button>
                            <button type="button" class="btn-admin-action btn-admin-primary" style="flex: 1; padding: 12px;" onclick="finishWizardSetup()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Valider & Ouvrir le CMS !
                            </button>
                        </div>
                    </div>
                </div>

                
                <!-- VUE HUB : CHOIX THEME OU INFO -->
                <div id="core-view-hub" style="display: none; text-align: center; padding: 20px 0;">
                    <h3 style="margin-bottom: 24px; color: var(--text-primary);">Que souhaitez-vous modifier ?</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <button type="button" class="btn-admin-action" style="padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;" onclick="openThemeEditor()">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.88 0 1.59-.69 1.63-1.56.02-.38-.11-.75-.38-1.04-.26-.28-.39-.67-.35-1.07.08-.85.83-1.49 1.69-1.49H19c1.66 0 3-1.34 3-3 0-4.97-4.48-9-10-9z"></path><circle cx="7.5" cy="10.5" r="1.5"></circle><circle cx="10.5" cy="7.5" r="1.5"></circle><circle cx="14.5" cy="7.5" r="1.5"></circle><circle cx="17.5" cy="10.5" r="1.5"></circle></svg>
                            <strong style="font-size: 1.1rem;">Personnaliser le Thème</strong>
                            <span style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">Couleurs, Fonds, Apparence</span>
                        </button>
                        <button type="button" class="btn-admin-action btn-admin-primary" style="padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;" onclick="openAdminModal()">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-primary);"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            <strong style="font-size: 1.1rem;">Éditer le Contenu</strong>
                            <span style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 5px;">Bio, Projets, Contact</span>
                        </button>
                    </div>
                </div>

                <!-- VUE THEME : EDITEUR DE COULEURS -->
                <div id="core-view-theme" style="display: none;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
                        <button type="button" class="btn-admin-action" style="padding: 6px 12px;" onclick="openHubModal()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> Retour au Menu</button>
                        <strong style="line-height: 32px; color: var(--accent-primary);">Éditeur de Thème Global</strong>
                    </div>
                    <form onsubmit="event.preventDefault(); saveAdminThemeData();">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div class="admin-form-group">
                                <label>Couleur de Fond Principale :</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="color" id="thm-bg-primary" oninput="applyThemeLivePreview()" style="width:40px; height:40px; cursor:pointer; background:none; border:none; padding:0;">
                                    <input type="text" class="admin-input" id="thm-bg-primary-txt" oninput="document.getElementById('thm-bg-primary').value = this.value; applyThemeLivePreview()" placeholder="#000000" style="flex:1;">
                                </div>
                            </div>
                            <div class="admin-form-group">
                                <label>Couleur de Fond Secondaire :</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="color" id="thm-bg-secondary" oninput="applyThemeLivePreview()" style="width:40px; height:40px; cursor:pointer; background:none; border:none; padding:0;">
                                    <input type="text" class="admin-input" id="thm-bg-secondary-txt" oninput="document.getElementById('thm-bg-secondary').value = this.value; applyThemeLivePreview()" placeholder="#111111" style="flex:1;">
                                </div>
                            </div>
                            <div class="admin-form-group">
                                <label>Couleur d'Accentuation :</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="color" id="thm-accent-primary" oninput="applyThemeLivePreview()" style="width:40px; height:40px; cursor:pointer; background:none; border:none; padding:0;">
                                    <input type="text" class="admin-input" id="thm-accent-primary-txt" oninput="document.getElementById('thm-accent-primary').value = this.value; applyThemeLivePreview()" placeholder="#00F0FF" style="flex:1;">
                                </div>
                            </div>
                            <div class="admin-form-group">
                                <label>Couleur de Texte Principale :</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="color" id="thm-text-primary" oninput="applyThemeLivePreview()" style="width:40px; height:40px; cursor:pointer; background:none; border:none; padding:0;">
                                    <input type="text" class="admin-input" id="thm-text-primary-txt" oninput="document.getElementById('thm-text-primary').value = this.value; applyThemeLivePreview()" placeholder="#FFFFFF" style="flex:1;">
                                </div>
                            </div>
                            <div class="admin-form-group">
                                <label>Couleur des Bordures :</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="color" id="thm-border-color" oninput="applyThemeLivePreview()" style="width:40px; height:40px; cursor:pointer; background:none; border:none; padding:0;">
                                    <input type="text" class="admin-input" id="thm-border-color-txt" oninput="document.getElementById('thm-border-color').value = this.value; applyThemeLivePreview()" placeholder="#222222" style="flex:1;">
                                </div>
                            </div>
                          </div>
                          
                           <!-- LOADER SETTINGS -->
                           <div style="margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 18px;">
                               <label style="font-size:0.85rem; font-weight:600; color:var(--accent-primary); display:block; margin-bottom:14px; letter-spacing:0.05em; text-transform:uppercase;">Écran de Chargement</label>
                               <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                                   <div class="admin-form-group">
                                       <label>Texte Animé :</label>
                                       <input type="text" class="admin-input" id="thm-loader-text" placeholder="KADRE">
                                   </div>
                                   <div class="admin-form-group">
                                       <label>Couleurs (séparées par virgule) :</label>
                                       <input type="text" class="admin-input" id="thm-loader-colors" placeholder="#FF5733, #33FF57, #3357FF" title="Laissez vide pour utiliser la couleur principale">
                                   </div>
                               </div>
                           </div>

                           <!-- MISE EN PAGE GLOBALE -->
                           <div style="margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 18px;">
                               <label style="font-size:0.85rem; font-weight:600; color:var(--accent-primary); display:block; margin-bottom:14px; letter-spacing:0.05em; text-transform:uppercase;">Mise en Page</label>
                               <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                                   <div class="admin-form-group">
                                       <label>Arrondi des coins (border-radius) :</label>
                                       <div style="display:flex; gap:8px; align-items:center;">
                                           <input type="range" id="thm-border-radius" min="0" max="24" step="1" value="12" oninput="document.getElementById('thm-border-radius-val').textContent=this.value+'px'; applyThemeLivePreview()" style="flex:1; accent-color:var(--accent-primary);">
                                           <span id="thm-border-radius-val" style="font-size:0.8rem; font-weight:bold; min-width:35px;">12px</span>
                                       </div>
                                   </div>
                                   <div class="admin-form-group">
                                       <label>Largeur max du contenu :</label>
                                       <select id="thm-layout-width" class="admin-input" onchange="applyThemeLivePreview()">
                                           <option value="100%">Pleine largeur</option>
                                           <option value="1200px">1200px (confort)</option>
                                           <option value="1400px">1400px (large)</option>
                                       </select>
                                   </div>
                                   <div class="admin-form-group">
                                       <label>Police d'écriture :</label>
                                       <select id="thm-font-family" class="admin-input" onchange="applyThemeLivePreview()">
                                           <option value="Inter, sans-serif">Inter (sans-serif)</option>
                                           <option value="'Space Grotesk', sans-serif">Space Grotesk (moderne)</option>
                                           <option value="'Playfair Display', serif">Playfair Display (serif)</option>
                                           <option value="'JetBrains Mono', monospace">JetBrains Mono (monospace)</option>
                                       </select>
                                   </div>
                                   <div class="admin-form-group">
                                       <label>Navbar fixe en haut :</label>
                                       <div style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                                           <input type="checkbox" id="thm-navbar-sticky" onchange="applyThemeLivePreview()" checked style="width:18px; height:18px; accent-color:var(--accent-primary);">
                                           <span>Sticky (reste visible au scroll)</span>
                                       </div>
                                   </div>
                               </div>
                           </div>

                           <!-- DYNAMIC ANIMATION SETTINGS PER TEMPLATE -->
                           <div id="thm-anim-container" style="margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 18px;">
                               <label style="font-size:0.85rem; font-weight:600; color:var(--accent-primary); display:block; margin-bottom:14px; letter-spacing:0.05em; text-transform:uppercase;">Animations du Thème</label>
                               <div id="thm-anim-dynamic-controls"></div>
                           </div>
  
                          
                          <div style="display: flex; gap: 10px; margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 14px;">
                            <button type="submit" class="btn-admin-action btn-admin-primary" style="flex: 1; padding: 12px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Sauvegarder le Thème (Appliqué partout)
                            </button>
                        </div>
                    </form>
                </div>

                <!-- VUE 3 : PANNEAU CMS MULTI-ONGLETS COMPLET NO-CODE -->
                <div id="core-view-admin" style="display: none;">
                    <div style="display: flex; gap: 6px; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px; overflow-x: auto;">
                        <button type="button" class="btn-admin-action" style="padding: 6px 10px; margin-right: 8px; flex-shrink: 0;" onclick="openHubModal()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px; vertical-align:middle;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> Menu</button>
                        <button type="button" class="adm-tab-btn active" style="display:flex; align-items:center;" id="tab-btn-profil" onclick="switchCmsTab('profil')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Profil</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-about" onclick="switchCmsTab('about')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Bio</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-skills" onclick="switchCmsTab('skills')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> Compétences</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-projects" onclick="switchCmsTab('projects')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M13.5 10.5 21 3"></path><path d="M16 3h5v5"></path><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg> Projets</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-experience" onclick="switchCmsTab('experience')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> Expériences</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-contact" onclick="switchCmsTab('contact')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Contact</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-settings" onclick="switchCmsTab('settings')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> Données</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-apparence" onclick="switchCmsTab('apparence')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Apparence</button>
                        <button type="button" class="adm-tab-btn" style="display:flex; align-items:center;" id="tab-btn-gallery" onclick="switchCmsTab('gallery')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Galerie</button>
                    </div>

                    <form onsubmit="event.preventDefault(); saveAdminCMSData();">
                        
                        <!-- TAB 1 : PROFIL -->
                        <div class="cms-tab-content" id="cms-tab-profil">
                            <div class="admin-form-group">
                                <label>Nom & Prénom :</label>
                                <input type="text" id="adm-name" class="admin-input" placeholder="Votre Nom">
                            </div>
                            <div class="admin-form-group">
                                <label>Titre / Rôle Principal :</label>
                                <input type="text" id="adm-title" class="admin-input" placeholder="Développeur Full-Stack">
                            </div>
                            <div class="admin-form-group">
                                <label>Username / Nom Terminal (ex: votre-username) :</label>
                                <input type="text" id="adm-username" class="admin-input" placeholder="votre-username">
                            </div>
                            <div class="admin-form-group">
                                <label>Texte du Bouton d'Action (CTA) :</label>
                                <input type="text" id="adm-cta" class="admin-input" placeholder="./voir-projets.sh">
                            </div>
                            <div class="admin-form-group">
                                <label>Nom du site / Logo :</label>
                                <input type="text" id="adm-logo" class="admin-input" placeholder="MOTION STACK">
                            </div>
                            <div class="admin-form-group">
                                <label>Label / Badge Héro :</label>
                                <input type="text" id="adm-label" class="admin-input" placeholder="CREATOR STACK">
                            </div>
                            <div class="admin-form-group">
                                <label>Favicon (URL) :</label>
                                <div style="display:flex; gap:8px; align-items:center;">
                                    <input type="url" id="adm-favicon" class="admin-input" placeholder="https://example.com/favicon.svg" style="flex:1;">
                                    <button type="button" class="btn-admin-action" onclick="document.getElementById('adm-favicon-upload').click()" title="Uploader un fichier" style="padding:6px 10px; flex-shrink:0;">📁</button>
                                    <input type="file" id="adm-favicon-upload" accept="image/*" style="display:none;" onchange="handleFaviconUpload(event)">
                                </div>
                            </div>
                        </div>

                        <!-- TAB 2 : BIO -->
                        <div class="cms-tab-content" id="cms-tab-about" style="display:none;">
                            <div class="admin-form-group">
                                <label>Nom du Fichier Virtuel :</label>
                                <input type="text" id="adm-about-file" class="admin-input" placeholder="about.md">
                            </div>
                            <div class="admin-form-group">
                                <label>Présentation & Biographie :</label>
                                <textarea id="adm-bio" class="admin-textarea" rows="6" placeholder="Racontez votre parcours..."></textarea>
                            </div>
                            <div class="admin-form-group">
                                <label>Photo de profil :</label>
                                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                                    <div style="width:80px; height:80px; border-radius:50%; overflow:hidden; border:2px solid var(--accent-primary); flex-shrink:0; background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:var(--text-secondary);" id="adm-photo-preview">Aperçu</div>
                                    <div style="flex:1; min-width:150px;">
                                        <input type="text" id="adm-photo" class="admin-input" placeholder="URL externe ou upload" style="margin-bottom:6px;">
                                        <button type="button" class="btn-admin-action" onclick="document.getElementById('adm-photo-upload').click()" style="width:100%; padding:8px;">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Choisir une photo depuis l'ordinateur
                                        </button>
                                        <input type="file" id="adm-photo-upload" accept="image/*" style="display:none;" onchange="handlePhotoUpload(event)">
                                    </div>
                                </div>
                                <div id="adm-photo-size-warn" style="font-size:0.7rem; color:#FF7B72; margin-top:4px; display:none;">L'image est volumineuse (>2MB), un redimensionnement automatique sera appliqué.</div>
                            </div>
                        </div>

                        <!-- TAB 3 : COMPÉTENCES -->
                        <div class="cms-tab-content" id="cms-tab-skills" style="display:none;">
                            <div id="adm-skills-container"></div>
                            <button type="button" class="btn-admin-action" onclick="addCmsSkillRow()" style="width: 100%; margin-top: 10px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Ajouter une Compétence
                            </button>
                        </div>

                        <!-- TAB 4 : PROJETS -->
                        <div class="cms-tab-content" id="cms-tab-projects" style="display:none;">
                            <div id="adm-projects-container"></div>
                            <button type="button" class="btn-admin-action" onclick="addCmsProjectRow()" style="width: 100%; margin-top: 10px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Ajouter un Projet
                            </button>
                        </div>

                        <!-- TAB 5 : EXPÉRIENCES -->
                        <div class="cms-tab-content" id="cms-tab-experience" style="display:none;">
                            <div id="adm-experiences-container"></div>
                            <button type="button" class="btn-admin-action" onclick="addCmsExperienceRow()" style="width: 100%; margin-top: 10px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Ajouter une Expérience
                            </button>
                        </div>

                        <!-- TAB 6 : CONTACT -->
                        <div class="cms-tab-content" id="cms-tab-contact" style="display:none;">
                            <div class="admin-form-group">
                                <label>Email Professionnel :</label>
                                    <input type="email" id="adm-email" class="admin-input" placeholder="alex@dev.io">
                            </div>
                            <div class="admin-form-group">
                                <label>Lien GitHub :</label>
                                <input type="text" id="adm-github" class="admin-input" placeholder="https://github.com/votre-username">
                            </div>
                            <div class="admin-form-group">
                                <label>Lien LinkedIn :</label>
                                <input type="text" id="adm-linkedin" class="admin-input" placeholder="https://linkedin.com/in/votre-username">
                            </div>
                            <div class="admin-form-group">
                                <label>Lien WhatsApp :</label>
                                <input type="text" id="adm-whatsapp" class="admin-input" placeholder="https://wa.me/22500000000">
                            </div>
                            <div class="admin-form-group">
                                <label>Lien Twitter / X :</label>
                                <input type="text" id="adm-twitter" class="admin-input" placeholder="https://twitter.com/votre-username">
                            </div>
                            <div class="admin-form-group">
                                <label>Lien Instagram :</label>
                                <input type="text" id="adm-instagram" class="admin-input" placeholder="https://instagram.com/votre-username">
                            </div>
                            <div class="admin-form-group">
                                <label>Lien YouTube :</label>
                                <input type="text" id="adm-youtube" class="admin-input" placeholder="https://youtube.com/@votre-username">
                            </div>
                        </div>

                        <!-- TAB 7 : SETTINGS -->
                        <div class="cms-tab-content" id="cms-tab-settings" style="display:none;">
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px;">
                                Gestion de la connexion et de la sécurité Supabase.
                            </p>
                            <div style="border-top: 1px solid var(--border-color); margin: 16px 0; padding-top: 16px;">
                                <label style="font-size:0.85rem; font-weight:600; color:var(--accent-primary); display:block; margin-bottom:12px; letter-spacing:0.05em; text-transform:uppercase;">Affichage des sections</label>
                                <div style="display:flex; flex-direction:column; gap:10px; font-size:0.9rem;">
                                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" id="adm-vis-about" checked> Afficher la page/section "À propos"</label>
                                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" id="adm-vis-skills" checked> Afficher la page/section "Compétences"</label>
                                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" id="adm-vis-projects" checked> Afficher la page/section "Projets"</label>
                                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" id="adm-vis-experience" checked> Afficher la page/section "Expériences"</label>
                                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" id="adm-vis-contact" checked> Afficher la page/section "Contact"</label>
                                </div>
                            </div>

                            
                            <button type="button" class="btn-admin-action" onclick="copySqlScriptToClipboard()" style="width: 100%; margin-bottom: 10px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copier le Script SQL RLS
                            </button>

                            <div style="border-top: 1px solid var(--border-color); margin: 16px 0; padding-top: 16px;">
                                <label style="font-size:0.85rem; font-weight:600; color:var(--accent-primary); display:block; margin-bottom:12px; letter-spacing:0.05em; text-transform:uppercase;">Sécurité Administrateur</label>
                                <div class="admin-form-group">
                                    <label>Nouveau Secret Admin (utilisé dans ?admin=...) :</label>
                                    <input type="text" id="adm-new-secret" class="admin-input" placeholder="Mots de passe secret (ex: MonSecret42)" value="">
                                </div>
                                <div class="admin-form-group">
                                    <label>Confirmer le nouveau secret :</label>
                                    <input type="text" id="adm-confirm-secret" class="admin-input" placeholder="Retaper le même secret" value="">
                                </div>
                                <button type="button" class="btn-admin-action btn-admin-primary" onclick="handleChangeAdminSecret()" style="width: 100%;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg> Changer le Secret Admin (hashé SHA-256)
                                </button>
                                <div id="adm-secret-msg" style="font-size:0.8rem; margin-top:8px;"></div>
                                <div class="admin-form-group" style="margin-top:12px;">
                                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                        <input type="checkbox" id="adm-bypass-toggle" onchange="handleBypassToggle()" style="width:18px;height:18px;accent-color:var(--accent-primary);">
                                        Autoriser l'accès admin via ?admin=VOTRE_SECRET dans l'URL
                                    </label>
                                    <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">⚠️ Désactivé par défaut. À activer uniquement si nécessaire (moins sécurisé).</div>
                                </div>
                            </div>

                            <div style="border-top: 1px solid var(--border-color); margin: 16px 0; padding-top: 16px;">
                                <label style="font-size:0.85rem; font-weight:600; color:var(--accent-primary); display:block; margin-bottom:12px; letter-spacing:0.05em; text-transform:uppercase;">Sauvegarde & Restauration</label>
                                <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">
                                    Exportez vos données pour les sauvegarder ou les transférer vers un autre appareil. Fichier JSON utilisable sans compte Supabase.
                                </p>
                                <button type="button" class="btn-admin-action btn-admin-primary" onclick="handleExportBackup()" style="width:100%; margin-bottom:8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exporter mes données (fichier JSON)
                                </button>
                                <button type="button" class="btn-admin-action" onclick="document.getElementById('adm-import-file').click()" style="width:100%;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Importer un fichier JSON
                                </button>
                                <input type="file" id="adm-import-file" accept=".json" style="display:none;" onchange="handleImportBackup(event)">
                                <div id="adm-backup-msg" style="font-size:0.8rem; margin-top:8px;"></div>
                            </div>

                            <button type="button" class="btn-admin-action" onclick="handleCoreLogout()" style="width: 100%; color: #FF7B72;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Se Déconnecter de Supabase
                            </button>
                        </div>

                        
                            <div style="border-top: 1px solid var(--border-color); margin: 16px 0; padding-top: 16px;">
                                <label style="font-size:0.85rem; font-weight:600; color:var(--accent-primary); display:block; margin-bottom:12px; letter-spacing:0.05em; text-transform:uppercase;">Paramètres SEO (Référencement)</label>
                                <div class="admin-form-group">
                                    <label>Titre du site (Meta Title) :</label>
                                    <input type="text" id="adm-seo-title" class="admin-input" placeholder="Mon Portfolio | Développeur Web">
                                </div>
                                <div class="admin-form-group">
                                    <label>Description du site (Meta Description) :</label>
                                    <textarea id="adm-seo-description" class="admin-textarea" rows="2" placeholder="Découvrez mon portfolio, mes projets et mes compétences..."></textarea>
                                </div>
                                <div class="admin-form-group">
                                    <label>Mots-clés (Meta Keywords) :</label>
                                    <input type="text" id="adm-seo-keywords" class="admin-input" placeholder="portfolio, développeur, web, react, nodejs">
                                </div>
                            </div>

                        <!-- BARRE DE SAUVEGARDE PERMANENTE -->
                          <div style="display: flex; gap: 10px; margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 14px;">
                            <button type="submit" class="btn-admin-action btn-admin-primary" style="flex: 1; padding: 12px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Enregistrer les Modifications en Direct (Supabase)
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Inject crop modal
    const cropHTML = `
    <div class="admin-modal-overlay" id="core-crop-overlay" style="z-index:100000;">
        <div class="admin-modal-card" style="max-width:500px; max-height:90vh; display:flex; flex-direction:column;">
            <div class="admin-header" style="flex-shrink:0;">
                <div class="admin-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Rogner la photo</div>
                <button type="button" class="btn-close-modal" onclick="closeCropModal()">✕</button>
            </div>
            <div class="admin-body" style="padding:16px; overflow-y:auto; flex:1; text-align:center;">
                <div style="position:relative; display:inline-block; max-width:100%;">
                    <img id="crop-image" src="" style="max-width:100%; max-height:50vh; display:block;">
                    <div id="crop-box" style="position:absolute; inset:0; border:2px dashed var(--accent-primary); cursor:move; resize:both; overflow:hidden; min-width:80px; min-height:80px; background:rgba(0,0,0,0.3);"></div>
                </div>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:8px;">Redimensionnez le cadre pour choisir la zone à conserver (carré).</p>
                <div style="display:flex; gap:10px; margin-top:12px; justify-content:center;">
                    <button type="button" class="btn-admin-action" onclick="closeCropModal()">Annuler</button>
                    <button type="button" class="btn-admin-action btn-admin-primary" onclick="applyCrop()">Appliquer le rognage</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', cropHTML);
}

function openCoreAuthModal() {
    const overlay = document.getElementById('core-auth-modal-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeCoreAuthModal() {
    const overlay = document.getElementById('core-auth-modal-overlay');
    if (overlay) overlay.classList.remove('active');
}

function switchCmsTab(tabName) {
    document.querySelectorAll('.cms-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.adm-tab-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(`cms-tab-${tabName}`);
    const targetBtn = document.getElementById(`tab-btn-${tabName}`);

    if (targetTab) targetTab.style.display = 'block';
    if (targetBtn) targetBtn.classList.add('active');
    if (tabName === 'gallery') { loadGalleryImages(); }
    if (tabName === 'apparence') { loadApparenceColors(); }
}

window.openAuthLoginModal = function() {
    openCoreAuthModal();
    document.getElementById('core-auth-title').innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Connexion Propriétaire`;
    document.getElementById('core-auth-desc').textContent = `Entrez vos identifiants administrateur Supabase.`;
    document.getElementById('core-view-login').style.display = 'block';
    document.getElementById('core-view-wizard').style.display = 'none';
    document.getElementById('core-view-admin').style.display = 'none';
    hideCoreAuthMessages();
};

window.openSetupWizardModal = function() {
    openCoreAuthModal();
    document.getElementById('core-auth-title').innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Assistant d'Installation Supabase`;
    document.getElementById('core-auth-desc').textContent = `Associez votre compte Supabase gratuit en 2 minutes.`;
    document.getElementById('core-view-login').style.display = 'none';
    document.getElementById('core-view-wizard').style.display = 'block';
    document.getElementById('core-view-admin').style.display = 'none';
    document.getElementById('core-view-hub').style.display = 'none';
    document.getElementById('core-view-theme').style.display = 'none';
    goToWizStep(1);
    hideCoreAuthMessages();
};

window.openAdminModal = async function() {
    openCoreAuthModal();
    document.getElementById('core-auth-title').innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Panneau de Configuration No-Code`;
    document.getElementById('core-auth-desc').textContent = `Gérez tous vos contenus en direct sur Supabase.`;
    document.getElementById('core-view-login').style.display = 'none';
    document.getElementById('core-view-wizard').style.display = 'none';
    document.getElementById('core-view-hub').style.display = 'none';
    document.getElementById('core-view-admin').style.display = 'block';
    switchCmsTab('profil');
    hideCoreAuthMessages();

    // Remplir les champs avec les données actuelles
    if (window.getPortfolioDataAsync) {
        const data = await window.getPortfolioDataAsync({});
        if (data) {
            if (data.hero) {
                document.getElementById('adm-name').value = data.hero.name || '';
                document.getElementById('adm-title').value = data.hero.title || data.hero.subtitle || '';
                document.getElementById('adm-username').value = data.hero.username || '';
                document.getElementById('adm-cta').value = data.hero.ctaText || '';
            }
            if (data.about) {
                document.getElementById('adm-about-file').value = data.about.file || 'about.md';
                document.getElementById('adm-bio').value = data.about.content || '';
            }
            if (data.hero) {
                document.getElementById('adm-logo').value = data.hero.logo || '';
                document.getElementById('adm-label').value = data.hero.label || '';
                document.getElementById('adm-favicon').value = data.hero.favicon || '';
                // Preview favicon image if present
                const fav = data.hero.favicon;
                if (fav) setFavicon(fav);
            }
            if (data.about) {
                const photoUrl = data.about.photo || '';
                document.getElementById('adm-photo').value = photoUrl;
                const preview = document.getElementById('adm-photo-preview');
                if (photoUrl) {
                    preview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = photoUrl;
                    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                    preview.appendChild(img);
                } else {
                    preview.textContent = 'Aperçu';
                }
            }
            if (data.contact) {
                document.getElementById('adm-email').value = data.contact.email || '';
                document.getElementById('adm-github').value = data.contact.github || '';
                document.getElementById('adm-linkedin').value = data.contact.linkedin || '';
                document.getElementById('adm-whatsapp').value = data.contact.whatsapp || '';
                document.getElementById('adm-twitter').value = data.contact.twitter || '';
                document.getElementById('adm-instagram').value = data.contact.instagram || '';
                document.getElementById('adm-youtube').value = data.contact.youtube || '';
            }

            // Remplir les listes dynamiques (Projets, Compétences, Expériences)
            renderCmsSkillsRows(data.skills || []);
            renderCmsProjectsRows(data.projects || []);
            renderCmsExperienceRows(data.experience || []);
        }
    }

    // Initialiser l'état du toggle bypass admin
    const bypassToggle = document.getElementById('adm-bypass-toggle');
    if (bypassToggle) {
        bypassToggle.checked = window.isAdminBypassEnabled ? window.isAdminBypassEnabled() : false;
    }
};

/* GESTION COMPÉTENCES */
function renderCmsSkillsRows(skills) {
    const container = document.getElementById('adm-skills-container');
    if (!container) return;
    container.innerHTML = '';
    skills.forEach((s, idx) => addCmsSkillRow(s));
}

function addCmsSkillRow(skill = {}) {
    const container = document.getElementById('adm-skills-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'cms-dynamic-row';
    div.style.cssText = 'background: var(--bg-primary); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid var(--border-color);';
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <strong style="font-size: 0.85rem;">Compétence</strong>
            <button type="button" onclick="this.parentElement.parentElement.remove()" style="color:#FF7B72; background:none; border:none; cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Supprimer</button>
        </div>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
            <input type="text" class="admin-input sk-name" placeholder="Ex: React / Node.js" value="${skill.name || ''}">
            <input type="number" class="admin-input sk-level" placeholder="%" value="${skill.level || 90}">
        </div>
    `;
    container.appendChild(div);
}

/* GESTION PROJETS */
function renderCmsProjectsRows(projects) {
    const container = document.getElementById('adm-projects-container');
    if (!container) return;
    container.innerHTML = '';
    projects.forEach(p => addCmsProjectRow(p));
}

function addCmsProjectRow(proj = {}) {
    const container = document.getElementById('adm-projects-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'cms-dynamic-row';
    div.style.cssText = 'background: var(--bg-primary); padding: 12px; border-radius: 6px; margin-bottom: 12px; border: 1px solid var(--border-color);';
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <strong style="font-size: 0.85rem; color: var(--accent-primary);">Projet</strong>
            <button type="button" onclick="this.parentElement.parentElement.remove()" style="color:#FF7B72; background:none; border:none; cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Supprimer</button>
        </div>
        <div class="admin-form-group" style="margin-bottom:8px;">
            <input type="text" class="admin-input pr-title" placeholder="Titre du projet" value="${proj.title || ''}">
        </div>
        <div class="admin-form-group" style="margin-bottom:8px;">
            <textarea class="admin-textarea pr-desc" rows="2" placeholder="Description du projet">${proj.desc || ''}</textarea>
        </div>
        <div class="admin-form-group" style="margin-bottom:8px;">
            <input type="text" class="admin-input pr-tags" placeholder="Tags (séparés par des virgules: React, Node.js)" value="${(proj.tags || []).join(', ')}">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <input type="text" class="admin-input pr-github" placeholder="Lien Code / GitHub" value="${proj.github || ''}">
            <input type="text" class="admin-input pr-live" placeholder="Lien Live Demo" value="${proj.live || ''}">
        </div>
    `;
    container.appendChild(div);
}

/* GESTION EXPÉRIENCES */
function renderCmsExperienceRows(expList) {
    const container = document.getElementById('adm-experiences-container');
    if (!container) return;
    container.innerHTML = '';
    expList.forEach(e => addCmsExperienceRow(e));
}

function addCmsExperienceRow(exp = {}) {
    const container = document.getElementById('adm-experiences-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'cms-dynamic-row';
    div.style.cssText = 'background: var(--bg-primary); padding: 12px; border-radius: 6px; margin-bottom: 12px; border: 1px solid var(--border-color);';
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <strong style="font-size: 0.85rem; color: var(--accent-secondary);">Expérience / Poste</strong>
            <button type="button" onclick="this.parentElement.parentElement.remove()" style="color:#FF7B72; background:none; border:none; cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Supprimer</button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom:8px;">
            <input type="text" class="admin-input ex-role" placeholder="Poste (ex: Lead Dev)" value="${exp.role || ''}">
            <input type="text" class="admin-input ex-company" placeholder="Entreprise" value="${exp.company || ''}">
        </div>
        <div class="admin-form-group" style="margin-bottom:8px;">
            <input type="text" class="admin-input ex-date" placeholder="Période (ex: 2022 - Présent)" value="${exp.date || ''}">
        </div>
        <div class="admin-form-group" style="margin-bottom:0;">
            <textarea class="admin-textarea ex-desc" rows="2" placeholder="Description des missions">${exp.desc || ''}</textarea>
        </div>
    `;
    container.appendChild(div);
}

function goToWizStep(stepNum) {
    document.querySelectorAll('.wizard-step').forEach(s => s.style.display = 'none');
    const target = document.getElementById(`wiz-step-${stepNum}`);
    if (target) target.style.display = 'block';
}

function showCoreAuthError(msg) {
    const err = document.getElementById('core-auth-error');
    if (err) {
        err.textContent = msg;
        err.style.display = 'block';
    }
}

function showCoreAuthSuccess(msg) {
    const succ = document.getElementById('core-auth-success');
    if (succ) {
        succ.textContent = msg;
        succ.style.display = 'block';
    }
}

function hideCoreAuthMessages() {
    const err = document.getElementById('core-auth-error');
    const succ = document.getElementById('core-auth-success');
    if (err) { err.style.display = 'none'; err.textContent = ''; }
    if (succ) { succ.style.display = 'none'; succ.textContent = ''; }
}

async function handleCoreLoginSubmit() {
    hideCoreAuthMessages();
    const email = document.getElementById('core-login-email').value;
    const pass = document.getElementById('core-login-pass').value;

    // Mode test : n'importe quel email/password fonctionne en local
    if (email && pass) {
        openHubModal();
        return;
    }

    const res = await loginWithSupabase(email, pass);
    if (res.error) {
        showCoreAuthError(` ${res.error}`);
    } else {
        openHubModal();
    }
}

async function saveAdminCMSData() {
    hideCoreAuthMessages();
    const currentData = await getPortfolioDataAsync({});
    
    const newData = collectBackupData();
    newData.theme = currentData.theme || {};
    
    const success = await savePortfolioDataAsync(newData);
    
    showCoreAuthSuccess(' Enregistré avec succès ! Mise à jour en cours...');
    
    setTimeout(() => {
        closeCoreAuthModal();
        window.location.reload();
    }, 1200);
}
async function handleCoreLogout() {
    await logoutSupabaseOwner();
    closeCoreAuthModal();
    alert(' Vous êtes déconnecté.');
}

function handleChangeAdminSecret() {
    const newSecret = document.getElementById('adm-new-secret')?.value;
    const confirmSecret = document.getElementById('adm-confirm-secret')?.value;
    const msgEl = document.getElementById('adm-secret-msg');

    if (!newSecret || newSecret.length < 4) {
        msgEl.style.cssText = 'color:#FF7B72;';
        msgEl.textContent = 'Le secret doit faire au moins 4 caractères.';
        return;
    }
    if (newSecret !== confirmSecret) {
        msgEl.style.cssText = 'color:#FF7B72;';
        msgEl.textContent = 'Les deux secrets ne correspondent pas.';
        return;
    }

    setStoredSecretHash(newSecret).then(hash => {
        const bypassOn = document.getElementById('adm-bypass-toggle')?.checked;
        msgEl.style.cssText = 'color:#3FB950;';
        if (bypassOn) {
            msgEl.textContent = '✓ Nouveau secret enregistré (hashé SHA-256). Utilisez ?admin=' + newSecret + ' pour l\'accès rapide.';
        } else {
            msgEl.textContent = '✓ Nouveau secret enregistré (hashé SHA-256). Le bypass URL est désactivé — activez-le dans la section sécurité si besoin.';
        }
        document.getElementById('adm-new-secret').value = '';
        document.getElementById('adm-confirm-secret').value = '';
    });
}

function handleBypassToggle() {
    const toggle = document.getElementById('adm-bypass-toggle');
    if (window.setAdminBypassEnabled) {
        window.setAdminBypassEnabled(toggle.checked);
    }
    const msgEl = document.getElementById('adm-secret-msg');
    if (msgEl) {
        msgEl.style.cssText = 'color:' + (toggle.checked ? '#FF7B72' : '#3FB950') + ';';
        msgEl.textContent = toggle.checked
            ? '⚠️ Bypass URL activé. L\'accès admin via ?admin=SECRET est maintenant possible.'
            : '✓ Bypass URL désactivé. L\'accès admin via URL est maintenant bloqué.';
        setTimeout(() => { msgEl.textContent = ''; }, 3000);
    }
}

/* ─── BACKUP / RESTORE JSON ─── */
function collectBackupData() {
    const readVal = (id) => (document.getElementById(id) || {}).value || '';
    const readCb = (id) => (document.getElementById(id) || {}).checked || false;

    // Collect skills from dynamic rows
    const skills = [];
    document.querySelectorAll('#adm-skills-container .cms-dynamic-row').forEach(row => {
        const name = (row.querySelector('.sk-name') || {}).value;
        const level = parseInt((row.querySelector('.sk-level') || {}).value) || 90;
        if (name) skills.push({ name, level });
    });

    // Collect projects
    const projects = [];
    document.querySelectorAll('#adm-projects-container .cms-dynamic-row').forEach(row => {
        const title = (row.querySelector('.pr-title') || {}).value;
        const desc = (row.querySelector('.pr-desc') || {}).value;
        const tagsStr = (row.querySelector('.pr-tags') || {}).value || '';
        const github = (row.querySelector('.pr-github') || {}).value;
        const live = (row.querySelector('.pr-live') || {}).value;
        if (title) projects.push({
            title, desc,
            tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
            github, live
        });
    });

    // Collect experience
    const experience = [];
    document.querySelectorAll('#adm-experiences-container .cms-dynamic-row').forEach(row => {
        const role = (row.querySelector('.ex-role') || {}).value;
        const company = (row.querySelector('.ex-company') || {}).value;
        const date = (row.querySelector('.ex-date') || {}).value;
        const desc = (row.querySelector('.ex-desc') || {}).value;
        if (role) experience.push({ role, company, date, desc });
    });

    return {
        hero: {
            name: readVal('adm-name'),
            title: readVal('adm-title'),
            username: readVal('adm-username'),
            ctaText: readVal('adm-cta'),
            logo: readVal('adm-logo'),
            label: readVal('adm-label'),
            favicon: readVal('adm-favicon'),
        },
        about: {
            file: readVal('adm-about-file'),
            content: readVal('adm-bio'),
            photo: readVal('adm-photo'),
        },
        contact: {
            email: readVal('adm-email'),
            github: readVal('adm-github'),
            linkedin: readVal('adm-linkedin'),
            whatsapp: readVal('adm-whatsapp'),
            twitter: readVal('adm-twitter'),
            instagram: readVal('adm-instagram'),
            youtube: readVal('adm-youtube'),
        },
        skills,
        projects,
        experience,
        visibility: {
            about: readCb('adm-vis-about'),
            skills: readCb('adm-vis-skills'),
            projects: readCb('adm-vis-projects'),
            experience: readCb('adm-vis-experience'),
            contact: readCb('adm-vis-contact'),
        },
        seo: {
            title: readVal('adm-seo-title'),
            description: readVal('adm-seo-description'),
            keywords: readVal('adm-seo-keywords'),
        },
        _exportedAt: new Date().toISOString(),
        _version: '4.0'
    };
}

function handleExportBackup() {
    const msgEl = document.getElementById('adm-backup-msg');
    try {
        const data = collectBackupData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        msgEl.style.cssText = 'color:#3FB950;';
        msgEl.textContent = '✓ Fichier exporté avec succès.';
        setTimeout(() => { msgEl.textContent = ''; }, 3000);
    } catch(e) {
        msgEl.style.cssText = 'color:#FF7B72;';
        msgEl.textContent = 'Erreur lors de l\'export : ' + e.message;
    }
}

function handleImportBackup(event) {
    const file = event.target.files && event.target.files[0];
    const msgEl = document.getElementById('adm-backup-msg');
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.hero) {
                msgEl.style.cssText = 'color:#FF7B72;';
                msgEl.textContent = 'Fichier invalide — la structure hero est manquante.';
                return;
            }

            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el && val !== undefined) el.value = val;
            };
            const setCb = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.checked = !!val;
            };

            // Fill hero fields
            if (data.hero) {
                setVal('adm-name', data.hero.name);
                setVal('adm-title', data.hero.title);
                setVal('adm-username', data.hero.username);
                setVal('adm-cta', data.hero.ctaText);
                setVal('adm-logo', data.hero.logo);
                setVal('adm-label', data.hero.label);
                setVal('adm-favicon', data.hero.favicon);
            }

            // Fill about
            if (data.about) {
                setVal('adm-about-file', data.about.file);
                setVal('adm-bio', data.about.content);
                setVal('adm-photo', data.about.photo);
                const preview = document.getElementById('adm-photo-preview');
                if (data.about.photo && preview) {
                    preview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = data.about.photo;
                    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                    preview.appendChild(img);
                } else if (preview) {
                    preview.textContent = 'Aperçu';
                }
            }

            // Fill contact
            if (data.contact) {
                setVal('adm-email', data.contact.email);
                setVal('adm-github', data.contact.github);
                setVal('adm-linkedin', data.contact.linkedin);
                setVal('adm-whatsapp', data.contact.whatsapp);
                setVal('adm-twitter', data.contact.twitter);
                setVal('adm-instagram', data.contact.instagram);
                setVal('adm-youtube', data.contact.youtube);
            }

            // Fill visibility
            if (data.visibility) {
                setCb('adm-vis-about', data.visibility.about);
                setCb('adm-vis-skills', data.visibility.skills);
                setCb('adm-vis-projects', data.visibility.projects);
                setCb('adm-vis-experience', data.visibility.experience);
                setCb('adm-vis-contact', data.visibility.contact);
            }

            // Fill SEO
            if (data.seo) {
                setVal('adm-seo-title', data.seo.title);
                setVal('adm-seo-description', data.seo.description);
                setVal('adm-seo-keywords', data.seo.keywords);
            }

            // Fill dynamic rows
            if (data.skills) renderCmsSkillsRows(data.skills);
            if (data.projects) renderCmsProjectsRows(data.projects);
            if (data.experience) renderCmsExperienceRows(data.experience);

            msgEl.style.cssText = 'color:#3FB950;';
            msgEl.textContent = '✓ Données restaurées. Cliquez sur "Enregistrer" pour sauvegarder définitivement.';
            setTimeout(() => { msgEl.textContent = ''; }, 5000);
        } catch(e) {
            msgEl.style.cssText = 'color:#FF7B72;';
            msgEl.textContent = 'Erreur de lecture du fichier : ' + e.message;
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

async function finishWizardSetup() {
    hideCoreAuthMessages();
    const url = document.getElementById('wiz-supabase-url').value;
    const key = document.getElementById('wiz-supabase-key').value;
    const email = document.getElementById('wiz-admin-email').value;
    const pass = document.getElementById('wiz-admin-pass').value;

    if (!url || !key || !email || !pass) {
        showCoreAuthError(' Veuillez remplir tous les champs de l\'assistant.');
        return;
    }

    await setSupabaseCredentialsAndInit(url, key);
    const res = await signUpOwnerWithSupabase(email, pass);

    if (res.error && !res.error.includes('already registered')) {
        const loginRes = await loginWithSupabase(email, pass);
        if (loginRes.error) {
            showCoreAuthError(` ${loginRes.error}`);
            return;
        }
    }

    alert(' Configuration Supabase terminée avec succès !');
    openAdminModal();
}

function copySqlScriptToClipboard() {
    const sql = `
-- TABlE PORTFOLIO DATA (Row Level Security Active)
CREATE TABLE IF NOT EXISTS public.portfolio_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    json_content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT portfolio_user_unique UNIQUE (user_id)
);

-- ACTIVATION RLS
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- POLITIQUE LECTURE PUBLIQUE (Tous les visiteurs voient le site)
CREATE POLICY "Public Read Access" 
ON public.portfolio_data 
FOR SELECT 
USING (true);

-- POLITIQUE ÉCRITURE PROPRIÉTAIRE (Seul l'admin authentifié modifie ses données)
CREATE POLICY "Owner Write Access" 
ON public.portfolio_data 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
    `.trim();

    navigator.clipboard.writeText(sql).then(() => {
        alert(' Script SQL copié dans votre presse-papier ! Collez-le dans l\'éditeur SQL de votre Dashboard Supabase.');
    });
}


// ─── DYNAMIC ANIMATION CONFIGURATION PER TEMPLATE ──────────────────────────
const TEMPLATE_ANIM_CONFIGS = {
    'terminal-craft': [
        { id: 'matrix-color', label: 'Couleur Pluie (Matrix)', type: 'color', default: '#00F0FF', cssVar: 'matrix-color' },
        { id: 'snake-char', label: 'Caractère du Serpent', type: 'select', default: '█', cssVar: 'snake-char', options: [
            { val: '█', label: 'Bloc plein (█)' },
            { val: '▄', label: 'Demi-bloc (▄)' },
            { val: '░', label: 'Ombré (░)' },
            { val: '#', label: 'Dièse (#)' },
            { val: '*', label: 'Astérisque (*)' },
            { val: '~', label: 'Onde (~)' },
            { val: '>', label: 'Flèche (>)' },
            { val: '0', label: 'Zéro (0)' }
        ] },
        { id: 'snake-speed', label: 'Vitesse Serpent (ms)', type: 'range', min: 10, max: 200, step: 10, default: 80, cssVar: 'snake-speed', unit: 'ms' }
    ],
    'blueprint': [
        { id: 'grid-color', label: 'Couleur des Lignes', type: 'color', default: '#FFA726', cssVar: 'blueprint-grid-color' },
        { id: 'grid-lights', label: 'Lumières dynamiques', type: 'checkbox', default: true, cssVar: 'blueprint-lights' }
    ],
    'motion-stack': [
        { id: 'bg-light-color', label: 'Couleur Lumière Fond', type: 'color', default: '#58A6FF', cssVar: 'stack-light-color' },
        { id: 'stack-dir', label: 'Sens Rotation', type: 'select', default: '1', cssVar: 'stack-dir', options: [{ val: '1', label: 'Horaire' }, { val: '-1', label: 'Anti-horaire' }] },
        { id: 'stack-levitation', label: 'Lévitation active', type: 'checkbox', default: true, cssVar: 'stack-levitation' },
        { id: 'mesh-blob-enable', label: 'Blobs lumières (mesh)', type: 'checkbox', default: true, cssVar: 'mesh-blob-enable' },
        { id: 'morph-words', label: 'Mots (séparés par virgule)', type: 'text', default: '"Motion Stack","Full-Stack Dev","UI Architect","Creative Coder"', cssVar: 'morph-words' },
        { id: 'card-stack-angle', label: 'Inclinaison cartes (°)', type: 'range', min: 1, max: 10, step: 0.5, default: 3, cssVar: 'card-stack-angle', unit: '°' },
        { id: 'card-stack-z', label: 'Profondeur cartes (px)', type: 'range', min: 10, max: 100, step: 5, default: 40, cssVar: 'card-stack-z', unit: 'px' },
        { id: 'marquee-speed', label: 'Vitesse marquee (s)', type: 'range', min: 10, max: 60, step: 2, default: 30, cssVar: 'marquee-speed', unit: 's' }
    ],
    'quiet-system': [
        { id: 'grain-color', label: 'Couleur du Grain', type: 'color', default: '#ffffff', cssVar: 'grain-color' },
        { id: 'grain-intensity', label: 'Intensité Grain', type: 'range', min: 0.01, max: 0.2, step: 0.01, default: 0.05, cssVar: 'grain-intensity', unit: '' },
        { id: 'blur-intro', label: 'Douceur (Blur) Intro', type: 'range', min: 0, max: 20, step: 1, default: 10, cssVar: 'blur-intro', unit: 'px' }
    ],
    'gallery-wall': [
        { id: 'gallery-bg', label: 'Mur Musée (Fond)', type: 'checkbox', default: true, cssVar: 'gallery-bg' },
        { id: 'gallery-layout', label: 'Disposition côte à côte', type: 'checkbox', default: false, cssVar: 'gallery-layout' }
    ],
    'paper-cut': [
        { id: 'paper-crease', label: 'Froissage / Pliures', type: 'checkbox', default: true, cssVar: 'paper-crease' },
        { id: 'paper-depth', label: 'Profondeur Ombres', type: 'range', min: 0, max: 50, step: 1, default: 20, cssVar: 'paper-depth', unit: 'px' }
    ],
    'neon-reel': [
        { id: 'neon-color-bg', label: 'Couleur Néon Fond', type: 'color', default: '#ff00ff', cssVar: 'neon-color-bg' },
        { id: 'neon-blink', label: 'Clignotement Néon', type: 'checkbox', default: true, cssVar: 'neon-blink' },
        { id: 'neon-glide', label: 'Glissement Lumineux', type: 'checkbox', default: true, cssVar: 'neon-glide' }
    ],
    'boardroom': [
        { id: 'liquid-glass', label: 'Effet Liquid Glass', type: 'checkbox', default: true, cssVar: 'liquid-glass' },
        { id: 'glass-opacity', label: 'Opacité du Verre', type: 'range', min: 0.1, max: 0.9, step: 0.05, default: 0.4, cssVar: 'glass-opacity', unit: '' }
    ],
    'momentum': [
        { id: 'speed-lines', label: 'Speed Lines (Fond)', type: 'checkbox', default: true, cssVar: 'speed-lines' },
        { id: 'speed-lines-color', label: 'Couleur Speed Lines', type: 'color', default: 'rgba(255,255,255,0.1)', cssVar: 'speed-lines-color' },
        { id: 'motion-blur', label: 'Motion Blur Souris', type: 'checkbox', default: true, cssVar: 'motion-blur' }
    ],
    'the-ledger': [
        { id: 'data-ticker', label: 'Data Ticker Actif', type: 'checkbox', default: true, cssVar: 'data-ticker' },
        { id: 'chart-bg', label: 'Graphique Boursier (Fond)', type: 'checkbox', default: true, cssVar: 'chart-bg' }
    ],
    'first-chapter': [
        { id: 'dust-particles', label: 'Poussière Dorée', type: 'checkbox', default: true, cssVar: 'dust-particles' },
        { id: 'page-curl', label: 'Effet Tourne-Page', type: 'checkbox', default: true, cssVar: 'page-curl' }
    ],
    'field-notes': [
        { id: 'ink-drops', label: 'Gouttes d\'Encre/Café', type: 'checkbox', default: true, cssVar: 'ink-drops' },
        { id: 'wind-effect', label: 'Vent Léger (Carnet)', type: 'checkbox', default: true, cssVar: 'wind-effect' }
    ],
    'atelier': [
        { id: 'sparks', label: 'Étincelles de création', type: 'checkbox', default: true, cssVar: 'sparks' },
        { id: 'glare-effect', label: 'Reflet Matériau', type: 'checkbox', default: true, cssVar: 'glare-effect' }
    ],
    'signal': [
        { id: 'radar-sweep', label: 'Balayage Radar', type: 'checkbox', default: true, cssVar: 'radar-sweep' },
        { id: 'tv-interference', label: 'Interférence TV (Glitch)', type: 'checkbox', default: false, cssVar: 'tv-interference' }
    ],
    'constellation': [
        { id: 'galaxy-mode', label: 'Mode Voie Lactée', type: 'checkbox', default: false, cssVar: 'galaxy-mode' },
        { id: 'stars-multi', label: 'Étoiles Multicolores', type: 'checkbox', default: true, cssVar: 'stars-multi' }
    ]
};

function generateAnimControlHTML(control, savedValue) {
    const val = savedValue !== undefined ? savedValue : control.default;
    let html = `<div class="admin-form-group">
        <label>${control.label} :</label>
        <div style="display:flex; gap:10px; align-items:center; margin-top:8px;">`;

    if (control.type === 'color') {
        html += `<input type="color" id="dyn-anim-${control.id}" oninput="applyThemeLivePreview()" value="${val}" style="width:40px;height:40px;cursor:pointer;background:none;border:none;padding:0;">
                 <input type="text" class="admin-input" id="dyn-anim-${control.id}-txt" oninput="document.getElementById('dyn-anim-${control.id}').value=this.value;applyThemeLivePreview()" value="${val}" style="flex:1;">`;
    } else if (control.type === 'text') {
        html += `<input type="text" class="admin-input" id="dyn-anim-${control.id}-txt" oninput="applyThemeLivePreview()" value="${val}" style="flex:1;">`;
    } else if (control.type === 'range') {
        const numericVal = (typeof val === 'string' && control.unit) ? val.replace(control.unit, '') : val;
        html += `<input type="range" id="dyn-anim-${control.id}-range" min="${control.min}" max="${control.max}" step="${control.step}" value="${numericVal}" oninput="document.getElementById('dyn-anim-${control.id}-val').textContent=this.value+'${control.unit}'; applyThemeLivePreview()" style="flex:1; accent-color:var(--accent-primary);">
                 <span id="dyn-anim-${control.id}-val" style="font-size:0.8rem; font-weight:bold; min-width:40px;">${numericVal}${control.unit}</span>`;
    } else if (control.type === 'checkbox') {
        const checkedStr = (val === true || val === 'true') ? 'checked' : '';
        html += `<label style="display:flex; align-items:center; cursor:pointer;">
                    <input type="checkbox" id="dyn-anim-${control.id}-check" onchange="applyThemeLivePreview()" ${checkedStr} style="margin-right:8px; width:18px; height:18px; accent-color:var(--accent-primary);"> Activer
                 </label>`;
    } else if (control.type === 'select') {
        html += `<select id="dyn-anim-${control.id}-sel" class="admin-input" onchange="applyThemeLivePreview()" style="flex:1;">`;
        control.options.forEach(opt => {
            const selStr = (opt.val == val) ? 'selected' : '';
            html += `<option value="${opt.val}" ${selStr}>${opt.label}</option>`;
        });
        html += `</select>`;
    }

    html += `</div></div>`;
    return html;
}


window.openHubModal = function() {
    openCoreAuthModal();
    document.getElementById('core-auth-title').innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Panneau de Contrôle Central`;
    document.getElementById('core-auth-desc').textContent = `Que souhaitez-vous administrer ?`;
    document.getElementById('core-view-login').style.display = 'none';
    document.getElementById('core-view-wizard').style.display = 'none';
    document.getElementById('core-view-theme').style.display = 'none';
    document.getElementById('core-view-admin').style.display = 'none';
    document.getElementById('core-view-hub').style.display = 'block';
    hideCoreAuthMessages();
};


window.openThemeEditor = async function() {
    openCoreAuthModal();
    document.getElementById('core-auth-title').innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.88 0 1.59-.69 1.63-1.56.02-.38-.11-.75-.38-1.04-.26-.28-.39-.67-.35-1.07.08-.85.83-1.49 1.69-1.49H19c1.66 0 3-1.34 3-3 0-4.97-4.48-9-10-9z"></path><circle cx="7.5" cy="10.5" r="1.5"></circle><circle cx="10.5" cy="7.5" r="1.5"></circle><circle cx="14.5" cy="7.5" r="1.5"></circle><circle cx="17.5" cy="10.5" r="1.5"></circle></svg> Éditeur de Thème Global`;
    document.getElementById('core-auth-desc').textContent = `Modifiez l'apparence du site. Un aperçu en direct est affiché.`;
    document.getElementById('core-view-hub').style.display = 'none';
    document.getElementById('core-view-admin').style.display = 'none';
    document.getElementById('core-view-theme').style.display = 'block';

    
    // Charger les couleurs actuelles du DOM ou des données Supabase
    const rootStyles = getComputedStyle(document.documentElement);
    
    // Fonction d'aide pour extraire l'hexa (très simplifiée, on présume du format existant ou hex)
    const getHexFromVar = (varName) => {
        let val = rootStyles.getPropertyValue(varName).trim();
        return val;
    };

    // Pré-remplir (si existant dans Supabase)
    const data = await window.getPortfolioDataAsync({});
    let themeData = (data && data.theme) ? data.theme : {};
    
    document.getElementById('thm-bg-primary').value = themeData.bgPrimary || getHexFromVar('--bg-primary') || '#0D1117';
    document.getElementById('thm-bg-primary-txt').value = document.getElementById('thm-bg-primary').value;
    
    document.getElementById('thm-bg-secondary').value = themeData.bgSecondary || getHexFromVar('--bg-secondary') || '#161B22';
    document.getElementById('thm-bg-secondary-txt').value = document.getElementById('thm-bg-secondary').value;
    
    document.getElementById('thm-accent-primary').value = themeData.accentPrimary || getHexFromVar('--accent-primary') || '#58A6FF';
    document.getElementById('thm-accent-primary-txt').value = document.getElementById('thm-accent-primary').value;
    
    document.getElementById('thm-text-primary').value = themeData.textPrimary || getHexFromVar('--text-primary') || '#E6EDF3';
    document.getElementById('thm-text-primary-txt').value = document.getElementById('thm-text-primary').value;
    
    document.getElementById('thm-border-color').value = themeData.borderColor || getHexFromVar('--border-color') || '#30363D';
    
      document.getElementById('thm-border-color-txt').value = document.getElementById('thm-border-color').value;

      // Pré-remplir Loader
      document.getElementById('thm-loader-text').value = themeData.loaderText || 'KADRE';
      document.getElementById('thm-loader-colors').value = themeData.loaderColors || '';
      
      // Pré-remplir mise en page
      const brVal = themeData.borderRadius || '12px';
      document.getElementById('thm-border-radius').value = parseInt(brVal) || 12;
      document.getElementById('thm-border-radius-val').textContent = brVal;
      if (themeData.layoutWidth) document.getElementById('thm-layout-width').value = themeData.layoutWidth;
      if (themeData.fontFamily) document.getElementById('thm-font-family').value = themeData.fontFamily;
      const nsEl = document.getElementById('thm-navbar-sticky');
      if (nsEl && themeData.navbarSticky !== undefined) nsEl.checked = themeData.navbarSticky;
      
      // RENDER DYNAMIC ANIMATIONS
      const templateId = document.body.getAttribute('data-theme');
      const dynContainer = document.getElementById('thm-anim-dynamic-controls');
      if (templateId && TEMPLATE_ANIM_CONFIGS[templateId] && dynContainer) {
          const controls = TEMPLATE_ANIM_CONFIGS[templateId];
          let html = '<div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">';
          controls.forEach(ctrl => {
              const savedVal = themeData.customAnim ? themeData.customAnim[ctrl.cssVar] : undefined;
              html += generateAnimControlHTML(ctrl, savedVal);
          });
          html += '</div>';
          dynContainer.innerHTML = html;
      } else if (dynContainer) {
          dynContainer.innerHTML = '<div style="font-size:0.8rem; color:var(--text-secondary);">Aucune animation spécifique pour ce template.</div>';
      }

};

window.applyThemeLivePreview = function() {
    const root = document.documentElement;
    const g = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    if (g('thm-bg-primary-txt'))    root.style.setProperty('--bg-primary',       g('thm-bg-primary-txt'));
    if (g('thm-bg-secondary-txt'))  root.style.setProperty('--bg-secondary',     g('thm-bg-secondary-txt'));
    if (g('thm-accent-primary-txt'))root.style.setProperty('--accent-primary',   g('thm-accent-primary-txt'));
    if (g('thm-text-primary-txt'))  root.style.setProperty('--text-primary',     g('thm-text-primary-txt'));
    
      if (g('thm-border-color-txt'))  root.style.setProperty('--border-color',     g('thm-border-color-txt'));
      
      // APPLY DYNAMIC ANIMATIONS
      const templateId = document.body.getAttribute('data-theme');
      if (templateId && TEMPLATE_ANIM_CONFIGS[templateId]) {
          TEMPLATE_ANIM_CONFIGS[templateId].forEach(ctrl => {
              let val = null;
              if (ctrl.type === 'color' || ctrl.type === 'text') val = g(`dyn-anim-${ctrl.id}-txt`);
              else if (ctrl.type === 'range') { val = g(`dyn-anim-${ctrl.id}-range`); if (val !== '') val += (ctrl.unit || ''); }
              else if (ctrl.type === 'checkbox') {
                  const el = document.getElementById(`dyn-anim-${ctrl.id}-check`);
                  val = el ? el.checked : false;
              }
              else if (ctrl.type === 'select') val = g(`dyn-anim-${ctrl.id}-sel`);
              
              if (val !== null && val !== '') root.style.setProperty(`--${ctrl.cssVar}`, val);
          });
      }

    // Mise en page
    if (g('thm-border-radius'))     root.style.setProperty('--border-radius',   g('thm-border-radius') + 'px');
    if (g('thm-layout-width'))      root.style.setProperty('--layout-max-width', g('thm-layout-width'));
    if (g('thm-font-family'))       root.style.setProperty('--font-family',     g('thm-font-family'));
    const stickyEl = document.getElementById('thm-navbar-sticky');
    if (stickyEl) {
        const headerEl = document.querySelector('header, .navbar, .terminal-header, .header');
        if (headerEl) {
            headerEl.style.position = stickyEl.checked ? 'sticky' : 'relative';
            headerEl.style.top = stickyEl.checked ? '0' : '';
        }
    }

    // Animation live
    const animEl = document.getElementById('thm-anim-duration');
    if (animEl) root.style.setProperty('--anim-duration', animEl.value + 's');
    if (g('thm-anim-color1-txt'))   root.style.setProperty('--anim-color-1',     g('thm-anim-color1-txt'));
    if (g('thm-anim-color2-txt'))   root.style.setProperty('--anim-color-2',     g('thm-anim-color2-txt'));
};

window.saveAdminThemeData = async function() {
    hideCoreAuthMessages();
    const currentData = await getPortfolioDataAsync({});
    
    
    currentData.seo = {
        title: document.getElementById('adm-seo-title') ? document.getElementById('adm-seo-title').value : '',
        description: document.getElementById('adm-seo-description') ? document.getElementById('adm-seo-description').value : '',
        keywords: document.getElementById('adm-seo-keywords') ? document.getElementById('adm-seo-keywords').value : ''
    };
    if(typeof window.applySEOSettings === 'function') window.applySEOSettings(currentData.seo);

    currentData.visibility = {
        about: document.getElementById('adm-vis-about') ? document.getElementById('adm-vis-about').checked : true,
        skills: document.getElementById('adm-vis-skills') ? document.getElementById('adm-vis-skills').checked : true,
        projects: document.getElementById('adm-vis-projects') ? document.getElementById('adm-vis-projects').checked : true,
        experience: document.getElementById('adm-vis-experience') ? document.getElementById('adm-vis-experience').checked : true,
        contact: document.getElementById('adm-vis-contact') ? document.getElementById('adm-vis-contact').checked : true
    };
    if(typeof window.applyVisibilitySettings === 'function') window.applyVisibilitySettings(currentData.visibility);

    currentData.theme = currentData.theme || {};
    
    const g2 = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    currentData.theme.bgPrimary    = g2('thm-bg-primary-txt');
    currentData.theme.bgSecondary  = g2('thm-bg-secondary-txt');
    currentData.theme.accentPrimary= g2('thm-accent-primary-txt');
    currentData.theme.textPrimary  = g2('thm-text-primary-txt');
    currentData.theme.borderColor  = g2('thm-border-color-txt');

    // Loader
    currentData.theme.loaderText = g2('thm-loader-text');
    currentData.theme.loaderColors = g2('thm-loader-colors');

    // Mise en page
    currentData.theme.borderRadius = g2('thm-border-radius') + 'px';
    currentData.theme.layoutWidth = g2('thm-layout-width');
    currentData.theme.fontFamily = g2('thm-font-family');
    const stickyCheck = document.getElementById('thm-navbar-sticky');
    currentData.theme.navbarSticky = stickyCheck ? stickyCheck.checked : true;

    // Animations
    const animDurEl = document.getElementById('thm-anim-duration');
    if (animDurEl) currentData.theme.animDuration = animDurEl.value + 's';
    currentData.theme.animColor1 = g2('thm-anim-color1-txt');
    currentData.theme.animColor2 = g2('thm-anim-color2-txt');
    
    // SAVE DYNAMIC ANIMATIONS (per-template)
    currentData.theme.customAnim = {};
    const templateId = document.body.getAttribute('data-theme');
    if (templateId && TEMPLATE_ANIM_CONFIGS[templateId]) {
        TEMPLATE_ANIM_CONFIGS[templateId].forEach(ctrl => {
            let val = null;
            if (ctrl.type === 'color' || ctrl.type === 'text') val = g2(`dyn-anim-${ctrl.id}-txt`);
            else if (ctrl.type === 'range') val = document.getElementById(`dyn-anim-${ctrl.id}-range`)?.value;
            else if (ctrl.type === 'checkbox') { const el = document.getElementById(`dyn-anim-${ctrl.id}-check`); val = el ? el.checked : false; }
            else if (ctrl.type === 'select') val = document.getElementById(`dyn-anim-${ctrl.id}-sel`)?.value;
            if (val !== null && val !== undefined) currentData.theme.customAnim[ctrl.cssVar] = val + (ctrl.unit || '');
        });
    }
    
    const success = await savePortfolioDataAsync(currentData);
    
    showCoreAuthSuccess(' Thème enregistré avec succès ! Mise à jour...');
    setTimeout(() => { 
        closeCoreAuthModal(); 
        window.location.reload();
    }, 1200);
};

window.startDemoMode = function() { window.openHubModal(); if(typeof showCoreAuthSuccess === 'function') showCoreAuthSuccess('Mode Démo Activé : Sauvegarde dans le navigateur uniquement.'); };

// ─── PHOTO UPLOAD & CROP ─────────────────────────────────────────────────────
let cropFileDataUrl = '';

function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        if (dataUrl.length > 2000000) {
            document.getElementById('adm-photo-size-warn').style.display = 'block';
        } else {
            document.getElementById('adm-photo-size-warn').style.display = 'none';
        }
        openCropModal(dataUrl);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function openCropModal(dataUrl) {
    cropFileDataUrl = dataUrl;
    const img = document.getElementById('crop-image');
    img.src = dataUrl;
    img.onload = function() {
        const box = document.getElementById('crop-box');
        const size = Math.min(img.naturalWidth, img.naturalHeight, 300);
        box.style.width = size + 'px';
        box.style.height = size + 'px';
        box.style.left = ((img.width - size) / 2) + 'px';
        box.style.top = ((img.height - size) / 2) + 'px';
    };
    document.getElementById('core-crop-overlay').classList.add('active');
}

function closeCropModal() {
    document.getElementById('core-crop-overlay').classList.remove('active');
    cropFileDataUrl = '';
}

function applyCrop() {
    const img = document.getElementById('crop-image');
    const box = document.getElementById('crop-box');
    const rect = img.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const sx = (boxRect.left - rect.left) * scaleX;
    const sy = (boxRect.top - rect.top) * scaleY;
    const sw = boxRect.width * scaleX;
    const sh = boxRect.height * scaleY;

    const canvas = document.createElement('canvas');
    const size = Math.round(Math.min(sw, sh, 400));
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Center crop to square
    const cx = sx + sw / 2;
    const cy = sy + sh / 2;
    ctx.drawImage(img, cx - size/2/scaleX, cy - size/2/scaleY, size/scaleX, size/scaleY, 0, 0, size, size);

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    document.getElementById('adm-photo').value = croppedDataUrl;
    document.getElementById('adm-photo-preview').innerHTML = `<img src="${croppedDataUrl}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
    closeCropModal();
}

// ─── FAVICON UPLOAD ──────────────────────────────────────────────────────────
function handleFaviconUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('adm-favicon').value = e.target.result;
        // Preview the favicon
        setFavicon(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

// KadreCore namespace aliases (backward compat)
KadreCore.ui.openAuth = window.openAuthLoginModal;
KadreCore.ui.openSetup = window.openSetupWizardModal;
KadreCore.ui.openAdmin = window.openAdminModal;
KadreCore.ui.openHub = window.openHubModal;
KadreCore.ui.openTheme = window.openThemeEditor;
KadreCore.ui.close = closeCoreAuthModal;
KadreCore.ui.applyTheme = applyThemeLivePreview;


// =============================================
// GALLERY IMAGES CMS MANAGEMENT
// =============================================

// Marquee Mode
function getMarqueeMode() { return localStorage.getItem('kadre_marquee_mode_v1') || 'mixed'; }
function setMarqueeMode(mode) { localStorage.setItem('kadre_marquee_mode_v1', mode); }
function saveMarqueeMode() { 
    var sel = document.getElementById('adm-marquee-mode');
    if (sel) { setMarqueeMode(sel.value); saveGalleryImages(); }
}

function getGalleryImages() {
    try { return JSON.parse(localStorage.getItem('kadre_gallery_images_v1')) || []; } catch(e) { return []; }
}
function setGalleryImages(arr) {
    localStorage.setItem('kadre_gallery_images_v1', JSON.stringify(arr));
}
function loadGalleryImages() {
    var sel = document.getElementById('adm-marquee-mode');
    if (sel) sel.value = getMarqueeMode();
    const grid = document.getElementById('gallery-images-grid');
    if (!grid) return;
    const images = getGalleryImages();
    if (images.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem; grid-column: 1 / -1;">Aucune image. Ajoutez-en depuis votre ordinateur ou collez une URL.</p>';
        return;
    }
    grid.innerHTML = images.map((img, i) => `
        <div style="position: relative; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); aspect-ratio: 4/5;">
            <img src="${img.url}" alt="${img.title || ''}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 8px; background: rgba(0,0,0,0.7); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.7rem; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80px;">${img.title || 'Image ' + (i+1)}</span>
                <button type="button" onclick="removeGalleryImage(${i})" style="background: rgba(255,80,80,0.8); border: none; color: #fff; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; cursor: pointer;">X</button>
            </div>
        </div>
    `).join('');
}
function addGalleryImageFromFile() {
    var input = document.getElementById('gallery-file-input');
    if (input) input.click();
}
function handleGalleryFileUpload(event) {
    var files = event.target.files;
    if (!files || files.length === 0) return;
    var images = getGalleryImages();
    var processed = 0;
    Array.from(files).forEach(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            images.push({ url: e.target.result, title: file.name.replace(/\.[^.]+$/, ''), source: 'file' });
            processed++;
            if (processed === files.length) { setGalleryImages(images); loadGalleryImages(); event.target.value = ''; }
        };
        reader.readAsDataURL(file);
    });
}
function addGalleryImageFromUrl() {
    var url = prompt('Collez l\'URL de l\'image :');
    if (!url || !url.trim()) return;
    var title = prompt('Titre de l\'image (optionnel) :', '') || 'Image web';
    var images = getGalleryImages();
    images.push({ url: url.trim(), title: title, source: 'url' });
    setGalleryImages(images);
    loadGalleryImages();
}
function removeGalleryImage(index) {
    var images = getGalleryImages();
    images.splice(index, 1);
    setGalleryImages(images);
    loadGalleryImages();
}
function saveGalleryImages() {
    var successEl = document.getElementById('core-auth-success');
    if (successEl) {
        successEl.style.display = 'block';
        successEl.innerHTML = 'Galerie sauvegardee ! Rechargez la page pour voir les changements.';
        setTimeout(function() { successEl.style.display = 'none'; }, 4000);
    }
    var track = document.getElementById('marquee-track');
    if (track) {
        var imgs = getGalleryImages();
        if (imgs.length > 0) {
            var display = imgs.concat(imgs).concat(imgs);
            track.innerHTML = display.map(function(g) {
                return '<div class="marquee-item"><img src="' + g.url + '" alt="' + (g.title || '') + '" loading="lazy"></div>';
            }).join('');
        }
    }
}

// =============================================
// APPARENCE (THEME COLORS) CMS MANAGEMENT
// =============================================
function loadApparenceColors() {
    var primary = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#759280';
    var secondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim() || '#577364';
    
    // Check local storage config
    try {
        var conf = JSON.parse(localStorage.getItem('portfolio_custom_config_v4'));
        if (conf && conf.theme) {
            if (conf.theme.accentPrimary) primary = conf.theme.accentPrimary;
            if (conf.theme.accentSecondary) secondary = conf.theme.accentSecondary;
        }
    } catch(e) {}
    
    var elPri = document.getElementById('adm-color-primary');
    var elSec = document.getElementById('adm-color-secondary');
    
    // Basic hex conversion for inputs if it's rgb/hsl (fallback)
    function toHex(str) { return str.startsWith('#') ? str.slice(0,7) : '#759280'; }
    
    if (elPri) elPri.value = toHex(primary);
    if (elSec) elSec.value = toHex(secondary);
    
    var elSpeed = document.getElementById('adm-metal-speed');
    var elGlass = document.getElementById('adm-glass-opacity');
    if (conf && conf.theme) {
        if (elSpeed && conf.theme.metalSpeed) { elSpeed.value = conf.theme.metalSpeed; document.getElementById('val-metal-speed').innerText = conf.theme.metalSpeed + 's'; }
        if (elGlass && conf.theme.glassOpacity !== undefined) { elGlass.value = conf.theme.glassOpacity; document.getElementById('val-glass-opacity').innerText = conf.theme.glassOpacity; }
    }
}

function saveApparenceColors() {
    var elPri = document.getElementById('adm-color-primary');
    var elSec = document.getElementById('adm-color-secondary');
    if (!elPri || !elSec) return;
    
    var conf = { theme: {} };
    try {
        var existing = JSON.parse(localStorage.getItem('portfolio_custom_config_v4'));
        if (existing) conf = existing;
        if (!conf.theme) conf.theme = {};
    } catch(e) {}
    
    conf.theme.accentPrimary = elPri.value;
    conf.theme.accentSecondary = elSec.value;
    
    var elSpeed = document.getElementById('adm-metal-speed');
    var elGlass = document.getElementById('adm-glass-opacity');
    if (elSpeed) conf.theme.metalSpeed = elSpeed.value;
    if (elGlass) conf.theme.glassOpacity = elGlass.value;
    
    localStorage.setItem('portfolio_custom_config_v4', JSON.stringify(conf));
    
    if (elSpeed) document.documentElement.style.setProperty('--metal-speed', elSpeed.value + 's');
    if (elGlass) document.documentElement.style.setProperty('--glass-opacity', elGlass.value);
    
    
    // Apply immediately to root
    document.documentElement.style.setProperty('--accent-primary', elPri.value);
    document.documentElement.style.setProperty('--accent-secondary', elSec.value);
    
    var successEl = document.getElementById('core-auth-success');
    if (successEl) {
        successEl.style.display = 'block';
        successEl.innerHTML = 'Couleurs sauvegardees ! Effet Liquid Metal mis a jour.';
        setTimeout(function() { successEl.style.display = 'none'; }, 4000);
    }
}
