describe('JSLintXML', function() {
	var grunt  = require('./grunt.0.4');
	var cut    = require('../src/reporters/XML')(grunt);
	var expect = require('chai').expect;

	it ('should escape html chars <>', function() {
		var esc = cut.prototype.escape;
		var ex1 = esc('<anonymous>');
		var ex2 = esc('p><d');

		expect(ex1).to.equal('&lt;anonymous&gt;');
		expect(ex2).to.equal('p&gt;&lt;d');
	});
});
