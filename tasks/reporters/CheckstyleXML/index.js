module.exports = function(grunt, XMLReporter) {
	var checkstyleReporter = function(filenames, options) {
		this.init(options, 'checkstyleXML', __dirname);
	};

	checkstyleReporter.prototype = new XMLReporter();

	return checkstyleReporter;
};
