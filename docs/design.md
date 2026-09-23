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
component choices, and code samples originally lived in `redesign-spec-2026-09-23.md`; once
built and seen live, Miguel found real inconsistencies against the actual reference design
and supplied the real static reference implementation it was built from
(`~/Downloads/amwayi-site`: `index.html`, `article.html`, `assets/js/main.js`,
`src/input.css`), which is now the actual source of truth Claude Code builds from and
reconciles against, superseding the spec document's own rougher markup samples where they
disagree. This file records what it means, why it was chosen, where it conflicts with
anything decided here before, and how it meshes with the site's real existing content rather
than an idealized version of it.

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
| 2026-09-23 | Miguel supplied two further reference artifacts and asked for the live site reconciled against them: a self-unpacking canvas-mockup export (`Amwayi Portfolio.html`) and, once that proved hard to inspect precisely, a real static HTML/CSS/JS implementation (`~/Downloads/amwayi-site`: `index.html`, `article.html`, `assets/js/main.js`, `src/input.css`) built from the same spec. The second one became the authoritative source of truth for exact copy, markup, and CSS, superseding both the rougher spec markup samples and this project's own first-pass interpretation of them | The static implementation is unambiguous, real, runnable code, a stronger source than either a rendered mockup export (hard to inspect pixel-by-pixel) or the spec's own illustrative-only samples; reconciling against it directly, rather than re-guessing from a screenshot, is what actually resolves "a lot of inconsistencies" rather than trading one set of guesses for another |
| 2026-09-23 | Rewrote to match the reference closely: exact hero/pillar/hub/writing/projects/now copy and headings (e.g. "I tend what I learn and put it to work.", "The journal sits at the center.", "Recent articles", "What I'm building", "Where I am this month"); the exact shepherd SVG illustration (previously a rougher redrawn approximation); pillar icon stickers per pillar; the shared "In practice" line moved out of per-card collapse content into one box below the grid, shown/hidden via a `#pillars:has(input[value="N"]:checked)` pattern instead of `aria-label`-keyed selectors; the hub diagram's dark node-circle styling and `:has()` selectors keyed the same way; a homepage-vs-inner-page navbar split (Philosophy/Writing/Projects/Now anchors on the homepage, a simpler Home/Articles/Projects nav plus a mobile back-arrow on articles/projects/listings, matching the reference's article.html exactly); the article sidebar's CSS-only text-size radio group (dropped the JS-driven S/M/L buttons entirely); separate Copy-link and This-helped controls with the reference's own icons and `data-*` hooks; and the footer's "Read along as I learn." heading, side-by-side layout, and all five social links (Hashnode/GitHub/LinkedIn/dev.to/Medium) with the reference's own `href="#"` placeholders for the four that don't have real accounts yet, reversing the previous call to omit them outright | The reference's own footer literally ships with `href="#"` placeholders and a README step "Add your ... URLs before you go live", which settles the ambiguity the previous revision's GitHub-only call was guessing at: showing the intended final link set with honest placeholders, not hiding it, is what this specific reference does, and it's now unambiguous ground truth rather than a guess |
| 2026-09-23 | Kept, not reconciled to the reference: real content everywhere the reference used sample placeholders (writing tab entries, dates, read times), UMWAYI in the projects grid already matched, the homepage's live open-questions feature (not present in the reference at all, since it doesn't model that integration), Giscus/Waline comments on article pages (same reason), and routine-machine's precise "Phase 3 of 4, built and verified" status text over the reference's generic "In progress" (its own `linkLabel`, "Follow the build", was adopted since that's just phrasing, not a factual precision question) | The reference is a static mockup with invented sample content by design (its own README says "Replace the sample article titles..."); real data and a real, already-working feature this project built and verified twice take precedence over matching placeholder text, the same standard applied when the spec first arrived |
| 2026-09-23 | Found and fixed two more real bugs surfaced only by this reconciliation pass, again by rendering and inspecting, not by reading the CSS: (1) an unlayered `svg { display: block }` reset was beating Tailwind's layered `.hidden` utility on the theme-toggle's moon/sun icon pair, the same cascade-layers class of bug as the earlier button-text and badge-outline fixes, showing both icons at once regardless of theme; fixed by excluding `.hidden` from the reset's selector rather than reaching for `!important`; (2) `<fieldset>` (the pillar radio group) carries a browser-default border/padding Preflight normally strips, drawing a visible box around the whole pillar grid with Preflight off; fixed with an explicit small reset | Both were only visible in an actual screenshot, not in the source; this is now the fourth distinct instance of the same "Preflight is off, and something assumed it wasn't" bug class across the two revisions built on this stack, worth naming as a standing risk for anything touched later |
| 2026-09-23 | Content moved out of this repo entirely: `scripts/sync-content.mjs` runs as `predev`/`prebuild`, reading from `UMWAYI_PATH` if set or else a fresh `--depth 1` sparse-checkout clone of UMWAYI's `site/` and `projects/` folders into `.umwayi/`, then copying markdown into `src/content/*`, illustrations/images into `public/`, and the committed copies of all five into `.gitignore` (`config.ts` stays, it's the schema, not content). `openThreads.ts` switched from a runtime `raw.githubusercontent.com` fetch to a build-time read of `.umwayi/projects/*.md`. The build fails loudly (`process.exit(1)`) on a failed clone or zero articles copied, the opposite of `openThreads`' own graceful degradation | A failed fetch in the open-threads widget hides one small homepage section; a failed content sync would deploy an empty site. Failing the build keeps the last good deploy live instead, which is the safer failure mode for the thing everything else on the page depends on |
| 2026-09-23 | UMWAYI's own `site/README.md` documents the journal folder as `journal/` but the real directory on disk is `journals/` (plural); `sync-content.mjs` maps `journals` → `journal` explicitly rather than silently fixing UMWAYI's naming or its docs | Preserves the actual (undocumented) contract as it exists today without reaching into a separate repo to "fix" a naming mismatch that isn't this repo's to fix; flagged here so it's visible instead of buried in a script comment only |
| 2026-09-23 | Deploy workflow gained `repository_dispatch` (`types: [umwayi-content]`) and `workflow_dispatch` triggers alongside the existing `push`, plus an explicit `node scripts/sync-content.mjs` step before `withastro/action@v3` | Lets UMWAYI trigger a rebuild when its own content changes, not just when this repo's code changes; the explicit sync step is there because this sandbox can't verify live whether the action's internal `npm run build` reliably fires the `prebuild` hook, so the workflow doesn't depend on that assumption |
| 2026-09-23 | Content schema gained `links` (optional `{label, url}[]`), `illustration`, `illustrationAlt`, and optional `tags` on articles/projects; `crossPost` removed entirely | Matches the real fields UMWAYI's own content now ships (inspected directly, not guessed); `crossPost` was unused by every file in both repos |
| 2026-09-23 | The new `personal-website.md` project makes four project cards; the grid went from a fixed 3-up (`md:grid-cols-3`) to 2-up (`md:grid-cols-2`), reading as a 2×2 block rather than 3-plus-orphan | The obvious candidate at four cards and the one that avoids a lonely fourth card on its own row |
| 2026-09-23 | Projects now render through the same `ArticlePage.astro` template as articles (`isProject` branching: 3-level breadcrumb, status/category/stack badges instead of avatar/date, no Keep Reading, a Links block from the new `links` field, Waline only, no Giscus) instead of a separate slim template, which is deleted | The brief asked for this directly; the old template also rendered an empty "Comments" heading above Giscus's own "Guest comments" on every project page, which goes away as a side effect |
| 2026-09-23 | Fixed a real font bug: `h1`/`h2`/`h3` across the whole site (hero, article titles, section headings) were silently rendering in Karla (the body font) instead of Fraunces, because the reference's own `h1, h2, h3 { @apply font-display }` base rule had never been ported here | Confirmed by computed `font-family` on the rendered hero H1 before the fix; the reference's own CSS shows this is a real, not cosmetic, rule this repo was missing |
| 2026-09-23 | Profile photo: a new `ProfilePhoto.astro` component checks for `public/images/profile.jpg` at build time and falls back to the existing inline SVG avatar if it's absent, used at two sizes (header, author box) in place of the previous duplicated inline SVGs | Matches the brief's "graceful fallback if missing" requirement without hardcoding a broken `<img>` if the photo never arrives from UMWAYI's `site/images/` |
| 2026-09-23 | Article/project illustrations render in a bordered, offset-shadow panel between the header and body when frontmatter has `illustration`, framed the same way as the reference's own gate-scene image, with no frame at all when there's no illustration | Matches the reference's own illustration treatment exactly rather than approximating a generic image block |
| 2026-09-23 | Takeaways ("What I took from it") render as CSS-counter badges (`#what-i-took-from-it + ol` + `li::before`) rather than a rehype plugin, after confirming in the actual built HTML that Astro's own heading-slug pipeline produces exactly `id="what-i-took-from-it"` for that heading text | Avoids adding a markdown-pipeline dependency for something CSS alone can do, once the id was confirmed rather than assumed |
| 2026-09-23 | Waline's "This helped" button now posts a real, anonymous "This helped" comment to the article's own Waline thread (same server as `Waline.astro`, same `path` convention) instead of only toggling local UI state; on success, `localStorage` remembers `helped:<path>` and both the sidebar and phone copies switch to a disabled "Thanks noted" state; on failure the button stays clickable and a short error shows in the existing status area, no key is set | The brief asked for a real post, not a fake local-only toggle; the request/response contract was read from `@waline/api`'s own `dist/index.d.ts`/`dist/index.js` (downloaded via `npm pack`), not guessed, and confirmed against the live server, since assuming an unverified API shape here would mean silently failing in production instead of locally |
| 2026-09-23 | Found live against the real Waline server: `mail` and `link` must be sent as explicit empty strings, not omitted, or the server 500s trying to hash an `undefined` mail for a gravatar (a real server-side bug, not a documented contract requirement); the deployment has no comment moderation enabled, confirmed by a real test post coming back `status: "approved"` immediately rather than `"waiting"` | Both are backed by an actual request/response against the live server during this session, not inferred from docs, and are now baked into `article-controls.js` with a comment explaining why |
| 2026-09-23 | "Same device can't click twice" is enforced client-side only, via `localStorage`, which is per-browser, not per-device or per-visitor; clearing site data or switching browsers resets it | Named explicitly rather than left implicit, since real per-visitor enforcement would need a server-side change to Waline that's out of scope here |
| 2026-09-23 | Code blocks on phones: dropped `pre.astro-code`'s base font-size to 12.5px and side padding to 1rem (from 0.9rem/1.25rem), restored to the desktop values at the `md` breakpoint, after a Playwright check confirmed every diagram in UMWAYI's content (rewritten there to ≤40 characters wide) fits at 375px with no scroll at these values, while real (unwrapped) code still scrolls as expected | Chosen over the reference's own phone values because this repo's diagrams and panel width (331px content width, not the reference's) needed the actual numbers checked rather than reused on the assumption they'd transfer directly |
| 2026-09-23 | Homepage hub section: "Open threads" duplicated as two copies, one `hidden md:block` staying in its original desktop position inside the left column, one `md:hidden` placed as a sibling after the diagram, so mobile DOM order becomes heading → text → steps → tabs → diagram → Open threads last, while desktop is visually unchanged | CSS `order` was ruled out: the two-column grid's row height would shift on desktop if the source order changed, so duplication with responsive visibility was the way to reorder mobile without touching desktop layout |
| 2026-09-23 | Favicon replaced: the old unrelated cursor-bar icon is gone, replaced with the reference's own crook-staff glyph path on an ink-filled rounded square in the ochre-light accent color, sized to read at 16px on both light and dark browser tabs | Matches the reference's own navbar mark instead of carrying over a leftover icon from an earlier, since-reversed design direction |
| 2026-09-23 | Found and fixed a real spacing bug during the section-spacing audit, by rendering the reference's `index.html` and this site at 1440px and measuring actual computed heights and margins, not by eyeballing: with Preflight off, the browser's default `h1`–`h6`/`p` margins were never zeroed, so they stacked on top of every flex/grid `gap` layout that assumed zero margins (the same assumption the reference gets for free from Preflight, which is on there). This inflated the hero (794px vs. the reference's 725px) and pillars/hub sections similarly. Fixed with an explicit `margin: 0` base reset on `h1`–`h6`, `p`, `figure`, `dl`, `dd`, alongside the file's existing Preflight-equivalent rules. Reverified after the fix: hero height now 725px on both, pixel-identical | `.prose-amwayi` already zeroed its own `p`/`li` margins for this exact reason; this was the same root cause everywhere else on the page that isn't inside `.prose-amwayi`, just not yet found. The fifth distinct instance of this project's "Preflight is off, and something assumed it wasn't" bug class |
| 2026-09-23 | Found and fixed a second real bug in the same audit pass: `.navbar a`, `.menu a`, and `.row-link`'s own unlayered `color: inherit` reset (needed so daisyUI's navbar/menu don't show link-blue) was also permanently beating their `hover:text-primary` utility, since that utility lives in a Tailwind layer and cascade layers rank every layered rule below every unlayered one regardless of specificity or pseudo-class. Playwright confirmed nav links and article-listing rows stayed `rgb(29,36,32)` (ink) on hover instead of turning `rgb(154,91,30)` (primary) as the reference does. Fixed with an explicit `.navbar a:hover, .menu a:hover, .row-link:hover { color: var(--color-primary) }` alongside the existing reset, the same pattern used for the sticker-button hover fix earlier. `.breadcrumbs a` and `a.card` needed no equivalent fix: neither has a color hover in the reference either, confirmed the same way | The sixth distinct instance of the same bug class on this project, now spanning button text, badge outlines, theme-toggle icons, fieldset borders, heading fonts/margins, and hover color, all from the same root cause: Preflight is deliberately off here, and every place that assumed some part of it was still on had to be found by rendering, not by reading the CSS |
| 2026-09-23 | Full verification pass before calling this phase done: `npm run check:mobile` clean across all 15 pages (including all 4 project pages) against a production build; every hover audited against the reference's actual `input.css`/`main.js`/markup and Playwright-verified before/after (nav links, row-links, thought bubble, Keep Reading card lift, sticker-button lift, size-radio focus ring, pillar focus-visible outline); text-size radio group confirmed 17px/19px/21px across S/M/L; a build with `UMWAYI_PATH` pointed at a local checkout and a build via a real network clone both produced the same 15 pages | Same standard as every verification pass in this log: rendered and measured, not assumed from the diff |
| 2026-09-23 | Fixed the article illustration's centering at wide viewports (0px left edge at 1440, 1920, 2560 instead of the title's 96/336/656) at its actual root cause rather than with an `!important`: `tailwind.css` now declares `@layer theme, base, components, utilities;` as the very first thing in the built stylesheet, and `global.css`'s pure element-level reset (`*`, `html`, `body`, the `h1`–`h6`/`p`/`figure`/`dl`/`dd` margin reset, the heading font rule, `fieldset`, the `:not(.hidden)` display reset, `:target`, reduced-motion) now lives in `@layer base`, ranked below `utilities` by that order statement. Before this, that whole block was unlayered, so it beat every layered rule unconditionally including a `mx-auto`/`mt-*` utility on the very same element, not just other components' rules | The reference gets correct layer order for free from a plain `@import "tailwindcss"` (Preflight on); this repo deliberately keeps Preflight off (see the file's own top comment), so it has to declare that order itself once the reset needs to be layered rather than exploiting "unlayered always wins" |
| 2026-09-23 | Everything below the element-level reset in `global.css` (`.navbar a`, `.sticker`, `.pillar`, `.hub-node`, `.code-panel`, `.prose-amwayi`, the takeaways counters, etc) stays unlayered, not moved into `@layer base` alongside the reset | Those are targeted, component-scoped overrides that still need to unconditionally beat daisyUI's own layered rules (`.navbar a`'s `color: inherit` beating daisyUI's link-blue, `.btn.sticker:hover` beating daisyUI's own `.btn:hover`); moving them into a named layer would rank them below daisyUI's own `daisyui` layer and silently undo those fixes. Verified after the change that `.btn-neutral`'s text is still the right color (`rgb(243,238,227)` on `rgb(29,36,32)`) and every earlier hover/badge/icon fix still holds |
| 2026-09-23 | Searched for every other element hit by the same now-fixed bug (an element from the reset list carrying a margin utility class): found two more, both `<p class="mt-*">` (the article-listing summary in `EntryList.astro`, and the "Pulled from the UMWAYI hub..." line in the homepage's Open Threads section), confirmed fixed the same way as the illustration (`mt-5` computes to 20px, `mt-2` to 8px, instead of 0 either way) | Item 3 of this round's brief: don't just fix the one reported case, account for the whole class of it |
| 2026-09-23 | Confirmed UMWAYI's illustration SVGs no longer draw their own border (checked `idempotency-keys.svg`: no outer stroked rect, only the background fill), so the site's own frame (border, rounded corners, offset shadow) is the only outline now, in both themes | Screenshotted the illustration in light and dark; no doubled outline in either |
| 2026-09-23 | Fixed the "What I took from it" flex-column bug: `#what-i-took-from-it + ol li` was `display: flex`, which turned every text run and every inline element (a bare word run, then a `<code>` span, then another word run) into its own flex column instead of one wrapping sentence - visible on the idempotency article's `` `UNKNOWN` `` item, which split into three side-by-side columns. Changed to `display: block` with the badge pulled out of flow via `position: absolute`, keeping the badge's size/color/border unchanged; tuned `padding-left`/`min-height` separately for the 30px phone badge (46px/30px) and the 34px desktop badge (50px/34px) so the badge stays aligned with the first line at both sizes | Verified against the actual reported case (the `UNKNOWN` item now reads as one flowing sentence with the code span inline) and against a 3-line-wrapping item at 390px width, in both themes |
| 2026-09-23 | Footer and homepage social/profile links now come from UMWAYI's new `site/links.md` (front matter only, a `links` collection added to `config.ts`) instead of `Footer.astro`'s own hardcoded array; external links get `target="_blank" rel="noopener"`, matched by URL shape (`resolveLink`/starts-with-`/`) the same way project `links[]` already does | Matches this round's brief directly; also replaces the previous phase's `href="#"` placeholders with UMWAYI's real account URLs now that they exist, closing the open question this log already had flagged about those placeholders |
| 2026-09-23 | The homepage's "All articles on Hashnode" link now points at the `Hashnode` entry's real URL from `links.md` (looked up by label) instead of `href="#"`; `settlement-engine.md`'s new GitHub link needed no code change, confirmed showing in its Links block from the existing `links[]` schema | Both directly requested; the Hashnode lookup falls back to `#` only if UMWAYI ever ships `links.md` without a `Hashnode` entry, which shouldn't happen given the schema, but fails safely rather than throwing if it did |
| 2026-09-23 | The journal/journals discrepancy this log flagged earlier is resolved: UMWAYI's `site/README.md` now documents `journals/` (plural, matching the real directory) instead of `journal/`. `sync-content.mjs`'s rename map stays (this repo's own collection is still named `journal`, singular, on purpose), but its comment no longer describes this as an unresolved mismatch | Confirmed directly against the current `site/README.md` before editing the comment, not assumed from the brief's own claim that it was fixed |
| 2026-09-23 | Before writing any code for the footer sign-up, checked live whether Waline leaks the typed email address: posted one real test entry with `mail` set to a real address, then requested `GET /api/comment?path=/miguel-site/subscribe` with no credentials and searched the whole raw response for that address. It never appears anywhere in the public read response - only a one-way Libravatar-hash avatar URL (`https://seccdn.libravatar.org/avatar/<md5-like hash>`) is derived from it. A direct unauthenticated `DELETE` was also tried and correctly rejected with `errno 401` | This was the brief's own explicit precondition ("if the address appears anywhere, stop and report it instead of shipping") - it didn't leak, so the feature was safe to build as specified, sending the real address in `mail` |
| 2026-09-23 | The footer sign-up now posts an anonymous Waline entry (`nick: "Subscriber"`, the typed address in `mail`, the fixed comment text, `url: "/miguel-site/subscribe"`, a path no page renders a Waline widget for) instead of only validating and resetting the form locally. Success shows "You're on the list. You'll hear when a new article is up."; a repeat submission of the same address (remembered via `localStorage`, try/catch-guarded) shows "You're already on the list." without reposting; failure keeps the typed address in the field and shows a reason distinguishing Waline's own rate limit (`errno: 1000`, confirmed live by posting fast enough to trigger `"Comment too fast!"`) from a network failure or any other server rejection; invalid email keeps the existing format check unchanged | Matches the brief's item 12 requirements exactly, informed by what the live server actually does (the rate-limit errno) rather than a guessed error taxonomy; wording stays "notify"/"hear when" rather than "subscribe to a newsletter" per item 13, since the reference's own copy already avoids that phrase too |
| 2026-09-23 | Found and fixed a real, previously-unknown bug while wiring this up: the footer's `<script src="../scripts/subscribe.js">` had been silently 404ing in every prior phase (`GET /scripts/subscribe.js`, missing the `/miguel-site` base and the correct directory), because it sat inside a `{!simple && <script ... />}` conditional expression, which stopped Astro's compiler from recognizing and bundling it as a local script asset at all - it was left as a literal, unprocessed, broken relative path in every build's output HTML. The sign-up form has never actually worked, in any previous phase, despite being screenshotted and reasoned about. Fixed by moving the script tag to render unconditionally (it already no-ops safely via `if (form) {...}` when the simple footer's markup has no `#subscribe` element), which Astro then correctly bundles into a hashed, base-path-correct `<script type="module" src="/miguel-site/_astro/hoisted.*.js">` | Found by checking the actual network request in a live Playwright run rather than assuming a script tag that looks right works right; `ArticlePage.astro`'s equivalent `<script src="../scripts/article-controls.js">` was never inside a conditional and bundles correctly, which is what made the comparison catch it |
| 2026-09-23 | Six test/probe comments now sit on the live Waline server from this round's own verification and the previous round's: objectId 3 (`/miguel-site/tech/idempotency-keys`, "This helped", prior phase's E2E test), objectId 4/6/7/8 (`/miguel-site/subscribe`, the privacy check and sign-up flow tests), objectId 5 (`/miguel-site/rate-limit-probe`, the rate-limit discovery test). None of these paths render a Waline widget on the live site, so none are visible to a real visitor, but they're real admin-visible data. Listed here rather than deleted, since deletion needs Waline admin credentials this environment doesn't have (confirmed: an unauthenticated `DELETE` is correctly rejected with `errno 401`) | Per the brief's own instruction: delete them, or list them so Miguel can delete them from the Waline admin page. Miguel has the admin credentials this sandbox doesn't |

## Open questions

- ~~Whether the two-typeface contrast holds up on mobile~~ Answered 2026-09-22, reconfirmed
  2026-09-23 twice: once against the fully rebuilt layout (one real regression, the article
  body grid needing `min-w-0`, found and fixed), and again after reconciling against the real
  reference implementation, `npm run check:mobile` clean across all 14 pages against a
  production build both times, not assumed carried over from the earlier fix.
- ~~Whether the homepage's real open-questions feature has a place in the new layout~~
  Answered 2026-09-23: kept, placed inside the hub-explorer band; see the decisions log.
- ~~Whether the fully illustrated shepherd reads as specific to this site or as generic
  pastoral illustration~~ Superseded 2026-09-23: the site now uses the reference
  implementation's own exact shepherd SVG rather than a redrawn approximation, so this is no
  longer a question this project's own drawing choices can answer either way; Miguel already
  supplied and asked for this specific illustration directly.
- ~~Whether UMWAYI belongs as a third card in the projects grid~~ Answered 2026-09-23: yes,
  the reference implementation includes it as a third card with real copy, badge, and a
  GitHub link; adopted as given.
- Whether collapsing the UMWAYI method's six stages into the new spec's four pillars and
  four-step hub loop loses something real, or is a fair simplification for a homepage that
  was never meant to carry the method's full detail.
- Whether the new `pasture`/`nightwatch` palette holds up for long-form essay reading once
  actually seen at essay length, since this revision, unlike 2026-09-22's, doesn't carve out
  a separately calmer palette for essay body text specifically. Screenshotted at article
  length in both themes and reads legibly from this end, but that's a first-pass visual
  check, not the same as Miguel actually reading a full piece on it.
- Whether a table of contents, callouts, takeaways, and per-article illustrations are worth
  adding to specific existing articles by hand, now that the template supports all four but
  no current article uses any of them.
- ~~Whether the footer's four `href="#"` placeholder links are the right call before those
  accounts exist~~ Moot as of 2026-09-23: UMWAYI's `site/links.md` now ships all five real
  account URLs, and the footer/homepage read from it directly; nothing left to placeholder.
- Whether the footer sign-up collecting addresses with no actual "new article" email behind
  it yet is a fine interim state to ship, or whether it risks people expecting a real
  notification that never arrives. The page's own copy says "notify," not "subscribe to a
  newsletter," and item 13 of this round's brief says this explicitly, but it's still
  collecting real addresses for a promise nothing yet fulfills.
- Whether Waline is the right long-term home for the sign-up list at all, versus a real
  mailing-list provider (Buttondown, etc) once one exists: Waline was chosen here because
  it's already the site's own comment backend and the privacy check (mail never appears in
  the public API) made it safe to reuse, not because it's built for this job - there's no
  export/segment tooling for it, just Waline's own admin page.