// Feed at /miguel-site/rss.xml covering the three article sections.
//
// It exists mostly to make the new-article email possible either way:
// MailerLite can build a campaign automatically from an RSS feed, but
// only on its paid plans, so on the free plan Miguel sends each one by
// hand. The feed costs almost nothing now and keeps both paths open.
//
// URLs carry a trailing slash deliberately. That's the canonical form on
// GitHub Pages, which 301-redirects the slashless URL to it (the same
// behaviour documented in the decisions log for the Waline comment path),
// so a guid here matches the URL a reader actually lands on.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/url';

const SECTIONS = ['philosophy', 'tech', 'journal'];

export async function GET(context) {
  const bySection = await Promise.all(
    SECTIONS.map(async (section) => {
      const entries = await getCollection(section, ({ data }) => !data.draft);
      return entries.map((entry) => ({ entry, section }));
    }),
  );

  const items = bySection
    .flat()
    .sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf())
    .map(({ entry, section }) => {
      // withBase first, then resolve against site: site already ends in
      // /miguel-site, and a root-relative path would otherwise replace
      // that path rather than extend it.
      const url = new URL(withBase(`/${section}/${entry.slug}/`), context.site).href;
      return {
        title: entry.data.title,
        pubDate: entry.data.date,
        description: entry.data.summary,
        link: url,
        guid: url,
      };
    });

  return rss({
    title: 'Amwayi',
    description: 'Articles on philosophy, technology and journaling, by Miguel (Amwayi).',
    site: context.site,
    items,
  });
}
