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
            'src/components/accountVisual/index.js',
            'src/components/header/header.js',
            'src/components/searchBar/index.js',
            'src/components/register/register.js',
            'src/components/search/index.js',
            'src/components/voteUrlProcessor/voteUrlProcessor.js',
            'src/components/voteUrlProcessor/index.js',
            'src/components/onboarding/index.js',
            'src/components/passphrase/createSecond/index.js',
            'src/components/passphraseCreation/index.js',
            'src/utils/api/liskService.js',
            'src/components/errorBoundary/index.js',
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
