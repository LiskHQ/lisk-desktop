var path = require('path');
var webpackConfig = require('./webpack.config.babel');
var entry = path.resolve(__dirname + '/app', './app/index.js'); //accessing [0] because there are mutli entry points for webpack hot loader
var preprocessors = {};
preprocessors[entry] = ['webpack'];
preprocessors['**/*.html'] = ['ng-html2js'];

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai'],

		// list of files / patterns to load in the browser
		files: [entry],
		webpack: webpackConfig,

		// list of files to exclude
		exclude: [],

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

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
		autoWatch: true,

		ngHtml2JsPreprocessor: {
			stripPrefix: 'app/components/',
			moduleName: 'my.templates'
		},

		reporters: ['mocha'],

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		plugins: [
			require('karma-webpack'),
			'karma-chai',
			'karma-mocha',
			'karma-chrome-launcher',
			'karma-ng-html2js-preprocessor',
			'karma-mocha-reporter'
		]
	});
}