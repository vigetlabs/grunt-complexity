var ConsoleHelpers = require('../tasks/reporters/Console/helpers.js');
var expect = require('chai').expect;

describe("Utility methods", function() {

  describe("longestString", function() {

    it('should return longest string length from array', function() {
      // given
      var arr = ["abc", "asdff", "defg"];
      // when
      var longestLength = ConsoleHelpers.longestString(arr);

      // then
      expect(longestLength).to.equal(5);
    });

    it('should return 0 for empty array', function() {
      // given
      var arr = [];

      // when
      var longestLength = ConsoleHelpers.longestString(arr);

      // then
      expect(longestLength).to.equal(0);
    });

  });
});