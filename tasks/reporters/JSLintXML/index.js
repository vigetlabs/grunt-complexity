module.exports = function(grunt) {

  var fs = require('fs');

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
      if(!options.jsLintXML) {
        throw new Error('Output filename not provided!');
      }
      fs.writeFileSync(options.jsLintXML, "");
    };

  JSLintXMLReporter.prototype = {
    escape: function(message) {
      return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    write: function(message) {
      fs.appendFileSync(this.options.jsLintXML, message);
    },

    complexity: function(filepath, complexFunctions) {
      var message = grunt.template.process(tpl.violation, {
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
      this.write(tpl.opening);
    },

    finish: function() {
      this.write(tpl.ending);
    }
  };


  return JSLintXMLReporter;
};