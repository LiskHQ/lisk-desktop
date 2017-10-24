// const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  specs: [
    'features/*.feature',
  ],

  directConnect: true,
  capabilities: {
    browserName: 'chrome',
  },
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  cucumberOpts: {
    require: 'features/step_definitions/*.js',
    tags: '~@ignore',
    format: 'pretty',
    profile: false,
    'no-source': true,
  },

  params: {
    screenshotFolder: 'e2e-test-screenshots',
    baseURL: 'http://localhost:8080/',
    liskCoreURL: 'http://localhost:4000/',
  },
};
