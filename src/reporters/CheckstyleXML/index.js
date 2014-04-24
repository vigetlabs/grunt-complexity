var XMLReporter = require('../XML');

var CheckstyleReporter = module.exports = function(filenames, options) {
	this.init(options, 'checkstyleXML', __dirname);
};

CheckstyleReporter.prototype = new XMLReporter();
