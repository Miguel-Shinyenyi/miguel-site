// The shepherd's rotating one-line thoughts, per
// docs/redesign-spec-2026-09-23.md section 4.2. Text-only, aria-live
// carries the update to screen readers, no motion beyond the button's own
// state change.
const thoughts = [
  'Who shepherds the shepherd?',
  'Did I learn it, or just read it?',
  'Which habit is leading me today?',
  "If I can't explain it, do I know it?",
  'Am I following the path, or making it?',
  'What did today teach me?',
];
let i = 0;
const btn = document.getElementById('thought');
const text = document.getElementById('thought-text');
if (btn && text) {
  btn.addEventListener('click', () => {
    i = (i + 1) % thoughts.length;
    text.textContent = thoughts[i];
  });
}
