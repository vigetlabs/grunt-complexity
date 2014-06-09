module.exports = function(grunt) {
  'use strict';

  var EventReporter = function(filenames, options) {
    this.options = options;
  };

  EventReporter.prototype = {

    // only invoked when offending code was detected
    //
    complexity: function(filepath, complexFunctions) {
      // TODO
    },

    maintainability: function(filepath, valid, analysis) {
      grunt.event.emit('grunt-complexity.maintainability', {
        filepath: filepath,
        valid: valid,
        maintainability: analysis.maintainability
      });
    },

    start: function() {
      grunt.event.emit('grunt-complexity.start');
    },

    finish: function() {
      grunt.event.emit('grunt-complexity.finish');
    }
  };

  return EventReporter;
};
