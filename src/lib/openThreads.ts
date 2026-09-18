const SOURCES = [
  { file: 'career-prep.md', label: 'career prep' },
  { file: 'cmu-masters.md', label: 'cmu masters' },
  { file: 'routine-machine.md', label: 'routine machine' },
];

const RAW_BASE = 'https://raw.githubusercontent.com/Miguel-Shinyenyi/UMWAYI/main/projects';

export interface OpenThread {
  project: string;
  text: string;
}

function extractOpenItems(markdown: string): string[] {
  const items: string[] = [];
  let inSection = false;
  let current: string | null = null;

  const flush = () => {
    if (current) items.push(current);
    current = null;
  };

  for (const line of markdown.split('\n')) {
    const heading = line.match(/^##\s+(.*)/);
    if (heading) {
      flush();
      const title = heading[1].trim().toLowerCase();
      inSection = title === 'open questions' || title === 'open decisions';
      continue;
    }
    if (!inSection) continue;

    const bullet = line.match(/^-\s+(.*)/);
    if (bullet) {
      flush();
      current = bullet[1].trim();
    } else if (current && /^\s+\S/.test(line)) {
      current += ' ' + line.trim();
    }
  }
  flush();
  return items;
}

// Pulls the open-questions/open-decisions bullets straight from UMWAYI's public
// repo at build time (see docs/design.md's homepage open-questions feature).
// Best-effort: a network hiccup during build should never fail the site build,
// it should just mean the section renders empty for that build.
export async function getOpenThreads(max = 3): Promise<OpenThread[]> {
  const byProject = await Promise.all(
    SOURCES.map(async ({ file, label }) => {
      try {
        const res = await fetch(`${RAW_BASE}/${file}`);
        if (!res.ok) return { label, items: [] as string[] };
        return { label, items: extractOpenItems(await res.text()) };
      } catch {
        return { label, items: [] as string[] };
      }
    })
  );

  const threads: OpenThread[] = [];
  let round = 0;
  while (threads.length < max && byProject.some((p) => p.items.length > round)) {
    for (const p of byProject) {
      if (threads.length >= max) break;
      if (p.items[round]) threads.push({ project: p.label, text: p.items[round] });
    }
    round++;
  }
  return threads;
}
