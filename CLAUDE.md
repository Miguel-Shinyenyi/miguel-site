# Working in miguel-site

Claude Code reads this file at the start of every task. Practices that apply to every project are in `~/.claude/CLAUDE.md`. This file adds what is specific here.

## What this repo is

The code that renders the site (Astro, Tailwind v4, daisyUI). It holds no content. The content lives in the UMWAYI repo under `site/`. A build clones that folder and copies it in (`scripts/sync-content.mjs`).

## Read in this order

1. `PROJECT.md`. Stack, structure, status log, rules for working here.
2. Only the doc for what you are changing.

| You are changing | Read |
|---|---|
| Layout, typography, colour, motion | `docs/design.md` |
| Comments, "This helped", Waline, Giscus | `docs/feedback.md` |
| Build, deploy, Pages, the content sync | `docs/publishing.md` |
| A redesign step | `docs/redesign-spec-2026-09-23.md` |
| Analytics, consent, the privacy page | `docs/analytics.md` |

## Rules that already apply

- Never add content here. Articles, project pages, links and the Now section are edited in UMWAYI under `site/`, never in this repo.
- No backend and no database, with one documented exception: Waline (`docs/feedback.md`). A feature that needs another backend belongs in a different project.
- Every design decision in `docs/design.md`'s decisions log has a stated reason.
- If something in `docs/design.md` or `docs/feedback.md` is impractical in Astro, flag it. Do not substitute silently.
- Do not change `scripts/sync-content.mjs`'s privacy check (`PRIVATE_NAMES`). The names live only in a repository secret. Never write them into any file.
- Do not push or open a pull request unless the task says so.

## Checks before you say a page is done

1. `npm run build` succeeds. A content file that fails the collection schema fails the build (a project page with no front matter did this once).
2. Look at the page at 375px and 1280px in a real browser. Do not judge it from the CSS.
3. `npm run check:mobile` passes.
4. State which of these you ran.

## Understanding first, and the 59 concerns

These rules come from the UMWAYI hub (`docs/understanding-first.md` and `docs/engineering-concerns.md`). They apply to every task here.

- State the goal in one sentence before any work, in the other person's words. After the work, check the output against that sentence.
- Stay close behind AI output. Do not accept code you cannot explain. Review each change before the next one starts.
- Solve the problem as stated. Do not draft, follow up or audit before you are asked.
- Name the failure mode when you notice it: Forming, Dislodging, Assumption, Location, Achievement, Progression, Interruption, Mislead. Apply its remedy.
- When there is so much to do that nothing moves, pick the smallest next piece and finish it.
- Keep a concerns record in the design doc: one row per concept (1 to 59), answered applies, not applicable or deferred, with a reason and evidence. Add it when asked for an audit, and at the start of any new project.