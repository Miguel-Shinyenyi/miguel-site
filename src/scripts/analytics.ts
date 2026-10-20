// Product analytics. See docs/analytics.md for the event table and the
// decisions behind it.
//
// No consent banner yet. Miguel decided on 2026-10-15 to take full
// analytics now and add the banner later, so this runs everything,
// session replay included. docs/analytics.md records that gap.
//
// The key is read from the environment at build time and never lives in
// the repo. It is a PostHog project key, which is public by design: it
// ships inside the client bundle and is write only.
//
// Every option name here was checked against
// https://posthog.com/docs/libraries/js/config rather than written from
// memory. `defaults` is deliberately left unset: setting it to
// '2025-05-24' or later switches capture_pageview to 'history_change',
// and this is a multi-page static site where every navigation is a real
// page load, so explicit options are more predictable.

const KEY = import.meta.env.PUBLIC_POSTHOG_KEY;
const HOST = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const DEBUG = import.meta.env.PUBLIC_POSTHOG_DEBUG === 'true';

function isLocalHost(): boolean {
  const h = location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.endsWith('.localhost');
}

// Masked in session replay: every input, plus the two comment widgets and
// the newsletter form. maskTextSelector takes a CSS selector string and
// masks matching elements and their children. It does not reach input
// elements, which is why maskAllInputs is set as well.
const MASK_SELECTOR = '#mlb2-46272821, #waline, .guest-comments, .comments, giscus-widget';

type ArticleProps = {
  collection?: string;
  slug?: string;
  tags?: string[];
  word_count?: number;
};

function articleProps(): ArticleProps {
  const el = document.querySelector<HTMLElement>('[data-article]');
  if (!el) return {};
  const tags = el.dataset.tags ? el.dataset.tags.split(',').filter(Boolean) : [];
  const words = Number(el.dataset.wordCount);
  return {
    collection: el.dataset.collection,
    slug: el.dataset.slug,
    tags,
    word_count: Number.isFinite(words) ? words : undefined,
  };
}

async function start() {
  const { default: posthog } = await import('posthog-js');

  posthog.init(KEY, {
    api_host: HOST,
    // Honours Do Not Track. Verified in the installed 1.438.11 source
    // that this also checks navigator.globalPrivacyControl, so Global
    // Privacy Control is covered by the same flag.
    respect_dnt: true,
    capture_pageview: true,
    capture_pageleave: 'if_capture_pageview',
    autocapture: true,
    rageclick: true,
    capture_dead_clicks: true,
    capture_heatmaps: true,
    capture_exceptions: true,
    capture_performance: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: MASK_SELECTOR,
    },
    debug: DEBUG,
  });

  // Exposed only under the debug flag, so a local session can inspect
  // consent state and config from the console. Never set in production.
  if (DEBUG) (window as unknown as Record<string, unknown>).posthog = posthog;

  wireCustomEvents(posthog);
}

function wireCustomEvents(posthog: typeof import('posthog-js').default) {
  const props = articleProps();
  const onArticle = Boolean(props.slug);

  // ---- outbound clicks ----
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;

      let url: URL;
      try {
        url = new URL(link.href, location.href);
      } catch {
        return;
      }
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

      if (url.host !== location.host) {
        posthog.capture('outbound_click', {
          href: url.href,
          host: url.host,
          text: link.textContent?.trim().slice(0, 120) ?? '',
        });
        return;
      }

      // Same host. RSS and CV are tracked separately so they do not get
      // lost inside autocapture.
      if (url.pathname.endsWith('/rss.xml') || url.pathname.endsWith('/rss/')) {
        posthog.capture('rss_click', { source: location.pathname });
      } else if (/\.(pdf|docx?)$/i.test(url.pathname) && /cv|resume/i.test(url.pathname)) {
        posthog.capture('cv_download', { file: url.pathname });
      }
    },
    true,
  );

  // ---- theme toggle ----
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // The layout's own handler flips the attribute. Read it on the next
      // frame so this reports the theme being moved to, not away from.
      requestAnimationFrame(() => {
        posthog.capture('theme_toggle', {
          to: document.documentElement.getAttribute('data-theme'),
        });
      });
    });
  });

  // ---- code copy ----
  // article-controls.js builds the panels after this module runs, so the
  // listener is delegated rather than bound to each button.
  document.addEventListener('click', (event) => {
    const btn = (event.target as Element | null)?.closest?.('.code-panel-copy');
    if (!btn) return;
    const panel = btn.closest('.code-panel');
    const language = panel?.querySelector('.code-panel-header span')?.textContent?.trim();
    posthog.capture('code_copy', { language: language || 'code', ...props });
  });

  // ---- newsletter sign-up ----
  document.querySelector('#mlb2-46272821 form')?.addEventListener('submit', () => {
    posthog.capture('newsletter_signup_click', { page: location.pathname });
  });

  if (!onArticle) return;

  // ---- article read progress and completion ----
  const body = document.querySelector<HTMLElement>('[data-article]');
  if (!body) return;

  const milestones = [25, 50, 75, 100];
  const sent = new Set<number>();
  let complete = false;

  // Active seconds: counted only while the tab is visible. This is this
  // site's own measure, not a PostHog built-in, so it is time the page was
  // on screen rather than proof anyone was reading.
  let activeSeconds = 0;
  const tick = setInterval(() => {
    if (document.visibilityState === 'visible') activeSeconds += 1;
  }, 1000);

  function percentRead(): number {
    const rect = body!.getBoundingClientRect();
    const total = rect.height;
    if (total <= 0) return 0;
    const seen = Math.min(total, Math.max(0, window.innerHeight - rect.top));
    return Math.round((seen / total) * 100);
  }

  function check() {
    const pct = percentRead();
    for (const m of milestones) {
      if (pct >= m && !sent.has(m)) {
        sent.add(m);
        posthog.capture('article_read_progress', { percent: m, ...props });
      }
    }
    if (pct >= 100 && !complete) {
      complete = true;
      posthog.capture('article_read_complete', { active_seconds: activeSeconds, ...props });
    }
  }

  let queued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        check();
      });
    },
    { passive: true },
  );
  check();

  // A reader who leaves part way still counts as a completion attempt, so
  // the event carries the time they did spend.
  addEventListener('pagehide', () => {
    clearInterval(tick);
    if (!complete) {
      complete = true;
      posthog.capture('article_read_complete', {
        active_seconds: activeSeconds,
        percent_reached: percentRead(),
        ...props,
      });
    }
  });
}

if (KEY && (!isLocalHost() || DEBUG)) {
  // Dynamic import so the library is never fetched when there is no key.
  void start();
}
