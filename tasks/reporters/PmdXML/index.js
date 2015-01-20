module.exports = function(grunt, XMLReporter) {
	var pmdReporter = function(filenames, options) {
		this.init(options, 'pmdXML', __dirname);
	};

	pmdReporter.prototype = new XMLReporter();

	return pmdReporter;
};
