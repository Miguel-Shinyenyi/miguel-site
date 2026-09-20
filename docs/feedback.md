# Feedback

## Purpose

Lets visitors comment on articles, with the actual conversation happening on GitHub, where
comments become Discussions, responses get written there, and the whole thread reflects back
onto the site automatically. A second, guest-friendly option runs alongside it for visitors
who don't have or don't want to use a GitHub account.

## Current state

Giscus is live. Discussions is enabled, the giscus app is installed, and
`src/components/Giscus.astro` has real `GISCUS_REPO_ID`/`GISCUS_CATEGORY_ID` values from
giscus.app. Comments render on every non-draft article.

Waline is built, not yet activated. `src/components/Waline.astro` and the wiring into all
four article templates (in Cusdis's old place, right after Giscus) are in place, but
`WALINE_SERVER_URL` is blank, so the component renders nothing. One real step remains, and
it's a genuine infrastructure step, not a settings toggle, so it goes through the site owner:

1. Deploy Waline's server to Vercel (Waline publishes an official one-click Vercel deploy
   template that also provisions the database as part of setup).
2. Once deployed, copy the resulting server's URL (e.g. `https://your-app.vercel.app`).
3. Paste it into `WALINE_SERVER_URL` at the top of `src/components/Waline.astro`. The widget
   activates immediately, no other code changes.

## Removed: Cusdis

Cusdis was built on 2026-09-20, `src/components/Cusdis.astro` and its wiring into all four
article templates, then removed the same day, before the account-setup step was ever done.
The deprecation claim was independently re-verified before acting on it: `djyde/cusdis` on
GitHub is archived (last push 2026-07-17), and cusdis.com's main site returns HTTP 521
(origin unreachable), consistent with the report rather than taken on a single source alone.
`src/components/Cusdis.astro` and its four import/usage lines have been deleted and replaced
with Waline in the same position.

## How Giscus works

Giscus, a comment widget built specifically for static sites, backed by GitHub Discussions.
No server, no database, matching this project's no-backend rule; GitHub owns the
infrastructure, nothing is added to this project.

1. A visitor comments through the widget, signed in with their own GitHub account, which
   creates a Discussion on the repo (mapped one-to-one to the article's URL path).
2. Replies get written directly on GitHub, in the Discussion, and appear back on the site
   through the same embed, no separate sync step.

## Waline, for guest comments

Giscus's one real limitation is the GitHub account requirement. Waline is an open-source,
self-hostable comment system that accepts real guest comments, no account required, meant to
run alongside Giscus, not replace it.

**This is a real exception to the no-backend rule, not a false one like Giscus.** Waline
needs an actual Node.js backend and a database, there's no way around that, unlike Giscus
(GitHub's infrastructure) or Cusdis's now-dead free hosted tier. The exception is being taken
deliberately, with the smallest possible footprint, not backed into by accident.

**Hosting decision**: Vercel serverless functions plus a free-tier database (Postgres or
MongoDB, whichever Vercel's current free-tier marketplace makes simplest to wire up at build
time). Zero cost, at the tradeoff of a free tier's limits, possible cold starts, rate limits,
or the database expiring on inactivity. Accepted knowingly, revisit if it becomes a real
problem, not preemptively.

**How it works:**

1. Waline's server runs on Vercel, backed by the chosen free-tier database, separate from
   this static site's own GitHub Pages deployment, Waline needs a live server, GitHub Pages
   only serves static files.
2. Each article gets a Waline widget right after the Giscus one, under its own "Guest
   comments" heading, keyed by `window.location.pathname` at render time, same identifier
   scheme Giscus already uses, so both systems agree on what counts as "this page."
3. Guest comments post directly to the Vercel-hosted Waline backend and render back through
   the widget, no GitHub involvement, moderation happens through Waline's own dashboard.
4. Reactions are disabled (`reaction: false`) and theme follows the OS (`dark: 'auto'`),
   matching the same two decisions already made for Giscus.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-20 | Cusdis removed, replaced by Waline | Cusdis was confirmed deprecated (repo archived, hosted backend down since July 2026), verified independently before acting on the report, not taken on faith alone |
| 2026-09-20 | Waline hosted on Vercel serverless plus a free-tier database, not self-hosted on a VPS or a managed third-party host | Zero ongoing cost was chosen over the more robust paid options; Waline genuinely needs a backend either way, so this picks the cheapest real one rather than avoiding the tradeoff |
| 2026-09-20 | Waline is an acknowledged, deliberate exception to the no-backend rule, not treated as compliant with it | Unlike Giscus, which uses infrastructure this project doesn't own or run, Waline requires standing up and maintaining an actual server and database; pretending otherwise would misdocument a real architectural change |
| 2026-09-20 | Giscus over a custom comments backend | Matches the existing no-backend, no-database rule for this project; GitHub already provides identity, moderation, and storage, building a parallel system would duplicate what GitHub does for free |
| 2026-09-20 | Comments land on the main site repo's Discussions, not a separate repo | Keeps feedback next to the content it's about; a separate repo would need its own permissions and add a coordination cost with no clear benefit |
| 2026-09-20 | `data-mapping="pathname"` | Ties a discussion to the article's URL rather than its title, so a later title edit doesn't orphan existing comments |
| 2026-09-20 | `data-reactions-enabled="0"` | Emoji reaction counters read as a gamified, polished-product feature, which is exactly what the design brief (docs/design.md) says this site should avoid |
| 2026-09-20 | `data-theme="preferred_color_scheme"` | Matches the site's own `prefers-color-scheme` based light/dark handling instead of hardcoding one theme |
| 2026-09-20 | Comments render only on non-draft entries (`!entry.data.draft`) | A draft is explicitly unfinished and not meant to be public; there's nothing to discuss on a page that isn't really published yet |
| 2026-09-20 | Reused the default `Announcements` category (type Announcement) rather than creating a separate `Comments` one | Already the right format per giscus's guidance; a same-purpose second category would just be a naming preference, not a functional difference |
| 2026-09-20 | Waline widget keyed by `window.location.pathname` at render time, `reaction: false`, `dark: 'auto'` | Mirrors the same three decisions already made for Giscus (pathname mapping, no reactions, OS-driven theme), so both comment systems behave consistently instead of each having its own rules |

## Open questions

- Postgres or MongoDB for Waline's free tier, whichever Vercel's marketplace makes simplest
  to provision at implementation time. Decide during build, not here.
- What happens if the free-tier database goes inactive and gets suspended, whether that
  needs a keepalive or just an accepted risk. Decide once it's live and a real usage pattern
  exists, not speculatively.