module.exports = {
  default: {
    parallel: 2,
    format: ['html:./e2e/assets/cucumber-report.html'],
    paths: [],
    import: ['./e2e/hooks/hooks.mjs', './e2e/steps/**/*.mjs', './e2e/steps/**/*.js'],
    dryRun: false,
    failFast: false,
    retry: 3,
  },
};
