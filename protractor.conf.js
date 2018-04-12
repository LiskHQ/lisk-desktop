// const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  specs: [
    'test/e2e/*.feature',
  ],
  directConnect: !process.env.BRANCH_NAME,
  multiCapabilities: [{
    browserName: 'chrome',
    browserVersion: '65.0',
    os: 'Windows',
    osVersion: '7',
    resolution: '1680x1050',
    maxInstances: 5,
  /*
  }, {
    browserName: 'Firefox',
    browserVersion: '58.0',
    os: 'Windows',
    osVersion: '10',
    resolution: '1680x1050',
  }, {
    browserName: 'Edge',
    browserVersion: '16.0',
    os: 'Windows',
    osVersion: '10',
    resolution: '1680x1050',
  }, {
    browserName: 'Safari',
    browserVersion: '10.1',
    os: 'OS X',
    osVersion: 'Sierra',
    resolution: '1600x1200',
    */
  }].map(({ browserName, os, resolution }) => ({
    browserName,
    os,
    resolution,
    project: 'Lisk Hub',
    build: process.env.BRANCH_NAME,
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_PASSWORD,
    'browserstack.local': process.env.BRANCH_NAME ? 'true' : undefined,
    'browserstack.localIdentifier': process.env.BRANCH_NAME,
    'browserstack.debug': true,
  })),
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  restartBrowserBetweenTests: true,
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
    baseURL: 'http://localhost:8080',
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
