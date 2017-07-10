// Karma configuration
const webpackEnv = { test: true };
const webpackConfig = require('./webpack.config')(webpackEnv);

const fileGlob = 'src/**/*.test.js';
const onJenkins = process.env.ON_JENKINS;
process.env.BABEL_ENV = 'test';
module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [fileGlob],
    preprocessors: {
      [fileGlob]: ['webpack'],
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        {
          type: 'text',
          dir: 'coverage/',
        },
        {
          type: onJenkins ? 'lcov' : 'html',
          dir: 'coverage/',
        },
      ],
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
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,
  });
};
