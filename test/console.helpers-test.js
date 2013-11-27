var ConsoleHelpers = require('../tasks/reporters/Console/helpers.js');
var expect = require('chai').expect;

describe("Utility methods", function() {

	describe("longestString", function() {

		it('should return longest string length from array', function() {
			var arr = ["abc", "asdff", "defg"];
			var longestLength = ConsoleHelpers.longestString(arr);
			expect(longestLength).to.equal(5);
		});

		it('should return 0 for empty array', function() {
			var arr = [];
			var longestLength = ConsoleHelpers.longestString(arr);
			expect(longestLength).to.equal(0);
		});
	});
});
