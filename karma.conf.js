const path = require('path');
const webpackConfig = require('./webpack.config.babel');
// Accessing [0] because there are mutli entry points for webpack hot loader
// var entry = path.resolve(webpackConfig.entry.app, '..', '..', 'app', 'app.js');
const preprocessors = {};
// preprocessors[entry] = ['webpack'];
preprocessors['**/*.html'] = ['ng-html2js'];
const libs = path.join(__dirname, 'src', 'libs.js');
const app = path.join(__dirname, 'src', 'liskNano.js');
const testLibs = path.join(__dirname, 'test', 'libs.js');
const test = path.join(__dirname, 'test', 'test.js');
preprocessors[libs] = ['webpack'];
preprocessors[app] = ['webpack'];
preprocessors[testLibs] = ['webpack'];
preprocessors[test] = ['webpack'];

const opts = {
  onTravis: process.env.ON_TRAVIS,
  onJenkins: process.env.ON_JENKINS,
  live: process.env.LIVE,
};

module.exports = function (config) {
  config.set({

    // Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // Frameworks to use
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // List of files / patterns to load in the browser
    files: [libs, app, testLibs, test],
    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },

    // List of files to exclude
    exclude: [],

    // Rest results reporter to use
    // Possible values: 'dots', 'progress'
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage', 'mocha'].concat(opts.onTravis ? ['coveralls'] : []).concat(opts.onJenkins ? ['coveralls'] : []),

    preprocessors,

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
      },
    },

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    //
    // Possible values:
    //   config.LOG_DISABLE
    //   config.LOG_ERROR
    //   config.LOG_WARN
    //   config.LOG_INFO
    //   config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: opts.live,

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/components/',
      moduleName: 'my.templates',
    },

    coverageReporter: {
      reporters: [{
        type: 'text',
        dir: 'coverage/',
      }, {
        type: opts.onTravis ? 'lcov' : 'html',
        dir: 'coverage/',
      }, {
        type: opts.onJenkins ? 'lcov' : 'html',
        dir: 'coverage/',
      }],
    },

    // Start these browsers
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // If true, Karma captures browsers, runs the tests and exits
    singleRun: !opts.live,
    client: {
      captureConsole: true,
      mocha: {
        opts: 'test/mocha.opts', // You can set opts to equal true then plugin will load opts from default location 'test/mocha.opts'
      },
    },

    plugins: [
      require('karma-webpack'), // eslint-disable-line import/no-extraneous-dependencies
      'karma-chai',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-mocha-reporter',
      'karma-coverage',
      'karma-coveralls',
      'karma-phantomjs-launcher',
    ],
  });
};
