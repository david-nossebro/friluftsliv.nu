/**
 * Lighthouse CI config — desktop profile.
 *
 * Same routes as the mobile config but with the `desktop` preset (no mobile
 * emulation, lighter throttling). Desktop is more stable, so we set a slightly
 * stricter performance bar; a11y / SEO / best-practices bars are identical to
 * mobile.
 *
 * Outputs to .lighthouseci/desktop/.
 *
 * Run with: pnpm test:lighthouse:desktop (assumes `next build` already ran).
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
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance':    ['warn',  { minScore: 0.90 }],
        'categories:accessibility':  ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn',  { minScore: 0.90 }],
        'categories:seo':            ['warn',  { minScore: 0.90 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci/desktop',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
};
