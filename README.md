# KADRE — Portfolio Templates Premium

Templates de portfolio premium pour développeurs, créatifs et consultants.

## Structure

```
kadre/
├── index.html                 ← Page d'accueil (redirect vers showcase)
├── showcase/                  ← Vitrine interactive (5 templates)
├── templates/                 ← Templates source (code propre)
├── core/                      ← Modules partagés (auth, data-sync, etc.)
└── assets/                    ← CSS, JS, images partagés
```

## Templates

| # | Nom | Cible | Prix |
|---|-----|-------|------|
| 01 | Terminal Craft | Développeurs & Tech | 39$ |
| 02 | Blueprint | Développeurs & Tech | 39$ |
| 03 | Motion Stack | Développeurs & Tech | 39$ |
| 04 | Quiet System | Executifs & Consultants | 39$ |
| 05 | Gallery Wall | Designers & Artistes | 39$ |

## Développement

```bash
# Servir localement
python -m http.server 3000

# Ouvrir
http://localhost:3000/showcase/
```

## Déploiement

Le site est déployé via GitHub Pages depuis la branche `main`.

## Tech Stack

- HTML/CSS/JS vanilla
- Three.js (arrière-plan 3D)
- Supabase (données dynamiques)
- CSS 3D (tesseract)

## Licence

Propriétaire — VOUH DIGITAL
