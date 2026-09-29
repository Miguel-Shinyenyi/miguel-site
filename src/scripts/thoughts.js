// Shepherd's thought bubble, ported from the 2026-09-29 reference's
// assets/js/main.js. Rule for new thoughts: under 8 words, one idea, ends
// in a question mark.
//
// The hero art also carries its own reveal class so the thought trail and
// bubble animate in from their own source (the bubble grows from its
// tail), which the shared [data-reveal] observer in BaseLayout does not
// cover because that one only fades the wrapper.
const thoughts = [
  'Who shepherds the shepherd?',
  "Did I learn it, or just read it?",
  'Which habit is leading me today?',
  "If I can't explain it, do I know it?",
  'Am I following the path, or making it?',
  'What did today teach me?',
];

const btn = document.getElementById('thought');
const text = document.getElementById('thought-text');
const heroArt = document.querySelector('.hero-art');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroArt) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    heroArt.classList.add('is-in');
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(heroArt);
  }
}

if (btn && text) {
  let i = 0;
  let swapTimer;
  btn.addEventListener('click', () => {
    i = (i + 1) % thoughts.length;
    if (reduceMotion) {
      text.textContent = thoughts[i];
      return;
    }
    // Out fast, swap, in slower. A rapid click retargets the same timer
    // instead of queueing another swap behind it.
    clearTimeout(swapTimer);
    text.classList.add('is-out');
    swapTimer = setTimeout(() => {
      text.textContent = thoughts[i];
      text.classList.remove('is-out');
    }, 120);
  });
}
