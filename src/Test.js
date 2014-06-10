var Test = {
	run: function () {
		for (var i in Test.cases) {
			console.log('running test case #' + i);
			var r = Test.cases[i].call();
			if (r !== undefined && r !== true) {
				console.error('failed');
			}
		}
		console.log('done');
	},
	cases: [
		function () {
			var e = new Enumerable([1, 2, 3]);
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 2 && e.a[2] === 3;
		},
		function () {

		},
	]

};