#!/usr/bin/env node
/**
 * Orchestrate the full Lighthouse audit pipeline.
 *
 * Steps:
 *   1. `next build`              — fatal: if this fails, abort (no point auditing a broken build)
 *   2. `lhci autorun` mobile     — non-fatal: assertion failure is captured, not aborted
 *   3. `lhci autorun` desktop    — non-fatal
 *   4. `lighthouse-summary.mjs`  — always runs so the developer/AI sees the digest
 *
 * Exit code: 0 if both lhci runs returned 0; otherwise the worst non-zero exit
 * code from the lhci steps (so `pnpm test:run` still fails when assertions trip,
 * but we still get the summary printed).
 */
import { spawnSync } from 'node:child_process';

const run = (cmd, args, { fatal }) => {
  console.log(`\n$ ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  if (result.error) {
    console.error(`Failed to launch ${cmd}: ${result.error.message}`);
    process.exit(1);
  }
  if (fatal && result.status !== 0) {
    console.error(`\n${cmd} ${args[0]} failed (exit ${result.status}); aborting.`);
    process.exit(result.status ?? 1);
  }
  return result.status ?? 0;
};

run('pnpm', ['exec', 'next', 'build'], { fatal: true });

const mobileExit = run(
  'pnpm',
  ['exec', 'lhci', 'autorun', '--config=lighthouserc.mobile.js'],
  { fatal: false },
);

const desktopExit = run(
  'pnpm',
  ['exec', 'lhci', 'autorun', '--config=lighthouserc.desktop.js'],
  { fatal: false },
);

run('node', ['scripts/lighthouse-summary.mjs'], { fatal: false });

const worst = Math.max(mobileExit, desktopExit);
if (worst !== 0) {
  console.error(
    `\nLighthouse assertions failed (mobile=${mobileExit}, desktop=${desktopExit}). See summary above and reports under .lighthouseci/.`,
  );
}
process.exit(worst);
