var Test = {
	run: function () {
		console.log('begin');
		var c = 0;
		for (var i in Test.cases) {
			try {
				var r = Test.cases[i].call();
				if (r !== undefined && r !== true)
					throw '';
			} catch (ex) {
				c += 1;
				if (ex === '')
					console.error('failed at test case #' + i);
				else
					console.error('failed at test case #' + i + '\n' + ex);
				console.debug(Test.cases[i]);
			}
		}
		console.log('done' + (c > 0 ? ' with ' + c + 'error' + (c > 1 ? 's' : '') : ' without any error'));
	},
	cases: [
		function () {
			var e = new Enumerable([1, 2, 3]);
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 2 && e.a[2] === 3;
		},
		function () {
			var d = new Enumerable([1, 2, 3]);
			var e = new Enumerable(d);
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 2 && e.a[2] === 3;
		},
		function () {
			var e = new Enumerable({ length: 3, "0": 1, "1": 2, "2": 3 });
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 2 && e.a[2] === 3;
		},
		function () {
			var e = new Enumerable({ "0": 1, "1": 2, "2": 3, "3": function () { }, "_4": 4 });
			return e.a.length === 3 && e.a[0].name === "0" && e.a[1].name === "1" && e.a[2].name === "2" && e.a[0].value === 1 && e.a[1].value === 2 && e.a[2].value === 3;
		},
		function () {
			var e = new Enumerable('123');
			return e.a.length === 3 && e.a[0] === '1' && e.a[1] === '2' && e.a[2] === "3";
		},
		function () {
			var e = new Enumerable('123', '2');
			return e.a.length === 2 && e.a[0] === '1' && e.a[1] === "3";
		},
		function () {
			var e = new Enumerable();
			return e.a.length === 0;
		},
		function () {
			try {
				var e = new Enumerable(null);
				return false;
			} catch (ex) {
				return true;
			}
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a);
			var z = e.toArray();
			return typeof z === 'object' && z instanceof Array && z.length === 3 && z[0] === 1 && z[1] === 2 && z[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var d = new Enumerable(a);
			var e = d.clone();
			e.a[1] = 4;
			return e.m === true && e.a[1] === 4 && d.a[1] === 2;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a);
			var z = e.toImmutableArray();
			z[1] = 4;
			return typeof z === 'object' && z instanceof Array && z[1] === 4 && a[1] === 2 && e.a[1] === 2;
		},
		function () {
			var e = new Enumerable().create(1, 3);
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 1 && e.a[1] === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).where(function (x) { return x <= 2; });
			return e.a.length === 2 && e.a[0] === 1 && e.a[1] === 2;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).where({ x: 2 });
			return e.a.length === 1 && e.a[0].x === 2;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).select(function (x) { return x * 2; });
			return e.a.length === 3 && e.a[0] === 2 && e.a[1] === 4 && e.a[2] === 6;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).select('x');
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 2 && e.a[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).replace(function (x) { return x === 2; }, 4);
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 4 && e.a[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var z = [];
			var e = new Enumerable(a).invoke(function (x) { z.push(x); });
			return z.length === 3 && z[0] === 1 && z[1] === 2 && z[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var z = [];
			var o = { f: function (x) { if (this === o) z.push(x); } };
			var e = new Enumerable(a).invoke(o.f, o);
			return z.length === 3 && z[0] === 1 && z[1] === 2 && z[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(function (x) { return x >= 2; });
			return e.a.length === 3 && e.a[0] === 1 && e.a[1] === 2 && e.a[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(1);
			return e.a.length === 2 && e.a[0] === 2 && e.a[1] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(1, 2);
			return e.a.length === 2 && e.a[0] === 1 && e.a[1] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(function (x) { return x >= 2; });
			return e.a.length === 0;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(1);
			return e.a.length === 1 && e.a[0] === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(1, 2);
			return e.a.length === 1 && e.a[0] === 2;
		},
	]

};