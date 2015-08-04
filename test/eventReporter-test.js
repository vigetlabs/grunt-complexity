describe('Event Reporter', function() {
	var expect = require('chai').expect;
	var grunt = require('./grunt.0.4');

	var Complexity = require('../tasks/complexity')(grunt);
	var EventReporter = require('../tasks/reporters/event-reporter')(grunt);

	it ('triggers a maintainability event', function(done) {
		var targetFile = __dirname + '/fixtures/sample.js';
		var reporter   = Complexity.buildReporter([targetFile], { broadcast: true });

		grunt.event.on('grunt-complexity.maintainability', function(report) {
			expect(report.filepath).to.equal(targetFile);
			expect(report.valid).to.equal(true);
			done();
		});

		Complexity.analyze(reporter, [targetFile], Complexity.normalizeOptions({
			maintainability: 0
		}));
	});
});
