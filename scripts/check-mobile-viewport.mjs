// Mobile-viewport overflow check, per docs/design.md's mobile-first correction
// (2026-09-22). Renders each page at 375px width against a running preview
// server and asserts document.documentElement.scrollWidth === clientWidth,
// the same measurement that found the three verified mobile bugs. Run
// against a production build (`npm run build && npm run preview`), not
// `astro dev`, whose dev toolbar overlay is unrelated DOM noise.
//
// Usage: node scripts/check-mobile-viewport.mjs <path> [<path> ...]
// Paths are relative to the site base (e.g. "/", "/tech/idempotency-keys").
import { chromium } from 'playwright';

const paths = process.argv.slice(2);
if (paths.length === 0) {
  console.error('Usage: node scripts/check-mobile-viewport.mjs <path> [<path> ...]');
  process.exit(1);
}

const base = process.env.CHECK_BASE || 'http://localhost:4322/miguel-site';

const browser = await chromium.launch({ channel: 'chrome' });
let anyFail = false;

for (const p of paths) {
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  const ok = r.sw === r.cw;
  if (!ok) anyFail = true;
  console.log(`${p} -> scrollWidth=${r.sw} clientWidth=${r.cw} ok=${ok}`);
  await page.close();
}

await browser.close();
process.exit(anyFail ? 1 : 0);
