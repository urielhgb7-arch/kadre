# AuraKadre - Documentation Globale du Projet

## 1. La Vision : Pourquoi AuraKadre a-t-il été créé ?

**AuraKadre** est né d'un constat simple : les etudiants,les développeurs, designers, photographes,autres créatifs ou autres personnes non technique(non codeur) ont besoin d'un portfolio en ligne pour se démarquer, mais ils manquent souvent de temps, d'inspiration ou de compétences transversales (un développeur backend n'est pas forcément un as du design, et un photographe ne sait pas coder). Les solutions presentes sont soit interessante pour du basique(mais des qu'on veut avancer ont est aubliger de depenser au moins 30 000 fcfa pour 1 projet , sans compter les hebergement et nom de domaine qui son tres consequen pour nos compatriote en Afrique ) et soit complexe a utiliser pour les personne non technique(parfois meme pour  nous les codeur ) 

**L'objectif d'AuraKadre est de proposer des templates de portfolios :**
- **Premium et Ultra-modernes :** Basés sur les dernières tendances UI/UX (Glassmorphism, Brutalism, animations 3D, interactions fluides).
- **Sans Code (No-Code friendly) :** Contrairement à des templates React ou Vue.js complexes, les templates AuraKadre sont conçus en HTML/CSS/JS pur. Ils peuvent être modifiés simplement en changeant des valeurs dans un cms intégré, facile a mettre en place et completement personnalisable(tu peux enlever les partie dont tu n'a pas besoin sans toucher au code ou rajouter et personnaliser d'autres infos ).
- **Accessibles financièrement :** Offrir la qualité d'une agence digitale haut de gamme à un prix abordable pour les freelances et les étudiants.

AuraKadre se positionne comme **le pont entre la haute exigence technique/visuelle et l'accessibilité absolue**.

---

## 2. Le Site Vitrine (AuraKadre.com)

Le site vitrine est la plateforme e-commerce et la vitrine marketing du projet. 

### Stack Technique (La vitrine)
- **Framework :** [Astro](https://astro.build/) (Choisi pour ses performances extrêmes, son rendu statique SSG, et sa fluidité).
- **Styling :** Tailwind CSS.
- **Animations & 3D :** Vanilla JS et [Three.js](https://threejs.org/) (pour l'orbe liquide interactive en page d'accueil).
- **Hébergement :** Vercel.

### Fonctionnalités Clés du Site Vitrine
- **Design Premium ("Dark Mode" natif) :** Esthétique "Digital Agency" avec une palette sombre, des néons cyan, du glassmorphism et une orbe 3D liquide en arrière-plan qui réagit au mouvement de la souris et s'adapte à la taille de l'écran.
- **SEO Avancé :** 
  - Balises sémantiques strictes.
  - Intégration complète de Schema.org (JSON-LD) : `WebSite`, `Organization`, `SiteNavigationElement`, `FAQPage`.
  - Open Graph et Twitter Cards parfaitement configurés (images, métadonnées).
  - Fichier `robots.txt` et `sitemap-index.xml` automatisés.
- **Architecture de contenu :**
  - **Accueil :** Hero section immersive, liste des templates, FAQ dynamique intégrée au SEO, section "Comment ça marche".
  - **Pages de détails des templates :** Génération dynamique (`/template/[id]`) avec bouton d'achat, preview en direct et caractéristiques détaillées.
  - **Pages légales :** Mentions Légales et Conditions Générales de Vente (CGV) intégrées pour la conformité e-commerce.

---

## 3. Les Portfolios (Les Templates vendus)

C'est le cœur du produit. **Contrairement au site vitrine qui utilise Astro, les templates vendus sont volontairement architecturés sans framework lourd.**

### Architecture des Templates
- **Stack :** HTML5 Sémantique, CSS3 (Custom Properties, Flexbox/Grid, Animations natives), JavaScript pur (ES6+ Vanilla).
- **Pourquoi Vanilla JS/HTML/CSS ?**
  1. **Zéro dépendance :** Pas besoin d'installer Node.js, NPM, React, ou de faire un `npm run build`. Le client télécharge le dossier et clique sur `index.html`.
  2. **Déploiement universel :** Hébergeable gratuitement en 1 clic sur Github Pages, Netlify, Vercel, ou n'importe quel hébergement mutualisé (Hostinger, OVH).
  3. **Personnalisation facile :** Le contenu (textes, projets) est centralisé.
- **Intégration Base de Données (Optionnelle) :** Les templates intègrent une configuration native avec **Supabase** (BaaS) via le module `core/data-sync.js` et `core/auth.js`. Cela permet aux utilisateurs non techniciens de gérer leurs projets dynamiquement depuis le cms integré (dans le template ) plutôt que de modifier le HTML à la main.

### Les 5 Portfolios Originaux
Chaque template a été conçu avec une psychologie et une cible utilisateur précise :

1. **Terminal Craft (01)**
   - **Cible :** Développeurs Backend, DevOps, Cyber-sécurité, Data Scientists.
   - **Esthétique :** Inspiré des interfaces CLI (Command Line Interface). Polices monospace, fond noir absolu, texte vert/cyan façon "Matrix".
   - **Vibe :** Geek assumé, technique, brut, efficacité maximale.

2. **Blueprint (02)**
   - **Cible :** Ingénieurs Full-Stack, Architectes Cloud, Ingénieurs Système.
   - **Esthétique :** Design industriel, papier millimétré, lignes géométriques, bleu cyan profond. Ressemble à un plan de construction.
   - **Vibe :** Structuré, mathématique, professionnel, solide.

3. **Motion Stack (03)**
   - **Cible :** Développeurs Frontend, UX/UI Designers, Créatifs.
   - **Esthétique :** Animations ultra-fluides, interactions poussées, glassmorphism extrême, dégradés vibrants.
   - **Vibe :** "Wow effect", modernité, sens du détail visuel, agence primée sur Awwwards.

4. **Quiet System (04)**
   - **Cible :** Minimalistes, Rédacteurs, Product Managers, Consultants.
   - **Esthétique :** Espace blanc (ou noir) abondant, typographie large et soignée (serif / sans-serif contrasté), aucune distraction.
   - **Vibe :** Zen, luxe silencieux, concentration sur le contenu pur.

5. **Gallery Wall (05)**
   - **Cible :** Photographes, Illustrateurs, Artistes 3D, Graphistes.
   - **Esthétique :** Grilles asymétriques (Masonry), focus absolu sur les images, interface effacée au profit de l'art.
   - **Vibe :** Galerie d'art contemporaine, portfolio d'exposition, immersif.

---

## 4. Résumé de la relation entre les deux

- **AuraKadre (La coquille)** vend et met en valeur. C'est un site techniquement complexe (Astro, 3D, SEO poussé) optimisé pour l'acquisition client et la vente.
- **Les Portfolios (Le contenu)** sont les produits. Ils sont techniquement accessibles (HTML/CSS/JS), extrêmement beaux, prêts à l'emploi et modulables, pensés pour que l'utilisateur final n'ait qu'à s'occuper de son contenu.
## 5. Le lien

[aurakadre.com](https://aurakadre.com) (a rechercher sur google)