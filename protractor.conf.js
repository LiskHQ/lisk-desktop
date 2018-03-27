// const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  specs: [
    'test/e2e/*.feature',
  ],

  directConnect: true,
  capabilities: {
    browserName: 'chrome',
  },
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  cucumberOpts: {
    require: 'test/e2e/step_definitions/*.js',
    tags: ['~@advanced'],
    format: 'pretty',
    profile: false,
    'no-source': true,
    strict: true,
  },

  params: {
    screenshotFolder: 'e2e-test-screenshots',
    baseURL: 'http://localhost:8080/',
    liskCoreURL: 'http://localhost:4000/',
    testnetPassphrase: process.env.TESTNET_PASSPHRASE,
    useTestnetPassphrase: false,
    network: 'customNode',
    screenWidth: 1400,
    screenHeight: 1300,
    reportDir: './reports/',
    reportFile: 'cucumber_report.json',
  },
};
