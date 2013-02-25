/*global module:false*/
var cr = require('complexity-report');

module.exports = function(grunt) {

	var MultiReporter = require('./reporters/multi')(grunt);
	var ConsoleReporter = require('./reporters/Console')(grunt);
	var JSLintXMLReporter = require('./reporters/JSLintXML')(grunt);

	var Complexity = {

		defaultOptions: {
			errorsOnly: false,
			cyclomatic: 3,
			halstead: 8,
			maintainability: 100
		},

		buildReporter: function(files, options) {

			var reporter = new MultiReporter(files, options);
			reporter.addReporter(ConsoleReporter);

			if(options.jsLintXML) {
				reporter.addReporter(JSLintXMLReporter);
			}
			
			return reporter;

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

		isMaintainable: function(data, options) {

			var expected = options.maintainability;
			var actual = data.maintainability;

			return expected < actual;

		},

		reportComplexity: function(reporter, analysis, filepath, options) {

			var complicatedFunctions = analysis.functions.filter(function(data) {
				return this.isComplicated(data, options);
			}, this);

			grunt.fail.errorcount += complicatedFunctions.length;

			reporter.complexity(filepath, complicatedFunctions);

		},

		reportMaintainability: function(reporter, analysis, filepath, options) {

			var valid = this.isMaintainable(analysis, options);

			if(!options.errorsOnly || !valid) {
				reporter.maintainability(filepath, valid, analysis);
			}

			if(!valid) {
				grunt.fail.errorcount++;
			}

		},

		analyze: function(reporter, files, options) {
			reporter.start();

			files.forEach(function(filepath) {
				var content = grunt.file.read(filepath);
				var analysis = cr.run(content, options);

				this.reportMaintainability(reporter, analysis, filepath, options);
				this.reportComplexity(reporter, analysis, filepath, options);
			}, this);

			reporter.finish();
		}
	};

	grunt.registerMultiTask('complexity', 'Determines complexity of code.', function() {

		var files = this.filesSrc || grunt.file.expandFiles(this.file.src);

		// Set defaults
		var options = this.options(Complexity.defaultOptions);

		var reporter = Complexity.buildReporter(files, options);

		Complexity.analyze(reporter, files, options);

		return this.errorCount === 0;

	});

	return Complexity;

};