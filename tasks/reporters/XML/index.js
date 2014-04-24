module.exports = function(grunt) {

	var XMLReporter = function() {};
	var fs = require('fs-extra'),
			path = require('path');

	XMLReporter.prototype = {
		init: function(options, fileKey, dirname) {
			this.options = options;
			this.xmlFilename = options[fileKey];

			if(!this.xmlFilename) {
				throw new Error('Output filename not provided!');
			}

			this.dirname = dirname;
			this.tpl = this.getTpl();

			var outputDir = path.dirname(this.xmlFilename);

			if (outputDir !== '') {
				fs.mkdirpSync(outputDir);
			}

			fs.writeFileSync(this.xmlFilename, '');
		},

		readTpl: function(name) {
			return fs.readFileSync(this.dirname + '/' + name).toString();
		},

		getTpl: function() {
			return {
				opening: this.readTpl('opening.xml_'),
				ending: this.readTpl('ending.xml_'),
				violation: this.readTpl('violation.xml_')
			};
		},

		escape: function(message) {
			return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},

		write: function(message) {
			fs.appendFileSync(this.xmlFilename, message);
		},

		complexity: function(filepath, complexFunctions) {
			var message = grunt.template.process(this.tpl.violation, {
				data: {
					filepath: filepath,
					escape: this.escape,
					complexFunctions: complexFunctions
				}
			});

			this.write(message);
		},

		maintainability: function(filepath, valid, analysis) {
			// Maintainability is not written at all
		},

		start: function() {
			this.write(this.tpl.opening);
		},

		finish: function() {
			this.write(this.tpl.ending);
		}
	};

	return XMLReporter;
};
