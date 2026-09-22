// The flock gathers toward the shepherd once, on load or first scroll into
// view (docs/design.md, Motion section: "a short, purposeful motion, not a
// decorative loop"). CSS (global.css) owns the actual transform/transition;
// this only ever adds .is-gathered once, it never removes it, so it can't
// become a loop even if re-triggered.
const mascot = document.querySelector('.mascot');
if (mascot) {
  const settle = () => mascot.classList.add('is-gathered');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    settle();
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            settle();
            observer.unobserve(mascot);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(mascot);
  } else {
    settle();
  }
}
