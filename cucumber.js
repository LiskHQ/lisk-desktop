module.exports = {
  default: {
    parallel: 2,
    format: ['html:cucumber-report.html'],
    paths: ['./e2e/features/**/*.feature'],
    import: ['./e2e/steps/**/*.mjs', './e2e/steps/**/*.js'],
    dryRun: false,
    publishQuite: true,
    failFast: false,
  },
};
