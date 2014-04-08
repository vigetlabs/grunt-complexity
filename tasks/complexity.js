/*global module:false*/
var complexity = require('../src/index.js');

module.exports = function(grunt) {
	return grunt.registerMultiTask('complexity', 'Determines complexity of code.', function() {
		var files = this.filesSrc || grunt.file.expandFiles(this.file.src);

		// Set defaults
		var options = complexity.normalizeOptions(this.options(complexity.defaultOptions));
		var reporter = complexity.buildReporter(files, options);

		complexity.on('complexity', function() {
			grunt.fail.errorcount++;
		});

		complexity.analyze(reporter, files, options);

		return options.breakOnErrors === false || this.errorCount === 0;
	});
};
