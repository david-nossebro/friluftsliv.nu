/**
 * Lighthouse CI config — mobile profile.
 *
 * Audits a production build via `pnpm start`. Mobile uses Lighthouse's default
 * emulation (Moto G4, simulated 4G throttling) — the form factor most of our
 * users will hit in the field.
 *
 * Outputs JSON + HTML reports to .lighthouseci/mobile/ (filesystem target).
 * The companion `scripts/lighthouse-summary.mjs` reads these to produce a
 * markdown digest of failing audits and top opportunities.
 *
 * Run with: pnpm test:lighthouse:mobile (assumes `next build` already ran).
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/karta',
        'http://localhost:3000/om',
        'http://localhost:3000/utforska',
        'http://localhost:3000/turer/kungsleden-abisko-nikkaluokta',
        'http://localhost:3000/stugor/kebnekaise-fjallstation',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance':    ['warn',  { minScore: 0.80 }],
        'categories:accessibility':  ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn',  { minScore: 0.90 }],
        'categories:seo':            ['warn',  { minScore: 0.90 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci/mobile',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
};
