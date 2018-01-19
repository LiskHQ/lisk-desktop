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
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
        each: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
          excludes: [
            'src/store/reducers/forging.js',
            'src/store/reducers/voting.js',
            'src/store/reducers/transactions.js',
            'src/store/reducers/savedAccounts.js',
            'src/store/middlewares/account.js',
            'src/store/middlewares/login.js',
            'src/utils/notification.js',
            'src/store/middlewares/savedAccounts.js',
            'src/store/middlewares/socket.js',
            'src/components/account/account.js',
            'src/components/account/address.js',
            'src/components/account/index.js',
            'src/components/account/index.js',
            'src/components/app/index.js',
            'src/components/dashboard/index.js',
            'src/components/transactions/transactionList.js',
            'src/components/relativeLink/index.js',
            'src/components/receiveDialog/receiveDialog.js',
            'src/components/registerDelegate/index.js',
            'src/components/accountVisual/index.js',
            'src/components/secondPassphrase/index.js',
            'src/components/authenticate/index.js',
            'src/components/authenticate/authenticate.js',
            'src/components/multiStep/index.js',
            'src/components/passphrase/info/index.js',
            'src/components/passphrase/create/index.js',
            'src/components/passphrase/safekeeping/index.js',
            'src/components/toolbox/checkbox/index.js',
            'src/components/toolbox/transitionWrapper/index.js',
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
            'src/components/voting/index.js',
            'src/components/voting/voting.js',
            'src/components/forging/index.js',
            'src/components/forging/forging.js',
            'src/components/dialog/index.js',
            'src/components/dialog/dialog.js',
            'src/components/toaster/index.js',
            'src/components/mainMenu/mainMenu.js',
            'src/components/setting/setting.js',
            'src/utils/externalLinks.js',
            'src/utils/ipcLocale.js',
            'app/src/menu.js',
            'app/src/modules/autoUpdater.js',
            'app/src/modules/win.js',
            'app/src/modules/localeHandler.js',
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
