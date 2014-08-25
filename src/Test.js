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
		console.log('done' + (c > 0 ? ' with ' + c + ' error' + (c > 1 ? 's' : '') : ' without any error'));
	},
	cases: [
		function () {
			var e = new Enumerable([1, 2, 3]);
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var d = new Enumerable([1, 2, 3]);
			var e = new Enumerable(d);
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var e = new Enumerable({ length: 3, "0": 1, "1": 2, "2": 3 });
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var e = new Enumerable({ "0": 1, "1": function () { }, "_2": 4 });
			return e._a.length === 1 && e._a[0].name === "0" && e._a[0].value === 1;
		},
		function () {
			var e = new Enumerable({ "0": 1, "1": function () { }, "_2": 4 }, true);
			return e._a.length === 3 && e._a[0].name === "0" && e._a[0].value === 1 && e._a[1].name === "1" && typeof e._a[1].value === 'function' && e._a[2].name === "_2" && e._a[2].value === 4;
		},
		function () {
			var e = new Enumerable({ "0": 1 }, 'k');
			return e._a.length === 1 && e._a[0].k === "0" && e._a[0].value === 1;
		},
		function () {
			var e = new Enumerable({ "0": 1 }, 'k', 'v');
			return e._a.length === 1 && e._a[0].k === "0" && e._a[0].v === 1;
		},
		function () {
			var e = new Enumerable('123');
			return e._a.length === 3 && e._a[0] === '1' && e._a[1] === '2' && e._a[2] === "3";
		},
		function () {
			var e = new Enumerable('123', '2');
			return e._a.length === 2 && e._a[0] === '1' && e._a[1] === "3";
		},
		function () {
			var e = new Enumerable();
			return e._a.length === 0;
		},
		function () {
			try {
				var e = new Enumerable(undefined);
				return false;
			} catch (ex) {
				return true;
			}
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
			var e = new Enumerable([1, 2, 3]);
			var z = e.toArray();
			return typeof z === 'object' && z instanceof Array && z.length === 3 && z[0] === 1 && z[1] === 2 && z[2] === 3;
		},
		function () {
			var a = ['a', 'b', 'c'];
			var e = new Enumerable(a);
			var z = e.toString();
			return typeof z === 'string' && z === 'abc';
		},
		function () {
			var e = new Enumerable(['a', 'b', 'c']);
			var z = e.toString(' ');
			return typeof z === 'string' && z === 'a b c';
		},
		function () {
			var e = new Enumerable([1, 2, 3]);
			var z = e.toObject();
			return typeof z === 'object' && z['0'] === 1 && z['1'] === 2 && z['2'] === 3;
		},
		function () {
			var a = [{ i: 1 }, { i: 2 }, { i: 3 }];
			var e = new Enumerable(a);
			var z = e.toObject('i');
			return typeof z === 'object' && z['1'] === a[0] && z['2'] === a[1] && z['3'] === a[2];
		},
		function () {
			var a = [{ i: 1 }, { i: 2 }, { i: 3 }];
			var e = new Enumerable(a);
			var z = e.toObject(function (x, i) { return 'x' + i; });
			return typeof z === 'object' && z['x0'] === a[0] && z['x1'] === a[1] && z['x2'] === a[2];
		},
		function () {
			var a = [{ i: 1 }, { i: 2 }, { i: 3 }];
			var e = new Enumerable(a);
			var z = e.toObject(function (x, i) { return 'x' + i; }, 'i');
			return typeof z === 'object' && z['x0'] === 1 && z['x1'] === 2 && z['x2'] === 3;
		},
		function () {
			var e = new Enumerable([1, 2, 3]);
			var z = e.toObject(function (x, i) { return 'x' + i; }, function (x) { return x * 2; });
			return typeof z === 'object' && z['x0'] === 2 && z['x1'] === 4 && z['x2'] === 6;
		},
		function () {
			var a = [1, 2, 3];
			var d = new Enumerable(a);
			var e = d.clone();
			e._a[1] = 4;
			return e._m === true && e._a[1] === 4 && d._a[1] === 2;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a);
			var z = e.toImmutableArray();
			z[1] = 4;
			return typeof z === 'object' && z instanceof Array && z[1] === 4 && a[1] === 2 && e._a[1] === 2;
		},
		function () {
			var e = new Enumerable(3);
			return e._a.length === 3 && e._a[0] === undefined && e._a[1] === undefined && e._a[2] === undefined;
		},
		function () {
			var e = new Enumerable(3, 1);
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 1 && e._a[2] === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).where(function (x) { return x <= 2; });
			return e._a.length === 2 && e._a[0] === 1 && e._a[1] === 2;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).where({ x: 2 });
			return e._a.length === 1 && e._a[0].x === 2;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).select(function (x) { return x * 2; });
			return e._a.length === 3 && e._a[0] === 2 && e._a[1] === 4 && e._a[2] === 6;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).select('x');
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).select(function (x) { return x % 2 === 1; }, function (x) { return x * 2; });
			return e._a.length === 2 && e._a[0] === 2 && e._a[1] === 6;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).select({ x: 2 }, function (x) { return x.x * 2; });
			return e._a.length === 1 && e._a[0] === 4;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).select(function (x) { return x.x % 2 === 1; }, 'x');
			return e._a.length === 2 && e._a[0] === 1 && e._a[1] === 3;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).select({ x: 2 }, 'x');
			return e._a.length === 1 && e._a[0] === 2;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).replace(function (x) { return x === 2; }, 4);
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 4 && e._a[2] === 3;
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
			var o = {};
			var e = new Enumerable(a, o).invoke(function (x) { if (this === o) z.push(x); });
			return z.length === 3 && z[0] === 1 && z[1] === 2 && z[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(function (x) { return x >= 2; });
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(Infinity);
			return e._a.length === 0;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(Number.MAX_VALUE);
			return e._a.length === 0;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(1);
			return e._a.length === 2 && e._a[0] === 2 && e._a[1] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).skip(1, 2);
			return e._a.length === 2 && e._a[0] === 1 && e._a[1] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(function (x) { return x >= 2; });
			return e._a.length === 0;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(Infinity);
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(Number.MAX_VALUE);
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(1);
			return e._a.length === 1 && e._a[0] === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).take(1, 2);
			return e._a.length === 1 && e._a[0] === 2;
		},
		function () {
			var a = [[1, 2, 3], [4, 5, [6, 7]]];
			var e = new Enumerable(a).flatten();
			return e._a.length === 6 && e._a[0] === 1 && e._a[5][0] === 6;
		},
		function () {
			var a = [[1, 2, 3], [4, 5, [6, 7]]];
			var e = new Enumerable(a).flatten(true);
			return e._a.length === 7 && e._a[0] === 1 && e._a[5] === 6;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).any();
			return e === true;
		},
		function () {
			var a = [];
			var e = new Enumerable(a).any();
			return e === false;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).any(function (x) { return x === 2; });
			return e === true;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).any(function (x) { return x === 4; });
			return e === false;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).any(2);
			return e === true;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).any(4);
			return e === false;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).all(1);
			return e === false;
		},
		function () {
			var a = [1, 1, 1];
			var e = new Enumerable(a).all(1);
			return e === true;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).all(function (x) { return typeof x === 'string'; });
			return e === false;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).all(function (x) { return typeof x === 'number'; });
			return e === true;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).isSubsetOf([1, 3]);
			return e === true;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).isSubsetOf([1, 4]);
			return e === false;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).isEquivalentTo([2, 3, 1]);
			return e === true;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).isEquivalentTo([2, 3, 4]);
			return e === false;
		},
		function () {
			var a = [{ v: 1 }, { v: 2 }, { v: 3 }];
			var e = new Enumerable(a).isEquivalentTo([{ v: 3 }, { v: 1 }, { v: 2 }], function (x, y) { return x.v === y.v; });
			return e === true;
		},
		function () {
			var a = [{ v: 1 }, { v: 2 }, { v: 3 }];
			var e = new Enumerable(a).isEquivalentTo([{ v: 1 }, { v: 1 }, { v: 2 }], function (x, y) { return x.v === y.v; });
			return e === false;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).indexOf(2);
			return e === 1;
		},
		function () {
			var a = [1, 2, 3, 2];
			var e = new Enumerable(a).indexOf(2);
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).indexOf(4);
			return e === -1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).indexOf(2, 1);
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).indexOf(1, 2);
			return e === -1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).indexOf(function (x) { return x % 2 === 0; });
			return e === 1;
		},
		function () {
			var a = [1, 3, 5];
			var e = new Enumerable(a).indexOf(function (x) { return x % 2 === 0; });
			return e === -1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).lastIndexOf(2);
			return e === 1;
		},
		function () {
			var a = [1, 2, 3, 2];
			var e = new Enumerable(a).lastIndexOf(2);
			return e === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).lastIndexOf(4);
			return e === -1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).lastIndexOf(2, 1);
			return e === -1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).lastIndexOf(1, 2);
			return e === 0;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).lastIndexOf(function (x) { return x % 2 === 0; });
			return e === 1;
		},
		function () {
			var a = [1, 3, 5];
			var e = new Enumerable(a).lastIndexOf(function (x) { return x % 2 === 0; });
			return e === -1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).contains(2);
			return e === true;
		},
		function () {
			var a = [{ x: 1 }, { x: 2 }, { x: 3 }];
			var e = new Enumerable(a).find('x', 2);
			return e.x === 2;
		},
		function () {
			var a = [];
			var e = new Enumerable(a).firstOrNull();
			return e === null;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).firstOrNull();
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).firstOrNull(2);
			return e === 2;
		},
		function () {
			var a = [];
			try {
				var e = new Enumerable(a).first();
				return false;
			} catch (ex) {
				return true;
			}
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).first();
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).first(2);
			return e === 2;
		},
		function () {
			var a = [];
			var e = new Enumerable(a).lastOrNull();
			return e === null;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).lastOrNull();
			return e === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).lastOrNull(2);
			return e === 2;
		},
		function () {
			var a = [];
			try {
				var e = new Enumerable(a).last();
				return false;
			} catch (ex) {
				return true;
			}
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).last();
			return e === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).last(2);
			return e === 2;
		},
		function () {
			var a = [];
			var e = new Enumerable(a).singleOrNull();
			return e === null;
		},
		function () {
			var a = [1];
			var e = new Enumerable(a).singleOrNull();
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).singleOrNull();
			return e === null;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).singleOrNull(2);
			return e === 2;
		},
		function () {
			var a = [];
			try {
				var e = new Enumerable(a).single();
				return false;
			} catch (ex) {
				return true;
			}
		},
		function () {
			var a = [1];
			var e = new Enumerable(a).single();
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			try {
				var e = new Enumerable(a).single();
				return false;
			} catch (ex) {
				return true;
			}
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).single(2);
			return e === 2;
		},
		function () {
			var a = [1, 2, 3, 2, 2, 2, 3];
			var e = new Enumerable(a).distinct();
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var a = [{ v: 1 }, { v: 2 }, { v: 1 }, {}];
			var e = new Enumerable(a).distinct('v');
			return e._a.length === 3 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2] === undefined;
		},
		function () {
			var a = [1, 2, 3, 2, 2, 2, 3];
			var e = new Enumerable(a).distinct(function (x) { return x % 2; });
			return e._a.length === 2 && e._a[0] === 1 && e._a[1] === 2;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).add(4);
			return e._a.length === 4 && e._a[3] === 4;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).add(4, 1);
			return e._a.length === 4 && e._a[1] === 4;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).addRange([4]);
			return e._a.length === 4 && e._a[3] === 4;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).addRange([4], 1);
			return e._a.length === 4 && e._a[1] === 4;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).addRange([4, 5, 6], 1);
			return e._a.length === 6 && e._a[1] === 4 && e._a[2] === 5 && e._a[3] === 6;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).remove(2);
			return e._a.length === 2 && e._a[0] === 1 && e._a[1] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).removeAt(1);
			return e._a.length === 2 && e._a[0] === 1 && e._a[1] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).removeRange([1, 3]);
			return e._a.length === 1 && e._a[0] === 2;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).union([2, 3, 4]);
			return e._a.length === 4 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3 && e._a[3] === 4;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).intersect([2, 3, 4]);
			return e._a.length === 2 && e._a[0] === 2 && e._a[1] === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).difference([2, 3, 4]);
			return e._a.length === 1 && e._a[0] === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).reverse();
			return e._a.length === 3 && e._a[0] === 3 && e._a[1] === 2 && e._a[2] === 1;
		},
		function () {
			var a = [3, 1, 2];
			var e = new Enumerable(a).sort();
			return e._a.length === 3 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3;
		},
		function () {
			var a = ['c', 'a', 'b'];
			var e = new Enumerable(a).sortBy();
			return e._a.length === 3 && e._a[0] === 'a' && e._a[1] === 'b' && e._a[2] === 'c';
		},
		function () {
			var a = [{ v: 3 }, { v: 1 }, { v: 2 }];
			var e = new Enumerable(a).sortBy('v');
			return e._a.length === 3 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2].v === 3;
		},
		function () {
			var a = [{ v: 3 }, { v: 1 }, { v: 2 }];
			var e = new Enumerable(a).sortBy(function (x) { return x.v; });
			return e._a.length === 3 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2].v === 3;
		},
		function () {
			var a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			var e = new Enumerable(a).groupBy('g');
			return e[1]._a.length === 2 && e[1]._a[0].v === 1 && e[1]._a[1].v === 2 && e[2]._a.length === 1 && e[2]._a[0].v === 3;
		},
		function () {
			var a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			var e = new Enumerable(a).groupBy(function (x) { return x.g; });
			return e[1]._a.length === 2 && e[1]._a[0].v === 1 && e[1]._a[1].v === 2 && e[2]._a.length === 1 && e[2]._a[0].v === 3;
		},
		function () {
			var a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			var e = new Enumerable(a).joinBy([{ v: 4, g: 1 }], 'g');
			return e._a.length === 3 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2].v === 3;
		},
		function () {
			var a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			var e = new Enumerable(a).joinBy([{ v: 4, g: 2, t: 1 }], function (x) { return x.g; });
			return e._a.length === 3 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2].v === 3;
		},
		function () {
			var a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			var e = new Enumerable(a).joinBy([{ v: 4, g: 2, t: 1 }], 'g', true);
			return e._a.length === 3 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2].v === 4 && e._a[2].t === 1;
		},
		function () {
			var a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			var e = new Enumerable(a).joinBy([{ v: 4, g: 2, t: 1 }], function (x) { return x.g; }, true);
			return e._a.length === 3 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2].v === 4 && e._a[2].t === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).count();
			return e === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).countBy(function (x) { return x === 2; });
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).countBy(1);
			return e === 1;
		},
		function () {
			var a = [1, 1, 1];
			var e = new Enumerable(a).min();
			return e === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).min();
			return e === 1;
		},
		function () {
			var a = [{ v: 1, t: 3 }, { v: 2, t: 1 }, { v: 3, t: NaN }];
			var e = new Enumerable(a).min('t');
			return e.v === 2;
		},
		function () {
			var a = [{ v: 1, t: 3 }, { v: 2, t: 1 }, { v: 3, t: NaN }];
			var e = new Enumerable(a).min(function (x) { return x.t; });
			return e.v === 2;
		},
		function () {
			var a = [3, 3, 3];
			var e = new Enumerable(a).max();
			return e === 3;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).max();
			return e === 3;
		},
		function () {
			var a = [{ v: 1, t: 3 }, { v: 2, t: 1 }, { v: 3, t: NaN }];
			var e = new Enumerable(a).max('t');
			return e.v === 1;
		},
		function () {
			var a = [{ v: 1, t: 3 }, { v: 2, t: 1 }, { v: 3, t: NaN }];
			var e = new Enumerable(a).max(function (x) { return x.t; });
			return e.v === 1;
		},
		function () {
			var a = [1, 2, 2, 3, 3, 2];
			var e = new Enumerable(a).mod();
			return e === 2;
		},
		function () {
			var a = [{ v: 1, t: 1 }, { v: 2, t: 1 }, { v: 3, t: 2 }];
			var e = new Enumerable(a).mod('t');
			return e.v === 1;
		},
		function () {
			var a = [{ v: 1, t: 1 }, { v: 2, t: 1 }, { v: 3, t: 2 }];
			var e = new Enumerable(a).mod(function (x) { return x.t; });
			return e.v === 1;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).sum();
			return e === 6;
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).avg();
			return e === 2;
		},
		function () {
			var e = new Enumerable([1]).interpolate('a<%=x%>b<%=x+1%>c<%=y%>', { x: 1, y: function () { return this.x + 1 + arguments.length; } });
			return e === 'a1b2c3';
		},
		function () {
			var a = [undefined, 1, null, 2, NaN, 3, Infinity, 'x'];
			var e = new Enumerable(a).norm();
			return e._a.length === 4 && e._a[0] === 1 && e._a[1] === 2 && e._a[2] === 3 && e._a[3] === 'x';
		},
		function () {
			var a = [{}, { v: 1 }, { v: null }, { v: 2 }, { v: NaN }, { v: 3 }, { v: Infinity }, { v: 'x' }];
			var e = new Enumerable(a).norm(function (x) { return x.v; });
			return e._a.length === 4 && e._a[0].v === 1 && e._a[1].v === 2 && e._a[2].v === 3 && e._a[3].v === 'x';
		},
		function () {
			var a = [1, 2, 3];
			var e = new Enumerable(a).define('test', function (x) { return this._a[x] === 1; });
			var f = new Enumerable([0, 1]);
			return e.test(0) === true && f.test(1) === true;
		},
	]
};