# 🛍️ Kadre, by VOUH Digital — Site Vitrine & Repertoire Vendeur

Bienvenue dans le dépôt du site vitrine commercial pour la marque **Kadre, by VOUH Digital**.

---

## 🔒 RÉPERTOIRE CONFIDENTIEL : LES 15 URLS DE GUIDES POST-ACHAT

> ⚠️ **AVERTISSEMENT DE SÉCURITÉ VENDEUR IMPORTANT** :
> Ces 15 URLs de guides contiennent des codes uniques et imprévisibles de 8 caractères. Elles possèdent la balise `<meta name="robots" content="noindex, nofollow">` et ne sont liées sur AUCUNE page publique de votre site.
> 
> **VOUS DEVEZ CONFIGURER CHAQUE URL CI-DESSOUS DANS VOTRE DASHBOARD MAKETOU COMME URL DE REDIRECTION POST-PAIEMENT (PAGE DE REMERCIEMENT / CONFIRMATION) DE CHAQUE PRODUIT CORRESPONDANT.**

| # | Nom du Template | Slug | Code Unique | URL Complète du Guide Post-Achat |
|---|---|---|---|---|
| 01 | Terminal Craft | `terminal-craft` | `x7k2p9qm` | `/guides/guide-terminal-craft-x7k2p9qm.html` |
| 02 | Blueprint | `blueprint` | `b9r4m2p8` | `/guides/guide-blueprint-b9r4m2p8.html` |
| 03 | Motion Stack | `motion-stack` | `m3s8k7v1` | `/guides/guide-motion-stack-m3s8k7v1.html` |
| 04 | Quiet System | `quiet-system` | `q1s9t4w6` | `/guides/guide-quiet-system-q1s9t4w6.html` |
| 05 | Gallery Wall | `gallery-wall` | `g5w2y8n3` | `/guides/guide-gallery-wall-g5w2y8n3.html` |
| 06 | Paper Cut | `paper-cut` | `p6c4u9r2` | `/guides/guide-paper-cut-p6c4u9r2.html` |
| 07 | Neon Reel | `neon-reel` | `n7r1l5k8` | `/guides/guide-neon-reel-n7r1l5k8.html` |
| 08 | Boardroom | `boardroom` | `b8d3r6m9` | `/guides/guide-boardroom-b8d3r6m9.html` |
| 09 | Momentum | `momentum` | `m9m2t7k4` | `/guides/guide-momentum-m9m2t7k4.html` |
| 10 | The Ledger | `the-ledger` | `t1l5d8g3` | `/guides/guide-the-ledger-t1l5d8g3.html` |
| 11 | First Chapter | `first-chapter` | `f1c9p3h7` | `/guides/guide-first-chapter-f1c9p3h7.html` |
| 12 | Field Notes | `field-notes` | `f2n8t4s6` | `/guides/guide-field-notes-f2n8t4s6.html` |
| 13 | Atelier | `atelier` | `a3t7l9r2` | `/guides/guide-atelier-a3t7l9r2.html` |
| 14 | Signal | `signal` | `s4g8n1l5` | `/guides/guide-signal-s4g8n1l5.html` |
| 15 | Constellation | `constellation` | `c5s9t2l8` | `/guides/guide-constellation-c5s9t2l8.html` |

---

## 📝 LISTE DES PLACEHOLDERS À REMPLACER AVANT MISE EN LIGNE

1. **Liens d'achat Maketou** :
   Dans les 15 fichiers sous `templates/template-XX-[slug].html`, remplacez le lien d'achat placeholder :
   `<!-- REMPLACER PAR LE VRAI LIEN MAKETOU PRODUIT XX -->`
   `https://maketou.com/kadre-XX-slug` par votre lien produit réel généré sur Maketou.

2. **Email de support** :
   Dans les 15 guides sous `guides/`, vérifiez l'adresse email de contact `support@vouhdigital.com` et adaptez-la si besoin.

3. **Visuels & Capture d'écran** :
   Remplacez les placeholders SVG dans `templates/` et `index.html` par de vraies captures d'écran ou visuels de vos portfolios si souhaité.

---

## 📂 STRUCTURE DES DOSSIERS DU PROJET

```text
/kadre-showcase/
├── index.html                                  (Page d'accueil du site vitrine)
├── assets/
│   ├── css/
│   │   ├── style.css                           (Design system principal sombre & or)
│   │   └── product.css                         (Styles des pages produits & FAQ)
│   ├── js/
│   │   └── main.js                             (Accordéons FAQ & animations)
├── templates/                                  (15 Pages produits dédiées)
├── guides/                                     (15 Pages guides protégées noindex)
└── README.md                                   (Ce guide confidentiel)
```
