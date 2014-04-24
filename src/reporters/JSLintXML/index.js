var XMLReporter = require('../XML');

var JSLintXMLReporter = module.exports = function(filenames, options) {
	this.init(options, 'jsLintXML', __dirname);
};

JSLintXMLReporter.prototype = new XMLReporter();
