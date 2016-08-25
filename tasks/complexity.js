/*global module:false*/
var escomplex = require('typhonjs-escomplex');
var _ = require('lodash');

module.exports = function(grunt) {
	var MultiReporter = require('./reporters/multi')(grunt);
	var ConsoleReporter = require('./reporters/Console')(grunt);
	var XMLReporter = require('./reporters/XML')(grunt);
	var JSLintXMLReporter = require('./reporters/JSLintXML')(grunt, XMLReporter);
	var checkstyleReporter = require('./reporters/CheckstyleXML')(grunt, XMLReporter);
	var pmdReporter = require('./reporters/PmdXML')(grunt, XMLReporter);

	var Complexity = {

		defaultOptions: {
			breakOnErrors: true,
			errorsOnly: false,
			cyclomatic: [3, 7, 12],
			halstead: [8, 13, 20],
			maintainability: 100,
			hideComplexFunctions: false
		},

		normalizeOptions: function(options) {
			// Handle backward compatibility of thresholds
			if (options.cyclomatic instanceof Array === false) {
				options.cyclomatic = [
					options.cyclomatic
				];
			}

			if (options.halstead instanceof Array === false) {
				options.halstead = [
					options.halstead
				];
			}

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

			if (options.pmdXML) {
				reporter.addReporter(pmdReporter);
			}

			if (options.broadcast && options.broadcast === true) {
				var eventReporter = require('./reporters/event-reporter')(grunt);
				reporter.addReporter(eventReporter);
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

			return expected <= actual;
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
			var classFunctionsReports = this.getFunctionsFromClasses(analysis.classes);
			var methodFunctionsReports = analysis.methods;
			var complicatedFunctions = []; 
			
			if (options.hideComplexFunctions !== true) {
				var allFunctionReports = methodFunctionsReports.concat(classFunctionsReports);
				complicatedFunctions = this.getComplicatedFunctions(allFunctionReports, options);
			}

			grunt.fail.errorcount += complicatedFunctions.length;
			reporter.complexity(filepath, complicatedFunctions);
		},

		getFunctionsFromClasses: function(classes) {
			return _.flatMap(classes, 'methods');
		},

		getComplicatedFunctions: function(methodList, options) {
			return methodList.filter((data) => this.isComplicated(data, options)).map((data) => this.assignSeverity(data, options));
		},

		reportMaintainability: function(reporter, analysis, filepath, options) {
			var valid = this.isMaintainable(analysis, options);
			if (!options.errorsOnly || !valid) {
				reporter.maintainability(filepath, valid, analysis);
			}
		},

		getProjectInfos: function(files) {
			return files.map((filepath) => {
				var content = grunt.file.read(filepath);
					if (!content.length) {
						throw new Error('Empty source file: \'' + filepath + '\'.');
					} else {
						return { srcPath: filepath, code: content };
					}
			});
		},

		displayReports: function(reporter, fileReports, options) {
			fileReports = _.orderBy(fileReports,'analysis.maintainability', 'asc');
			grunt.fail.errorcount = _.countBy(fileReports, (report) => this.isMaintainable(report, options)).true || 0;
			fileReports.forEach((info) => {
				this.reportMaintainability(reporter, info.analysis, info.filepath, options);
				this.reportComplexity(reporter, info.analysis, info.filepath, options);
			});
		},

		analyze: function(reporter, files, options) {
			reporter.start();
			var analyzedProject = escomplex.analyzeProject(this.getProjectInfos(files), options);
			var fileReports = analyzedProject.modules.map((moduleReport) => ({ filepath: moduleReport.srcPath, analysis: moduleReport }));
			this.displayReports(reporter, fileReports, options);
			reporter.finish();
		}
	};

	grunt.registerMultiTask('complexity', 'Determines complexity of code.', function() {
		var files = this.filesSrc || grunt.file.expandFiles(this.file.src);
			excludedFiles = this.data.exclude;

		// Exclude any unwanted files from 'files' array
		if (excludedFiles) {
			grunt.file.expand(excludedFiles).forEach(function (e) { files.splice(files.indexOf(e), 1); });
		}

		// Set defaults
		var options = Complexity.normalizeOptions(this.options(Complexity.defaultOptions));

		var reporter = Complexity.buildReporter(files, options);

		Complexity.analyze(reporter, files, options);

		return options.breakOnErrors === false || this.errorCount === 0;
	});

	return Complexity;

};
