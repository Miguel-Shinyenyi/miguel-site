# Feedback

## Purpose

Lets visitors comment on articles, with the actual conversation happening on GitHub, where
comments become Discussions, responses get written there, and the whole thread reflects back
onto the site automatically. A second, guest-friendly option is planned alongside it for
visitors who don't have or don't want to use a GitHub account.

## Current state

Giscus is live. Discussions is enabled, the giscus app is installed, and
`src/components/Giscus.astro` has real `GISCUS_REPO_ID`/`GISCUS_CATEGORY_ID` values from
giscus.app. Comments render on every non-draft article.

Cusdis is planned, not built. See below.

## How Giscus works

Giscus, a comment widget built specifically for static sites, backed by GitHub Discussions.
No server, no database, matching this project's existing no-backend rule.

1. A visitor comments through the widget, signed in with their own GitHub account, which
   creates a Discussion on the repo (mapped one-to-one to the article's URL path).
2. Replies get written directly on GitHub, in the Discussion, and appear back on the site
   through the same embed, no separate sync step.

## Planned: Cusdis, for guest comments

Giscus's one real limitation is the GitHub account requirement, which shuts out anyone who
doesn't have one. Cusdis is a lightweight, privacy-oriented comment widget that accepts
anonymous, name-only guest comments, no account needed on either side, meant to run alongside
Giscus, not replace it.

**How it would work**, once built:

1. A free Cusdis account (cusdis.com) gives a hosted instance, so this still doesn't need a
   backend added to this project, the same constraint Giscus respects. Self-hosting is
   possible later if the hosted free tier ever becomes a real limitation, not needed to start.
2. Each article gets a Cusdis widget alongside the Giscus one, likely under a second heading,
   "Guest comments," so it's clear the two are separate threads, not one merged conversation.
3. New guest comments show up in the Cusdis dashboard for moderation and reply, not on
   GitHub, since Cusdis has no GitHub integration, that's the actual tradeoff for allowing
   guests in the first place.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-20 | Cusdis planned as a second, separate widget, not a Giscus replacement | Giscus's GitHub-account requirement is a real access barrier worth removing for some visitors, but Giscus's GitHub-native reply workflow is worth keeping for everyone else; running both preserves each one's strength instead of trading one off for the other |
| 2026-09-20 | Cusdis is documented now, not built now | This is a scoped future addition, not an active phase; recorded so the decision and its reasoning exist before the work does, rather than being reconstructed later |
| 2026-09-20 | Giscus over a custom comments backend | Matches the existing no-backend, no-database rule for this project; GitHub already provides identity, moderation, and storage, building a parallel system would duplicate what GitHub does for free |
| 2026-09-20 | Comments land on the main site repo's Discussions, not a separate repo | Keeps feedback next to the content it's about; a separate repo would need its own permissions and add a coordination cost with no clear benefit |
| 2026-09-20 | `data-mapping="pathname"` | Ties a discussion to the article's URL rather than its title, so a later title edit doesn't orphan existing comments |
| 2026-09-20 | `data-reactions-enabled="0"` | Emoji reaction counters read as a gamified, polished-product feature, which is exactly what the design brief (docs/design.md) says this site should avoid |
| 2026-09-20 | `data-theme="preferred_color_scheme"` | Matches the site's own `prefers-color-scheme` based light/dark handling instead of hardcoding one theme |
| 2026-09-20 | Comments render only on non-draft entries (`!entry.data.draft`) | A draft is explicitly unfinished and not meant to be public; there's nothing to discuss on a page that isn't really published yet |
| 2026-09-20 | Reused the default `Announcements` category (type Announcement) rather than creating a separate `Comments` one | Already the right format per giscus's guidance; a same-purpose second category would just be a naming preference, not a functional difference |

## Open questions

- Whether Cusdis's hosted free tier stays sufficient once real guest traffic exists, or
  whether self-hosting becomes worth the added complexity. Decide once there's actual usage
  to look at, not before.
- Whether "guest comments" visually needs its own heading distinct from Giscus's "Comments,"
  or whether that reads as cluttered once both are actually on the page. Decide during build.