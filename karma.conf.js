// Karma configuration
const webpackConfig = require('./config/webpack.config.test');

webpackConfig.watch = true;

const filePattern = 'src/**/*.test.js';
const fileRoot = 'src/tests.js';
const onJenkins = process.env.ON_JENKINS;
process.env.BABEL_ENV = 'test';
module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      fileRoot,
      {
        pattern: filePattern,
        included: false,
        served: false,
        watched: false,
      },
    ],
    preprocessors: {
      '**/*.js': ['sourcemap'],
      [fileRoot]: ['webpack'],
    },
    reporters: ['coverage', 'mocha', 'junit'],
    coverageReporter: {
      reporters: [
        {
          type: 'json',
          dir: 'coverage/',
        },
        {
          type: 'cobertura',
          dir: 'coverage/',
        },
        {
          type: onJenkins ? 'lcov' : 'html',
          dir: 'coverage/',
        },
      ],
      check: {
        global: {
          statements: 80,
          branches: 79,
          functions: 80,
          lines: 80,
        },
        each: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
          excludes: [
            'src/actions/transactions.js',
            'src/components/errorBoundary/index.js',
            'src/components/feedbackForm/**/*.js',
            'src/components/ledger/accountCard.js',
            'src/components/ledger/addAccountCard.js',
            'src/components/ledger/index.js',
            'src/components/ledger/ledgerLogin.js',
            'src/components/ledger/unlockWallet.js',
            'src/components/login/index.js',
            'src/components/login/login.js',
            'src/components/register/register.js',
            'src/components/request/specifyRequest.test.js',
            'src/components/voteUrlProcessor/index.js',
            'src/store/middlewares/login.js',
            'src/store/reducers/liskService.js',
            'src/utils/api/ledger.js',
            'src/utils/api/liskService.js',
            'src/utils/ledger.js',
            'src/utils/rawTransactionWrapper.js',
            'src/utils/to.js',
            'src/components/newsFeed/index.js', // This component doesn't meet the setted tresholds for mocha but in jest
            'src/components/dashboard/currencyGraph.js', // This component should be fixed later, right now the test is being skip (canvas issue)
            'test/integration/wallet.js', // integration wallet throw random error that should be check it
            'src/components/passphraseCreation/index.js',
          ],
          overrides: {
            'src/store/**/*.js': {
              statements: 100,
            },
          },
        },
      },
    },
    junitReporter: {
      outputFile: 'reports/junit_report.xml',
      useBrowserName: false,
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
      // and use stats to turn off verbose output
      stats: {
        // options i.e.
        chunks: false,
      },
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    browserNoActivityTimeout: 60000,
    browserDisconnectTolerance: 3,
    concurrency: Infinity,
  });
};
