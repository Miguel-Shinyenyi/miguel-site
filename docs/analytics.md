# Analytics

Product analytics for the site, with a consent banner and cookieless counting.
Decided 2026-10-15.

The vendor is not named in any visitor-facing text for now. The banner and the privacy
page say "analytics". Naming it later is Miguel's call, open at the end of this file.

## Status

Built and verified locally on 2026-10-15, on branch `feat/posthog`. Not pushed.

**There is no consent banner.** Miguel decided on 2026-10-15, after reading the Stage 1
design, to take full analytics now and add consent later. That means cookies, a localStorage
identifier and session replay run for every visitor, with no banner and no privacy page.
That gap is deliberate and temporary. It is written down here rather than left implicit, so
whoever adds the banner knows exactly what they are switching from.

## Acceptance checks

These are the checks, written before the code. A stage is done only when its checks have
run. Each one records the command or capture used.

### Stage 1, design

| Check | What it requires | State |
|---|---|---|
| A1 | Every event and property the site sends is listed in the table below. Nothing is sent that is not in the table. | Written |
| A2 | The table covers the required capability list. Anything the plan or a static site cannot support is marked. | Written, 3 gaps found |
| A3 | The consent design is stated, with the exact posthog-js options and the doc page for each. | Written, 1 conflict found |
| A4 | What session replay masks is listed. | Written |
| A5 | Do Not Track and Global Privacy Control are treated as Decline. | Written, 1 item to verify in Stage 2 |

### Stage 2, build

The consent checks B3 to B8 no longer apply: there is no banner, no consent state and no
privacy page. They are kept, marked dropped, so the banner work can pick them straight back
up.

| Check | State | Evidence |
|---|---|---|
| B1 | Pass | `posthog-js` pinned at exactly `1.438.11` in `package.json`. Loaded by dynamic `import()` inside `src/scripts/analytics.ts`, only when `PUBLIC_POSTHOG_KEY` is set, and skipped on localhost unless `PUBLIC_POSTHOG_DEBUG=true`. |
| B2 | Pass | With `.env` removed: build passed at 28 pages, `phc_` appears nowhere in `dist/`, the library is not bundled at all, and a browser capture over the homepage and an article showed zero requests to any analytics host, zero PostHog cookies and zero localStorage keys. |
| B3 | Dropped | No consent state exists. |
| B4 | Pass, adapted | Verified against the real ingestion host. See "How the events were verified" below. |
| B5 | Dropped | No consent choice to persist. |
| B6 | Dropped for the banner. `check:mobile` **fails**, but not because of this work. | 375px check fails on article and project pages with `scrollWidth` 378 against 375. Reproduced with analytics fully disabled, so it predates this branch. No single unclipped element exceeds 375px, so it needs its own pass. Listing pages and the homepage pass. |
| B7 | Dropped | No banner to reopen. |
| B8 | Dropped | Miguel declined a privacy page for now. |
| B9 | Pass | `npm run build` passes, 28 pages. The analytics chunk is 328 KB raw, **108 KB gzip**. It is dynamically imported, so it does not block first paint, but it is by far the largest script the site ships. |
| B10 | Pass | `.github/workflows/deploy.yml` passes `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from repository secrets. The file contains no key: `grep -c "phc_"` returns 0. |

### How the events were verified

PostHog drops events from automated browsers on purpose. The guard in the installed source
is:

```js
r = !config.opt_out_useragent_filter && this._is_bot();
if (r && !config.__preview_capture_bot_pageviews) return;
```

It returns `undefined` with no warning and no network request, which is exactly what a
broken integration looks like. Changing the user agent does not defeat it, because the
check also sees the automation flags Playwright sets.

So the pipeline was proved by turning `opt_out_useragent_filter` on **temporarily**, in a
throwaway build, and reverting it immediately. That build produced real POSTs to
`https://us.i.posthog.com/e/`, `/i/v0/e/` and `/s/` (replay snapshots), carrying
`$pageview`, `$web_vitals`, `$autocapture`, `$$heatmap`, `$snapshot`, plus the custom
`theme_toggle`, `code_copy`, `article_read_progress` and `article_read_complete`. The flag
is **not** in the shipped code: `grep -c opt_out_useragent_filter src/scripts/analytics.ts`
returns 0.

Two consequences worth keeping in mind:

1. Automated traffic will never appear in PostHog, which is usually what you want.
2. This verification cannot be done from a scripted browser without that flag. Confirming
   events from a real browser is Miguel's step.

### Stage 3, commit

