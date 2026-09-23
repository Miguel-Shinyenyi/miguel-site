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

// ---------- "This helped" (can appear twice: sidebar + inline on phone) ----------
document.querySelectorAll('[data-helped]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    document.querySelectorAll('[data-helped]').forEach((b) => {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      const l = b.querySelector('[data-helped-label]');
      if (l) l.textContent = on ? 'Thanks noted' : 'This helped';
    });
  });
});

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
