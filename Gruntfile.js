module.exports = function (grunt) {
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