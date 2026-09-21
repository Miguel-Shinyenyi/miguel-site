import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://Miguel-Shinyenyi.github.io/miguel-site',
  base: '/miguel-site',
  markdown: {
    shikiConfig: {
      // Outputs CSS variables instead of a hardcoded theme, so code blocks
      // follow this site's own light/dark palette (see global.css) instead
      // of an unrelated GitHub-dark box that ignores prefers-color-scheme.
      theme: 'css-variables',
    },
  },
});
