# Grunt-Complexity

A [grunt](http://github.com/gruntjs/grunt/) task that utilizes
[complexity-report](https://github.com/philbooth/complexityReport.js)
to evaluate the complexity and maintainability of code.

## Versions

- Use version 0.0.7 for Grunt 0.3.x
- Use versions 0.1.x for Grunt 0.4.x

![screenshot](https://raw.github.com/vigetlabs/grunt-complexity/master/example.png)
![screenshot](https://raw.github.com/vigetlabs/grunt-complexity/master/complexity.png)

## Usage

```bash
npm install grunt-complexity --save
```

Within your grunt file:

```javascript
    // Project configuration.
	grunt.initConfig({

		complexity: {
			generic: {
				src: ['grunt.js', 'tasks/grunt-complexity.js'],
				options: {
					jsLintXML: 'report.xml', // create XML JSLint-like report
					checkstyleXML: 'checkstyle.xml', // create checkstyle report
					errorsOnly: false, // show only maintainability errors
					cyclomatic: 3,
					halstead: 8,
					maintainability: 100
				}
			}
		}


	});

	grunt.loadNpmTasks('grunt-complexity');
	grunt.registerTask('default', 'complexity');
```

## What is Cyclomatic and Halstead?

Documentation on this to come. For now, see [jscomplexity.org](http://jscomplexity.org/complexity)

## Contributing

This repo has a submodule, so after you `npm install`, you'll want to `git submodule init` and `git submodule update`.

Then, you should `cd test/grunt.0.4` and `npm install`.

## Contributors

- [Nate Hunzaker](https://github.com/nhunzaker)
- [Golo Roden](https://github.com/goloroden)
- [tomusdrw](https://github.com/tomusdrw)
- [averyvery](https://github.com/averyvery)
- [jzsfkzm](https://github.com/jzsfkzm)
