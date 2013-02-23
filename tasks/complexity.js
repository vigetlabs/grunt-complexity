/*global module:false*/
var cr = require('complexity-report');
var _ = require('underscore');

module.exports = function(grunt) {

	var ConsoleReporter = require('./reporters/Console')(grunt);

	var Complexity = {
		defaultOptions : {
			errorsOnly: false,
			cyclomatic: 3,
			halstead: 8,
			maintainability: 100
		},

		isComplicated: function(data, options) {

			var complicated = false;

			if(data.complexity.cyclomatic > options.cyclomatic) {
				complicated = true;
			}

			if(data.complexity.halstead.difficulty > options.halstead) {
				complicated = true;
			}

			return complicated;

		},

		isMaintainable: function(filepath, data, options) {

			var expected = options.maintainability;
			var actual = data.maintainability;

			return expected < actual;

		},

		determineComplexity: function(reporter, filepath, data, options) {

			if(this.isComplicated(data, options) === false) return;

			reporter.complexity(filepath, data);

			grunt.fail.errorcount++;

		},

		complexityTask: function(reporter, src, filepath, options) {

			var analysis = cr.run(src, options);

			var valid = this.isMaintainable(filepath, analysis, options);

			if(!options.errorsOnly || !valid) {
				reporter.maintainability(filepath, valid, analysis);
			}

			if(!valid) grunt.fail.errorcount++;

			analysis.functions.forEach(function(data) {
				this.determineComplexity(reporter, filepath, data, options);
			}, this);
		},

		analyze: function(reporter, files, options) {
			reporter.start();

			files.forEach(function(filepath) {
				var content = grunt.file.read(filepath);
				this.complexityTask(reporter, content, filepath, options);
			}, this);

			reporter.finish();
		}
	};

	grunt.registerMultiTask('complexity', 'Determines complexity of code.', function() {

		var files = this.filesSrc || grunt.file.expandFiles(this.file.src);

		// Set defaults
		var options = _.defaults(this.data.options, Complexity.defaultOptions);

		var reporter = new ConsoleReporter(files, options);

		Complexity.analyze(reporter, files, options);

		return this.errorCount === 0;

	});

	return Complexity;

};