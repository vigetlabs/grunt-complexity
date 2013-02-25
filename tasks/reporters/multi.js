module.exports = function(grunt) {

  var MultiReporter = function(filenames, options) {
      this.filenames = filenames;
      this.options = options;
      this.reporters = [];
    };

  MultiReporter.prototype = {
    addReporter: function(ReporterConstructor) {
      this.reporters.push(new ReporterConstructor(this.filenames, this.options));
    },

    invoke: function(methodName, argumentsArray) {
      this.reporters.forEach(function(reporter) {
        reporter[methodName].apply(reporter, argumentsArray);
      });
    },

    complexity: function(filepath, complexFunctions) {
      this.invoke('complexity', [filepath, complexFunctions]);
    },

    maintainability: function(filepath, valid, analysis) {
      this.invoke('maintainability', [filepath, valid, analysis]);
    },

    start: function() {
      this.invoke('start', []);
    },

    finish: function() {
      this.invoke('finish', []);
    }
  };

  return MultiReporter;
};