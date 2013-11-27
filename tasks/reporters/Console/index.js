module.exports = function(grunt) {
	var bodyTemplate = require('fs').readFileSync(__dirname + '/reporter.tpl').toString();
	var template = grunt.template.process;

	var helpers = require('./helpers');

	var ConsoleReporter = function(filenames, options) {
		this.options = options;
		this.tableLength = helpers.longestString(filenames);
	};

	ConsoleReporter.prototype = {

		maintainabilityMessage: function(filepath, valid, analysis) {
			var symbol = valid ? '\u2713'.green : '\u2717'.red;
			var bar = helpers.generateBar(analysis.maintainability, this.options.maintainability);
			var label = helpers.fitWhitespace(this.tableLength, filepath);

			return symbol + ' ' + label + bar;
		},

		complexity: function(filepath, complexFunctions) {
			complexFunctions.forEach(function(data) {
				data.filepath = filepath;

				var message = template(bodyTemplate, {
					data: data
				});

				this.log(message.yellow);

			}, this);
		},

		maintainability: function(filepath, valid, analysis) {
			var message = this.maintainabilityMessage(filepath, valid, analysis);
			this.log(message);
		},

		start: function() {
			this.log(' ');
		},

		finish: function() {},

		log: function(message, display) {
			message = message || '';
			grunt.log.writeln(message);
		}

	};


	return ConsoleReporter;
};
