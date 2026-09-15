# Personal site

Built with Astro, content-collection-driven. Four sections: philosophy, tech, journal, projects.
Each is a folder of markdown files under `src/content/`.

## Running it

```
npm install
npm run dev
```

Visit the local URL it prints. Edit anything in `src/content/*` and it hot-reloads.

## Adding an entry

Drop a new `.md` file in the right folder under `src/content/`, with this frontmatter:

```
---
title: "Your title"
date: 2026-09-16
summary: "One or two sentences for the listing page."
draft: false
---
```

Set `draft: true` to keep something out of the build without deleting it.

## Deploying

`npm run build` outputs a static site to `dist/`. That folder can go to GitHub Pages, Netlify,
Vercel, or any static host. Update `site` in `astro.config.mjs` to your real domain first.

## What's here now

One sample entry per section, adapted from the UMWAYI context hub, so the site isn't empty on
first push. Replace or add to these as real articles get written.
