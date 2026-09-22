# Design

## Purpose

Defines the visual and interaction language for the site, so it feels like the thing it's
actually about: a mind working through philosophy, technology, and self-observation at once,
not a finished conclusion presented as a portfolio.

## Current state

Implemented through both 2026-09-22 revisions. The first (mobile fixes, Tailwind/daisyUI,
the code-reveal effect, a small cursor-based mark) read as flat once seen live, screenshots
taken at desktop and mobile width. Miguel confirmed that reading directly and asked for a
second, larger revision the same day: the shepherd theme fully embraced, an actual mascot,
and the page given real life. That's now built: an SVG shepherd mascot (staff literally the
site's own cursor glyph) in a real homepage hero, a six-mark flock that gathers toward it
once on load, a fixed-color hero band that holds up in both light and dark mode, one small
idle blink on the mascot, reverified against a production build (`npm run check:mobile`,
all 13 pages) and looked at directly in screenshots (desktop, dark, mobile, reduced-motion)
before being called done. See the decisions log for the exact sequence, including two
color choices that didn't work before the one that did.

## The core idea

Unchanged. Two things that don't usually sit together, literary essay writing and
engineering documentation, held in tension rather than resolved into one style. "Alive and
searching" means the site doesn't perform finished thought. What's changed across both
2026-09-22 revisions is how much personality is allowed to show while saying that, not the
underlying claim itself.

## Typography

Unchanged. Two typefaces, a warm literary serif for essay body text, a technical monospace
for structure. Still never mixed within a single block of text.

## Color

**Revised 2026-09-22, twice.** The original rule was one functional accent only, no
decorative palette. The first revision loosened that for the site's structural chrome.
Seeing the result live showed that loosening wasn't enough, the page still read as flat,
not "alive." The second revision goes further:

- **Essay body text:** still keeps its calm, literary palette. This isn't reversed, long-
  form reading genuinely needs the restraint the original rule was protecting, and nothing
  Miguel asked for was about wanting the essays themselves harder to read.
- **Everywhere else, real color energy, not just labels and hover states.** The accent
  color gets to be a presence, not a hint: a real hero section on the homepage, a
  meaningfully colored band or block behind the mascot, not just text tinted orange. A
  second, complementary tone is allowed alongside the existing accent specifically for the
  mascot and flock illustration, so the mascot doesn't have to be monochrome to read as
  alive, chosen to sit comfortably next to the existing accent rather than fighting it,
  Claude Code's call, checked against both light and dark mode.
- No gradients, still true, flat color blocks and shapes instead. No glassmorphism, still
  true. "Print-like" still the reference, but now specifically the bold, confident,
  high-contrast end of that tradition (poster, zine, letterpress) rather than the quiet
  literary-book end, for everything outside the essay column itself.

## Layout

Unchanged from the first 2026-09-22 revision: mobile-first, narrow essay column, margin
metadata. One addition:

- **The homepage gets a real hero section**, the mascot and headline together, not the
  mascot as a small corner detail. This is the single biggest visual change this revision
  makes, everything else (color, motion, the mascot itself) exists to make this moment
  actually land.

## Motion

**Revised 2026-09-22, twice.** The first revision added the code-reveal effect and small
nav hover details. This revision adds real presence to the homepage specifically:

- Cursor-blink on the headline: unchanged.
- Code-block typing reveal: unchanged.
- **New: the flock gathers.** On the homepage, the six small marks representing the UMWAYI
  method's stages animate inward toward the mascot on load or on scroll into view, a short,
  purposeful motion, not a decorative loop, it happens once and settles, consistent with
  "gathered and tended" rather than looping forever like a spinner.
- **New: the mascot itself can carry one small idle motion** (a slow blink, a subtle sway,
  whatever Claude Code's first draft finds reads as alive without reading as a looping GIF
  mascot), short and restrained, not constant bouncing.
- Parallax, scroll-triggered fade-ins on every section, and page transitions stay out. The
  line hasn't moved: motion that reinforces the shepherd/gathering idea specifically, not
  motion that performs generic polish.
