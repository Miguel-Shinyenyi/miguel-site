// Footer sign-up, posted as an anonymous entry to the site's own Waline
// server (the same one This-helped and article comments use), at a path
// no article renders a Waline widget for (`/miguel-site/subscribe`), so
// these never show up mixed into an article's comment thread. This only
// collects addresses - nothing sends the "new article" email yet.
//
// Checked live before shipping this (see docs/design.md's decisions log):
// posted a real test entry, then requested that path's comments with no
// credentials and searched the whole response for the address. It never
// appears - Waline's public read API only ever returns a one-way hashed
// Libravatar URL built from the address, never the address itself. Safe
// to send the real typed address as `mail`.
const form = document.getElementById('subscribe');
if (form) {
  const ok = document.getElementById('subscribe-ok');
  const err = document.getElementById('subscribe-err');
  const submitBtn = form.querySelector('button');
  const WALINE_SERVER = 'https://waline-comments-azure-zeta.vercel.app';
  const SUBSCRIBE_PATH = '/miguel-site/subscribe';

  function showOk(message) {
    ok.textContent = message;
    ok.classList.remove('hidden');
    err.classList.add('hidden');
  }

  function showErr(message) {
    err.textContent = message;
    err.classList.remove('hidden');
    ok.classList.add('hidden');
  }

  function storageKey(email) {
    return `notify:${email.trim().toLowerCase()}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const valid = form.email.checkValidity() && email !== '';
    if (!valid) {
      showErr("That email doesn't look right. Check it and try again.");
      return;
    }

    let alreadyOn = false;
    try {
      alreadyOn = localStorage.getItem(storageKey(email)) === 'true';
    } catch {
      // Storage unavailable; just skip the remembered state and post again.
    }
    if (alreadyOn) {
      showOk("You're already on the list.");
      form.reset();
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    try {
      const res = await fetch(`${WALINE_SERVER}/api/comment?lang=en`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nick: 'Subscriber',
          mail: email,
          link: '',
          comment: 'Wants to receive notifications when new articles appear.',
          ua: navigator.userAgent,
          url: SUBSCRIBE_PATH,
        }),
      });
      const json = await res.json().catch(() => null);
      // errno 1000, "Comment too fast!" is Waline's own rate limit,
      // confirmed live by posting fast enough to trigger it (see the
      // decisions log); everything else that isn't errno 0 is some other
      // server-side rejection.
      if (!res.ok || !json) {
        throw new Error('network');
      }
      if (json.errno === 1000) {
        throw new Error('rate-limit');
      }
      if (json.errno !== 0) {
        throw new Error(json.errmsg || 'other');
      }

      try {
        localStorage.setItem(storageKey(email), 'true');
      } catch {
        // Best-effort only; the post still succeeded server-side.
      }
      showOk("You're on the list. You'll hear when a new article is up.");
      form.reset();
    } catch (error) {
      const reason =
        error.message === 'rate-limit'
          ? "too many attempts right now - wait a moment and try again"
          : error.message === 'network'
            ? "a network problem"
            : "something went wrong on the server";
      showErr(`Couldn't save that: ${reason}.`);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
