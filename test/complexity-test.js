describe("Generic Sanity Check", function() {

	it ("can set up properly", function() {

		var grunt = require('grunt');

		// Load local tasks.
		grunt.loadTasks('tasks');

		exports['require'] = {

			setUp: function(done) {
				// setup here
				done();
			}

		};

	});

});