| Check | State | Evidence |
|---|---|---|
| C1 | Pass | 0 em dashes and 0 en dashes across every changed and added file. |
| C2 | Pass | The key value appears nowhere in the repo or its history. |

## A1 and A2. Events and properties

Every article event carries four shared properties, read from the page at runtime:
`collection` (philosophy, tech or journal), `slug`, `tags` and `word_count`. They come from
front matter that already exists in the content schema, exposed on the article element as
data attributes.

### Built in, captured by the SDK

| Event | When it fires | Properties |
|---|---|---|
| `$pageview` | Page load. | SDK defaults: url, referrer, device, viewport. |
| `$pageleave` | Visitor leaves the page. | SDK defaults plus scroll depth. Exact property names to confirm against the installed types in Stage 2. |
| `$autocapture` | Click on a link, button or other interactive element. | Element text, selector, href. |
| `$rageclick` | Three rapid clicks in roughly one spot. | Element and position. |
| Dead clicks | Click that produces no change. | Enabled by `capture_dead_clicks`. Exact event name not given on the docs page. Confirm in Stage 2. |
| Web vitals | Core Web Vitals per page. | Enabled by `capture_performance`. Exact event name not given on the docs page. Confirm in Stage 2. |
| Exceptions | Uncaught JavaScript error. | Enabled by `capture_exceptions`. Exact event name not given on the docs page. Confirm in Stage 2. |
| Heatmaps | Click and scroll positions for heatmaps. | Enabled by `capture_heatmaps`. Sent as heatmap data, not a normal event. |
| Session replay | Recording of the session. | Not an event. Masking is in A4. |

### Custom, sent by this site

| Event | When it fires | Properties |
|---|---|---|
| `article_read_progress` | Scroll passes 25, 50, 75 and 100 percent of the article body. Once per milestone per page view. | `percent`, plus the four article properties. |
| `article_read_complete` | Visitor reaches 100 percent, or leaves after reading. | `active_seconds`, plus the four article properties. |
| `outbound_click` | Click on a link whose host is not this site. | `href`, `host`, `text`. |
| `code_copy` | Copy button on a code panel is clicked. | `language`, plus the four article properties. |
| `theme_toggle` | Theme toggle is clicked. | `to` (pasture or nightwatch). |
| `rss_click` | Click on a visible RSS link. | `source` (page path). |
| `cv_download` | Click on a CV download link. | `file`. |
| `newsletter_signup_click` | Footer sign-up form is submitted. | `page` (path the submit came from). |

### Gaps found in A2

Three of the required items cannot work as asked today. None is a reason to stop, but none
should be written as working either.

1. **`rss_click` has nothing to click.** The feed exists at `/rss.xml` and is linked from
   `<head>` as `<link rel="alternate">`, but no page renders a clickable RSS link. Checked
   the built HTML: zero `<a>` elements point at `rss.xml`. The event stays in the table and
   stays dead until a visible link is added. Adding one is a design change, so it is a
   question for Miguel, not something to slip in.
2. **`cv_download` has no CV.** Nothing in the site references a CV, resume or curriculum
   vitae. The event cannot fire until a CV exists and is linked.
3. **Active seconds is approximate.** `article_read_complete` carries `active_seconds`
   measured with page visibility and an idle timer in this site's own code. It is not a
   PostHog built-in, so it counts time the tab was visible, not time the visitor was
   genuinely reading.

Two further limits worth stating:

4. **Cookieless mode needs a project setting.** PostHog ignores cookieless events unless
   "Cookieless server hash mode" is turned on in Project Settings, Web analytics. That is a
   manual step in the PostHog UI. It is not something this repo can do.
5. **Session replay and heatmaps are consent-only.** Both write to storage, so neither runs
   before Accept. That follows from the consent design below, not from a platform limit.

## A3. Consent design, superseded

The Stage 1 design proposed a banner with three states and cookieless counting before
consent. Miguel dropped it on 2026-10-15. This section records what was found, because the
findings still apply when the banner is built.

**The original plan could not have worked as written.** It asked for cookieless anonymous
pageviews before consent. PostHog's documented behaviour with
`opt_out_capturing_by_default: true` and `cookieless_mode: 'on_reject'` is: "No events are
captured until after consent is either given or denied." Cookieless counting applies to the
declined state, not the pending one. A visitor who ignores the banner is never counted. Any
future banner has to choose between that and `cookieless_mode: 'always'`, which counts
everyone but sends a request before the visitor has answered.

**What runs instead, today.** No opt out by default, no cookieless mode, full capture from
first load. Every option below was checked against the current docs, not written from
memory.

