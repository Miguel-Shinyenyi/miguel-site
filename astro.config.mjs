import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://Miguel-Shinyenyi.github.io/miguel-site',
  base: '/miguel-site',
  // Tailwind 4 / daisyUI 5 (docs/design.md, Color section, 2026-09-23):
  // config lives in src/styles/tailwind.css itself (@import "tailwindcss"
  // split into theme+utilities to skip Preflight, plus @plugin blocks),
  // not a tailwind.config.mjs file. @astrojs/tailwind stays on the old
  // PostCSS-era model and doesn't support Tailwind 4.
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Outputs CSS variables instead of a hardcoded theme, so code blocks
      // follow this site's own light/dark palette (see global.css) instead
      // of an unrelated GitHub-dark box that ignores prefers-color-scheme.
      theme: 'css-variables',
    },
  },
});
