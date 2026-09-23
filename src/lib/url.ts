export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

// UMWAYI's site/README.md: "A url that starts with / is a page on this
// site; the build adds the base path." Used for project links/links[].url,
// which can be either an internal page or an external URL.
export function resolveLink(url: string): string {
  return url.startsWith('/') ? withBase(url) : url;
}
