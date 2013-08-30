/*global module:false*/
var cr = require('complexity-report');

module.exports = function(grunt) {

	var MultiReporter = require('./reporters/multi')(grunt);
	var ConsoleReporter = require('./reporters/Console')(grunt);
	var XMLReporter = require('./reporters/XML')(grunt);
	var JSLintXMLReporter = require('./reporters/JSLintXML')(grunt, XMLReporter);
	var checkstyleReporter = require('./reporters/CheckstyleXML')(grunt, XMLReporter);

	var Complexity = {

		defaultOptions: {
			breakOnErrors: true,
			errorsOnly: false,
			cyclomatic: [3, 7, 12],
			halstead: [8, 13, 20],
			maintainability: 100
		},

		buildReporter: function(files, options) {

			var reporter = new MultiReporter(files, options);
			reporter.addReporter(ConsoleReporter);

			if (options.jsLintXML) {
				reporter.addReporter(JSLintXMLReporter);
			}

			if (options.checkstyleXML) {
				reporter.addReporter(checkstyleReporter);
			}

			return reporter;

		},

		isComplicated: function(data, options) {

			var complicated = false;

			if (data.complexity.cyclomatic > options.cyclomatic[0]) {
				complicated = true;
			}

			if (data.complexity.halstead.difficulty > options.halstead[0]) {
				complicated = true;
			}

			return complicated;

		},

		isMaintainable: function(data, options) {

			var expected = options.maintainability;
			var actual = data.maintainability;

			return expected < actual;

		},

		assignSeverity: function(data, options) {
			var levels = [
					'info',
					'warning',
					'error'
				];

			levels.forEach(function(level, i) {
				if (data.complexity.cyclomatic > options.cyclomatic[i] || data.complexity.halstead.difficulty > options.halstead[i]) {
					data.severity = levels[i];
				}
			});

			return data;
		},

		reportComplexity: function(reporter, analysis, filepath, options) {
			var complicatedFunctions = analysis.functions.filter(function(data) {
				return this.isComplicated(data, options);
			}, this).map(function(data) {
				return this.assignSeverity(data, options);
			}, this);

			grunt.fail.errorcount += complicatedFunctions.length;

			reporter.complexity(filepath, complicatedFunctions);

		},

		reportMaintainability: function(reporter, analysis, filepath, options) {

			var valid = this.isMaintainable(analysis, options);

			if (!options.errorsOnly || !valid) {
				reporter.maintainability(filepath, valid, analysis);
			}

			if (!valid) {
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

		return options.breakOnErrors === false || this.errorCount === 0;

	});

	return Complexity;

};
