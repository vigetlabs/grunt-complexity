/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js'],

		watch: {
			all: {
				files: '<%= files %>'
			}
		},

		jshint: {
			all: '<%= files %>',
			options: {
				esnext: true
			}
		},

		complexity: {
			generic: grunt.file.readJSON('complexity.json')
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'complexity']);

	// Used for testing only, you shouldn't add this to your code:
	grunt.loadTasks('tasks');

};
