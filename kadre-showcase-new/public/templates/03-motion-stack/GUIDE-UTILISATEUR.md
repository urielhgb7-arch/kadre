# 📖 Guide d'Installation No-Code pour l'Acheteur (Pack Portfolio Pro)

Bienvenue et félicitations pour votre achat du **Pack Portfolio Modulable Pro** ! 

Grâce à ce système, vous bénéficiez d'une **sécurité de niveau entreprise (Supabase Auth & RLS)** et d'une gestion de contenu **100% No-Code** directement sur votre site web, sans toucher une ligne de code.

---

## ⚡ Installation Rapide en 3 Étapes (Moins de 5 Minutes)

### 1️⃣ Étape 1 : Créer votre compte Supabase gratuit
1. Rendez-vous sur [https://supabase.com](https://supabase.com) et inscrivez-vous gratuitement (aucune carte bancaire requise).
2. Cliquez sur **"New Project"**, choisissez un nom (ex: `Mon Portfolio`), définissez un mot de passe de base de données fort et sélectionnez une région proche de vous.
3. Attendez ~1 minute que Supabase prépare votre projet.

### 2️⃣ Étape 2 : Récupérer vos 2 clés d'accès
Dans votre tableau de bord Supabase :
1. Allez dans **Project Settings ⚙️ (l'icône d'engrenage tout en bas à gauche)** ➔ **API** (ou **Data API**).
2. Récupérez les 2 informations :
   - **Project URL** : Situé en haut de la page sous la section **Project URL** ou **URL** (ex: `https://xxxxxxxxx.supabase.co`). *(Astuce : l'URL est aussi visible directement sur l'écran d'accueil "Home" de votre projet).*
   - **Anon Public Key** : Dans la section **Project API keys** (ou sous l'onglet **Legacy anon, service_role API keys**), copiez la clé identifiée comme **`anon` `public`** (une longue clé commençant par `eyJ...`).

> 🔒 *Note de sécurité* : Utilisez TOUJOURS la clé `anon public` (jamais la clé `service_role`). La clé `anon` peut apparaître publiquement sans aucun risque car la sécurité des données est garantie par le script SQL (RLS).

### 3️⃣ Étape 3 : Lancer l'assistant d'installation sur votre site
1. Ouvrez votre site web dans votre navigateur.
2. Effectuez un **Triple Clic Rapide (3 clics)** sur le nom/logo en haut à gauche de la page.
3. L'**Assistant de Configuration No-Code** s'ouvre automatiquement :
   - **Page 1** : Collez votre `Project URL` et votre `Anon Key`.
   - **Page 2** : Définissez votre **Email d'administration** et votre **Mot de Passe Secret** (minimum 6 caractères).
   - **Page 3** : Cliquez sur **"Copier le Script SQL de Sécurité"**, puis allez sur Supabase ➔ **SQL Editor** ➔ **New Query**, collez et cliquez sur **Run**.
4. Cliquez sur **Terminer la Configuration** !

🎉 **Félicitations !** Votre portfolio est désormais sécurisé et vous pouvez modifier toutes vos informations en temps réel depuis le panneau d'administration.

---

## 🔐 Secret d'Accès Rapide (Admin Secret)

Par défaut, vous pouvez ouvrir le panneau d'administration en ajoutant `?admin=KADRE2026` à l'URL de votre site (ex: `monsite.com/?admin=KADRE2026`).

**⚠️ IMPORTANT :** Changez ce secret avant de mettre votre site en ligne !

### Comment changer le secret ?
1. Ouvrez le panneau d'administration (Triple-clic sur le logo ➔ Connectez-vous).
2. Allez dans l'onglet **Données** (tout à droite des onglets).
3. Descendez à la section **"Sécurité Administrateur"**.
4. Saisissez votre nouveau secret (minimum 4 caractères), confirmez-le, puis cliquez sur **"Changer le Secret Admin"**.
5. Le nouveau secret est automatiquement hashé (SHA-256) et stocké dans votre navigateur.

### Comment l'utiliser après l'avoir changé ?
- Rendez-vous sur `monsite.com/?admin=MON_NOUVEAU_SECRET` pour ouvrir le panneau d'administration directement.
- Si le secret est perdu, pas de panique : le triple-clic sur le logo fonctionne toujours via votre connexion Supabase.

---

## 🚀 Comment déployer votre site gratuitement ?

Vous pouvez héberger votre portfolio gratuitement en 1 clic sur :
- **Vercel** (`vercel.com`) : Glissez-déposez le dossier du template choisi.
- **Netlify** (`netlify.com`) : Glissez-déposez le dossier sur la plateforme.
- **GitHub Pages** : Glissez votre projet sur un dépôt GitHub.
