// Footer subscribe form check, per docs/redesign-spec-2026-09-23.md section
// 4.8. No newsletter provider is wired up yet, so this only validates the
// email format and shows the right message; posting to a provider's form
// endpoint is a follow-up once one exists.
const form = document.getElementById('subscribe');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = form.email.checkValidity();
    document.getElementById('ok').classList.toggle('hidden', !ok);
    document.getElementById('err').classList.toggle('hidden', ok);
  });
}
