/*global module:false*/
var fs = require('fs');
var cr = require('complexity-report');

module.exports = function(grunt) {

	var BLOCK = '\u2588';

	var make = grunt.template.process;
	var bodyTemplate = fs.readFileSync(__dirname + '/reporter.tpl').toString();
	var tableLength = 30;

	var options = {
		cyclomatic: 3,
		halstead: 8,
		maintainability: 100
   	};

	function log(message) {
		message = message || '';
		grunt.log.writeln(message);
	}

	function fitWhitespace(string) {

		var remaining = tableLength - string.length;

		// Prevent negative values from breaking the array
		remaining = Math.max(0, remaining);

		return string + Array(remaining + 3).join(' ');
	}

	function generateBar(score, threshold) {

		// 17.1 for 1/10 of 171, the maximum score
		var magnitude = Math.floor(score / 17.1);
		var bar = Array(magnitude).join(BLOCK) +  ' ' + score.toPrecision(5);

		// Out of 171 points, what % did it earn?
		var rating = score / threshold;

		return rating < 1 ? bar.red : rating < 1.2 ? bar.yellow : bar.green;

	}

	function longestString(arrayOfStrings) {

		var longest = arrayOfStrings.sort(function(a,b) { 
			return a.length < b.length; 
		})[0].length;

		return longest;

	}

	function isComplicated(data, options) {

		var complicated = false;

		if (data.complexity.cyclomatic > options.cyclomatic) {
			complicated = true;
		}

		if (data.complexity.halstead.difficulty > options.halstead) {
			complicated = true;
		}

		return complicated;
	}

	function isMaintainable(filepath, data, options) {

		var expected = options.maintainability;
		var actual = data.maintainability;

		return expected < actual;

	}

	function determineComplexity(filepath, data, options) {

		if (isComplicated(data, options) === false) return;

		data.filepath = filepath;

		var message = make(bodyTemplate, data);

		log(message.yellow);
		grunt.fail.errorcount++;

	}

	grunt.registerHelper('complexity', function (src, filepath, options) {

		var analysis = cr.run(src, options);

		var valid = isMaintainable(filepath, analysis, options);
		var symbol = valid? '\u2713'.green : '\u2717'.red;

		var bar = generateBar(analysis.maintainability, options.maintainability);
		var label = fitWhitespace(filepath);
		
		log(symbol + ' ' + label + bar);

		if (!valid) grunt.fail.errorcount++;

		analysis.functions.forEach(function(data) {
			determineComplexity(filepath, data, options);
		});

	});

	grunt.registerMultiTask('complexity', 'Determines complexity of code.', function () {

		var files = grunt.file.expandFiles(this.file.src);

		log(' ');

		// Set defaults
		var params = this.data.options;
		for (var o in params) options[o] = params[o];

		tableLength = longestString(files);

		files.forEach(function(filepath) {
			var content = grunt.file.read(filepath);
			grunt.helper('complexity', content, filepath, options);
		});

		return this.errorCount === 0;

	});

};
