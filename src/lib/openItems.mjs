// The open-threads parser, shared by the two things that need to agree on
// exactly which bullets reach the site: src/lib/openThreads.ts, which
// renders them, and scripts/sync-content.mjs's privacy guard, which has to
// scan the same set and nothing more.
//
// Scope matters here. UMWAYI's root projects/*.md are Miguel's own private
// tracking files, and only their "Open questions"/"Open decisions" bullets
// are ever published. Everything else in those files (including headings
// naming companies) stays private, so the guard scans what this returns,
// never the whole file.
//
// Plain .mjs rather than .ts so the build script can import it directly
// under plain node, with no transpile step and no dependency on a Node
// version that can strip types (CI runs Node 20, which can't).

export const OPEN_THREAD_SOURCES = [
  { file: 'career-prep.md', label: 'career prep' },
  { file: 'cmu-masters.md', label: 'cmu masters' },
  { file: 'routine-machine.md', label: 'routine machine' },
];

/**
 * @param {string} markdown
 * @returns {{ text: string, line: number }[]} each published bullet, with
 *   the 1-based line in the source file where it starts.
 */
export function extractOpenItems(markdown) {
  /** @type {{ text: string, line: number }[]} */
  const items = [];
  let inSection = false;
  /** @type {{ text: string, line: number } | null} */
  let current = null;

  const flush = () => {
    if (current) items.push(current);
    current = null;
  };

  markdown.split('\n').forEach((line, index) => {
    const heading = line.match(/^##\s+(.*)/);
    if (heading) {
      flush();
      const title = heading[1].trim().toLowerCase();
      inSection = title === 'open questions' || title === 'open decisions';
      return;
    }
    if (!inSection) return;

    const bullet = line.match(/^-\s+(.*)/);
    if (bullet) {
      flush();
      current = { text: bullet[1].trim(), line: index + 1 };
    } else if (current && /^\s+\S/.test(line)) {
      current.text += ' ' + line.trim();
    }
  });
  flush();
  return items;
}
