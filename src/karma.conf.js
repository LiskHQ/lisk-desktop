var path = require('path');
var webpackConfig = require('./webpack.config.babel');
// var entry = path.resolve(webpackConfig.entry.app, '..', '..', 'app', 'app.js'); //accessing [0] because there are mutli entry points for webpack hot loader
var preprocessors = {};
//preprocessors[entry] = ['webpack'];
preprocessors['**/*.html'] = ['ng-html2js'];
var libs = path.join(__dirname, 'app', 'libs.js');
var app = path.join(__dirname, 'app', 'lisk-nano.js');
var test = path.join(__dirname, 'test', 'test.js');
preprocessors[libs] = ['webpack'];
preprocessors[app] = ['webpack', 'coverage'];
preprocessors[test] = ['webpack'];

var opts = {
  onTravis: process.env.ON_TRAVIS,
};

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai'],

		// list of files / patterns to load in the browser
		files: [libs, app, test],
		webpack: webpackConfig,

		// list of files to exclude
		exclude: [],

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'mocha', 'coverage'].concat(opts.onTravis ? ['coveralls'] : []),

		preprocessors: preprocessors,

		babelPreprocessor: {
			options: {
				presets: ['es2015']
			}
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		ngHtml2JsPreprocessor: {
			stripPrefix: 'app/components/',
			moduleName: 'my.templates'
		},


		coverageReporter: {
      type : opts.onTravis ? 'lcov' : 'text',
      dir : 'coverage/',
    },


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,
		client: {
			mocha: {
				opts: 'test/mocha.opts' // You can set opts to equal true then plugin will load opts from default location 'test/mocha.opts'
			},
		},


		plugins: [
			require('karma-webpack'),
			'karma-chai',
			'karma-mocha',
			'karma-chrome-launcher',
			'karma-ng-html2js-preprocessor',
			'karma-mocha-reporter',
			'karma-coverage',
			'karma-coveralls',
			'karma-phantomjs-launcher'
		]
	});
}
