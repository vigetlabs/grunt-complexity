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

});

describe("Complexity task", function() {
	var grunt = require('./grunt.0.4');
	var cut = require('../tasks/complexity')(grunt);
	var expect = require('chai').expect;

	describe("isComplicated", function() {
		var data = {
			complexity: {
				cyclomatic: 5,
				halstead: {
					difficulty: 7
				}
			}
		};

		it('should return true if cyclomatic complexity is greater than in options', function() {
			// given
			var options = {
				cyclomatic: 3,
				halstead: 8
			};

			// when
			var isComplicated = cut.isComplicated(data, options);

			// then
			expect(isComplicated).to.equal(true);
		});

		it('should return true if halstead is greater than in options', function() {
			// given
			var options = {
				cyclomatic: 6,
				halstead: 3
			};

			// when
			var isComplicated = cut.isComplicated(data, options);

			// then
			expect(isComplicated).to.equal(true);
		});

		it('should return false if no metric is greater than in options', function() {
			// given
			var options = {
				cyclomatic: 6,
				halstead: 8
			};

			// when
			var isComplicated = cut.isComplicated(data, options);

			// then
			expect(isComplicated).to.equal(false);
		});
	});

	describe("isMaintainable", function() {
		var data = {
			maintainability: 120
		};

		it('should return true if maintainability is greater than in options', function() {
			// given
			var options = {
				maintainability: 100
			};

			// when
			var isMaintainable = cut.isMaintainable(data, options);

			// then
			expect(isMaintainable).to.equal(true);
		});

		it('should return false otherwise', function() {
			// given
			var options = {
				maintainability: 140
			};

			// when
			var isMaintainable = cut.isMaintainable(data, options);

			// then
			expect(isMaintainable).to.equal(false);
		});

	});

});