- `prefers-reduced-motion` is respected for all of the above, same as every other motion
  element on the site.

## Mascot

**Revised 2026-09-22.** The first version of this section explicitly avoided an illustrated
mascot, reasoning that a borrowed character (Hydra's duck) shouldn't be imitated and that a
literal shepherd icon would read as cliché. Miguel reviewed the result live and asked
directly for the opposite: full embrace, an actual mascot, not just structural dots.
That's a real reversal of the earlier call, not a small addition, and it's recorded as one.

The reasoning against cliché still matters, it just gets solved differently now: not by
avoiding a mascot, but by building one that's actually made from the site's own material
instead of generic shepherd iconography.

- **The mascot is a shepherd figure built from the site's existing cursor glyph.** The
  glyph already used for the blinking cursor (`|`) becomes the shepherd's staff, literally
  the same character, not a separate crook icon invented from nothing. The figure itself
  should stay in the site's existing flat, geometric, technical-illustration register
  (simple shapes, confident line weight, the accent colors), not soft or cartoon-cute,
  keeping it a plausible fit for a philosophy-and-engineering identity rather than a
  generic friendly-startup mascot.
- **The flock is the UMWAYI method's six stages** (Observe, Name, Investigate, Record,
  Learn, Govern), rendered as six small creatures or marks, simple enough to read as a
  group at a glance, gathering toward the shepherd (see Motion above). These replace the
  quiet six-dot version from the first revision, same underlying meaning, now visible and
  present instead of barely-there.
- **Placement:** the homepage hero, prominently, this is the whole point of this revision.
  A secondary, smaller placement (favicon, an idle-state touch) can reuse the mascot or the
  staff-glyph alone, Claude Code's call once the full character exists.
- **Still not final.** This is a first full pass, not a locked design. Miguel reacting to
  the actual built version, not this document, is what actually settles it, the same as the
  first revision's smaller version was treated.

## The homepage's open-questions feature

