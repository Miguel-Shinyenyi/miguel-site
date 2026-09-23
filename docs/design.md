# Design

## Purpose

Defines the visual and interaction language for the site, so it feels like the thing it's
actually about: a mind working through philosophy, technology, and self-observation at once,
not a finished conclusion presented as a portfolio.

## Current state

**Superseded 2026-09-23.** Both 2026-09-22 revisions (mobile fixes plus a bolder accent, then
a fuller mascot/hero built on top of it) are being replaced, not extended, by a complete
design spec Miguel provided directly: `docs/redesign-spec-2026-09-23.md`, the canvas-mockup
build notes he wrote and asked to be followed. This is a real replacement of the previous
direction's specific choices (the abstract geometric mascot, the rust-orange single-accent
palette, Newsreader/JetBrains Mono), not an extension of them, and it is recorded as one
rather than silently written over. The underlying identity the site is trying to hold, see
Core idea below, does not change; the visual system expressing it does, completely.

Sections below describe the new direction at the level this document has always worked at:
principles and decisions, not a component-by-component build spec. The full markup, daisyUI
component choices, and code samples live in `redesign-spec-2026-09-23.md` itself, which is
the actual source of truth Claude Code builds from; this file records what it means, why it
was chosen, where it conflicts with anything decided here before, and how it meshes with the
site's real existing content rather than an idealized version of it.

## The core idea

Unchanged. Two things that don't usually sit together, literary essay writing and
engineering documentation, held in tension rather than resolved into one style. "Alive and
searching" means the site doesn't perform finished thought. The new direction pushes further
on personality and presence than either 2026-09-22 revision did, but the underlying claim,
what the site is actually for, stays the same.

## Typography

**Replaced 2026-09-23.** The original two-typeface system (Newsreader serif for essay body,
JetBrains Mono for structure) is replaced with the new spec's pairing: Fraunces (400, 600,
italic 400) for display and headings, Karla (400, 500, 700) for body and structure. The
underlying principle, two typefaces in deliberate tension rather than one typeface doing
everything, is unchanged; the actual faces are not. Loaded via Google Fonts, this is a real
deployed site, not a sandboxed artifact, so an external font request at build/runtime is
fine here in a way it wouldn't be inside a self-contained preview page.

## Color

**Replaced 2026-09-23.** The single rust-orange accent system (`umwayi-light`/`umwayi-dark`,
built from the site's original one-accent rule, then loosened twice on 2026-09-22) is
replaced entirely by the new spec's two themes: `pasture` (light, ochre primary `#9A5B1E`,
pasture-green secondary `#3F5A3C`) and `nightwatch` (dark, ochre shifted to `#E0A965` for
contrast, per the spec's own note that the light-mode primary fails 4.5:1 on the dark
background). This is a genuinely different palette family, warm ochre and green rather than
rust orange, not a retune of the existing one. Essay body text is not carved out as a
separate, quieter palette this time, the new spec's own base/content tokens already read as
calm, literary colors rather than a bright decorative one; if a real reading of the built
pages shows the essay column itself getting harder to read, that's an open question below,
not assumed settled by the spec alone.

**Stack change this requires, verified before committing to it:** the new spec assumes
Tailwind CSS 4 and daisyUI 5, both real, current releases (checked directly: `tailwindcss`
4.3.3, `daisyui` 5.7.43 on npm as of this writing), a major-version jump from what's
currently installed (Tailwind 3.4, daisyUI 4.12, wired in via `@astrojs/tailwind`). Tailwind
4 changes its own integration model, config moves from a `tailwind.config.mjs` file to CSS
itself (`@import "tailwindcss"` plus `@plugin` blocks), and Astro's own integration path for
it is `@tailwindcss/vite` rather than `@astrojs/tailwind` (which stays on the old PostCSS-era
model). This was not assumed, it was tested directly against this exact repository before
this document or the Claude Code prompt were written: a working copy had `@astrojs/tailwind`,
`tailwindcss@3`, and `daisyui@4` removed, `tailwindcss@latest`, `@tailwindcss/vite@latest`,
and `daisyui@latest` installed, `astro.config.mjs` switched to the Vite-plugin form, and
`tailwind.config.mjs` deleted in favor of a CSS-based theme block naming the new `umwayi`-
style themes. `npm run build` succeeded, all 13 pages, and the built CSS contained both new
theme names and their `color-scheme` declarations, confirming daisyUI 5 actually generated
real theme rules from the CSS-based config, not just that the build didn't crash.

