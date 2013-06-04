module.exports = function(grunt, XMLReporter) {
  var JSLintXMLReporter = function(filenames, options) {
    this.init(options, 'jsLintXML', __dirname);
  };

  JSLintXMLReporter.prototype = new XMLReporter();

  return JSLintXMLReporter;
};