Unchanged in function. Its presentation is now part of the hero section and the flock
motion above, rather than a quiet text block below the fold.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-18 | Two-typeface system: literary serif for body, technical monospace for structure | Embodies the deliberate, unresolved tension between the philosophical/literary identity and the engineering identity, rather than picking one |
| 2026-09-18 | One functional accent color only, no decorative palette | Keeps the site from reading as a polished, settled product; color should mean something, not just look good. **Revised 2026-09-22, twice, see below.** |
| 2026-09-18 | Cursor-blink motion on the homepage headline | Single clearest way to express "thought mid-motion, not settled" without relying on abstract language alone |
| 2026-09-18 | Homepage surfaces real open questions from UMWAYI, not a static hero | Makes "alive and searching" a literal, verifiable property of the page, not just a stated design intention |
| 2026-09-18 | No decorative motion (parallax, scroll fades, transitions) | Any polish beyond the cursor-blink and hover annotation contradicts the unresolved, working-notebook premise. **Loosened 2026-09-22, twice, see below; parallax/scroll-fade/transitions remain out both times.** |
| 2026-09-18 | Homepage open questions are fetched at build time from UMWAYI's public GitHub repo (`raw.githubusercontent.com`, no auth), parsing `## Open questions` and `## Open decisions` headings out of `career-prep.md`, `cmu-masters.md`, `routine-machine.md` | Mirrors the precedent already set in routine-machine's `docs/hub-sync.md` (public repo, public API, no stored token). A network failure during build degrades to an empty section rather than failing the build, since a missing homepage feature is a smaller cost than a broken deploy |
| 2026-09-18 | Items are round-robined across the three source files, capped at 3, each labeled with its source project rather than a per-item date; the section is timestamped once with "as of \<build date\>" | The source files don't carry per-bullet dates, so inventing one would misrepresent the content. Labeling by project plus a single honest build-time stamp stays truthful to what's actually in the hub |
| 2026-09-18 | Light mode: bg `#faf6ef`, text `#201b14`, muted `#6f6656`, border `#e5ddcd`. Dark mode: bg `#17130e`, text `#ece4d6`, muted `#a3967f`, border `#332c22`. Accent (both modes): `#b5541f` light / `#d9834a` dark | Warm off-white/near-black per the brief, checked for adequate contrast against body text; the accent needed a lighter shift in dark mode to stay legible without turning bright/decorative |
| 2026-09-18 | Added an optional `updated` date field to the content schema | Needed so the hover annotation's "updated date" (specified in the Motion section) has real data to show instead of being decorative filler |
| 2026-09-18 | Fixed the placeholder scaffold's stylesheet include, which used a raw `<link href="/src/styles/global.css">` that only resolves in `astro dev` and silently ships with no CSS in a production build | Discovered while implementing this design; switching to a frontmatter `import` lets Astro bundle and base-path the stylesheet correctly for GitHub Pages |
| 2026-09-22 | Three real mobile-viewport bugs confirmed by rendering the live site at 375px width and measuring actual overflow, not by reading CSS: header nav overflow, and one CSS line (`.article-grid`'s mobile breakpoint missing `minmax(0, ...)`) causing both headline and code-block overflow | Resolved the standing open question about whether the two-typeface layout holds up on mobile: it didn't, concretely |
| 2026-09-22 | First color/motion loosening: bolder accent on structural chrome only, plus the code-reveal effect, mascot explicitly declined in favor of a small cursor-based mark and quiet six-dot flock | Miguel asked for more playfulness after seeing Hydra's developer-brand design; scoped conservatively as a first, bounded step |
| 2026-09-22 | Tailwind CSS and daisyUI added as the implementation path, scoped to structural chrome, Preflight off, essay typography untouched | daisyUI needs Tailwind underneath it; both build-time only, no conflict with the static site; keeps the new chrome themeable through daisyUI's own system instead of a second hand-rolled color system |
| 2026-09-22 | Built and pushed by Claude Code (commit `726e635`): both mobile bugs fixed, Tailwind/daisyUI wired in, code-reveal effect, favicon and six-dot mark, bolder nav accent. Independently reverified against the live pushed repo, not accepted on the commit message alone: a fresh `astro build`, served, and measured at 375px, `document.scrollWidth === clientWidth` on every page checked | Confirms the first revision actually shipped correctly before building further on top of it |
| 2026-09-22 | The live result was screenshotted (desktop and mobile) and looked at directly, not assumed from the code. Read as flat: the six-dot mark barely visible, accent color confined to small labels, no real visual presence anywhere on the page | Matches what Miguel said directly after seeing it himself; the first revision's caution turned out to undersell what was actually being asked for |
| 2026-09-22 | Reversed: mascot fully embraced. A shepherd figure built from the site's own cursor glyph (the glyph becomes the staff), the six method-stages become a visible flock that visually gathers toward it, placed prominently in a real homepage hero, not a quiet corner mark. A second, complementary color is allowed for the mascot/flock illustration specifically | Miguel's own explicit, direct reversal of the earlier "no mascot, subtle only" call, after seeing the subtler version and finding it dull. The cliché concern behind the original caution is addressed differently now, by building the mascot from the site's own existing material (the cursor glyph as staff) rather than generic shepherd iconography, not by avoiding a mascot altogether |
| 2026-09-22 | Essay body text keeps its original calm palette even in this fuller revision, the added color/illustration energy is scoped to the hero, chrome, and mascot | Long-form readability is a real constraint the original color rule was protecting, and nothing in Miguel's actual request was about wanting the essay text itself louder, only about the page overall feeling alive rather than dull |
| 2026-09-22 | Built the mascot as an inline SVG (`src/components/Mascot.astro`): a flat geometric shepherd (circle head, trapezoid robe, a small polygon arm, one dot eye) whose staff is a literal `<text>\|</text>` in the site's own monospace font, not a drawn icon. Six flock marks are one repeated `<symbol>` (a simple teardrop shape) via six `<use>` instances, not six bespoke creatures. Placed in a real homepage hero (`.hero`/`.hero-inner` in `global.css`, wired into `index.astro`), mascot beside the headline, not a corner detail | Matches the brief's "literally the same character, not a separate crook icon" instruction directly; one repeated symbol keeps the flock legible as a group at a glance without needing six independently-illustrated creatures for a first pass |
| 2026-09-22 | Hero band color: settled on a single fixed mid-toned teal (`--accent-2: #4a8078`) for both light and dark site themes, not a theme-flipping token. First attempt flipped it (dark teal in light mode, light teal in dark mode) two different ways and both failed: a near-black fixed band disappeared into the already-dark page in dark mode, and a theme-flipping teal put the flock's own teal marks directly on a teal band, invisible. A single mid-luminance teal reads clearly against both the cream light-mode page and the near-black dark-mode page at once, confirmed by screenshotting both, not assumed | The three colors doing real work here (band, flock marks, mascot) needed to be checked as a set, not picked independently; this was only caught by actually looking at rendered screenshots in both themes, exactly the discipline this log already uses for the mobile bugs |
| 2026-09-22 | Flock marks are cream (`--hero-ink`, fixed, matching the hero band's fixed-color logic) except the final, closest-to-the-staff mark, which is `--accent` (the theme-varying orange, matching the mascot) | Keeps the "gathered" one visually tied to the shepherd itself (same color), while the other five read clearly as a distinct group against the teal band; also the direct fix for the invisible-flock bug above |
| 2026-09-22 | Hero band is contained-width (cancels `main`'s own 1.5rem side padding via a fixed negative margin), not a 100vw full-viewport bleed | A 100vw-based full-bleed technique is a known source of horizontal-scrollbar overflow bugs, exactly the class of bug this same document's mobile-fixes section already spent real effort tracking down once; the contained approach still reaches the true viewport edge on mobile (where `main`'s max-width isn't in effect) without that risk, verified with `npm run check:mobile` after the hero was built |
| 2026-09-22 | Flock gather-in animation built as CSS `transform: translate()` transitions per `<use>` (SVG elements support CSS transforms directly), triggered once by an IntersectionObserver (`src/scripts/flock-gather.js`), same architecture as the existing code-reveal script. The mascot's one idle motion is a slow eye blink (a `scaleY` keyframe on the eye dot, ~6.5s cycle), kept rather than dropped | A blink read as "alive" without becoming a bouncing/looping mascot; both the gather (via JS class check) and the blink (via a `@media (prefers-reduced-motion: reduce)` rule) were verified directly with an isolated `reducedMotion: 'reduce'` Playwright context, not assumed from the CSS |
| 2026-09-22 | Reverified against a production `astro build` + `preview`: `npm run check:mobile` across all 13 pages, plus direct screenshots of the built homepage (desktop light, desktop dark, mobile, and the reduced-motion state) looked at before calling this done, not judged from the code | Matches this document's own standing rule that the mobile-bug and flatness findings were both only caught by looking, never assumed from reading CSS |

## Open questions

- ~~Whether the two-typeface contrast holds up on mobile~~ Answered 2026-09-22: it didn't,
  found, fixed, reverified, including after the hero was added.
- ~~What the small, quiet cursor-and-six-dot mark looks like~~ Superseded 2026-09-22 by the
  full mascot direction above, before Miguel had even reacted to the quiet version, once
  seeing it live made clear it wasn't enough.
- ~~Whether the second illustration color reads well next to the existing accent in both
  light and dark mode~~ Settled on a fixed mid-toned teal after two failed theme-flipping
  attempts, screenshotted and confirmed in both modes; see the decisions log above.
- Whether the mascot, hero section, and fuller color treatment actually read as alive once
  built, or overshoot into something that no longer feels like this site. Screenshotted and
  reads as intended from this end, but Miguel's own reaction to the live version, not this
  document or Claude Code's own read of its screenshots, is what actually settles it.