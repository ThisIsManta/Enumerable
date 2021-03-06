module.exports = function (grunt) {
	grunt.config.init({
		less: {
			demo: {
				options: {
					compress: true,
					plugins: [new (require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] })]
				},
				files: [{
					expand: true,
					src: ['./*.less', 'demo/*.less'],
					ext: '.css'
				}]
			}
		},
		watch: {
			main: {
				options: {
					atBegin: true
				},
				files: ['*.js'],
				tasks: ['compose']
			},
			less: {
				options: {
					atBegin: true
				},
				files: ['./*.less', 'demo/*.less'],
				tasks: ['less']
			},
			html: {
				options: {
					livereload: true
				},
				files: ['./*.html', './*.css', './*.js', '*/*.html', '*/*.css', '*/*.js']
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
		repo += '/blob/master/Enumerable-src.js';

		require('./Enumerable-src.js');
		require('jsdom').env(grunt.file.read('demo/index.html'), function (errx, wind) {
			if (errx) {
				grunt.fail.fatal(errx);
			}

			var $ = require('jquery')(wind);

			var srcx = grunt.file.read('./Enumerable-src.js');

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

				var name = code.match(/.*\s?=\s?/)[0];
				name = name.substring(0, name.indexOf('=')).trim();

				list.push({
					name: name,
					desc: desc,
					code: code,
					line: (base + srcx.substring(0, pivt)).split('\n').length + 1
				});
			}

			var $menu = $('nav ul').empty();
			var $main = $('main').empty();

			var funk = function (data) {
				if (Object.isObject(data)) {
					data = Object.clone(data);
					for (var name in data) {
						if (typeof data[name] === 'function' && data.hasOwnProperty(name)) {
							data[name] = '@fx';

						} else if (typeof data[name] === 'object') {
							data[name] = funk(data[name]);
						}
					}
				}
				return data;
			};

			var tran = function (data) {
				if (data === undefined) {
					return 'undefined';

				} else if (data === null) {
					return 'null';

				} else if (typeof data === 'string') {
					return '\'' + data + '\'';

				} else {
					return JSON.stringify(funk(data), null, ' ').replace(/"@fx"/g, 'function').replace(/\[(\n|\s)+/g, '[').replace(/(\n|\s)+\]/g, ']').replace(/\"([^"]+)\":/g, '$1:');
				}
			};

			list.sortBy(function (item) {
				if (item.name.contains('.prototype.')) {
					return item.name.substring(0, item.name.lastIndexOf('.') + 2);

				} else {
					return item.name;
				}
			}).groupBy(function (item) {
				return item.name.split('.').first();
			}).invoke(function (fami) {
				$('<hr data-fami="' + fami.name + '">').appendTo($menu);
				$('<h1><a name="' + fami.name.toLowerCase() + '"/>' + fami.name + '</h1>').appendTo($main);

				fami.invoke(function (item) {
					var keys = item.name.split('.').select(function (keyx) {
						return (keyx + '-' + keyx.toTrainCase()).toLowerCase().split('-');
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
						var buff = '';
						var wait = false;
						var varx = false;
						var temp;

						$(this).replaceWith('<code contenteditable="true" spellcheck="false">' + Array.create(this.childNodes).select(function (node) {
							if (node.nodeType === 8) { // In case of comments
								return node.textContent.split('\n').select(function (line) {
									line = line.toEncodedXML();
									if (line.startsWith('\t')) {
										line = line.replace(/\t/g, '&nbsp;&nbsp;');
									}
									if (line.contains('//')) {
										line = line.replace('//', '<s contenteditable="false">//') + '</s>';
									}
									return line;
								});

							} else {
								return node.textContent.split('\n').select(function (line) {
									var outp = '';

									if (/^var\s+\w+\s*=/.test(line) || /^\w+(\.\w+)*\s*=\s*/.test(line)) {
										buff += line;
										if (!/;$/.test(line)) {
											varx = true;
										}

									} else if (varx === true) {
										buff += line;
										if (!/^\t/.test(line) && /;$/.test(line)) {
											varx = false;
										}

									} else if (/^\t/.test(line)) {
										buff += line;

									} else if (/[\[\({,]$/.test(line)) {
										buff += 'temp = ' + line;
										wait = true;

									} else if (/;$/.test(line)) {
										var last;
										if (wait === true) {
											last = line;
											buff += last;
											wait = false;

										} else {
											last = 'temp = ' + line;
											buff += last;
										}

										var _log = console.log;
										var _out = [];
										console.log = function (argx) {
											_out.push(tran(argx));
										};

										try {
											eval(buff);

										} catch (ex) {
											temp = ex;
											buff = buff.substring(0, buff.length - last.length);
										}

										console.log = _log;

										if (_out.length > 0) {
											temp = _out.select(function (itm) {
												return itm.toEncodedXML();
											}).join('<br>// ');
											buff += '_out = [];';

										} else if (temp instanceof Error) {
											temp = 'Throws "' + temp.message + '"';

										} else {
											temp = tran(temp).toEncodedXML();
										}

										outp = '<br><s contenteditable="false">// ' + temp + '</s>';
									}

									if (line.contains('//')) {
										line = line.replace('//', '<s contenteditable="false">//') + '</s>';
									}

									return line.replace(/&/g, '&amp;').replace(/\t/g, '&nbsp;&nbsp;') + outp;
								});
							}
						}).flatten().where(function (line, indx, full) {
							return !(line.trim() === '' && (indx === 0 || indx === full.length - 1 || full[indx - 1].trim() === ''));
						}).join('<br>') + '</code>');
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

	grunt.task.registerTask('version', function () {
		var vers = grunt.file.readJSON('package.json').version;
		var html = grunt.file.read('index.html');
		var strt = html.indexOf('>', html.indexOf('id="version"')) + 1;
		var stop = html.indexOf('<', strt);
		html = html.substring(0, strt) + 'v' + vers + html.substring(stop);
		grunt.file.write('index.html', html);
	});
};