// Footer subscribe form check, matched against the reference
// implementation's assets/js/main.js. No newsletter provider is wired up
// yet, so this only validates the email format and shows the right
// message; posting to a provider's form endpoint is a follow-up once one
// exists (see the TODO below, same as the reference).
const form = document.getElementById('subscribe');
if (form) {
  const ok = document.getElementById('subscribe-ok');
  const err = document.getElementById('subscribe-err');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.email.checkValidity() && form.email.value.trim() !== '';
    ok.classList.toggle('hidden', !valid);
    err.classList.toggle('hidden', valid);
    if (valid) {
      // TODO: send to your newsletter provider (Buttondown, Hashnode, etc.)
      // fetch('https://your-provider/subscribe', { method: 'POST', body: new FormData(form) });
      form.reset();
    }
  });
}
