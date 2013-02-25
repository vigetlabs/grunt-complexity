describe('JSLintXML', function() {
  var grunt = require('./grunt.0.4');
  var cut = require('../tasks/reporters/JSLintXML')(grunt);
  var expect = require('chai').expect;

  it('should escape html chars <>', function() {
    // given
    var esc = cut.prototype.escape;
    
    // when
    var ex1 = esc('<anonymous>');
    var ex2 = esc('p><d');

    // then
    expect(ex1).to.equal('&lt;anonymous&gt;');
    expect(ex2).to.equal('p&gt;&lt;d');
  });
});