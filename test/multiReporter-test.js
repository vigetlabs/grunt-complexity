describe('MultiReporter', function() {
	var grunt = require('./grunt.0.4');
	var MultiReporter = require('../src/reporters/multi')(grunt);
	var expect = require('chai').expect;

	it ('should create object and pass filenames and options', function() {
		var actual = {};
		var expected = {
			filenames: "Abc",
			options: "xyz"
		};

		var Reporter = function(filenames, options) {
			actual.filenames = filenames;
			actual.options = options;
		};

		var reporter = new MultiReporter(expected.filenames, expected.options);
		reporter.addReporter(Reporter);
		expect(actual).to.deep.equal(expected);
	});

	it ('should call given method on all reporters', function() {
		var i = 0;
		var methodCalled = [false, false];
		var Reporter = function() {
			this.someMethod = function() {
				methodCalled[this] = true;
			}.bind(i);

			i += 1;
		};

		var reporter = new MultiReporter();

		reporter.addReporter(Reporter);
		reporter.addReporter(Reporter);

		reporter.invoke('someMethod');

		expect(methodCalled[0]).to.equal(true);
		expect(methodCalled[1]).to.equal(true);
	});

});