| Option | Value | Note |
|---|---|---|
| `api_host` | `https://us.i.posthog.com` | US Cloud. Confirmed as the documented US value. |
| `respect_dnt` | `true` | Honours Do Not Track, and Global Privacy Control. See A5. |
| `capture_pageview` | `true` | |
| `capture_pageleave` | `'if_capture_pageview'` | Gives page leave with scroll depth. |
| `autocapture` | `true` | |
| `rageclick` | `true` | |
| `capture_dead_clicks` | `true` | |
| `capture_heatmaps` | `true` | |
| `capture_exceptions` | `true` | |
| `capture_performance` | `true` | Web vitals. |
| `disable_session_recording` | `false` | Replay on, per Miguel's decision. |
| `session_recording` | see A4 | Masking. |
| `defaults` | left unset | Deliberate. Setting it to `'2025-05-24'` or later switches `capture_pageview` to `'history_change'`. This is a multi-page static site where every navigation is a real page load, so explicit options are more predictable. |

**Project settings override, worth knowing.** The remote config this project serves has
`heatmaps: false`, `captureDeadClicks: false`, `autocaptureExceptions: false` and
`capturePerformance.web_vitals: false`. Setting them explicitly in `init` turns them on
anyway: the debug log shows Web Vitals, Exception Autocapture, Heatmaps and Dead Clicks all
starting. So the client config wins over the project defaults. Turning them on in Project
Settings as well would make the two agree, which is tidier but not required.

## A4. Session replay masking

Replay runs only after Accept. When it runs, it masks:

| What | How |
|---|---|
| All form inputs | `session_recording.maskAllInputs: true`. |
| The newsletter form in the footer | `maskTextSelector` covering `#mlb2-46272821`. |
| The Waline comment area | `maskTextSelector` covering the Waline container. |
| The Giscus comment area | `maskTextSelector` covering the Giscus container. |

`maskTextSelector` takes a CSS selector string and masks matching elements and their
children. It does not apply to input elements, which is why `maskAllInputs` is set as well.
`:not()` selectors do not work in `maskTextSelector`, because masking applies to children.
For any region that is not text, PostHog's own escape hatch is the `ph-no-capture` class,
which replaces the element with a same-size block and also suppresses autocapture from it.

## A5. Do Not Track and Global Privacy Control

Both signals are treated as Decline.

- **Do Not Track** is handled by `respect_dnt: true`, which is a documented option.
- **Global Privacy Control** is covered by the same flag. **Verified** by reading the
  installed 1.438.11 source: it checks
  `[doNotTrack, msDoNotTrack, doNotTrack, globalPrivacyControl].some(...)`, so
  `respect_dnt: true` honours GPC as well as DNT. No extra code needed. This replaces the
  Stage 1 note, which rested on a third-party release aggregator.

## Still open

1. **The consent banner.** Dropped for now by decision, not oversight. Until it exists the
   site sets cookies, keeps a localStorage identifier and records sessions with no notice to
   visitors anywhere on the site. The A3 section above holds the findings the banner will
   need.
2. **No privacy page.** Declined for now. Nothing on the site tells a visitor any of this is
   happening.
3. **`cv_download` has nothing to fire on.** No CV exists on the site. The handler is wired
   and waits for one.
4. **The 375px overflow on article and project pages.** Pre-existing, not from this work,
   and unexplained. Worth its own pass.
5. **Repository secrets.** CI needs `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` adding
   before a deploy will send anything. Until then the production build has no key and does
   nothing, which is the same safe state as B2.
6. **Naming the vendor.** Nothing visitor-facing names it, because nothing visitor-facing
   exists yet. The question returns with the banner.

## Doc pages used

Read on 2026-10-15.

- JavaScript web configuration, for every option name and default:
  https://posthog.com/docs/libraries/js/config
- Controlling data collection, for opt in and opt out, the pending state and the cookieless
  wording: https://posthog.com/docs/privacy/data-collection
- Session replay privacy, for the masking options:
  https://posthog.com/docs/session-replay/privacy
- Autocapture, for the built-in event names:
  https://posthog.com/docs/data/autocapture
- Events, for the pageview and page leave events:
  https://posthog.com/docs/data/events
- Cookieless tracking: https://posthog.com/docs/data/cookieless-tracking. The page returned
  navigation only through the fetch used here, so its detail came from PostHog search
  results quoting it rather than the page body. Treated as weaker evidence, which is part of
  why the A3 conflict is left open rather than decided.
