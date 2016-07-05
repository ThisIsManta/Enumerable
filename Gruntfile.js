module.exports = function (grunt) {
	grunt.config.init({
		less: {
			demo: {
				options: {
					compress: true,
					plugins: [new (require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] })]
				},
				files: {
					'demo/index.css': 'demo/index.less'
				}
			}
		},
		watch: {
			demo: {
				options: {
					atBegin: true
				},
				tasks: ['compose'],
				files: ['*.js']
			},
			less: {
				options: {
					atBegin: true
				},
				files: ['demo/*.less'],
				tasks: ['less']
			},
			html: {
				options: {
					livereload: true
				},
				files: ['demo/*.*', '!demo/*.less']
			}
		}
	});

	grunt.task.loadNpmTasks('grunt-contrib-less');
	grunt.task.loadNpmTasks('grunt-contrib-watch');

	grunt.task.registerTask('compose', function () {
		var done = this.async();

		var repo = grunt.file.readJSON('package.json').repository.url;
		if (repo.endsWith('.git')) {
			repo = repo.substring(0, repo.length - 4);
		}
		repo += '/blob/master/Enumerable.js';

		require('./Enumerable.js');
		require('jsdom').env(grunt.file.read('demo/index.html'), function (errx, wind) {
			if (errx) {
				grunt.fail.fatal(errx);
			}

			var $ = require('jquery')(wind);

			var srcx = grunt.file.read('./Enumerable.js');

			var list = [];

			var base = srcx.substring(0, srcx.indexOf('{'));

			srcx = srcx.substring(srcx.indexOf('{') + 1, srcx.latchOf('{', '}'));

			var indx = -1;
			while ((indx = srcx.indexOf('/**', indx + 1)) >= 0) {
				var pivt = srcx.indexOf('*/', indx);

				var desc = srcx.substring(indx + 3, pivt).trim().split('\n').select(function (line) {
					return line.substring(line.indexOf('*') + 2);
				}).toString('\n');

				var tabc;
				var code = srcx.substring(pivt + 2, pivt + 2 + srcx.substring(pivt + 2).latchOf('{', '}') + 1).split('\n').skip(function (line) {
					return line.trim().length === 0;
				}).select(function (line, numb) {
					if (numb === 0) {
						tabc = line.match(/^\t*/)[0].length;
					}
					return line.substring(tabc);
				}).toString('\n');

				var name = code.match(/.*\s?=\s?function/)[0];
				name = name.substring(0, name.indexOf('=')).trim();

				list.push({
					name: name,
					desc: desc,
					code: code,
					line: (base + srcx.substring(0, pivt)).split('\n').length + 1
				});
			}

			var $menu = $('nav > ul').empty();
			var $main = $('main').empty();

			list.sortBy('name').groupBy(function (item) {
				return item.name.split('.').first();
			}).invoke(function (fami) {
				$('<h1><a name="' + fami.name.toLowerCase() + '"/>' + fami.name + '</h1>').appendTo($main); 
				fami.invoke(function (item) {
					var keys = item.name.split('.').select(function (keyx) {
						return (keyx + '-' + keyx.toKebabCase()).toLowerCase().split('-');
					}).flatten().norm();
					keys.addRange(($(item.desc).filter('meta[keywords]').attr('keywords') || '').toLowerCase().split(',').norm());
					keys = keys.distinct();

					var name = item.name.split('.');
					name[name.length - 1] = '<b>' + name[name.length - 1] + '</b>';
					name = name.join('.');
					$('<li data-keys="' + keys.join(',') + '"><a href="#' + item.name.toLowerCase() + '">' + name + '</a></li>').appendTo($menu);

					var $card = $(
						'<section>' +
						'<a name="' + item.name.toLowerCase() + '"/>' +
						'<h2>' +
						'<div>' + name + '</div>' +
						// '<i favs class="material-icons" title="Add to favorites">favorite_border</i>' +
						'<a view class="material-icons auto-hide" href="' + repo + '#L' + item.line + '" title="View source code">code</a>' +
						'</h2>' +
						item.desc +
						'</section>'
					);

					var $code = $card.find('code');
					$code.each(function () {
						var temp = '';
						var wait = false;
						var last;
						$(this).replaceWith('<code contenteditable="true" spellcheck="false">' + this.textContent.trim().split('\n').select(function (line) {
							var outp = '';
							if (/^var\s+\w+\s+=/.test(line) || /^\t/.test(line)) {
								temp += line;

							} else if (/({|\()$/.test(line)) {
								temp += 'last = ' + line;
								wait = true;

							} else if (/;$/.test(line)) {
								if (wait === true) {
									temp += line;
									wait = false;

								} else {
									temp += 'last = ' + line;
								}

								eval(temp);
								if (last === undefined) {
									last = 'undefined';

								} else if (last === null) {
									last = 'null';

								} else {
									last = JSON.stringify(last, null, '\t');
								}

								outp = '<br><s contenteditable="false">// ' + last + '</s>';
							}
							return line.replace(/^\t/, '&nbsp;&nbsp;') + outp;
						}).toString('<br>') + '</code>');
					});

					$card.appendTo($main);
				});
			});

			grunt.file.write('demo/index.html', '<html>' + $('html').html() + '</html>');

			done();
		});
	});

	grunt.task.registerTask('license', function (path) {
		var list = grunt.file.expand(path);
		list.forEach(function (path) {
			var file = grunt.file.read(path).trim();

			// Strips existing comments
			if (file.indexOf('/*') === 0) {
				file = file.substring(file.indexOf('*/') + 2).trim();
			}

			// Generates comments
			var data = grunt.file.readJSON('./package.json');
			var keys = ['name', 'version', 'author', 'license'];
			var vals = keys.filter(function (name) {
				return data[name];
			}).map(function (name) {
				return '@' + name + ' ' + data[name];
			});
			vals.push(data.repository.url);
			vals = vals.map(function (line) {
				return ' * ' + line;
			});
			vals.splice(0, 0, '/*');
			vals.push('*/');

			// Writes back
			grunt.file.write(path, vals.join('\n') + '\n' + file);
		});
	});
};