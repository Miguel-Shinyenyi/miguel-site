import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://Miguel-Shinyenyi.github.io/miguel-site',
  base: '/miguel-site',
  integrations: [
    // applyBaseStyles: false, Tailwind Preflight is also disabled in
    // tailwind.config.mjs, so the hand-written global.css stays the only
    // source of base typography/layout (see docs/design.md, Color section:
    // Tailwind/daisyUI is scoped to new structural chrome, not essay body
    // text). src/styles/tailwind.css is imported explicitly instead.
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    shikiConfig: {
      // Outputs CSS variables instead of a hardcoded theme, so code blocks
      // follow this site's own light/dark palette (see global.css) instead
      // of an unrelated GitHub-dark box that ignores prefers-color-scheme.
      theme: 'css-variables',
    },
  },
});
