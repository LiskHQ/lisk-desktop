module.exports = {
  default: {
    parallel: 2,
    format: ['html:./e2e/assets/cucumber-report.html'],
    paths: ['./e2e/features/**/*.feature'],
    import: ['./e2e/hooks/hooks.mjs', './e2e/steps/**/*.mjs', './e2e/steps/**/*.js'],
    dryRun: false,
    publishQuite: true,
    failFast: false,
    retry: 3,
  },
};
