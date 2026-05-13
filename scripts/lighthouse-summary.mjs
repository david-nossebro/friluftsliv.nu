#!/usr/bin/env node
/**
 * Read the JSON reports produced by `lhci autorun` (filesystem target) under
 * `.lighthouseci/{mobile,desktop}/` and print a markdown digest to stdout.
 *
 * For each form factor × URL we print:
 *   - the four category scores (0-100)
 *   - every weighted audit that scored below 0.9 (title, score, displayValue,
 *     first sentence of the official Lighthouse description)
 *   - the top 5 performance "opportunities" by potential savings (ms)
 *   - the path to the HTML report for human inspection
 *
 * Designed to be readable by both a developer and an AI agent: the audit
 * `title` + `description` come straight from Lighthouse and contain enough
 * context to act on without opening the HTML report.
 *
 * Exit code is always 0 — `lhci autorun` already failed the build if any
 * `error`-level assertion tripped; this script is purely for readable output.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, isAbsolute, dirname } from 'node:path';

const PROJECT_ROOT = process.cwd();
const BASE_DIR = join(PROJECT_ROOT, '.lighthouseci');
const FORM_FACTORS = ['mobile', 'desktop'];
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const FAIL_THRESHOLD = 0.9;

const out = [];
const w = (s = '') => out.push(s);

w('# Lighthouse audit summary');
w('');
w(`_Generated ${new Date().toISOString()}_`);
w('');

if (!existsSync(BASE_DIR)) {
  w('No `.lighthouseci/` directory found. Run `pnpm test:lighthouse` first.');
  console.log(out.join('\n'));
  process.exit(0);
}

const resolvePath = (manifestDir, p) => (isAbsolute(p) ? p : join(manifestDir, p));

const firstSentence = (text) => {
  if (!text) return '';
  // Strip markdown links: [Learn more](https://…) → Learn more
  const stripped = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const match = stripped.match(/^[^.!?]+[.!?]/);
  return (match ? match[0] : stripped).trim();
};

const scoreBar = (score) => {
  if (score == null) return 'n/a';
  return String(Math.round(score * 100));
};

for (const formFactor of FORM_FACTORS) {
  const dir = join(BASE_DIR, formFactor);
  const manifestPath = join(dir, 'manifest.json');

  w(`## ${formFactor}`);
  w('');

  if (!existsSync(manifestPath)) {
    w(`_No manifest at \`${relative(PROJECT_ROOT, manifestPath)}\` — not run yet._`);
    w('');
    continue;
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const representative = manifest.filter((r) => r.isRepresentativeRun);

  if (representative.length === 0) {
    w('_Manifest contained no representative runs._');
    w('');
    continue;
  }

  for (const entry of representative) {
    const jsonPath = resolvePath(dir, entry.jsonPath);
    const htmlPath = resolvePath(dir, entry.htmlPath);
    const lhr = JSON.parse(await readFile(jsonPath, 'utf8'));

    const urlPath = (() => {
      try {
        const u = new URL(entry.url);
        return u.pathname === '/' ? '/' : u.pathname;
      } catch {
        return entry.url;
      }
    })();

    w(`### \`${urlPath}\``);
    w('');

    const scoreLine = CATEGORIES.map((cat) => {
      const c = lhr.categories?.[cat];
      const label = cat === 'best-practices' ? 'best-prac' : cat;
      return `${label}: **${scoreBar(c?.score)}**`;
    }).join(' · ');
    w(scoreLine);
    w('');

    // Collect failing audits across all four categories.
    const failingById = new Map();
    for (const cat of CATEGORIES) {
      const c = lhr.categories?.[cat];
      if (!c?.auditRefs) continue;
      for (const ref of c.auditRefs) {
        if (!ref.weight || ref.weight <= 0) continue;
        const a = lhr.audits?.[ref.id];
        if (!a || a.score == null || a.score >= FAIL_THRESHOLD) continue;
        const existing = failingById.get(ref.id);
        if (existing) {
          existing.categories.push(cat);
        } else {
          failingById.set(ref.id, { ...a, categories: [cat] });
        }
      }
    }
    const failing = [...failingById.values()].sort((a, b) => a.score - b.score);

    if (failing.length) {
      w('**Failing audits:**');
      w('');
      for (const a of failing) {
        const score = Math.round(a.score * 100);
        const cats = a.categories.join('/');
        const dv = a.displayValue ? ` — ${a.displayValue}` : '';
        w(`- **${a.title}** \`${score}\` (${cats})${dv}`);
        const desc = firstSentence(a.description);
        if (desc) w(`  ${desc}`);
      }
      w('');
    } else {
      w('_All weighted audits pass at ≥ 90._');
      w('');
    }

    // Top opportunities by potential savings (ms).
    const opportunities = Object.values(lhr.audits ?? {})
      .filter(
        (a) =>
          a.details &&
          a.details.type === 'opportunity' &&
          typeof a.numericValue === 'number' &&
          a.numericValue > 0,
      )
      .sort((a, b) => b.numericValue - a.numericValue)
      .slice(0, 5);

    if (opportunities.length) {
      w('**Top performance opportunities:**');
      w('');
      for (const o of opportunities) {
        const savings = Math.round(o.numericValue);
        w(`- ${o.title} — potential savings ~${savings} ms`);
      }
      w('');
    }

    w(`Full report: \`${relative(PROJECT_ROOT, htmlPath)}\``);
    w('');
  }
}

console.log(out.join('\n'));
