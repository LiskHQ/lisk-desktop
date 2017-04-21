const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
  capabilities: {
    browserName: 'phantomjs',
  },
  onPrepare() {
    const env = jasmine.getEnv();

    // FIXME the following like can make the output cleaner
    // but then shell return code is always 0 even if some tests fail.
    // env.clearReporters();

    env.addReporter(new SpecReporter({
      spec: {
        displayStacktrace: false,
        displayDuration: true,
      },
      summary: {
        displayDuration: true,
      },
    }));
  },
};
