module.exports = function(grunt) {

  var fs = require('fs');
  var _ = require('underscore');

  var getTpl = function(name) {
      return fs.readFileSync(__dirname + '/' + name).toString();
    };

  var tpl = {
    opening: getTpl('opening.xml_'),
    ending: getTpl('ending.xml_'),
    violation: getTpl('violation.xml_')
  };

  var JSLintXMLReporter = function(filenames, options) {
      this.options = options;
      if(_.isUndefined(options.jsLintXML)) {
        throw new Error('Output filename not provided!');
      }
      fs.writeFileSync(options.jsLintXML, "");
    };

  JSLintXMLReporter.prototype = {
    write: function(message) {
      fs.appendFileSync(this.options.jsLintXML, message);
    },

    complexity: function(filepath, complexFunctions) {
      var message = grunt.template.process(tpl.violation, {
        data: {
          filepath: filepath,
          complexFunctions: complexFunctions
        }
      });
      this.write(message);
    },

    maintainability: function(filepath, valid, analysis) {
      // Maintainability is not written at all
    },

    start: function() {
      this.write(tpl.opening);
    },

    finish: function() {
      this.write(tpl.ending);
    }
  };


  return JSLintXMLReporter;
};