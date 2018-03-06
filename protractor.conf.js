// const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  specs: [
    'test/e2e/*.feature',
  ],
  directConnect: !process.env.BRANCH_NAME,
  capabilities: {
    browserName: 'chrome',
    resolution: '1680x1050',
    project: 'Lisk Hub',
    build: process.env.BRANCH_NAME,
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_PASSWORD,
    'browserstack.local': process.env.BRANCH_NAME ? 'true' : undefined,
    'browserstack.localIdentifier': process.env.BRANCH_NAME,
  },
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  cucumberOpts: {
    require: 'test/e2e/step_definitions/*.js',
    tags: [],
    format: 'pretty',
    profile: false,
    'no-source': true,
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
