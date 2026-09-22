// Code blocks "type" themselves in when scrolled into view (docs/design.md,
// Motion section). Only CSS clip-path is touched: the real text nodes are
// never removed or reordered, so selection, screen readers, and any future
// copy-to-clipboard button all see the full content immediately, this is a
// visual reveal, not a content-loading delay.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const blocks = document.querySelectorAll('pre.astro-code');

  blocks.forEach((pre) => {
    const code = pre.querySelector('code');
    const lines = code ? code.querySelectorAll(':scope > .line') : [];
    if (lines.length === 0) return;

    lines.forEach((line) => {
      line.style.clipPath = 'inset(0 100% 0 0)';
    });

    const cursor = document.createElement('span');
    cursor.className = 'cursor code-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.setAttribute('title', 'still being written');
    cursor.textContent = '|';
    lines[lines.length - 1].after(cursor);

    const stepMs = 70;
    const totalMs = lines.length * stepMs + 500;

    const reveal = () => {
      lines.forEach((line, i) => {
        line.style.transitionDelay = `${i * stepMs}ms`;
        line.style.clipPath = 'inset(0 0 0 0)';
      });
      window.setTimeout(() => {
        cursor.classList.add('code-cursor--done');
      }, totalMs);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(pre);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(pre);
  });
}
