// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kadre-blue.vercel.app',
  integrations: [
    sitemap({
      // Génère automatiquement le sitemap pour toutes les pages statiques
      filter: (page) => !page.includes('/api/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://kadrify.com/',
        'https://kadrify.com/template/01-terminal-craft',
        'https://kadrify.com/template/02-blueprint',
        'https://kadrify.com/template/03-motion-stack',
        'https://kadrify.com/template/04-quiet-system',
        'https://kadrify.com/template/05-gallery-wall',
      ]
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});