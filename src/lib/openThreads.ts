import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { OPEN_THREAD_SOURCES as SOURCES, extractOpenItems } from './openItems.mjs';

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

// Pulls the open-questions/open-decisions bullets from UMWAYI's own
// tracking files, synced locally at build time by scripts/sync-content.mjs
// (see docs/design.md's homepage open-questions feature). Best-effort: a
// missing file should never fail the build, it should just mean the
// section renders empty for that build, unlike the article/project sync
// itself, which fails loudly on purpose.
export async function getOpenThreads(max = 3): Promise<OpenThread[]> {
  const byProject = SOURCES.map(({ file, label }) => {
    const empty: ReturnType<typeof extractOpenItems> = [];
    try {
      const path = join(PROJECTS_DIR, file);
      if (!existsSync(path)) return { label, items: empty };
      return { label, items: extractOpenItems(readFileSync(path, 'utf-8')) };
    } catch {
      return { label, items: empty };
    }
  });

  const threads: OpenThread[] = [];
  let round = 0;
  while (threads.length < max && byProject.some((p) => p.items.length > round)) {
    for (const p of byProject) {
      if (threads.length >= max) break;
      if (p.items[round]) threads.push({ project: p.label, text: p.items[round].text });
    }
    round++;
  }
  return threads;
}
