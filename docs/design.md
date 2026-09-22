# Design

## Purpose

Defines the visual and interaction language for the site, so it feels like the thing it's
actually about: a mind working through philosophy, technology, and self-observation at once,
not a finished conclusion presented as a portfolio.

## Current state

Implemented, including the 2026-09-22 revision. Two-typeface system, color (light and dark),
margin-based metadata layout, cursor-blink and hover-annotation motion, and the homepage
open-questions feature are all live, as are: the three mobile-bug fixes; Tailwind CSS and
daisyUI (scoped to new structural chrome, Preflight off, essay typography untouched); the
code-block typing reveal; the favicon and six-stage "flock" mark; and the bolder nav accent
plus a small pass of structural microcopy. See the decisions log for what was built and
anything decided differently from the brief that produced it.

## The core idea

Two things that don't usually sit together: literary, essay-like writing, and engineering
documentation. The site holds that tension instead of resolving it into one style. Content
reads like an essay. Structure and metadata read like a well-kept technical doc. Neither
wins. This core idea is unchanged by the 2026-09-22 revision below, philosophy meets tech
stays the identity; what changes is how much personality and interactivity is allowed to
show on top of it.

"Alive and searching" means the site should not present itself as settled. Most personal
sites perform finished thought: a clean hero, a tidy bio, polished conclusions. This one
should visibly carry open threads, in-progress states, and dated reasoning, the same way the
UMWAYI journal and the settlement-engine status log do. The design's job is to make
unfinished thinking presentable without prettying it into something it isn't.

## Typography

Two typefaces, doing two different jobs, deliberately not blended into one voice. Unchanged
by the 2026-09-22 revision.

- **Body text (the essays themselves):** a warm, literary serif. Newsreader or Source Serif
  4. Comfortable line length (around 65-75 characters), generous line height (1.6-1.7).
  This is where the philosophy and the writing live, and it should read like a book, not a
  web app.
- **Structural text (nav, dates, tags, section labels, metadata):** a monospace or technical
  grotesk. JetBrains Mono or IBM Plex Mono. Small size, wide letter spacing, uppercase for
  labels. This is where the engineering identity shows, in the scaffolding around the
  writing, not in the writing itself.

The contrast between the two typefaces on the same page is the whole point. They should
never be mixed within a single block of text. Playful microcopy (see Color and Motion below)
lives in the structural voice, short, monospace, conversational, not in the essay voice.

## Color

**Revised 2026-09-22.** The original rule here was "not a bright, saturated, startup-style
palette," one functional accent only, used solely to mark states. That rule is being
deliberately loosened, not abandoned: the essay content itself keeps the original warm,
muted, paper-like palette, since that's still where the literary identity lives. The
structural and interactive layer around it, nav, homepage, code blocks, small interactive
touches, gets more room to be bold and have personality, closer to the developer-brand
approach a tool like Hydra takes: a confident, high-contrast accent used with intent, not
apologetically.

- **Base (essay content):** unchanged. Near-neutral, slightly warm off-white for light mode,
  deep warm near-black for dark mode. Still reads like paper or a terminal.
- **Bold accent, expanded role:** the existing burnt-orange accent (`#b5541f` light /
  `#d9834a` dark) is kept as the palette's anchor color rather than replaced, so the site
  doesn't lose its own identity chasing someone else's. Its role expands from "state marker
  only" to also carrying the structural chrome, header, nav hover states, the interactive
  code-typing cursor, small playful touches, with more saturation and confidence than
  before. It still never appears inside essay body text itself.
- No gradients, no glassmorphism, still true. Flat, direct, print-like, but "print-like" now
  includes the confident, high-contrast poster and zine tradition of print, not just a
  literary book page. Both are honest readings of "print," and this revision leans toward
  the bolder one for the site's chrome and interactive layer specifically.

## Layout

Largely unchanged, plus a mobile-first correction.

- Main content column stays narrow, literary-site width, not full-bleed.
- Metadata (date, tags, status) lives in a visible margin beside the content on wide
  screens, collapsing to stacked above content on narrow screens.
- Section navigation reads like a directory listing, plain text links, monospace, still no
  pill-shaped buttons, though hover/active states can now carry more personality (see
  Motion).
- **Mobile-first, corrected 2026-09-22:** the site was designed desktop-first with a mobile
  collapse bolted on, and that produced real, measured bugs rather than just an
  under-tested edge case. Going forward, mobile is the base case checked first, desktop is
  the addition, not the other way around.

## Motion

**Revised 2026-09-22.** The original rule was strict restraint: cursor-blink and hover
annotation only, nothing else, on the reasoning that any more motion would read as a
polished product demo and undercut the unfinished-thinking premise. That's being loosened
in one specific, bounded way, not opened up generally.

