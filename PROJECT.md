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
- Tailwind CSS 4 and daisyUI 5, configured in CSS rather than a config file
- Markdown as the content format, one file per entry
- **This repo holds no content.** Articles, project pages, links, the Now section,
  illustrations and downloadable files all live in the UMWAYI repo under `site/`, and a
  build copies them in (`scripts/sync-content.mjs`). See docs/publishing.md.
- No backend, no database, deploys as static files, with one deliberate exception: Waline
  (see below and docs/feedback.md)
- Giscus for comments, backed by GitHub Discussions, no server or database added for it
- Waline for guest comments, a genuine backend exception, hosted on Vercel serverless plus a
  free-tier database
- MailerLite for the footer sign-up, as an embedded form, no backend added here
- PostHog for product analytics, client side only, no backend added here. See
  docs/analytics.md

## Project structure

```
---
site/
  PROJECT.md <- this file, master guide
  CLAUDE.md <- how to work in this repo, routes to the doc you need
  docs/
    design.md <- visual and interaction design system, decisions log
    publishing.md <- GitHub Pages deployment and the UMWAYI content sync
    feedback.md <- Giscus and Waline comment features
    analytics.md <- PostHog events, consent state, acceptance checks
  .github/workflows/
    deploy.yml <- builds and deploys to GitHub Pages on push to main
  scripts/
    sync-content.mjs <- copies content from UMWAYI, runs the PRIVATE_NAMES check
    check-mobile-viewport.mjs <- 375px overflow check against a production preview
  src/
    content/
      config.ts <- collection schema. The .md files beside it are synced, not committed
      philosophy/ tech/ journal/ projects/ now/ links/
    components/
      ArticlePage.astro <- shared template for articles and project pages
      EntryList.astro <- listing-page article rows
      ProjectCard.astro <- bento tile
      Footer.astro <- the one dark block, MailerLite sign-up, link nav
      Shepherd.astro <- hero illustration
      ProfilePhoto.astro, Giscus.astro, Waline.astro
    lib/
      url.ts <- base-path-aware link helpers
      openThreads.ts <- reads UMWAYI's open questions at build time
      openItems.mjs <- the parser both openThreads and the privacy check share
      pillarStickers.ts <- pillar illustrations
    layouts/
      BaseLayout.astro
    pages/
      index.astro, rss.xml.js
      [section]/index.astro and [section]/[slug].astro for each of the four sections
    scripts/
      analytics.ts <- PostHog init and the custom events
      article-controls.js <- code panels, copy link, This helped, contents highlight
      thoughts.js <- the shepherd's thought bubble
    styles/
      tailwind.css <- themes and tokens, imports global.css
      global.css <- the design system's components
```

## Running the application

```
npm install
npm run dev
```

Visit the local URL it prints. Editing anything under `src/content/` hot-reloads.

## Adding an entry

**Not in this repo.** Content is authored in UMWAYI under `site/`, and a build copies it
here. Adding a `.md` file under `src/content/` does nothing lasting: the sync empties those
folders on the next build, and they are gitignored.

In UMWAYI, drop a new `.md` file in the right folder under `site/`, with this frontmatter:

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
   database. Done, live on every non-draft article.

6. Content move: content leaves this repo for UMWAYI's `site/` folder, pulled in at build
   time by `scripts/sync-content.mjs`. Done.
7. Design replacement: the 2026-09-23 system, then the 2026-09-29 system replacing it.
   Done. See docs/design.md.
8. Distribution: RSS feed, MailerLite sign-up in the footer. Done.
9. Analytics: PostHog, client side. Done on branch `feat/posthog`, with no consent banner
   yet. See docs/analytics.md.

Current phase: **none. The open work is listed under "Known gaps" below.**

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
| 2026-09-20 | Phase 5 | Done | Waline deployed to Vercel. First URL offered was rejected after checking it (redirected through Vercel's SSO login, a protected preview deployment); the working production URL, `waline-comments-azure-zeta.vercel.app`, was confirmed publicly reachable and running real Waline (`x-waline-version` header) before being wired into `WALINE_SERVER_URL`. Verified live in a real browser: both Giscus and Waline render and initialize correctly on an article page. |
| 2026-09-23 | Phase 7 | Done | Full visual rebuild on Tailwind 4 and daisyUI 5, from a design spec Miguel supplied, then reconciled against the real static reference implementation he provided. Preflight was switched off here, which later cost six cascade bugs of one kind. |
| 2026-09-23 | Phase 6 | Done | Content moved to UMWAYI's `site/` folder. `scripts/sync-content.mjs` added, run from `predev`/`prebuild`, failing the build loudly if nothing is copied. `openThreads.ts` switched from a runtime GitHub fetch to a build-time read. Project pages now render through the same template as articles. |
| 2026-09-23 | Phase 8 | Done | Footer sign-up moved from Waline to a MailerLite embed in the site's own markup, verified pixel-identical. Added `@astrojs/rss` and a feed at `/rss.xml`. Found that the sign-up script had never loaded in any previous build: a `<script>` inside a JSX conditional is not bundled by Astro. |
| 2026-09-23 | Privacy | Done | `PRIVATE_NAMES` build guard added to `scripts/sync-content.mjs`: it fails the build if published content names a company Miguel applied to or interviewed with, reporting file and line but never the matched text. The names live only in a repository secret. |
| 2026-09-29 | Phase 7 | Done | Second design replacement, the system in `~/Downloads/amwayi-site 2/docs/DESIGN.md`: cool pasture canvas with one amber accent, Bricolage Grotesque and Geist, Newsreader back for article body, flat surfaces instead of sticker shadows, a bento projects grid, and a documented motion system. Preflight turned back on, retiring the bug class above. |
| 2026-10-15 | Phase 9 | Done | PostHog added on branch `feat/posthog`: pageviews, autocapture, heatmaps, web vitals, exceptions, session replay and eight custom events. No consent banner and no privacy page, by Miguel's decision, recorded in docs/analytics.md. |

## Known gaps

- **No consent banner and no privacy page.** Analytics sets cookies, keeps a localStorage
  identifier and records sessions with no notice to visitors. Deliberate and temporary. See
  docs/analytics.md.
- **`npm run check:mobile` fails on article and project pages**, 378px against 375. Present
  with analytics disabled, so it predates that work. No single unclipped element exceeds
  375px. Needs its own pass.
- **Giscus returns 404 from its own discussions API** on every article, so the "Comments"
  heading sits above an empty widget with Waline working below it. A repository setting,
  not site code.

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