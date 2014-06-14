/*
 A reporter that broadcasts data the aggregated
 by grunt-complexity over the grunt event-bus.

 author:  David Linse
 version: 0.0.1
 license: MIT

 It emits the following "complex"-namespaced events:

   * grunt-complexity.start
   * grunt-complexity.maintainability
   * grunt-complexity.complexity (TBD)
   * grunt-complexity.finish

 */

module.exports = function(grunt) {
  'use strict';

  var EventReporter = function(filenames, options) {
    this.options = options;
  };

  EventReporter.prototype = {

    // only invoked when offending code was detected
    //
    complexity: function(filepath, complexFunctions) {

      //
      // A possible workaround could be to 'force' a run
      // w/ all metrics set to it's minimum and 'breakOnError' option
      // set to 'false'

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
