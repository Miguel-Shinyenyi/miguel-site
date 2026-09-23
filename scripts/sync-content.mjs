#!/usr/bin/env node
// Pulls this site's content from UMWAYI's site/ folder, per site/README.md
// there (the layout, front matter, and body rules it documents). Run
// before dev/build (see package.json's predev/prebuild), never committed
// as content: everything this script writes is gitignored.
//
// UMWAYI_PATH=/path/to/local/UMWAYI  -> read straight from that checkout,
//   for offline work and for testing content edits before pushing them.
// otherwise                          -> shallow, sparse-clone UMWAYI into
//   .umwayi/ (site/ and projects/ only), replacing any old copy.
//
// This fails the build on any problem, on purpose, the opposite of
// getOpenThreads()'s graceful degradation: a failed fetch there hides one
// homepage section; a failed fetch here would deploy a site with no
// articles. A failed build keeps the last good deploy live instead.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OPEN_THREAD_SOURCES, extractOpenItems } from '../src/lib/openItems.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UMWAYI_REMOTE = 'https://github.com/Miguel-Shinyenyi/UMWAYI.git';
const CLONE_DIR = join(ROOT, '.umwayi');

function fail(message) {
  console.error(`\n[sync-content] ${message}\n`);
  process.exit(1);
}

function log(message) {
  console.log(`[sync-content] ${message}`);
}

// UMWAYI's journal folder is "journals/" (plural) on disk; site/README.md
// now documents it that way too (fixed 2026-09-23, see docs/design.md's
// decisions log). This map is still the single place that renames it to
// this repo's own "journal" content collection.
const ARTICLE_DIRS = [
  { from: 'philosophy', to: 'philosophy' },
  { from: 'tech', to: 'tech' },
  { from: 'journals', to: 'journal' },
];

function resolveSource() {
  const envPath = process.env.UMWAYI_PATH;
  if (envPath) {
    if (!existsSync(join(envPath, 'site'))) {
      fail(`UMWAYI_PATH is set to "${envPath}" but it has no site/ folder. Point it at a UMWAYI checkout.`);
    }
    log(`Using local checkout at ${envPath} (UMWAYI_PATH set).`);
    return envPath;
  }

  if (existsSync(CLONE_DIR)) {
    rmSync(CLONE_DIR, { recursive: true, force: true });
  }
  log('Cloning UMWAYI (shallow, sparse: site/ and projects/ only)...');
  try {
    execFileSync('git', ['clone', '--depth', '1', '--filter=blob:none', '--sparse', UMWAYI_REMOTE, CLONE_DIR], {
      stdio: 'inherit',
    });
    execFileSync('git', ['sparse-checkout', 'set', 'site', 'projects'], { cwd: CLONE_DIR, stdio: 'inherit' });
  } catch (err) {
    fail(`Cloning UMWAYI failed: ${err.message}`);
  }
  return CLONE_DIR;
}

function emptyDir(dir) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function copyFilesInto(srcDir, destDir, filter = () => true) {
  if (!existsSync(srcDir)) return 0;
  mkdirSync(destDir, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    if (!statSync(srcPath).isFile() || !filter(entry)) continue;
    copyFileSync(srcPath, join(destDir, entry));
    count++;
  }
  return count;
}

const source = resolveSource();
const sitePath = join(source, 'site');
const projectsPath = join(source, 'projects');

if (!existsSync(sitePath)) {
  fail(`No site/ folder found at ${source}. Did the clone or UMWAYI_PATH checkout work?`);
}

let totalArticles = 0;
for (const { from, to } of ARTICLE_DIRS) {
  const destDir = join(ROOT, 'src', 'content', to);
  emptyDir(destDir);
  const n = copyFilesInto(join(sitePath, from), destDir, (f) => f.endsWith('.md'));
  log(`${from}/ -> src/content/${to}/ (${n} file${n === 1 ? '' : 's'})`);
  totalArticles += n;
}

if (totalArticles === 0) {
  fail('No articles were copied from UMWAYI (philosophy/tech/journals are all empty). Refusing to build an empty site.');
}

// projects/*.md (the public project pages under site/, not UMWAYI's own
// root projects/ tracking files, see getOpenThreads below)
const projectsDestDir = join(ROOT, 'src', 'content', 'projects');
emptyDir(projectsDestDir);
const projectCount = copyFilesInto(join(sitePath, 'projects'), projectsDestDir, (f) => f.endsWith('.md'));
log(`projects/ -> src/content/projects/ (${projectCount} file${projectCount === 1 ? '' : 's'})`);
if (projectCount === 0) {
  fail('No project pages were copied from UMWAYI (site/projects is empty).');
}

// now.md
const nowDestDir = join(ROOT, 'src', 'content', 'now');
emptyDir(nowDestDir);
const nowSrc = join(sitePath, 'now.md');
if (!existsSync(nowSrc)) {
  fail('site/now.md is missing from UMWAYI.');
}
copyFileSync(nowSrc, join(nowDestDir, 'now.md'));
log('now.md -> src/content/now/now.md');

// links.md (footer + profile links, front matter only)
const linksDestDir = join(ROOT, 'src', 'content', 'links');
emptyDir(linksDestDir);
const linksSrc = join(sitePath, 'links.md');
if (!existsSync(linksSrc)) {
  fail('site/links.md is missing from UMWAYI.');
}
copyFileSync(linksSrc, join(linksDestDir, 'links.md'));
log('links.md -> src/content/links/links.md');

