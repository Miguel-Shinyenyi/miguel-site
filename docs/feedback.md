# Feedback

## Purpose

Lets visitors comment on articles, with the actual conversation happening on GitHub, where
comments become Discussions, responses get written there, and the whole thread reflects back
onto the site automatically.

## Current state

Live. Discussions is enabled, the giscus app is installed, and
`src/components/Giscus.astro` has real `GISCUS_REPO_ID`/`GISCUS_CATEGORY_ID` values from
giscus.app. Comments render on every non-draft article.

## How it works

Giscus, a comment widget built specifically for static sites, backed by GitHub Discussions.
No server, no database, matching this project's existing no-backend rule.

1. A visitor comments through the widget, signed in with their own GitHub account, which
   creates a Discussion on the repo (mapped one-to-one to the article's URL path).
2. Replies get written directly on GitHub, in the Discussion, and appear back on the site
   through the same embed, no separate sync step.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-20 | Giscus over a custom comments backend | Matches the existing no-backend, no-database rule for this project; GitHub already provides identity, moderation, and storage, building a parallel system would duplicate what GitHub does for free |
| 2026-09-20 | Comments land on the main site repo's Discussions, not a separate repo | Keeps feedback next to the content it's about; a separate repo would need its own permissions and add a coordination cost with no clear benefit |
| 2026-09-20 | `data-mapping="pathname"` | Ties a discussion to the article's URL rather than its title, so a later title edit doesn't orphan existing comments |
| 2026-09-20 | `data-reactions-enabled="0"` | Emoji reaction counters read as a gamified, polished-product feature, which is exactly what the design brief (docs/design.md) says this site should avoid |
| 2026-09-20 | `data-theme="preferred_color_scheme"` | Matches the site's own `prefers-color-scheme` based light/dark handling instead of hardcoding one theme |
| 2026-09-20 | Comments render only on non-draft entries (`!entry.data.draft`) | A draft is explicitly unfinished and not meant to be public; there's nothing to discuss on a page that isn't really published yet |
| 2026-09-20 | Reused the default `Announcements` category (type Announcement) rather than creating a separate `Comments` one | Already the right format per giscus's guidance; a same-purpose second category would just be a naming preference, not a functional difference |

## Open questions

None currently. The only remaining "whether every article gets comments" question is
resolved above (non-draft only); moderation approach stays unaddressed until it's ever
actually needed.