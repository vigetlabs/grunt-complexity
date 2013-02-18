/*global module:false*/
var fs = require('fs');
var cr = require('complexity-report');

module.exports = function(grunt) {

	var BLOCK = '\u2588';

	var make = grunt.template.process;
	var bodyTemplate = fs.readFileSync(__dirname + '/reporter.tpl').toString();
	var tableLength = 30;

	var options = {
		errorsOnly: false,
		cyclomatic: 3,
		halstead: 8,
		maintainability: 100
	};

	function log(message, display) {
		message = message || '';
		grunt.log.writeln(message);
	}

	var Complexity = {

		fitWhitespace: function(string) {

			var remaining = tableLength - string.length;

			// Prevent negative values from breaking the array
			remaining = Math.max(0, remaining);

			return string + Array(remaining + 3).join(' ');

		},

		generateBar: function(score, threshold) {

			// 17.1 for 1/10 of 171, the maximum score
			var magnitude = Math.floor(score / 17.1);
			var bar = Array(magnitude).join(BLOCK) + ' ' + score.toPrecision(5);

			// Out of 171 points, what % did it earn?
			var rating = score / threshold;

			return rating < 1 ? bar.red : rating < 1.2 ? bar.yellow : bar.green;

		},

		longestString: function(arrayOfStrings) {

			var clone = Array.apply(null, arrayOfStrings);

			var longestLength = clone.reduce(function(memo, a) {
				return memo > a.length ? memo : a.length;
			}, 0);

			return longestLength;

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

		determineComplexity: function(filepath, data, options) {

			if(this.isComplicated(data, options) === false) return;

			data.filepath = filepath;
			var message = make(bodyTemplate, {
				data: data
			});

			log(message.yellow);
			grunt.fail.errorcount++;

		},

		maintainabilityMessage: function(filepath, valid, analysis, options) {

			var symbol = valid ? '\u2713'.green : '\u2717'.red;

			var bar = this.generateBar(analysis.maintainability, options.maintainability);
			var label = this.fitWhitespace(filepath);

			return symbol + ' ' + label + bar;

		},

		complexityTask: function(src, filepath, options) {

			var analysis = cr.run(src, options);

			var valid = this.isMaintainable(filepath, analysis, options);

			if (!options.errorsOnly || !valid) {
				var message = this.maintainabilityMessage(filepath, valid, analysis, options);
				log(message);
			}

			if(!valid) grunt.fail.errorcount++;

			analysis.functions.forEach(function(data) {
				this.determineComplexity(filepath, data, options);
			}, this);
		}
	};

	grunt.registerMultiTask('complexity', 'Determines complexity of code.', function() {

		var files = this.filesSrc || grunt.file.expandFiles(this.file.src);

		log(' ');

		// Set defaults
		var params = this.data.options;
		for(var o in params) options[o] = params[o];

		tableLength = Complexity.longestString(files);

		files.forEach(function(filepath) {
			var content = grunt.file.read(filepath);
			Complexity.complexityTask(content, filepath, options);
		});

		return this.errorCount === 0;

	});

	return Complexity;

};