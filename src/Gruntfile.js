module.exports = function (grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.json',
        format: 'codeframe',
        fix: false,
      },
      target: ['app/**/*.js', 'spec/**/*.js', 'test/**/*.js', '*.js'],
    },
  });

  grunt.registerTask('test', ['eslint']);
  grunt.registerTask('travis', ['test']);
  grunt.registerTask('default', ['test']);

  grunt.registerTask('eslint-fix', 'Run eslint and fix formatting', () => {
    grunt.config.set('eslint.options.fix', true);
    grunt.task.run('eslint');
  });
};