## Layout

**Replaced 2026-09-23.** The specific sections (navbar, hero, four-pillars, hub explorer,
writing tabs, projects grid, now, footer, article template) follow
`redesign-spec-2026-09-23.md` section 4 directly. Two meshing decisions with the site's real
existing structure, not covered by the spec itself because it was written without seeing the
live repo:

- **Content stays in three existing Astro content collections** (`philosophy`, `tech`,
  `journal`), not restructured into one collection with a `section` front-matter field as the
  spec's sample front matter suggests. The real content already lives this way, is already
  correctly typed and validated by `src/content/config.ts`, and the "Writing" tabs UI can pull
  from three existing collections exactly as easily as from one with a discriminator field.
  Restructuring real, committed content into a new schema for a v1 visual pass is a cost with
  no matching benefit here.
- **`readTime` is computed, not authored.** No article currently carries a read-time value,
  and hand-typing one per article invites it going stale. Claude Code computes it from each
  article's real word count at build time (a simple words-per-minute estimate is fine, common
  and expected to be approximate) rather than inventing a number or leaving the front-matter
  field required and unfilled.
- **`crossPost` stays empty for now.** Per `backlog.md`, Hashnode, dev.to, Medium, and
  LinkedIn accounts don't exist yet. The front-matter field can exist in the schema as
  optional, but no article gets values in it, and the footer's social links (section 4.8 of
  the spec) only render the ones that are real today: GitHub. The others are left out of the
  built page entirely rather than linked and broken, until those accounts exist.
