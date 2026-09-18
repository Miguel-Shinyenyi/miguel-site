# Publishing

## Purpose

How the site actually gets deployed and made public.

## GitHub Pages

The site deploys through a GitHub Actions workflow.

1. In the site's GitHub repo, go to Settings, Pages, and set Source to "GitHub Actions."
2. Add this workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. In `astro.config.mjs`, set `site` to the real GitHub Pages URL
   (`https://<username>.github.io/<repo-name>`), and if the repo isn't named
   `<username>.github.io`, add `base: '/<repo-name>'` as well, or Astro will generate links
   that 404.
4. Push to `main`. The workflow builds and deploys automatically on every push after that.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-18 | GitHub Pages only, Carrd and Hashnode dropped from scope | One working publishing pipeline is worth more right now than three partially documented ones. Revisit either if the need becomes concrete. |
| 2026-09-18 | `site: https://Miguel-Shinyenyi.github.io/miguel-site`, `base: /miguel-site` set in `astro.config.mjs`; the workflow file added at `.github/workflows/deploy.yml` exactly as specified above | Repo is named `miguel-site`, not `<username>.github.io`, so `base` is required per this doc's own step 3, or every internal link 404s on GitHub Pages |

## Open questions

None currently. Reopen if Carrd or Hashnode become relevant again.