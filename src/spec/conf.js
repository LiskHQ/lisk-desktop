const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  specs: ['spec.js'],
  directConnect: true,
  capabilities: {
    browserName: 'chrome',
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

    jasmine.getEnv().addReporter({
      specStarted(result) {
        jasmine.getEnv().currentSpec = result;
      },
      specDone() {
        jasmine.getEnv().currentSpec = null;
      },
    });
  },
};
