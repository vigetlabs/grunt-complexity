describe('MultiReporter', function() {
  var grunt = require('./grunt.0.4');
  var MultiReporter = require('../tasks/reporters/multi')(grunt);
  var expect = require('chai').expect;

  it('should create object and pass filenames and options', function() {
    // given
    var actual = {};
    var expected = {
      filenames: "Abc",
      options: "xyz"
    };
    var Reporter = function(filenames, options) {
        actual.filenames = filenames;
        actual.options = options;
      };

    // when
    var reporter = new MultiReporter(expected.filenames, expected.options);
    reporter.addReporter(Reporter);

    // then
    expect(actual).to.deep.equal(expected);
  });

  it('should call given method on all reporters', function() {
    // given
    var i = 0;
    var methodCalled = [false, false];
    var Reporter = function() {
        this.someMethod = function() {
          methodCalled[this] = true;
        }.bind(i);
        
        //increment
        i += 1;
      };
    var reporter = new MultiReporter();
    reporter.addReporter(Reporter);
    reporter.addReporter(Reporter);

    // when
    reporter.invoke('someMethod');

    // then
    expect(methodCalled[0]).to.equal(true);
    expect(methodCalled[1]).to.equal(true);
  });

});