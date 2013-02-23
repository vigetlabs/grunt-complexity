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