- Cursor-blink on the homepage headline: unchanged, still the single most important motion
  element.
- Hover-reveal marginal annotation: unchanged.
- **New: code blocks type themselves in**, revealing character by character (or a fast
  chunked reveal, not literally one keystroke at a time) when they scroll into view, using
  the same blinking-cursor visual language already established, not a new, disconnected
  effect. This is the same "not finished, actively being worked out" idea the headline
  cursor already carries, applied to code specifically, since code is where the working-out
  is most literal.
- **New: small, playful hover/interaction details** on nav and interactive elements, tied
  to the bold accent color, are allowed now, short of parallax, scroll-triggered fades, or
  page transitions, which remain out. The line is: motion that reinforces "a mind working
  through something," not motion that performs polish.
- `prefers-reduced-motion` is respected for all of the above, extending the pattern the
  cursor-blink animation already uses, not a new policy.

## Personal mark

**New, 2026-09-22.** Rather than an illustrated mascot borrowed from another product's
branding (the Hydra reference that prompted this revision has its own duck character, which
belongs to them, not something to imitate), the site gets a small original visual motif
built from material already native to it: UMWAYI itself, and what the name actually means.

- UMWAYI means shepherd. That's not incidental to the mark, it's the mark. A shepherd
  gathers scattered things into one place and tends them, which is exactly what the
  hub-and-spoke structure already does: journal entries, career prep, CMU, settlement
  engine, routine machine, all separate threads, gathered and tended from one hub. The
  personal-mark direction below is built from that meaning directly, not from an unrelated
  decoration layered on top of it.
- A simple mark built from the existing blinking-cursor glyph, the same `_` already used in
  the homepage headline animation, reads as the one doing the tending, the working,
  watching mind, the shepherd's own position in the metaphor. Minimal, geometric, not a
  cartoon face. Used sparingly (favicon, a small idle-state touch, maybe an easter egg),
  tied to "thought still being typed" the same way it already is, with "still being
  gathered and tended" as the added layer of meaning, not a second, separate symbol.
- A secondary, quieter visual language drawn from the UMWAYI method's six stages, Observe,
  Name, Investigate, Record, Learn, Govern, becomes the flock being gathered rather than a
  generic status glyph set: small marks, near metadata or in the homepage's open-questions
  feature, that visually read as separate small things being drawn toward or arranged
  around one point. This is the shepherd meaning made structural rather than illustrated,
  no crook, no literal shepherd imagery, which would read as a cliché icon rather than
  something earned from the actual name and the actual architecture.
- Neither of these is a full character design yet. This section scopes the direction and
  its reasoning; the actual visual execution is Claude Code's to draft and Miguel's to
  react to, not locked in here.

## The homepage's open-questions feature

