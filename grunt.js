/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		complexity: {
			generic: {
				src: ['grunt.js', 'tasks/grunt-complexity.js', 'tests/*.js'],
				options: {
					cyclomatic: 90,
					halstead: 90,
					maintainability: 100
				}
			}
		}
		

	});

	grunt.registerTask('default', 'complexity');

	// Used for testing only, you shouldn't add this to your code:
	grunt.loadTasks('tasks');

};
