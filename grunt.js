/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		files: ['grunt.js', 'tasks/*.js', 'test/*.js'],
		complexity: {
			generic: (function() {
				// Loading config manualy due to 0.3.x vs 0.4.x differences
				var config = grunt.file.readJSON('complexity.json');
				config.src = '<config:files>';
				return config;
			}())
		}
	});

	grunt.registerTask('default', 'complexity');

	// Used for testing only, you shouldn't add this to your code:
	grunt.loadTasks('tasks');

};