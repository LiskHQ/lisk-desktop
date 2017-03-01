'use strict';

module.exports = function (grunt) {

  require('jit-grunt')(grunt);

  grunt.initConfig({
    eslint: {
      options: {
				configFile: '.eslintrc.json',
				format: 'codeframe',
				fix: false
			},
      target: ['app'],
    }
  });

  grunt.registerTask('test', ['eslint']);
  grunt.registerTask('travis', ['test']);
  grunt.registerTask('default', ['test']);

  grunt.registerTask('eslint-fix', 'Run eslint and fix formatting', function () {
		grunt.config.set('eslint.options.fix', true);
		grunt.task.run('eslint');
	});

};
