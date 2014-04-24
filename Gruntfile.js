/*global module:false*/

module.exports = function(grunt) {
	grunt.initConfig({
		files: ['Gruntfile.js', 'tasks/**/*.js', 'test/*.js'],

		watch: {
			all: {
				files: '<%= files %>'
			}
		},

		jshint: {
			all: '<%= files %>'
		},

		complexity: {
			generic: grunt.file.readJSON('complexity.json')
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	require('./tasks/complexity')(grunt);

	grunt.registerTask('default', ['jshint', 'complexity']);
};
