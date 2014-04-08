/*global module:false*/
var escomplex = require('escomplex-js');
var events = require('events');

var MultiReporter = require('./reporters/multi')(grunt);
var ConsoleReporter = require('./reporters/Console')(grunt);
var XMLReporter = require('./reporters/XML')(grunt);
var JSLintXMLReporter = require('./reporters/JSLintXML')(grunt, XMLReporter);
var checkstyleReporter = require('./reporters/CheckstyleXML')(grunt, XMLReporter);

module.exports = function() {
	var ensureArray = function(obj) {
		return obj instanceof Array === false? [obj] : obj;
	}

	var Complexity = Object.create(events.EventEmitter, {
		defaultOptions: {
			breakOnErrors: true,
			errorsOnly: false,
			cyclomatic: [3, 7, 12],
			halstead: [8, 13, 20],
			maintainability: 100,
			hideComplexFunctions: false
		},

		normalizeOptions: function(options) {
			options.cyclomatic = ensureArray(options.cyclomatic);
			options.halstead = ensureArray(options.halstead);
			return options;
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

			if (data.cyclomatic > options.cyclomatic[0]) {
				complicated = true;
			}

			if (data.halstead.difficulty > options.halstead[0]) {
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

			if (options.cyclomatic.length === 1 && options.halstead.length === 1) {
				// backward compatibility here: any issue will raise a warning
				if (data.cyclomatic > options.cyclomatic[0] || data.halstead.difficulty > options.halstead[0]) {
					data.severity = 'warning';
				}
			} else {
				levels.forEach(function(level, i) {
					if (data.cyclomatic > options.cyclomatic[i] || data.halstead.difficulty > options.halstead[i]) {
						data.severity = levels[i];
					}
				});
			}

			return data;
		},

		reportComplexity: function(reporter, analysis, filepath, options) {
			var complicatedFunctions = [];

			if (options.hideComplexFunctions !== true) {
				complicatedFunctions = analysis.functions.filter(function(data) {
					var isComplex = this.isComplicated(data, options);

					if (isComplex) this.trigger('complexity', data, options);

					return isComplex;
				}, this).map(function(data) {
					return this.assignSeverity(data, options);
				}, this);
			}

			reporter.complexity(filepath, complicatedFunctions);
		},

		reportMaintainability: function(reporter, analysis, filepath, options) {
			var valid = this.isMaintainable(analysis, options);

			if (!options.errorsOnly || !valid) {
				reporter.maintainability(filepath, valid, analysis);
			}

			this.trigger('complexity')
		},

		analyze: function(reporter, files, options) {
			reporter.start();

			files.map(function(filepath) {
				var content = require('fs').readFileSync(filepath).toString();
				var analysis = escomplex.analyse(content, options);

				return {
					filepath: filepath,
					analysis: analysis
				};
			}).sort(function (info1, info2) {
				return info1.analysis.maintainability - info2.analysis.maintainability;
			}).forEach(function (info) {
				this.reportMaintainability(reporter, info.analysis, info.filepath, options);
				this.reportComplexity(reporter, info.analysis, info.filepath, options);
			}, this);

			reporter.finish();
		}
	});
};
