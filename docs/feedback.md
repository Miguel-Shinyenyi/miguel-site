# Feedback

## Purpose

Lets visitors comment on articles, with the actual conversation happening on GitHub, where
comments become Discussions, responses get written there, and the whole thread reflects back
onto the site automatically.

## Current state

Not built.

## How it works

Giscus, a comment widget built specifically for static sites, backed by GitHub Discussions.
No server, no database, matching this project's existing no-backend rule.

1. Enable Discussions on the site's GitHub repo (Settings, Features, Discussions).
2. Install the giscus app on that repo (giscus.app walks through this and generates the
   exact config).
3. Add the generated `<script>` embed to the article page template, so it renders at the
   bottom of each article.
4. A visitor comments through the widget, signed in with their own GitHub account, which
   creates a Discussion on the repo.
5. Replies get written directly on GitHub, in the Discussion, and appear back on the site
   through the same embed, no separate sync step.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-20 | Giscus over a custom comments backend | Matches the existing no-backend, no-database rule for this project; GitHub already provides identity, moderation, and storage, building a parallel system would duplicate what GitHub does for free |
| 2026-09-20 | Comments land on the main site repo's Discussions, not a separate repo | Keeps feedback next to the content it's about; a separate repo would need its own permissions and add a coordination cost with no clear benefit |

## Open questions

- Whether every article gets comments enabled by default, or only ones actually published
  and stable. Decide once the first real article goes live.
- Moderation approach if a comment needs removing, decide if this ever actually comes up,
  not preemptively.