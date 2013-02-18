describe("Generic Sanity Check", function() {

	it("works with Grunt 0.4.x", function() {

		var grunt = require('./grunt.0.4');

		// Load local tasks.
		grunt.loadTasks('tasks');

		exports.require = {

			setUp: function(done) {
				// setup here
				done();
			}

		};

	});

	it("works with Grunt 0.3.x", function() {

		var grunt = require('./grunt.0.3');

		// Load local tasks.
		grunt.loadTasks('tasks');

		exports.require = {

			setUp: function(done) {
				// setup here
				done();
			}

		};

	});

});
var grunt = require('./grunt.0.4');
var Complexity = require('../tasks/complexity.js')(grunt);
var expect = require('chai').expect;

describe("Utility methods", function() {

	describe("longestString", function() {

		it('should return longest string length from array', function() {
			// given
			var arr = ["abc", "asdff", "defg"];
			// when
			var longestLength = Complexity.longestString(arr);

			// then
			expect(longestLength).to.equal(5);
		});

		it('should return 0 for empty array', function() {
			// given
			var arr = [];

			// when
			var longestLength = Complexity.longestString(arr);

			// then
			expect(longestLength).to.equal(0);
		});

	});
});