Unchanged. Pulls open questions from the UMWAYI hub's project files at build time, displayed
plainly, dated, unresolved.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-18 | Two-typeface system: literary serif for body, technical monospace for structure | Embodies the deliberate, unresolved tension between the philosophical/literary identity and the engineering identity, rather than picking one |
| 2026-09-18 | One functional accent color only, no decorative palette | Keeps the site from reading as a polished, settled product; color should mean something, not just look good. **Revised 2026-09-22, see below.** |
| 2026-09-18 | Cursor-blink motion on the homepage headline | Single clearest way to express "thought mid-motion, not settled" without relying on abstract language alone |
| 2026-09-18 | Homepage surfaces real open questions from UMWAYI, not a static hero | Makes "alive and searching" a literal, verifiable property of the page, not just a stated design intention |
| 2026-09-18 | No decorative motion (parallax, scroll fades, transitions) | Any polish beyond the cursor-blink and hover annotation contradicts the unresolved, working-notebook premise. **Loosened 2026-09-22 for one specific addition, see below, parallax/scroll-fade/transitions remain out.** |
| 2026-09-18 | Homepage open questions are fetched at build time from UMWAYI's public GitHub repo (`raw.githubusercontent.com`, no auth), parsing `## Open questions` and `## Open decisions` headings out of `career-prep.md`, `cmu-masters.md`, `routine-machine.md` | Mirrors the precedent already set in routine-machine's `docs/hub-sync.md` (public repo, public API, no stored token). A network failure during build degrades to an empty section rather than failing the build, since a missing homepage feature is a smaller cost than a broken deploy |
| 2026-09-18 | Items are round-robined across the three source files, capped at 3, each labeled with its source project rather than a per-item date; the section is timestamped once with "as of \<build date\>" | The source files don't carry per-bullet dates, so inventing one would misrepresent the content. Labeling by project plus a single honest build-time stamp stays truthful to what's actually in the hub |
| 2026-09-18 | Light mode: bg `#faf6ef`, text `#201b14`, muted `#6f6656`, border `#e5ddcd`. Dark mode: bg `#17130e`, text `#ece4d6`, muted `#a3967f`, border `#332c22`. Accent (both modes): `#b5541f` light / `#d9834a` dark | Warm off-white/near-black per the brief, checked for adequate contrast against body text; the accent needed a lighter shift in dark mode to stay legible without turning bright/decorative |
| 2026-09-18 | Added an optional `updated` date field to the content schema | Needed so the hover annotation's "updated date" (specified in the Motion section) has real data to show instead of being decorative filler |
| 2026-09-18 | Fixed the placeholder scaffold's stylesheet include, which used a raw `<link href="/src/styles/global.css">` that only resolves in `astro dev` and silently ships with no CSS in a production build | Discovered while implementing this design; switching to a frontmatter `import` lets Astro bundle and base-path the stylesheet correctly for GitHub Pages |
| 2026-09-22 | Three real mobile-viewport bugs confirmed by rendering the live site at 375px width and measuring actual overflow, not by reading CSS: (1) `.site-nav`'s four links overflow the viewport by about 23px on every page, no wrap or shrink allowance; (2) article headlines, paragraphs, and code blocks all overflow, root cause is a single line, `.article-grid`'s mobile breakpoint uses `grid-template-columns: 1fr` instead of `minmax(0, 1fr)`, so the track has no containment floor and a wide code line stretches the whole grid past the screen; (3) same root cause explains both the code-block and headline overflow, it's one fix, not three | Resolves the open question below about whether the two-typeface layout holds up on mobile: it didn't, concretely, and now there's an exact, verified cause instead of a guess |
| 2026-09-22 | Color and motion policy deliberately loosened: a bolder, more confident use of the existing accent color across the site's structural chrome and interactive layer (not the essay body text), plus one new motion element, code blocks typing themselves in on scroll, tied to the existing cursor-blink visual language | Miguel asked for more playfulness and interactivity after seeing Hydra's (DuckDB-on-Postgres) developer-brand design, bold color, personality-driven microcopy, gamified touches. The underlying "philosophy meets tech, not finished, not a polished product demo" identity is kept; the loosening is bounded (essay text and the no-parallax/no-transition rule both stay as they were), not a full rebrand |
| 2026-09-22 | No borrowed mascot; a small original mark instead, built from the site's own existing cursor-blink glyph, plus a secondary visual language drawn from the UMWAYI method's six stages, rather than an illustrated character | The Hydra reference's duck is their brand asset, not a reusable design pattern. The site's own working method and existing motion language already have material to build an original mark from, without needing to invent or borrow a character |
| 2026-09-22 | The personal mark is built from UMWAYI's actual meaning: shepherd. The cursor glyph reads as the one tending and gathering (the shepherd's position), the six-stage method's markers read as the things being gathered (the flock), no literal crook or shepherd imagery used | Stated by Miguel directly. Ties the new personality layer to something real about the project's own name and its already-existing hub-and-spoke architecture (gathering scattered threads into one place), rather than an invented decoration; a literal shepherd icon was considered and rejected as a cliché that would carry less meaning than the structural version |
| 2026-09-22 | Adding Tailwind CSS and daisyUI as the implementation path for the above, on top of, not replacing, the existing hand-written `global.css` for typography and layout | daisyUI needs Tailwind underneath it; Astro has an official Tailwind integration, and both are build-time only, no conflict with the site staying fully static. Using daisyUI's theme system for the new bold-accent chrome keeps the implementation consistent and themeable (light/dark) rather than hand-rolling a second color system next to the existing CSS variables |
| 2026-09-22 | Both mobile bugs fixed as scoped: `.site-nav` gets `flex-wrap` plus a smaller font-size/letter-spacing step under 400px, `.article-grid`'s mobile breakpoint changed to `grid-template-columns: minmax(0, 1fr)`. Verified with a committed script, `scripts/check-mobile-viewport.mjs` (`npm run check:mobile`), driving Playwright against system Chrome (`channel: 'chrome'`, Playwright's own Chromium download couldn't reach its CDN from this environment) at 375px against a production `astro build` + `astro preview`, asserting `scrollWidth === clientWidth` on all 13 pages | `astro dev` was tried first and consistently failed the same check on every article page; root-caused to Astro's dev-only toolbar overlay, not a real layout bug (confirmed absent from a production build). Checking against `astro dev` would have chased a phantom bug on every future rerun, so the script targets `preview` and that constraint is written into the script's own header comment |
| 2026-09-22 | Tailwind installed manually (`npm install @astrojs/tailwind tailwindcss@^3 daisyui@^4`, hand-written `astro.config.mjs`/`tailwind.config.mjs`) rather than via `npx astro add tailwind` | `astro add`'s own package-resolution step failed to reach the registry in this environment even though plain `npm install` could; the manual path produces the same integration, just without the CLI's scaffolding step |
| 2026-09-22 | Tailwind's Preflight (`corePlugins.preflight: false`) is off | Preflight resets margins, headings, lists, etc. globally, which would fight the hand-tuned essay typography `global.css` already owns; disabling it keeps Tailwind/daisyUI strictly additive to the new chrome, matching "don't migrate the existing typography/layout CSS" and "not the essay body text" |
| 2026-09-22 | daisyUI theme choice (`umwayi-light` / `umwayi-dark`, primary color = the existing accent) is picked by a `data-theme` attribute set on `<html>` by a small synchronous inline script reading `prefers-color-scheme`, mirroring `global.css`'s own dark-mode block | Keeps daisyUI on the same system-preference signal the rest of the site already uses instead of introducing a manual light/dark toggle UI, which nothing in the brief asked for. The script is synchronous and blocking in `<head>`, so there's no theme flash |
| 2026-09-22 | Nav hover/active accent color is applied with actual Tailwind/daisyUI utility classes (`hover:text-primary`, `after:bg-primary`, conditionally added in `BaseLayout.astro`) rather than a hand-CSS rule referencing `var(--accent)` | The whole point of adding daisyUI was to make the bold-accent chrome themeable through its theme system; a hand-CSS shortcut would have produced the same visual result without actually exercising daisyUI, leaving it dead weight in the dependency tree |
| 2026-09-22 | Code-block reveal built as: IntersectionObserver per `pre.astro-code`, each shiki `.line` span gets a `clip-path` inline style JS toggles from fully-clipped to visible with a per-line `transition-delay`, using a stepped (not linear) transition timing; a `.code-cursor` (the same `.cursor` glyph/blink animation, colored with the accent) is appended after the last line and fades out once the reveal finishes | No text node is ever added, removed, or reordered, only a CSS `clip-path`, which browsers don't hide from the accessibility tree or from text selection the way `display`/`visibility` would; verified with Playwright that `pre.textContent` is complete before, during, and after the reveal, that `prefers-reduced-motion: reduce` fully skips the effect (checked with an isolated `reducedMotion: 'reduce'` browser context), and that the cursor fades rather than blinking indefinitely once "written" |
| 2026-09-22 | Favicon (`public/favicon.svg`) uses the `\|` character actually rendered by the homepage's `.cursor` span, not the `_` this document's Personal mark section describes it as | The live glyph in `index.astro` is `\|`, not `_`; matching the real glyph keeps the mark and the homepage consistent with each other rather than inventing a second, different character to match this document's wording |
| 2026-09-22 | The mark's second sparing placement (alongside the favicon) is the code-reveal cursor built for Part 3 above, not a separate new UI element | It's the same glyph, same blink animation, already tied to "still being written"; adding a third, distinct placement just to satisfy the letter of "favicon, a small idle-state touch" would have worked against "used sparingly...not spread across every page" |
| 2026-09-22 | The six-stage "flock" mark is six small dots of increasing opacity/size arranged in a short converging arc, ending in one accent-colored dot, placed once, next to "Open threads" on the homepage; the cluster carries one shared `aria-label`/`title` naming all six stages rather than per-dot labels | One clear, quiet placement per "not spread across every page"; a single accessible label reads better to a screen reader than six individually meaningless dots, and the converging arc (muted → accent) is the structural read of "gathered and tended" without any literal shepherd or crook imagery |
| 2026-09-22 | Structural microcopy pass: nav links get a `title` tooltip reusing/adapting the homepage's own per-section descriptions (already in `index.astro`, not new invented copy), and the code-reveal cursor gets `title="still being written"` | Keeps the dry, conversational voice tied to what the site already says about itself rather than generic "fun" copy; both are `title` attributes, so they're discoverable on hover without adding new visible UI |

## Open questions

- ~~Whether the two-typeface contrast holds up on mobile~~ Answered 2026-09-22: it didn't,
  three real bugs found, root-caused, and fixed (see decisions log); reverified clean across
  all 13 pages after every later part of the same revision, per `npm run check:mobile`.
- ~~What the "small original mark" built from the cursor glyph and the UMWAYI method's six
  stages actually looks like in practice~~ First pass built 2026-09-22: the favicon plus the
  code-reveal cursor for the shepherd glyph, six converging dots next to "Open threads" for
  the flock. Still a first pass, not locked in, Miguel's reaction to the live version is the
  next input, not this document.
- Whether the bolder accent usage on structural chrome reads as confident or as clashing
  against the still-muted essay body text, now actually built (nav hover/active states, the
  code-reveal cursor) and visually spot-checked in both themes, but not yet seen by Miguel in
  a real browser session, still needs that real look before it's considered settled.