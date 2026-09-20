# Personal Site

## What this is

A personal site built to actually show, not just claim, how philosophy, technology, and
self-observation connect. Four sections: philosophy, tech, journal, projects.

## Why it exists

Part of the broader hub-and-spoke system (UMWAYI). The journal and articles written there
feed this site, and this site is where that thinking becomes public and readable, not just
kept for personal reference.

## Tech stack

- Astro, static site generator, content-collection driven
- Markdown as the content format, one file per entry
- No backend, no database, deploys as static files, with one deliberate exception: Waline
  (see below and docs/feedback.md)
- Giscus for comments, backed by GitHub Discussions, no server or database added for it
- Waline for guest comments, a genuine backend exception, hosted on Vercel serverless plus a
  free-tier database

## Project structure

```
---
site/
  PROJECT.md <- this file, master guide
  docs/
    design.md <- visual and interaction design brief
    publishing.md <- GitHub Pages deployment
    feedback.md <- Giscus/GitHub/Waline Discussions comment feature
    .github/workflows/
    deploy.yml <- builds and deploys to GitHub Pages on push to main
  src/
    content/
      config.ts <- collection schema
      philosophy/ <- one .md file per entry
      tech/
      journal/
      projects/
    components/
      EntryList.astro <- listing-page entry rows
      EntryMeta.astro <- date/status/updated margin metadata
    lib/
      url.ts <- base-path-aware link helper
      openThreads.ts <- build-time fetch of UMWAYI's open questions
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      [section]/index.astro, [section]/[slug].astro for each of the four sections
    styles/
      global.css
---
```

## Running the application

```
npm install
npm run dev
```

Visit the local URL it prints. Editing anything under `src/content/` hot-reloads.

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

## Build phases

1. Structural scaffold: four theme sections, content collections, basic layout. Done, but
   built with a placeholder visual design, not a real one.
2. Real design implementation: apply `docs/design.md` in full. Typography, color, layout,
   motion, and the homepage's live open-questions feature. Done.
3. Deployment: push to a static host, connect a real domain. Done, live on GitHub Pages.
4. Feedback feature: Giscus comments on articles, backed by GitHub Discussions, per
   `docs/feedback.md`. Done, live on every non-draft article.
5. Guest comments: originally scoped as Cusdis, built, then removed after Cusdis's
   deprecation was confirmed. Replaced with Waline, hosted on Vercel plus a free-tier
   database. Built, inactive pending the Vercel deploy.

Current phase: **Phase 5, code complete, one manual step (Vercel deploy) short of live.**

## Status log

| Date | Phase | Status | Notes |
|------|-------|--------|-------|
| 2026-09-16 | Phase 1 | Done | Astro scaffold built and verified, four sections, one sample entry each, placeholder visual design |
| 2026-09-18 | Phase 2 | Started | Real design direction decided, see docs/design.md, replacing the placeholder |
| 2026-09-18 | Phase 2 | Done | Design implemented in full: typography, color (light/dark), margin metadata layout, cursor-blink and hover-annotation motion, homepage open-questions feature pulling live from UMWAYI. Also fixed a latent bug where the stylesheet never actually shipped in a production build. See docs/design.md decisions log. |
| 2026-09-18 | Phase 3 | Started | `astro.config.mjs` site/base and `.github/workflows/deploy.yml` added per docs/publishing.md. Repo pushed to GitHub. Still needs: GitHub Pages source set to "GitHub Actions" in repo settings (manual, not done by an agent), then a push to main to trigger the first deploy. |
| 2026-09-18 | Phase 3 | Done | Manual GitHub Pages setup completed and confirmed live at the GitHub Pages URL. |
| 2026-09-20 | Phase 4 | Scoped | Feedback feature designed: Giscus, backed by GitHub Discussions on this repo, no backend added. See docs/feedback.md. Not yet built. |
| 2026-09-20 | Phase 4 | Built | `src/components/Giscus.astro` added and wired into all four article templates, gated on non-draft entries. Renders nothing until `GISCUS_REPO_ID`/`GISCUS_CATEGORY_ID` are filled in, since Discussions and the giscus app aren't installed on the repo yet (account-level step, not done by an agent). See docs/feedback.md's "Current state" for the exact remaining steps. |
| 2026-09-20 | Phase 4 | Done | Discussions enabled, giscus app installed, real `GISCUS_REPO_ID`/`GISCUS_CATEGORY_ID` from giscus.app filled in against the existing `Announcements` category. Comments are live on every non-draft article. |
| 2026-09-20 | Phase 5 | Scoped | Guest-comments feature designed: Cusdis running alongside Giscus, no backend added. See docs/feedback.md. Not yet built. |
| 2026-09-20 | Phase 5 | Built | `src/components/Cusdis.astro` added and wired into all four article templates right after Giscus, same non-draft gating, keyed by URL pathname. Renders nothing until `CUSDIS_APP_ID` is filled in. |
| 2026-09-20 | Phase 5 | Reverted | Cusdis confirmed deprecated (repo archived, hosted backend down since July 2026) before the account-setup step was ever done. `src/components/Cusdis.astro` and its wiring need removing. See docs/feedback.md's "Removed: Cusdis" section. |
| 2026-09-20 | Phase 5 | Rescoped | Waline chosen in Cusdis's place, hosted on Vercel serverless plus a free-tier database, an acknowledged real exception to the no-backend rule, unlike Giscus. See docs/feedback.md. Not yet built. |
| 2026-09-20 | Phase 5 | Built | Re-verified the Cusdis deprecation claim independently (GitHub repo archived, cusdis.com origin returning HTTP 521) before deleting `src/components/Cusdis.astro` and its four template wirings. Added `src/components/Waline.astro` in the same position, keyed by `window.location.pathname`, reactions off, theme following the OS, matching Giscus's existing choices. Renders nothing until `WALINE_SERVER_URL` is filled in, since the Waline server hasn't been deployed to Vercel yet (real infrastructure step, not done by an agent). See docs/feedback.md's "Current state" for the exact remaining steps. |

## Rules for working on this project

- No backend, no database, with one deliberate, documented exception: Waline (see
  docs/feedback.md). Any other feature that seems to need a backend belongs in a different
  project, not here.
- Every design decision in `docs/design.md`'s decisions log gets a stated reason. No
  aesthetic choice without one.
- Deploying is `npm run build`, output goes to `dist/`, static hosting only.
- If something in `docs/design.md` or `docs/feedback.md` turns out to be impractical in
  Astro, flag it back rather than quietly substituting something else. Each was chosen
  deliberately, not arbitrarily.