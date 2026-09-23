// Article page interactions, per docs/redesign-spec-2026-09-23.md section
// 4.9: the text-size join and the code sample's copy button, plus the
// "This helped" toggle. All a few lines each, per the spec's own
// interaction summary (section 5).

document.querySelectorAll('.article-body pre.astro-code').forEach((pre) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-panel';
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-code-btn btn btn-xs';
  btn.textContent = 'Copy';
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent ?? '');
      btn.textContent = 'Copied';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 1500);
    } catch {
      // Clipboard API unavailable; nothing to do but leave the button as is.
    }
  });
  wrapper.appendChild(btn);
});

const sizeButtons = document.querySelectorAll('.text-size-btn');
const article = document.querySelector('.article-body');
if (article && sizeButtons.length) {
  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => b.classList.remove('btn-active'));
      btn.classList.add('btn-active');
      article.setAttribute('data-text-size', btn.dataset.size ?? 'md');
    });
  });
}

const helpedBtn = document.querySelector('.this-helped-btn');
if (helpedBtn) {
  helpedBtn.addEventListener('click', () => {
    helpedBtn.classList.toggle('btn-active');
  });
}
