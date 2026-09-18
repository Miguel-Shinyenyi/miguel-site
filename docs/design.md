# Design

## Purpose

Defines the visual and interaction language for the site, so it feels like the thing it's
actually about: a mind working through philosophy, technology, and self-observation at once,
not a finished conclusion presented as a portfolio.

## Current state

Implemented. Two-typeface system, color (light and dark), margin-based metadata layout,
cursor-blink and hover-annotation motion, and the homepage open-questions feature are all
live in the Astro codebase.

## The core idea

Two things that don't usually sit together: literary, essay-like writing, and engineering
documentation. The site holds that tension instead of resolving it into one style. Content
reads like an essay. Structure and metadata read like a well-kept technical doc. Neither
wins.

"Alive and searching" means the site should not present itself as settled. Most personal
sites perform finished thought: a clean hero, a tidy bio, polished conclusions. This one
should visibly carry open threads, in-progress states, and dated reasoning, the same way the
UMWAYI journal and the settlement-engine status log do. The design's job is to make
unfinished thinking presentable without prettying it into something it isn't.

## Typography

Two typefaces, doing two different jobs, deliberately not blended into one voice.

- **Body text (the essays themselves):** a warm, literary serif. Newsreader or Source Serif
  4. Comfortable line length (around 65-75 characters), generous line height (1.6-1.7).
  This is where the philosophy and the writing live, and it should read like a book, not a
  web app.
- **Structural text (nav, dates, tags, section labels, metadata):** a monospace or technical
  grotesk. JetBrains Mono or IBM Plex Mono. Small size, wide letter spacing, uppercase for
  labels. This is where the engineering identity shows, in the scaffolding around the
  writing, not in the writing itself.

The contrast between the two typefaces on the same page is the whole point. They should
never be mixed within a single block of text.

## Color

Not a bright, saturated, startup-style palette. Those read as settled and productized, the
opposite of the intent.

- **Base:** a near-neutral, slightly warm off-white for light mode (not stark white), a deep
  warm near-black for dark mode (not pure black). Both should feel like paper or a terminal,
  not a screen trying to look friendly.
- **One functional accent color**, not decorative. Used only to mark states that matter:
  "open question," "in progress," "draft." An amber or burnt orange works, something with
  weight, not a bright call-to-action blue. If the accent color appears somewhere that isn't
  marking one of these states, it's being used wrong.
- No gradients, no glassmorphism, no soft shadows for depth. Flat, direct, printed-page
  feeling.

## Layout

Not a centered, boxed, card-based layout, that reads as settled and templated.

- Main content column stays narrow, literary-site width, not full-bleed.
- Metadata (date, tags, status) lives in a visible margin beside the content, not stacked
  above it like a blog platform default. This echoes marginalia in a printed book, and
  doubles as the place where the technical, structured voice appears next to the literary
  one.
- Section navigation reads like a directory listing, not a marketing nav bar: plain text
  links, monospace, no pill-shaped buttons.

## Motion

Restraint. Motion exists only where it reinforces the concept, never for decoration.

- A slow blinking cursor after the homepage's headline, as if the thought is still being
  typed. This is the single most important motion element on the site, since it's the
  clearest expression of "not settled."
- Hover on an entry reveals a small marginal annotation (its status: draft, published,
  updated date) rather than a color change or shadow lift.
- No parallax, no scroll-triggered fade-ins, no page transition animations. Those all read
  as a polished product demo, which undercuts the whole premise.

## The homepage's open-questions feature

Rather than a static "welcome" hero, the homepage should surface real open threads: pull the
open questions from the UMWAYI hub's project files (career-prep.md, cmu-masters.md,
routine-machine.md) and display two or three of them, plainly, dated, unresolved, styled with
the monospace structural typeface. This is what makes "alive and searching" literal rather
than aspirational language: the homepage visibly holds unfinished thinking instead of
claiming everything is figured out.

This depends on reading UMWAYI's repo content at build time, similar in spirit to Routine
Machine's hub-sync design. Feasibility and exact implementation need deciding once Phase 2
build starts, this is a design requirement, not yet an engineering plan.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-18 | Two-typeface system: literary serif for body, technical monospace for structure | Embodies the deliberate, unresolved tension between the philosophical/literary identity and the engineering identity, rather than picking one |
| 2026-09-18 | One functional accent color only, no decorative palette | Keeps the site from reading as a polished, settled product; color should mean something, not just look good |
| 2026-09-18 | Cursor-blink motion on the homepage headline | Single clearest way to express "thought mid-motion, not settled" without relying on abstract language alone |
| 2026-09-18 | Homepage surfaces real open questions from UMWAYI, not a static hero | Makes "alive and searching" a literal, verifiable property of the page, not just a stated design intention |
| 2026-09-18 | No decorative motion (parallax, scroll fades, transitions) | Any polish beyond the cursor-blink and hover annotation contradicts the unresolved, working-notebook premise |
| 2026-09-18 | Homepage open questions are fetched at build time from UMWAYI's public GitHub repo (`raw.githubusercontent.com`, no auth), parsing `## Open questions` and `## Open decisions` headings out of `career-prep.md`, `cmu-masters.md`, `routine-machine.md` | Mirrors the precedent already set in routine-machine's `docs/hub-sync.md` (public repo, public API, no stored token). A network failure during build degrades to an empty section rather than failing the build, since a missing homepage feature is a smaller cost than a broken deploy |
| 2026-09-18 | Items are round-robined across the three source files, capped at 3, each labeled with its source project rather than a per-item date; the section is timestamped once with "as of \<build date\>" | The source files don't carry per-bullet dates, so inventing one would misrepresent the content. Labeling by project plus a single honest build-time stamp stays truthful to what's actually in the hub |
| 2026-09-18 | Light mode: bg `#faf6ef`, text `#201b14`, muted `#6f6656`, border `#e5ddcd`. Dark mode: bg `#17130e`, text `#ece4d6`, muted `#a3967f`, border `#332c22`. Accent (both modes): `#b5541f` light / `#d9834a` dark | Warm off-white/near-black per the brief, checked for adequate contrast against body text; the accent needed a lighter shift in dark mode to stay legible without turning bright/decorative |
| 2026-09-18 | Added an optional `updated` date field to the content schema | Needed so the hover annotation's "updated date" (specified in the Motion section) has real data to show instead of being decorative filler |
| 2026-09-18 | Fixed the placeholder scaffold's stylesheet include, which used a raw `<link href="/src/styles/global.css">` that only resolves in `astro dev` and silently ships with no CSS in a production build | Discovered while implementing this design; switching to a frontmatter `import` lets Astro bundle and base-path the stylesheet correctly for GitHub Pages |

## Open questions

- Whether the two-typeface contrast holds up on mobile: implemented with a responsive
  collapse (margin metadata stacks above content, hover-only annotation becomes always-visible
  below 700px) but not yet checked on a real device.