- **Projects grid:** the two real project files (`settlement-engine.md`, `routine-machine.md`)
  map directly to the spec's card component. Whether to add UMWAYI itself as a third card
  (the spec's own table lists it, "Knowledge system," live, real GitHub link) is left as an
  open question below rather than assumed, since it's a genuinely different kind of thing
  from the other two, a documentation system rather than a built application, and Miguel
  hasn't said directly whether it belongs on the same grid.

## Motion

**Replaced 2026-09-23.** The flock-gather animation and mascot eye-blink built in the
previous revision are removed along with the mascot they animated (see Mascot below). The new
spec's motion is smaller in scope and entirely CSS-driven or trivial JS: the theme-toggle
`swap` rotation, the `collapse` radio-group pillar cards, the `tabs` component switching, the
`:has()`-driven SVG node highlight in the hub explorer, none of it a custom animation loop.
The one genuinely new interactive piece, the shepherd's rotating one-line thoughts on tap,
is real JS (about a dozen lines per the spec) but text-only, no motion beyond the button's own
state change. `prefers-reduced-motion` still applies wherever the spec calls for a transition
(explicitly named for the theme-toggle rotation in its accessibility checklist), same standing
rule this site has held since the first revision.

## Mascot

**Replaced 2026-09-23.** The abstract geometric shepherd (circle head, trapezoid robe, a
polygon arm, the cursor glyph as a literal staff) and its six-mark teardrop flock, built and
verified in the previous revision, are both removed. In their place: a fully illustrated
shepherd, per the new spec, leaning on his crook, hand on chin, eyes up, a red shuka over a
green robe, one sheep at his feet, drawn in bold-outline flat-fill style with hard offset
shadows rather than the previous minimal-geometric register. This is a different illustration
language entirely, not a refinement of the existing one, and it is a deliberate choice Miguel
made by writing and providing this spec directly, not a call being made on his behalf here.

The previous mascot's specific reasoning, that the figure should visibly grow out of the
site's own material (the cursor glyph as literal staff) rather than read as generic pastoral
clip art, is not carried forward as a constraint on this new illustration; the new spec
doesn't ask for that connection and inventing one it didn't ask for would be adding scope
back in under a decision that's already been superseded once. If the finished illustration
ends up reading as generic once actually seen, that's a real question for the open list below,
the same discipline this document has applied to every mascot decision so far, not something
to pre-judge before Claude Code builds it.

The flock as a concept does not appear in the new spec's hero section; a single sheep at the
shepherd's feet replaces the six-creature flock. The UMWAYI method's six stages move instead
to the "Four things I try to understand" pillar cards (a related but different piece of the
site's own structure, four aims rather than six stages) and to the "How it fits together" hub
explorer's four-step loop (Observe, Write, Connect, Apply). Whether collapsing six named
stages into four aims/steps loses something real or is a fair simplification for a homepage
is left open below rather than assumed either way.

## The homepage's open-questions feature

**Open, not yet resolved by the new spec.** The previous two revisions built a real feature
here: open questions and decisions fetched at build time from UMWAYI's public repo, surfaced
on the homepage. The new spec's hero and pillar sections don't reference this feature or
replace it with anything, it's simply not mentioned. This isn't treated as an implicit removal
without saying so; it's flagged directly in the Claude Code prompt as a decision Claude Code
needs Miguel's call on, or a reasonable default (keep it, placed somewhere in the new layout
that doesn't fight the hero) with the reasoning stated, not silently dropped or silently kept.

## Accessibility

New from the spec, and a real addition rather than something this document already covered
at this level of detail: every control must be a genuine interactive element (button, a,
input, label), icon-only buttons need `aria-label`, the shepherd's thought bubble uses
`aria-live="polite"`, text contrast holds 4.5:1 in both themes (the spec's own reasoning for
why the light-mode primary had to shift color in dark mode), the shepherd SVG needs `role="img"`
plus a descriptive `aria-label`, and `prefers-reduced-motion` turns off the theme-toggle's
rotation specifically. Carried forward into the Claude Code prompt as explicit verification
steps, not just implementation notes, consistent with this document's standing practice of
checking claims against the rendered result rather than the code.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-18 | Two-typeface system: literary serif for body, technical monospace for structure | Embodies the deliberate, unresolved tension between the philosophical/literary identity and the engineering identity, rather than picking one. **Replaced 2026-09-23, see below.** |
| 2026-09-18 | One functional accent color only, no decorative palette | Keeps the site from reading as a polished, settled product; color should mean something, not just look good. **Revised 2026-09-22 twice, then replaced entirely 2026-09-23, see below.** |
| 2026-09-18 | Cursor-blink motion on the homepage headline | Single clearest way to express "thought mid-motion, not settled" without relying on abstract language alone. **Removed 2026-09-23 along with the mascot that carried it, see below.** |
| 2026-09-18 | Homepage surfaces real open questions from UMWAYI, not a static hero | Makes "alive and searching" a literal, verifiable property of the page, not just a stated design intention. **Status open as of 2026-09-23, see "open-questions feature" above.** |
| 2026-09-18 | No decorative motion (parallax, scroll fades, transitions) | Any polish beyond the cursor-blink and hover annotation contradicts the unresolved, working-notebook premise. **Still holds 2026-09-23: the new spec's motion is even smaller in scope than either 2026-09-22 revision.** |
| 2026-09-22 | Three real mobile-viewport bugs confirmed by rendering the live site at 375px width and measuring actual overflow, not by reading CSS: header nav overflow, and one CSS line (`.article-grid`'s mobile breakpoint missing `minmax(0, ...)`) causing both headline and code-block overflow | Resolved the standing open question about whether the two-typeface layout holds up on mobile: it didn't, concretely. **Still true, the root cause and fix aren't undone by this revision, but the whole layout is being rebuilt from the new spec's mobile-first sizing tables, so it needs its own fresh mobile-viewport check regardless.** |
| 2026-09-22 | First color/motion loosening: bolder accent on structural chrome only, mascot explicitly declined in favor of a small cursor-based mark | Scoped conservatively as a first, bounded step. **Superseded 2026-09-23.** |
| 2026-09-22 | Reversed: mascot fully embraced as an abstract geometric shepherd built from the site's own cursor glyph, with a six-mark flock and a fixed-teal hero band, independently verified in light mode, dark mode, and with reduced motion | Miguel's direct reversal of the earlier "no mascot" call, after seeing the subtler version and finding it dull. **Superseded 2026-09-23 by a different, fully illustrated mascot direction from a complete new spec Miguel wrote and provided directly, not a further iteration on this one.** |
| 2026-09-23 | Miguel provided `redesign-spec-2026-09-23.md` directly, a complete component-level design spec (daisyUI 5 mappings, exact copy, color tokens, an illustrated mascot, a restructured navigation and homepage), and asked for it to be followed, meshed with the site's real existing content | Named directly as a full replacement of both 2026-09-22 revisions' specific visual choices, not an extension of them, the same discipline this log has applied to every design reversal so far: dated, reasoned, and never silently overwritten |
| 2026-09-23 | Confirmed the required stack upgrade (Tailwind 4, daisyUI 5, `@tailwindcss/vite` replacing `@astrojs/tailwind`) actually works against this repository before writing anything for Claude Code: a real install and `astro build` in a working copy, 13 pages, no errors, built CSS containing both new theme names | Standing practice on this project: confirm a technical possibility against the real repo before committing a design direction to it, not just against the spec's own claims |
| 2026-09-23 | Content stays in the three existing Astro content collections (`philosophy`, `tech`, `journal`) rather than being restructured into the spec's single collection with a `section` field; `readTime` computed from real word count rather than authored; `crossPost` left empty and non-existent social links omitted from the footer rather than linked | The spec was written without seeing the live repo's real content structure and real (not yet existing) social accounts; meshing means adapting the spec's intent to what's actually true here, not restructuring working content or fabricating links, per `backlog.md`'s own record that those accounts don't exist yet |
| 2026-09-23 | Full rebuild shipped: Tailwind 4/daisyUI 5 stack, Fraunces/Karla type, navbar with a persisted light/dark toggle, the illustrated shepherd hero with the rotating thought bubble, four-pillar `collapse`, hub explorer (`steps` + `tabs` + `:has()` SVG highlight), writing tabs pulling real entries from the three collections, a projects grid from real front matter, a `now` section, and a footer subscribe form, all independently reverified against a production build, not accepted on the build succeeding alone | Followed `redesign-spec-2026-09-23.md` section 4 in order, per the brief; every interactive piece (theme persistence, hub highlight, pillar/writing tabs, thought bubble, reduced-motion on the swap rotation) was exercised with Playwright against the rendered page, not assumed from the markup |
| 2026-09-23 | Nav anchors map to homepage section ids the spec's own markup didn't pin down: Philosophy → the four-pillars section, Writing → the writing tabs, Projects → the projects grid, Now → the now section | The spec's `#philosophy`/`#writing`/`#projects`/`#now` hrefs assume those ids exist somewhere but never says where; this mapping is literal (Writing/Projects/Now are all named sections), and Philosophy is the closest thing the page has to a section by that name, given the four pillars ARE the site's stated philosophy |
| 2026-09-23 | Open-questions feature kept, not dropped: it now lives inside the hub-explorer band, right after the tabs, under an "Open threads" heading | Matches the brief's own suggested placement exactly (a real, still-working feature fetching from UMWAYI's public repo shouldn't silently disappear as a side effect of a template rewrite), and the hub band is already about how the site's pieces connect, which is what the open-questions feature has always been evidence of |
| 2026-09-23 | Project cards use real fields added to the content schema (`status`, `statusVariant`, `category`, `stack`, `link`, `linkLabel`), populated with real current data: settlement-engine "Deployed to staging" (matches its own body copy, "live staging server"); routine-machine "Phase 3 of 4, built and verified", checked directly against `PROJECT.md` in the routine-machine repo on this machine ("Current phase: Phase 3, built and verified", Phase 4 gated and not started), not guessed or left as the spec's generic "In progress" | The brief explicitly asked for the real current status, and a local checkout of routine-machine's own repo had the authoritative answer rather than inferring it from this repo's own summary text |
| 2026-09-23 | UMWAYI left out of the projects grid, per the brief; `now.md` built from real, current facts (Global Link+, Sapiens, Routine Machine, Nairobi), not the spec's placeholder text | Both explicitly directed by the brief rather than left to infer |
| 2026-09-23 | Footer (section 4.8) made global, rendered on every page via a shared component, not only the homepage | The spec presents it as one more homepage section, but a footer that disappears on every article and listing page would be a real regression from how the site worked before this revision; nothing in the brief said to scope it to the homepage only |
| 2026-09-23 | The previous revision's code-reveal typing effect (`code-reveal.js`) is removed, not carried forward | The new spec's own article template redefines how code is presented (`mockup-code` plus a copy button, section 4.9) and never mentions a reveal-on-scroll effect; keeping the old effect layered under a differently-styled code block would be inconsistent with "the new spec's motion is smaller in scope" already recorded above |
| 2026-09-23 | `mockup-code`'s terminal-panel look is approximated with hand CSS on shiki's existing `pre.astro-code` output (a `.code-panel` wrapper, shiki's own CSS variables remapped onto the neutral/neutral-content theme tokens) plus a small client-side script that wraps each code block and injects a Copy button, rather than a literal daisyUI `mockup-code` markup transform | Restructuring shiki's markdown-rendered output into daisyUI's exact `mockup-code` DOM shape would need a custom rehype plugin; this gets the same dark terminal-panel read and a working copy button without that added build-pipeline complexity |
| 2026-09-23 | Article template ships without a table of contents, callouts, takeaways, or a per-article illustration for any *existing* article; TOC renders conditionally from real `##` headings (none of the current articles have any), and callouts/takeaways aren't retrofitted into prose that was never written with them | None of the current articles have H2 headings, callout blocks, or a numbered-takeaways structure in their source; inventing that structure to fill out the template would mean writing new prose that isn't in the original piece, the same "don't invent sample content" standard already applied to the writing tabs. The illustration is explicitly optional per the brief |
| 2026-09-23 | Found and fixed three real bugs while building this, by looking at rendered output and computed styles, not by reading the CSS: (1) the spec's own `pasture`/`nightwatch` theme blocks never define `--border`/`--depth`/`--noise`, which several daisyUI components (e.g. `.badge`'s `border: var(--border) solid ...`) reference with no fallback, silently invalidating the whole `border` shorthand and dropping badge outlines entirely; (2) with Preflight off, an unlayered `a { color: inherit }` reset beat every layered daisyUI component rule regardless of CSS specificity (cascade layers rank layered rules below unlayered ones unconditionally), making `.btn-neutral`'s text invisible; fixed by scoping resets to specific non-conflicting selectors instead of a blanket element selector, not by re-enabling Preflight; (3) the article template's body grid column needed `min-w-0`, the same root-cause class (a grid track with no containment floor) as the mobile bug this project already fixed once in the previous revision | Each was caught by actually rendering the page and inspecting computed styles or measured overflow, the same discipline this log has held to since the first mobile-bug pass, not by assuming the spec's CSS or Tailwind's defaults would just work |

## Open questions

- ~~Whether the two-typeface contrast holds up on mobile~~ Answered 2026-09-22, reconfirmed
  2026-09-23 against the fully rebuilt layout: `npm run check:mobile` clean across all 13
  pages against a production build, including one real regression (the article body grid
  needed `min-w-0`, same bug class as before) found and fixed during this same revision, not
  assumed carried over from the old fix.
- ~~Whether the homepage's real open-questions feature has a place in the new layout~~
  Answered 2026-09-23: kept, placed inside the hub-explorer band; see the decisions log.
- Whether the fully illustrated shepherd (crook, shuka, sheep) reads as specific to this site
  once actually built and seen, the way the previous mascot's cursor-glyph staff was built to,
  or reads as more generic pastoral illustration. Built and screenshotted in both themes and
  at mobile width; reads intentional from this end, but Miguel's own reaction to the live
  version, not this document, is what actually settles it, same as every mascot decision on
  this project so far.
- Whether collapsing the UMWAYI method's six stages into the new spec's four pillars and
  four-step hub loop loses something real, or is a fair simplification for a homepage that
  was never meant to carry the method's full detail.
- Whether UMWAYI itself belongs as a third card in the projects grid alongside settlement-
  engine and routine-machine, given it's a documentation system rather than a built
  application, a genuinely different kind of thing from the other two.
- Whether the new `pasture`/`nightwatch` palette holds up for long-form essay reading once
  actually seen at essay length, since this revision, unlike 2026-09-22's, doesn't carve out
  a separately calmer palette for essay body text specifically. Screenshotted at article
  length in both themes and reads legibly from this end, but that's a first-pass visual
  check, not the same as Miguel actually reading a full piece on it.
- Whether a table of contents, callouts, takeaways, and per-article illustrations are worth
  adding to specific existing articles by hand, now that the template supports all four but
  no current article uses any of them.