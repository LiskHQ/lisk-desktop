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
            'src/components/delegateSidebar/index.js',
            'src/components/setting/index.js',
            'src/components/setting/setting.js',
            'src/components/menuBar/menuBar.js',
            'src/components/accountVisual/demo.js',
            'src/components/delegateList/votingHeader.js',
            'src/components/dialog/index.js',
            'src/components/app/index.js',
            'src/components/transactions/transactionList.js',
            'src/components/relativeLink/index.js',
            'src/components/receiveDialog/receiveDialog.js',
            'src/components/registerDelegate/index.js',
            'src/components/accountVisual/index.js',
            'src/components/secondPassphrase/index.js',
            'src/components/authenticate/index.js',
            'src/components/authenticate/authenticate.js',
            'src/components/multiStep/index.js',
            'src/components/passphrase/create/index.js',
            'src/components/passphrase/createSecond/index.js',
            'src/components/passphrase/safekeeping/index.js',
            'src/components/secondPassphrase/secondPassphrase.js',
            'src/components/toolbox/sliderCheckbox/index.js',
            'src/components/toolbox/transitionWrapper/index.js',
            'src/components/searchBar/index.js',
            'src/components/sendWritable/index.js',
            'src/components/signMessage/index.js',
            'src/components/signMessage/index.js',
            'src/components/voteDialog/index.js',
            'src/components/sidechains/index.js',
            'src/components/header/header.js',
            'src/components/login/index.js',
            'src/components/login/login.js',
            'src/components/register/index.js',
            'src/components/register/register.js',
            'src/components/transactions/transactionOverview.js',
            'src/components/transactions/transactionDetailView.js',
            'src/components/voting/index.js',
            'src/components/delegateList/index.js',
            'src/components/delegateList/delegateList.js',
            'src/components/dialog/index.js',
            'src/components/dialog/dialog.js',
            'src/components/toaster/index.js',
            'src/components/mainMenu/mainMenu.js',
            'src/components/setting/setting.js',
            'src/components/votesPreview/index.js',
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
