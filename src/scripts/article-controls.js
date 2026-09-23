// Article page interactions, matched against the reference implementation's
// assets/js/main.js. Text size is CSS-only (a radio group + :has(), see
// global.css's .prose-amwayi rules) and needs no JS at all. Copy link, copy
// code, "This helped" and the contents scroll-highlight do.

function copy(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'absolute';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch {
    // Nothing to fall back to; the button just won't show "copied".
  }
  document.body.removeChild(ta);
  return Promise.resolve();
}

// ---------- code blocks: wrap shiki's output in a header bar + Copy ----------
document.querySelectorAll('.article-body pre.astro-code').forEach((pre) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-panel sticker';
  pre.parentNode?.insertBefore(wrapper, pre);

  const header = document.createElement('div');
  header.className = 'code-panel-header';
  const lang = document.createElement('span');
  lang.textContent = pre.dataset.language || 'code';
  header.appendChild(lang);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-ghost btn-xs rounded-full border-[#4A5650] font-sans text-[#F3EEE3]';
  btn.textContent = 'Copy';
  btn.addEventListener('click', () => {
    copy(pre.innerText).then(() => {
      btn.textContent = 'Copied';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 2000);
    });
  });
  header.appendChild(btn);

  wrapper.appendChild(header);
  wrapper.appendChild(pre);
});

// ---------- copy link ----------
const linkStatus = document.querySelector('[data-copy-status]');
document.querySelectorAll('[data-copy-link]').forEach((btn) => {
  btn.addEventListener('click', () => {
    copy(location.href.split('#')[0]).then(() => {
      const label = btn.querySelector('[data-copy-label]');
      if (label) label.textContent = 'Link copied';
      if (linkStatus) linkStatus.classList.remove('hidden');
      setTimeout(() => {
        if (label) label.textContent = 'Copy link';
        if (linkStatus) linkStatus.classList.add('hidden');
      }, 2500);
    });
  });
});

// ---------- "This helped": posts an anonymous "This helped" comment to
// this page's own Waline thread (the same server src/components/Waline.astro
// points at), so it shows up alongside real guest comments rather than
// just toggling a local UI state. Request shape read from @waline/api's
// own source (its addComment: POST {serverURL}/api/comment?lang=en,
// {nick, mail, link, comment, ua, url}), not guessed, and confirmed
// against the live server: mail/link must be sent as empty strings, not
// omitted, or the server 500s trying to hash an undefined mail for an
// avatar. Confirmed the server has no comment moderation enabled (a test
// post came back with status: "approved" immediately, not "waiting").
//
// "Same device can't click twice" is enforced client-side only
// (localStorage), per browser, not per device: clearing site data or
// using another browser resets it. Real per-visitor enforcement would
// need a change on the Waline server, out of scope here.
(function () {
  const WALINE_SERVER = 'https://waline-comments-azure-zeta.vercel.app';
  const buttons = document.querySelectorAll('[data-helped]');
  if (!buttons.length) return;

  const path = window.location.pathname;
  const storageKey = `helped:${path}`;
  const status = document.querySelector('[data-copy-status]');

  function showStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('hidden');
    status.classList.toggle('text-error', !!isError);
    status.classList.toggle('text-success', !isError);
    setTimeout(() => status.classList.add('hidden'), 3000);
  }

  function setPressed() {
    buttons.forEach((b) => {
      b.setAttribute('aria-pressed', 'true');
      b.disabled = true;
      const l = b.querySelector('[data-helped-label]');
      if (l) l.textContent = 'Thanks noted';
    });
  }

  let alreadyHelped = false;
  try {
    alreadyHelped = localStorage.getItem(storageKey) === 'true';
  } catch {
    // Storage unavailable (private mode, blocked cookies); just skip the
    // remembered state, the button still works for this visit.
  }
  if (alreadyHelped) setPressed();

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (btn.getAttribute('aria-pressed') === 'true') return;
      buttons.forEach((b) => (b.disabled = true));

      try {
        const res = await fetch(`${WALINE_SERVER}/api/comment?lang=en`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nick: 'Anonymous',
            mail: '',
            link: '',
            comment: 'This helped',
            ua: navigator.userAgent,
            url: path,
          }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json || json.errno !== 0) {
          throw new Error(json?.errmsg || `Request failed (${res.status})`);
        }

        try {
          localStorage.setItem(storageKey, 'true');
        } catch {
          // Best-effort only; the click still succeeded server-side.
        }
        setPressed();
      } catch {
        buttons.forEach((b) => (b.disabled = false));
        showStatus("Couldn't save that. Try again in a moment.", true);
      }
    });
  });
})();

// ---------- highlight the section currently being read ----------
const tocLinks = document.querySelectorAll('[data-toc] a');
if (tocLinks.length && 'IntersectionObserver' in window) {
  const headings = Array.from(document.querySelectorAll('[data-toc]')[0].querySelectorAll('a'))
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActive(id) {
    tocLinks.forEach((a) => {
      a.setAttribute('aria-current', a.getAttribute('href') === `#${id}` ? 'true' : 'false');
    });
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-20% 0px -70% 0px' },
  );
  headings.forEach((h) => observer.observe(h));
  if (headings[0]) setActive(headings[0].id);

  tocLinks.forEach((a) => {
    a.addEventListener('click', () => {
      const d = a.closest('details');
      if (d) d.removeAttribute('open');
    });
  });
}
