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
				exclude: ['doNotTest.js'],
				options: {
					breakOnErrors: true,
					jsLintXML: 'report.xml',         // create XML JSLint-like report
					checkstyleXML: 'checkstyle.xml', // create checkstyle report
					errorsOnly: false,               // show only maintainability errors
					cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
					halstead: [8, 13, 20],           // or optionally a single value, like 8
					maintainability: 100,
					hideComplexFunctions: false      // only display maintainability
					broadcast: false                 // broadcast data over event-bus
				}
			}
		}


	});

	grunt.loadNpmTasks('grunt-complexity');
	grunt.registerTask('default', 'complexity');
```

## What is Cyclomatic and Halstead?

Documentation on this to come. For now, see [jscomplexity.org](http://jscomplexity.org/complexity)

## Reporter

Set the `broadcast` option to `true` to send the aggregated data over the
grunt-event bus.

Emitted events are:

* `grunt-complexity.start`
* `grunt-complexity.maintainability, payload`
* `grunt-complexity.end`

```js
// payload of grunt-complexity.maintainability
{
  filepath: /path/to/file,
  valid: true|false,
  maintainability: 123.42
}
```

## Contributing

This repo has a submodule, so after you `npm install`, you'll want to `git submodule init` and `git submodule update`.

Then, you should `cd test/grunt.0.4` and `npm install`.

Tests can be run with `mocha`.

## License

`grunt-complexity` is released under the [MIT License](http://opensource.org/licenses/MIT).

## Contributors

- Nate Hunzaker([nhunzaker](https://github.com/nhunzaker))
- Golo Roden ([goloroden](https://github.com/goloroden))
- Tomasz Drwięga ([tomusdrw](https://github.com/tomusdrw))
- Doug Avery ([averyvery](https://github.com/averyvery))
- Jozsef Kozma ([jzsfkzm](https://github.com/jzsfkzm))
- Patrick Williams [(pwmckenna](https://github.com/pwmckenna))
- Luís Couto ([Couto](https://github.com/Couto))
- Roman Liutikov ([roman01la](https://github.com/roman01la))
- Nick Weingartner ([streetlight](https://github.com/streetlight))
- David Linse ([davidlinse](https://github.com/davidlinse))