// illustrations/*.svg
const illustrationsDest = join(ROOT, 'public', 'illustrations');
emptyDir(illustrationsDest);
const illustrationCount = copyFilesInto(join(sitePath, 'illustrations'), illustrationsDest, (f) => f.endsWith('.svg'));
log(`illustrations/ -> public/illustrations/ (${illustrationCount} file${illustrationCount === 1 ? '' : 's'})`);

// images/*
const imagesDest = join(ROOT, 'public', 'images');
emptyDir(imagesDest);
const imageCount = copyFilesInto(join(sitePath, 'images'), imagesDest);
log(`images/ -> public/images/ (${imageCount} file${imageCount === 1 ? '' : 's'})`);

// UMWAYI's own root projects/*.md (career-prep.md, cmu-masters.md,
// routine-machine.md, ...), the source for the homepage's open-threads
// feature (src/lib/openThreads.ts), which reads from .umwayi/projects/ at
// Astro build time. In clone mode that's already exactly where git's
// sparse checkout put it, nothing to do. In UMWAYI_PATH mode (source is
// outside .umwayi/, which isn't created at all otherwise) it's normalized
// there with an explicit copy, since openThreads.ts runs as a separate
// process from this script and needs one predictable path regardless of
// where the source came from. (Copying .umwayi/projects/ onto itself in
// clone mode would empty it before reading it, so this must stay
// conditional, not run unconditionally.)
if (source === CLONE_DIR) {
  const n = existsSync(projectsPath) ? readdirSync(projectsPath).filter((f) => f.endsWith('.md')).length : 0;
  log(`UMWAYI projects/ already at .umwayi/projects/ (${n} file${n === 1 ? '' : 's'}, for openThreads)`);
} else if (existsSync(projectsPath)) {
  const umwayiProjectsDest = join(CLONE_DIR, 'projects');
  emptyDir(umwayiProjectsDest);
  const n = copyFilesInto(projectsPath, umwayiProjectsDest, (f) => f.endsWith('.md'));
  log(`UMWAYI projects/ -> .umwayi/projects/ (${n} file${n === 1 ? '' : 's'}, for openThreads)`);
} else {
  log('No projects/ folder found for openThreads; the open-threads section will render empty.');
}

// ---- privacy guard ----------------------------------------------------
//
// UMWAYI's site/README.md carries the rule this enforces: nothing the site
// publishes names a company Miguel applied to or interviewed with. This is
// the backstop for it, so a name can't reappear through a content edit
// without the build noticing.
//
// The names themselves live only in the environment (a repository secret
// of the same name in CI), never in this repo, and a match reports the
// file and line but never the matched text. That last part is load-bearing
// rather than belt-and-braces: GitHub masks a secret only as the exact
// whole string it was set to, so an individual name out of a
// comma-separated list would print unmasked in a public build log.
//
// Scope is "what actually reaches the site": every synced markdown file,
// plus the open-thread bullets extractOpenItems() publishes, and NOT the
// rest of UMWAYI's root projects/*.md, which are private tracking notes
// that legitimately name companies and never reach a page.
function privateNameMatchers() {
  const raw = process.env.PRIVATE_NAMES;
  if (!raw) return null;
  const names = raw
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  if (names.length === 0) return null;
  // Whole words, case-insensitive. \b still does the right thing where a
  // name butts against punctuation or a hyphen (a hostname, a compound),
  // which should match; the escape keeps a name with regex characters in
  // it from being read as a pattern.
  return names.map((name) => new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));
}

function scanTextLines(label, lines, matchers, hits) {
  lines.forEach(({ text, line }) => {
    if (matchers.some((re) => re.test(text))) hits.push(`${label}:${line}`);
  });
}

function scanFile(absPath, label, matchers, hits) {
  const lines = readFileSync(absPath, 'utf-8')
    .split('\n')
    .map((text, index) => ({ text, line: index + 1 }));
  scanTextLines(label, lines, matchers, hits);
}

const matchers = privateNameMatchers();
if (!matchers) {
  log('PRIVATE_NAMES not set; skipping the published-content privacy check.');
} else {
  const hits = [];

  const syncedDirs = [...ARTICLE_DIRS.map(({ to }) => to), 'projects', 'now', 'links'];
  for (const dir of syncedDirs) {
    const absDir = join(ROOT, 'src', 'content', dir);
    if (!existsSync(absDir)) continue;
    for (const entry of readdirSync(absDir).filter((f) => f.endsWith('.md'))) {
      scanFile(join(absDir, entry), `src/content/${dir}/${entry}`, matchers, hits);
    }
  }

  // Only the published bullets, with their real line numbers in the source
  // file. Every bullet is checked, not just the three getOpenThreads()
  // currently shows: which three those are depends on how many earlier
  // bullets are still open, so a fourth becomes visible the moment one
  // above it is resolved, with no edit to the bullet itself to catch.
  const umwayiProjects = join(CLONE_DIR, 'projects');
  for (const { file } of OPEN_THREAD_SOURCES) {
    const absPath = join(umwayiProjects, file);
    if (!existsSync(absPath)) continue;
    const items = extractOpenItems(readFileSync(absPath, 'utf-8'));
    scanTextLines(`UMWAYI projects/${file} (open threads)`, items, matchers, hits);
  }

  if (hits.length > 0) {
    fail(
      `Published content names something PRIVATE_NAMES forbids, at ${hits.length} place(s):\n` +
        hits.map((hit) => `  - ${hit}`).join('\n') +
        '\n\nThe matched text is deliberately not printed (build logs are public).\n' +
        'Reword the line in UMWAYI, push, and rebuild.',
    );
  }
  log(`Privacy check passed (${matchers.length} name${matchers.length === 1 ? '' : 's'} checked).`);
}

log(`Done: ${totalArticles} article(s), ${projectCount} project(s).`);
