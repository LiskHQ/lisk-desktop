const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
  capabilities: {
    browserName: 'chrome',
  },
  onPrepare() {
    const env = jasmine.getEnv();

    env.clearReporters();
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: false,
      },
    }));
  },
};
