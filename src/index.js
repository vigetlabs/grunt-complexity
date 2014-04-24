/*global module:false*/
var _ = require('underscore');
var util = require('util');
var escomplex = require('escomplex-js');
var EventEmitter = require('events').EventEmitter;
var MultiReporter = require('./reporters/multi');
var ConsoleReporter = require('./reporters/Console');
var XMLReporter = require('./reporters/XML');
var JSLintXMLReporter = require('./reporters/JSLintXML');
var checkstyleReporter = require('./reporters/CheckstyleXML');

var ensureArray = function(obj) {
	return Array.isArray(obj)? obj : [obj];
};

var Complexity = module.exports = function() {
	EventEmitter.call(this);
};

util.inherits(Complexity, EventEmitter);

_.extend(Complexity.prototype, {
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

		this.trigger('complexity');
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
		}).sort(function (a, b) {
			return a.analysis.maintainability - b.analysis.maintainability;
		}).forEach(function (info) {
			this.reportMaintainability(reporter, info.analysis, info.filepath, options);
			this.reportComplexity(reporter, info.analysis, info.filepath, options);
		}, this);

		reporter.finish();
	}
});
