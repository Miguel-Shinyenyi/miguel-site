import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SOURCES = [
  { file: 'career-prep.md', label: 'career prep' },
  { file: 'cmu-masters.md', label: 'cmu masters' },
  { file: 'routine-machine.md', label: 'routine machine' },
];

// scripts/sync-content.mjs normalizes UMWAYI's own root projects/*.md
// (its internal tracking files, distinct from site/projects/, the public
// project pages) to this fixed path, whether the build cloned UMWAYI or
// read it from UMWAYI_PATH. One local source, one parser, no network
// fetch at build time any more (see docs/design.md's decisions log).
const PROJECTS_DIR = join(process.cwd(), '.umwayi', 'projects');

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

// Pulls the open-questions/open-decisions bullets from UMWAYI's own
// tracking files, synced locally at build time by scripts/sync-content.mjs
// (see docs/design.md's homepage open-questions feature). Best-effort: a
// missing file should never fail the build, it should just mean the
// section renders empty for that build, unlike the article/project sync
// itself, which fails loudly on purpose.
export async function getOpenThreads(max = 3): Promise<OpenThread[]> {
  const byProject = SOURCES.map(({ file, label }) => {
    try {
      const path = join(PROJECTS_DIR, file);
      if (!existsSync(path)) return { label, items: [] as string[] };
      return { label, items: extractOpenItems(readFileSync(path, 'utf-8')) };
    } catch {
      return { label, items: [] as string[] };
    }
  });

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
