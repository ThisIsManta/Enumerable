$(document).ready(function () {
	$.get('Enumerable.js').then(function (full) {
		eval(full);

		var list = [];

		full = full.substring(full.indexOf('{') + 1, full.latchOf('{', '}'));

		var indx = -1;
		while ((indx = full.indexOf('/**', indx + 1)) >= 0) {
			var pivt = full.indexOf('*/', indx);

			var desc = full.substring(indx + 3, pivt).trim().split('\n').select(function (line) {
				return line.substring(line.indexOf('*') + 2);
			}).toString('\n');

			var tabc;
			var code = full.substring(pivt + 2, pivt + 2 + full.substring(pivt + 2).latchOf('{', '}') + 1).split('\n').skip(function (line) {
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
				code: code
			});
		}

		list.sortBy('name').groupBy(function (item) {
			return item.name.split('.').first();
		}).invoke(function (fami) {
			$('<h1>' + fami.name + '</h1>').appendTo('main > div');
			fami.invoke(function (item) {
				var name = item.name.split('.');
				name[name.length - 1] = '<b>' + name[name.length - 1] + '</b>';
				name = name.join('.');
				$('<li><a>' + name + '</a></li>').data('item', item).appendTo('nav ul');

				var $sect = $('<section>' + item.desc + '</section>');
				$sect.prepend('<h2><a name="' + item.name.toLowerCase() + '">' + name + '</a></h2>');

				var $code = $sect.find('code');
				$code.each(function () {
					this.contentEditable = true;
					this.spellcheck = false;
					var temp = '';
					var wait = false;
					var last;
					this.innerHTML = this.textContent.trim().split('\n').select(function (line) {
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

							console.debug(temp);
							eval(temp);
							if (last === undefined) {
								last = 'undefined';

							} else if (last === null) {
								last = 'null';

							} else {
								last = JSON.stringify(last, null, '\t');
							}

							outp = '<br><span contenteditable="false">// ' + last + '</span>';
						}
						return line.replace(/^\t/, '&nbsp;&nbsp;') + outp;
					}).toString('<br>');
				});

				$sect.appendTo('main > div');
			});
		});
	});
});