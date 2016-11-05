beforeEach(function () {
	jasmine.addCustomEqualityTester(function (cur, ano) {
		if (Array.isArray(cur) && Array.isArray(ano)) {
			return Object.isEqual(cur, ano);
		}
	});
});

describe('Array', function () {
	describe('create()', function () {
		it('returns an array by giving an array', function () {
			a = Array.create([1, 2, 3]);
			expect(a.length).toBe(3);
			expect(a[0]).toBe(1);
			expect(a[1]).toBe(2);
			expect(a[2]).toBe(3);
		});

		it('returns an array by giving an array-like', function () {
			a = Array.create({ length: 3, "0": 1, "1": 2, "2": 3 });
			expect(a.length).toBe(3);
			expect(a[0]).toBe(1);
			expect(a[1]).toBe(2);
			expect(a[2]).toBe(3);
		});

		it('returns an array by giving an object', function () {
			x = { "0": 1, "1": function () { }, "_x": 4 };

			a = Array.create(x);
			expect(a.length).toBe(1);
			expect(a[0].name).toBe('0');
			expect(a[0].value).toBe(1);

			a = Array.create(x, true);
			expect(a.length).toBe(3);
			expect(a[0].name).toBe('0');
			expect(a[0].value).toBe(1);
			expect(a[1].name).toBe('1');
			expect(a[1].value).toBe(x['1']);
			expect(a[2].name).toBe('_x');
			expect(a[2].value).toBe(4);

			a = Array.create({ "0": 1 }, 'k');
			expect(a.length).toBe(1);
			expect(a[0].k).toBe('0');
			expect(a[0].value).toBe(1);

			a = Array.create({ "0": 1 }, 'k');
			expect(a.length).toBe(1);
			expect(a[0].k).toBe('0');
			expect(a[0].value).toBe(1);

			a = Array.create({ "0": 1 }, 'k', 'v');
			expect(a.length).toBe(1);
			expect(a[0].k).toBe('0');
			expect(a[0].v).toBe(1);
		});

		it('returns an array by giving a string', function () {
			a = Array.create('123');
			expect(a).toEqual(['1', '2', '3']);

			a = Array.create('123', '2');
			expect(a).toEqual(['1', '3']);

			a = Array.create('1 $   3', /\s*\$\s*/);
			expect(a).toEqual(['1', '3']);
		});

		it('returns an array by giving nothing', function () {
			a = Array.create();
			expect(a.length).toBe(0);
		});

		it('returns an array by giving a dimension', function () {
			a = Array.create(3, null);
			expect(a.length).toBe(3);
			expect(a[0]).toBe(null);
			expect(a[1]).toBe(null);
			expect(a[2]).toBe(null);
		});

		it('throws an error', function () {
			expect(Array.create.bind(null, undefined)).toThrowError();
			expect(Array.create.bind(null, null)).toThrowError();
		});
	});

	describe('bind()', function () {
		it('asserts a context', function () {
			c = {};
			expect([].bind(c)._s).toBe(c);
			expect([].bind(c).bind({})._s).not.toBe(c);
			expect([].bind(null)._s).toBeUndefined();
		});

		it('throws an error', function () {
			expect([].bind).toThrowError();
		});
	});

	describe('clone()', function () {
		it('returns a copy of a given array', function () {
			a = [1, [2], { v: null, w: { x: [3] } }];
			z = a.clone();
			z.push(4);
			expect(a.length).toBe(3);
			expect(z.length).toBe(4);
			expect(z[0]).toBe(a[0]);
			expect(z[1]).toBe(a[1]);
			expect(z[2]).toBe(a[2]);

			z = a.clone(true);
			z.push(4);
			expect(a.length).toBe(3);
			expect(z.length).toBe(4);
			expect(z[0]).toBe(a[0]);
			expect(z[1]).not.toBe(a[1]);
			expect(z[1]).toEqual([2]);
			expect(z[2]).not.toBe(a[2]);
			expect(z[2]).toEqual(a[2]);
		});
	});

	describe('toImmutable()', function () {
		it('returns an immutable array', function () {
			a = [1, 2, 3];
			expect(a.toImmutable()).not.toBe(a);

			a = Array.create([]);
			expect(a.toImmutable().length).toBe(0);

			a = Array.create({ length: 0 });
			expect(a.toImmutable()).toBe(a);

			a = Array.create({});
			expect(a.toImmutable()).toBe(a);

			a = Array.create('abc');
			expect(a.toImmutable()).toBe(a);

			a = Array.create(1, null);
			expect(a.toImmutable()).toBe(a);
		});
	});

	describe('toMap()', function () {
		it('returns a map', function () {
			a = [{ v: 1, w: 4 }, { v: 2, w: 5 }, { v: 3, w: 6 }];
			z = a.toMap();
			expect(z instanceof Map).toBe(true);
			expect(z.size).toBe(3);
			expect(z.get(0)).toBe(a[0]);
			expect(z.get(1)).toBe(a[1]);
			expect(z.get(2)).toBe(a[2]);

			z = a.toMap('v');
			expect(z instanceof Map).toBe(true);
			expect(z.size).toBe(3);
			expect(z.get(1)).toBe(a[0]);
			expect(z.get(2)).toBe(a[1]);
			expect(z.get(3)).toBe(a[2]);

			z = a.toMap('v', 'w');
			expect(z instanceof Map).toBe(true);
			expect(z.size).toBe(3);
			expect(z.get(1)).toBe(4);
			expect(z.get(2)).toBe(5);
			expect(z.get(3)).toBe(6);

			z = a.toMap('v', function (x) { return x.w; });
			expect(typeof z).toBe('object');
			expect(z.get(1)).toBe(4);
			expect(z.get(2)).toBe(5);
			expect(z.get(3)).toBe(6);

			z = a.toMap(function (x) { return x.v; }, 'w');
			expect(typeof z).toBe('object');
			expect(z.get(1)).toBe(4);
			expect(z.get(2)).toBe(5);
			expect(z.get(3)).toBe(6);

			z = a.toMap(function (x) { return x.v; }, function (x) { return x.w; });
			expect(typeof z).toBe('object');
			expect(z.get(1)).toBe(4);
			expect(z.get(2)).toBe(5);
			expect(z.get(3)).toBe(6);
		});
	});

	describe('toObject()', function () {
		it('returns the object', function () {
			z = [1, 2, 3].toObject();
			expect(typeof z).toBe('object');
			expect(z['1']).toBe(1);
			expect(z['2']).toBe(2);
			expect(z['3']).toBe(3);

			a = [{ v: 1, w: 4 }, { v: 2, w: 5 }, { v: 3, w: 6 }];
			z = a.toObject('v');
			expect(typeof z).toBe('object');
			expect(z['1']).toBe(a[0]);
			expect(z['2']).toBe(a[1]);
			expect(z['3']).toBe(a[2]);

			z = a.toObject(function (x) { return x.v; });
			expect(typeof z).toBe('object');
			expect(z['1']).toBe(a[0]);
			expect(z['2']).toBe(a[1]);
			expect(z['3']).toBe(a[2]);

			z = a.toObject('v', 'w');
			expect(typeof z).toBe('object');
			expect(z['1']).toBe(4);
			expect(z['2']).toBe(5);
			expect(z['3']).toBe(6);

			z = a.toObject('v', function (x) { return x.w; });
			expect(typeof z).toBe('object');
			expect(z['1']).toBe(4);
			expect(z['2']).toBe(5);
			expect(z['3']).toBe(6);

			z = a.toObject(function (x) { return x.v; }, 'w');
			expect(typeof z).toBe('object');
			expect(z['1']).toBe(4);
			expect(z['2']).toBe(5);
			expect(z['3']).toBe(6);

			z = a.toObject(function (x) { return x.v; }, function (x) { return x.w; });
			expect(typeof z).toBe('object');
			expect(z['1']).toBe(4);
			expect(z['2']).toBe(5);
			expect(z['3']).toBe(6);
		});
	});

	describe('toString()', function () {
		it('returns the string', function () {
			expect(['a', 'b', 'c'].toString()).toBe('a,b,c');

			expect(['a', 'b', 'c'].toString(' ')).toBe('a b c');
		});

		it('throws an error', function () {
			expect([].toString.bind(['a', 'b', 'c'], 0)).toThrowError();
		});
	});

	describe('where()', function () {
		it('returns the new array', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 3 }];
			z = a.where('v', 2);
			expect(z).not.toBe(a);
			expect(Object.isEqual(z, [{ v: 2 }])).toBe(true);
			expect(z).toEqual(a.where({ v: 2 }));
			expect(z).toEqual(a.where(function (x) { return x.v === 2; }));
		});
	});

	describe('select()', function () {
		it('returns the new array', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 3 }];
			z = a.select('v');
			expect(z).not.toBe(a);
			expect(z).toEqual([1, 2, 3]);
			expect(z).toEqual(a.select(function (x) { return x.v; }));

			z = a.select(['v']);
			expect(z).not.toBe(a);
			expect(z).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }]);
		});
	});

	describe('invoke()', function () {
		it('executes a function by giving a small array', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 3 }];
			z = 0;
			a.invoke(function (x) { z += x.v; });
			expect(z).toBe(6);

			z = 0;
			a.invoke(1, function (x) { z += x.v; });
			expect(z).toBe(5);

			z = 0;
			a.invoke(1, 0, function (x) { z += x.v; });
			expect(z).toBe(1);

			z = 0;
			a.invoke(1, 0, -1, function (x) { z += x.v; });
			expect(z).toBe(1);

			z = 0;
			a.invoke(3, 0, -2, function (x) { z += x.v; });
			expect(z).toBe(4);

			z = 0;
			a.invoke(function (x, i) {
				z += x.v;
				if (i === 1) {
					return false;
				}
			});
			expect(z).toBe(3);
		});

		it('executes a function by giving a large array', function () {
			a = Array.create(2048, 1);
			z = 0;
			a.invoke(function (x) { z += x; });
			expect(z).toBe(2048);

			z = 0;
			a.invoke(function (x, i) {
				z += x;
				if (i === 1536 - 1) {
					return false;
				}
			});
			expect(z).toBe(1536);
		});
	});

	describe('invokeAsync()', function () {
		it('executes a function', function (done) {
			a = [1, 2, 3];
			z = 0;
			p = a.invokeAsync(function (x, i) {
				z += x;
				expect(z).toBe([1, 4, 7][i]);
			}).then(function () {
				expect(z).toBe(7);
				done();
			});
			expect(z).toBe(0);
			setTimeout(function () {
				z += 1;
				expect(z).toBe(2);
			});
			expect(p instanceof Promise).toBe(true);
		});

		it('executes a function by giving a start index', function (done) {
			a = [1, 2, 3];
			z = 0;
			p = a.invokeAsync(1, function (x, i) {
				z += x;
				expect(z).toBe([0, 2, 6][i]);
			}).then(function () {
				expect(z).toBe(6);
				done();
			});
			expect(z).toBe(0);
			setTimeout(function () {
				z += 1;
				expect(z).toBe(3);
			});
			expect(p instanceof Promise).toBe(true);
		});

		it('executes a function by giving a stop index', function (done) {
			a = [1, 2, 3];
			z = 0;
			p = a.invokeAsync(0, 2, function (x, i) {
				z += x;
				expect(z).toBe([1, 4, 0][i]);
			}).then(function () {
				expect(z).toBe(4);
				done();
			});
			expect(z).toBe(0);
			setTimeout(function () {
				z += 1;
				expect(z).toBe(2);
			});
			expect(p instanceof Promise).toBe(true);
		});

		it('executes a function by giving a step count', function (done) {
			a = [1, 2, 3];
			z = 0;
			p = a.invokeAsync(2, 0, -1, function (x, i) {
				z += x;
				expect(z).toBe([4, 2, 0][i]);
			}).then(function () {
				expect(z).toBe(4);
				done();
			});
			expect(z).toBe(0);
			setTimeout(function () {
				z += 1;
				expect(z).toBe(3);
			});
			expect(p instanceof Promise).toBe(true);
		});

		it('executes a function by giving a batch count', function (done) {
			a = [1, 2, 3];
			z = 0;
			p = a.invokeAsync(function (x, i) {
				z += x;
				expect(z).toBe([1, 3, 7][i]);
			}, 2).then(function () {
				expect(z).toBe(7);
				done();
			});
			expect(z).toBe(0);
			setTimeout(function () {
				z += 1;
				expect(z).toBe(4);
			});
			expect(p instanceof Promise).toBe(true);
		});

		it('executes a function with a break', function (done) {
			a = [1, 2, 3];
			z = 0;
			p = a.invokeAsync(function (x, i) {
				z += x;
				if (i === 1) {
					return false;
				}
				expect(z).toBe([1, 4, 0][i]);
			}).catch(function () {
				expect(z).toBe(4);
				done();
			});
			expect(z).toBe(0);
			setTimeout(function () {
				z += 1;
				expect(z).toBe(2);
			});
			expect(p instanceof Promise).toBe(true);
		});
	});

	describe('invokeWhich()', function () {
		it('executes a function', function () {
			a = [1, 2, 3];
			z = a.groupBy(function (x) {
				return x <= 2;
			}).invokeWhich(true, function (x, i) {
				expect(x).toBe([1, 2][i]);
			});
			expect(z).not.toBe(a);
		});

		it('throws an error', function () {
			a = [1, 2, 3];
			expect(a._g).toBeUndefined();
			expect(a.invokeWhich.bind(a)).toThrowError();

			z = a.groupBy(function (x) { return x <= 2; });
			expect(z._g).toBeDefined();
			expect(z.invokeWhich.bind(z)).toThrowError();
		});
	});

	describe('take()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3];
			z = a.take(function (x) { return x <= 2; });
			expect(a).not.toBe(z);
			expect(z).toEqual([1, 2]);

			z = a.take(Infinity);
			expect(a).not.toBe(z);
			expect(z).toEqual(a);

			z = a.take(Number.MAX_SAFE_INTEGER);
			expect(a).not.toBe(z);
			expect(z).toEqual(a);

			z = a.take(1);
			expect(a).not.toBe(z);
			expect(z).toEqual([1]);

			z = a.take(1, 3);
			expect(a).not.toBe(z);
			expect(z).toEqual([2, 3]);
		});
	});

	describe('skip()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3];
			z = a.skip(function (x) { return x <= 2; });
			expect(a).not.toBe(z);
			expect(z).toEqual([3]);

			z = a.skip(Infinity);
			expect(a).not.toBe(z);
			expect(z.length).toBe(0);

			z = a.skip(Number.MAX_SAFE_INTEGER);
			expect(a).not.toBe(z);
			expect(z.length).toBe(0);

			z = a.skip(1);
			expect(a).not.toBe(z);
			expect(z).toEqual([2, 3]);

			z = a.skip(1, 2);
			expect(a).not.toBe(z);
			expect(z).toEqual([1, 3]);
		});
	});

	describe('flatten()', function () {
		it('returns the new array', function () {
			a = [1, 2, [3, 4, 5], 6];
			z = a.flatten();
			expect(a).not.toBe(z);
			expect(z).toEqual([1, 2, 3, 4, 5, 6]);

			a = [[1, 2, 3], [4, [5, 6]]];
			z = a.flatten();
			expect(a).not.toBe(z);
			expect(z).toEqual([1, 2, 3, 4, [5, 6]]);

			a = [[1, 2, 3], [4, [5, 6]], []];
			z = a.flatten(true);
			expect(a).not.toBe(z);
			expect(z).toEqual([1, 2, 3, 4, 5, 6]);
		});
	});

	describe('any()', function () {
		it('returns the boolean', function () {
			expect([].any()).toBe(false);

			a = [1, 2, 3];
			expect(a.any()).toBe(true);

			expect(a.any(function (x) { return x === 2; })).toBe(true);
			expect(a.any(function (x) { return x === 4; })).toBe(false);

			expect(a.any(2)).toBe(true);
			expect(a.any(4)).toBe(false);

			a = [{ v: 1 }, { v: 2 }, { v: 3 }];
			expect(a.any('v', 2)).toBe(true);
			expect(a.any('v', 4)).toBe(false);
		});
	});

	describe('all()', function () {
		it('returns the boolean', function () {
			expect([].all()).toBe(true);

			a = [1, 2, 3];
			b = [1, 1, 1];
			expect(a.all(function (x) { return x === 1; })).toBe(false);
			expect(b.all(function (x) { return x === 1; })).toBe(true);

			expect(a.all(1)).toBe(false);
			expect(b.all(1)).toBe(true);

			a = [{ v: 1 }, { v: 2 }, { v: 3 }];
			b = [{ v: 1 }, { v: 1 }, { v: 1 }];
			expect(a.all('v', 1)).toBe(false);
			expect(b.all('v', 1)).toBe(true);
		});

		it('throws an error', function () {
			a = [1, 2, 3];
			expect(a.all.bind(a)).toThrowError();
		});
	});

	describe('has()', function () {
		it('returns the boolean', function () {
			a = [1, 2, 3];
			expect(a.has(2)).toBe(true);
			expect(a.has(4)).toBe(false);
		});

		it('throws an error', function () {
			a = [1, 2, 3];
			expect(a.has.bind(a)).toThrowError();
		});
	});

	describe('isEqual()', function () {
		it('returns the boolean', function () {
			a = [1, 2, 3];
			expect(a.isEqual([1])).toEqual(false);
			expect(a.isEqual([1, 2, 3])).toBe(true);
			expect(a.isEqual([1, 3, 2])).toBe(false);
			expect(a.isEqual([1, 1, 1])).toBe(false);
			expect(a.isEqual([1, 2, 3, 4])).toBe(false);
			expect(a.isEqual([0, 1, 2], function (x, y) { return x === y + 1; })).toBe(true);
		});

		it('throws an error', function () {
			a = [1, 2, 3];
			expect(a.isEqual.bind(a)).toThrowError();
		});
	});

	describe('isAlike()', function () {
		it('returns the boolean', function () {
			a = [1, 2, 3];
			expect(a.isAlike([1])).toBe(false);
			expect(a.isAlike([1, 2, 3])).toBe(true);
			expect(a.isAlike([1, 3, 2])).toBe(true);
			expect(a.isAlike([1, 1, 1])).toBe(false);
			expect(a.isAlike([1, 2, 3, 4])).toBe(false);
			expect(a.isAlike([0, 1, 2], function (x, y) { return x === y + 1; })).toBe(true);
		});

		it('throws an error', function () {
			expect([].isAlike.bind([])).toThrowError();
		});
	});

	describe('isSubset()', function () {
		it('returns the boolean', function () {
			a = [1, 2, 3];
			expect(a.isSubset([1])).toBe(false);
			expect(a.isSubset([1, 2, 3])).toBe(true);
			expect(a.isSubset([1, 3, 2])).toBe(true);
			expect(a.isSubset([1, 1, 1])).toBe(false);
			expect(a.isSubset([1, 2, 3, 4])).toBe(true);
			expect(a.isSubset([0, 1, 2], function (x, y) { return x === y + 1; })).toBe(true);
		});

		it('throws an error', function () {
			expect([].isSubset.bind([])).toThrowError();
		});
	});

	describe('indexOf()', function () {
		it('returns the number', function () {
			a = [1, 2, 1];
			f = function (x) { return x === 1; };
			expect(a.indexOf(1)).toBe(0);
			expect(a.indexOf(4)).toBe(-1);
			expect(a.indexOf(1, 0)).toBe(0);
			expect(a.indexOf(1, 1)).toBe(2);
			expect(a.indexOf(1, -1)).toBe(2);
			expect(a.indexOf(1, -2)).toBe(2);
			expect(a.indexOf(1, -3)).toBe(0);
			expect(a.indexOf(1, -4)).toBe(0);
			expect(a.indexOf(f)).toBe(0);
			expect(a.indexOf(function (x) { return x === 4; })).toBe(-1);
			expect(a.indexOf(f, 0)).toBe(0);
			expect(a.indexOf(f, 1)).toBe(2);
			expect(a.indexOf(f, -1)).toBe(2);
			expect(a.indexOf(f, -2)).toBe(2);
			expect(a.indexOf(f, -3)).toBe(0);
			expect(a.indexOf(f, -4)).toBe(0);
		});

		it('throws an error', function () {
			a = [1, 2, 3];
			expect(a.indexOf.bind(a)).toThrowError();
			expect(a.indexOf.bind(a, 1, 4)).not.toThrowError();
		});
	});

	describe('lastIndexOf()', function () {
		it('returns the number', function () {
			a = [1, 2, 1];
			f = function (x) { return x === 1; };
			expect(a.lastIndexOf(1)).toBe(2);
			expect(a.lastIndexOf(4)).toBe(-1);
			expect(a.lastIndexOf(1, 3)).toBe(2);
			expect(a.lastIndexOf(1, 1)).toBe(0);
			expect(a.lastIndexOf(1, -1)).toBe(2);
			expect(a.lastIndexOf(1, -2)).toBe(0);
			expect(a.lastIndexOf(1, -3)).toBe(0);
			expect(a.lastIndexOf(1, -4)).toBe(-1);
			expect(a.lastIndexOf(f)).toBe(2);
			expect(a.lastIndexOf(function (x) { return x === 4; })).toBe(-1);
			expect(a.lastIndexOf(f, 3)).toBe(2);
			expect(a.lastIndexOf(f, 1)).toBe(0);
			expect(a.lastIndexOf(f, -1)).toBe(2);
			expect(a.lastIndexOf(f, -2)).toBe(0);
			expect(a.lastIndexOf(f, -3)).toBe(0);
			expect(a.lastIndexOf(f, -4)).toBe(-1);
		});

		it('throws an error', function () {
			a = [1, 2, 3];
			expect(a.lastIndexOf.bind(a)).toThrowError();
			expect(a.lastIndexOf.bind(a, 1, 4)).not.toThrowError();
		});
	});

	describe('find()', function () {
		it('returns the first matched member or undefined', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect(a.find('v', 1)).toBe(a[0]);
			expect(a.find('v', 4)).toBeUndefined();
			expect(a.find(function (x) { return x.v === 1; })).toBe(a[0]);
			expect(a.find(function (x) { return x.v === 4; })).toBeUndefined();
		});

		it('throws an error', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect(a.find.bind(a)).toThrowError();
			expect(a.find.bind(a, 'v', null, null)).toThrowError();
		});
	});

	describe('firstOrNull()', function () {
		it('returns the first matched member or null', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect([].firstOrNull()).toBeNull();
			expect(a.firstOrNull()).toBe(a[0]);
			expect(a.firstOrNull(function (x) { return x.v === 1; })).toBe(a[0]);
			expect(a.firstOrNull(function (x) { return x.v === 4; })).toBeNull();
		});
	});

	describe('first()', function () {
		it('returns the first matched member', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect(a.first()).toBe(a[0]);
			expect(a.first(function (x) { return x.v === 1; })).toBe(a[0]);
		});

		it('throws an error', function () {
			expect([].first).toThrowError();
			expect([].first.bind([], function (x) { return x.v === 4; })).toThrowError();
		});
	});

	describe('lastOrNull()', function () {
		it('returns the last matched member or null', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect([].lastOrNull()).toBeNull();
			expect(a.lastOrNull()).toBe(a[2]);
			expect(a.lastOrNull(function (x) { return x.v === 1; })).toBe(a[2]);
			expect(a.lastOrNull(function (x) { return x.v === 4; })).toBeNull();
		});
	});

	describe('last()', function () {
		it('returns the first matched member', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect(a.last()).toBe(a[2]);
			expect(a.last(function (x) { return x.v === 1; })).toBe(a[2]);
		});

		it('throws an error', function () {
			expect([].last).toThrowError();
			expect([].last.bind([], function (x) { return x.v === 4; })).toThrowError();
		});
	});

	describe('singleOrNull()', function () {
		it('returns the last matched member or null', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect([].singleOrNull()).toBeNull();
			expect([1].singleOrNull()).toBe(1);
			expect([1, 2, 3].singleOrNull()).toBeNull();
			expect(a.singleOrNull(function (x) { return x.v === 1; })).toBeNull();
			expect(a.singleOrNull(function (x) { return x.v === 2; })).toBe(a[1]);
			expect(a.singleOrNull(function (x) { return x.v === 4; })).toBeNull();
		});
	});

	describe('single()', function () {
		it('returns the first matched member', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect([1].single()).toBe(1);
			expect(a.single(function (x) { return x.v === 2; })).toBe(a[1]);
		});

		it('throws an error', function () {
			a = [{ v: 1 }, { v: 2 }, { v: 1 }];
			expect([].single).toThrowError();
			expect([].single.bind([1, 2, 3])).toThrowError();
			expect([].single.bind(a, function (x) { return x.v === 1; })).toThrowError();
			expect([].single.bind(a, function (x) { return x.v === 4; })).toThrowError();
		});
	});

	describe('distinct()', function () {
		it('returns the new array', function () {
			a = [1, 2, 1, 2, 2, undefined, null];
			z = a.distinct();
			expect(z).not.toBe(a);
			expect(z).toEqual([1, 2, undefined, null]);

			a = [{ v: 1 }, { v: 2 }, { v: 1 }, { v: undefined }, { v: null }];
			z = a.distinct('v');
			expect(z).not.toBe(a);
			expect(z).toEqual([{ v: 1 }, { v: 2 }, { v: undefined }, { v: null }]);
			expect(z).toEqual(a.distinct(function (x) { return x.v; }));
		});

		it('throws an error', function () {
			expect([].distinct.bind([], null)).toThrowError();
		});
	});

	describe('add()', function () {
		it('asserts an added member', function () {
			a = [1, 2];
			z = a.add(3);
			expect(z).toBe(a);
			expect(z).toEqual([1, 2, 3]);

			z = a.add(4, a.length);
			expect(z).toBe(a);
			expect(z).toEqual([1, 2, 3, 4]);

			a = [2, 3];
			z = a.add(1, 0);
			expect(z).toBe(a);
			expect(z).toEqual([1, 2, 3]);
		});

		it('throws an error', function () {
			expect([].add).toThrowError();
			expect([].add.bind([], null, 1)).toThrowError(RangeError);
		});
	});

	describe('addRange()', function () {
		it('asserts added members', function () {
			a = [1];
			z = a.addRange([2, 3]);
			expect(z).toBe(a);
			expect(z).toEqual([1, 2, 3]);

			z.addRange([4], z.length);
			expect(z).toBe(a);
			expect(z).toEqual([1, 2, 3, 4]);

			a = [3];
			z = a.addRange([1, 2], 0);
			expect(z).toBe(a);
			expect(a.length).toBe(3);
			expect(z).toEqual([1, 2, 3]);
		});

		it('throws an error', function () {
			expect([].add).toThrowError();
			expect([].add.bind([], null, 1)).toThrowError(RangeError);
		});
	});

	describe('remove()', function () {
		it('asserts a removed member', function () {
			a = [1, 2, 3];
			z = a.remove(2);
			expect(z).toBe(a);
			expect(z).toEqual([1, 3]);
		});
	});

	describe('removeAt()', function () {
		it('asserts a removed member', function () {
			a = [1, 2, 3];
			z = a.removeAt(1);
			expect(z).toBe(a);
			expect(z).toEqual([1, 3]);
		});
	});

	describe('removeRange()', function () {
		it('asserts removed members', function () {
			a = [1, 2, 3, 2];
			z = a.removeRange([2, 3]);
			expect(z).toBe(a);
			expect(z).toEqual([1, 2]);
		});
	});

	describe('removeAll()', function () {
		it('asserts a removed member', function () {
			a = [1, 2, 3, 2];
			z = a.removeAll(2);
			expect(z).toBe(a);
			expect(z).toEqual([1, 3]);
		});

		it('asserts an empty array', function () {
			a = [1, 2, 3];
			a.removeAll();
			expect(a.length).toBe(0);
		});
	});

	describe('split()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3, 2, 3];
			z = a.split(3);
			expect(z).not.toBe(a);
			expect(z).toEqual([[1, 2], [2], []]);
			expect(z).toEqual(a.split(function (x) { return x === 3; }));

			z = [].split(0);
			expect(z).toEqual([]);
		});
	});

	describe('splitAt()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3];
			z = a.splitAt(2);
			expect(z).toEqual([[1, 2], [3]]);
		});
	});

	describe('replace()', function () {
		it('asserts an array', function () {
			a = [1, 2, 3, 2];
			z = a.replace(2, 4);
			expect(z).toBe(a);
			expect(z).toEqual([1, 4, 3, 4]);
			expect(z).toEqual(a.replace(function (x) { return x === 2; }, 4));
		});

		it('throws an error', function () {
			expect([].replace).toThrowError();
		});
	});

	describe('replaceAt()', function () {
		it('asserts an array', function () {
			a = [1, 2, 3, 2];
			z = a.replaceAt(1, 4);
			expect(z).toEqual([1, 4, 3, 2]);
		});

		it('throws an error', function () {
			expect([].replaceAt).toThrowError();
			expect([].replaceAt.bind([], -1, 0)).toThrowError(RangeError);
			expect([].replaceAt.bind([], 0, 0)).toThrowError(RangeError);
			expect([].replaceAt.bind([], 1, 0)).toThrowError(RangeError);
		});
	});

	describe('union()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3];
			b = [2, 3, 4];
			z = a.union(b);
			expect(a.length).toBe(3);
			expect(b.length).toBe(3);
			expect(z).toEqual([1, 2, 3, 4]);
		});
	});

	describe('intersect()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3];
			b = [2, 3, 4];
			z = a.intersect(b);
			expect(a.length).toBe(3);
			expect(b.length).toBe(3);
			expect(z).toEqual([2, 3]);
		});
	});

	describe('difference()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3];
			b = [2, 3, 4];
			z = a.difference(b);
			expect(a.length).toBe(3);
			expect(b.length).toBe(3);
			expect(z).toEqual([1]);
		});
	});

	describe('sortBy()', function () {
		it('returns the new array', function () {
			a = [{ v: 3 }, { v: 1 }, { v: 2 }];
			z = a.sortBy('v');
			expect(z).toEqual([a[1], a[2], a[0]]);

			z = a.sortBy('v', false);
			expect(z).toEqual([a[1], a[2], a[0]]);

			z = a.sortBy('v', true);
			expect(z).toEqual([a[0], a[2], a[1]]);

			z = a.sortBy(function (x) { return x.v; });
			expect(z).toEqual([a[1], a[2], a[0]]);

			z = a.sortBy(function (x) { return x.v; }, false);
			expect(z).toEqual([a[1], a[2], a[0]]);

			z = a.sortBy(function (x) { return x.v; }, true);
			expect(z).toEqual([a[0], a[2], a[1]]);

			z =

				a = [{ v: 3, k: 1 }, { v: 1, k: 2 }, { v: 2, k: 1 }, { v: 4, k: 2 }, { v: 4, k: 2, c: 1 }];
			z = a.sortBy('k', false, function (x) { return x.v; }, true);
			expect(z.length).toBe(5);
			expect(z[0].v).toBe(3);
			expect(z[1].v).toBe(2);
			expect(z[2].v).toBe(4);
			expect(z[3].v).toBe(4);
			expect(z[3].c).toBe(1);
			expect(z[4].v).toBe(1);
		});

		it('throws an error', function () {
			expect([].sortBy).toThrowError();
			expect([].sortBy.bind([], null)).toThrowError();
			expect([].sortBy.bind([], null, null)).toThrowError();
			expect([].sortBy.bind([], null, null, null)).toThrowError();
		});
	});

	describe('groupBy()', function () {
		it('returns the new array', function () {
			a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			z = a.groupBy('g');
			expect(z.length).toBe(2);
			expect(z[0].length).toBe(2);
			expect(z[0].name).toBe(1);
			expect(z[0][0]).toBe(a[0]);
			expect(z[0][1]).toBe(a[1]);
			expect(z[1].length).toBe(1);
			expect(z[1].name).toBe(2);
			expect(z[1][0]).toBe(a[2]);

			z = a.groupBy(function (x) { return x.g; });
			expect(z.length).toBe(2);
			expect(z[0].length).toBe(2);
			expect(z[0].name).toBe(1);
			expect(z[0][0]).toBe(a[0]);
			expect(z[0][1]).toBe(a[1]);
			expect(z[1].length).toBe(1);
			expect(z[1].name).toBe(2);
			expect(z[1][0]).toBe(a[2]);
		});
	});

	describe('groupOf()', function () {
		it('returns the new array', function () {
			a = [1, 2, 3, 4, 5];
			z = a.groupOf(2);
			expect(z.length).toBe(3);
			expect(z[0].length).toBe(2);
			expect(z[0][0]).toBe(1);
			expect(z[0][1]).toBe(2);
			expect(z[1].length).toBe(2);
			expect(z[1][0]).toBe(3);
			expect(z[1][1]).toBe(4);
			expect(z[2].length).toBe(1);
			expect(z[2][0]).toBe(5);
		});
	});

	describe('joinBy()', function () {
		it('returns the new array', function () {
			a = [{ v: 1, g: 1 }, { v: 2, g: 1 }, { v: 3, g: 2 }];
			b = [{ v: 4, g: 1 }, { v: 4, w: 1, g: 2 }];
			z = a.clone(true).joinBy(b, 'g');
			expect(z.length).toBe(3);
			expect(z[0].v).toBe(1);
			expect(z[1].v).toBe(2);
			expect(z[2].v).toBe(3);
			expect(z[2].w).toBe(1);

			z = a.clone(true).joinBy(b, 'g', true);
			expect(z.length).toBe(3);
			expect(z[0].v).toBe(4);
			expect(z[1].v).toBe(4);
			expect(z[2].v).toBe(4);
			expect(z[2].w).toBe(1);

			z = a.clone(true).joinBy(b, function (x) { return x.g; });
			expect(z.length).toBe(3);
			expect(z[0].v).toBe(1);
			expect(z[1].v).toBe(2);
			expect(z[2].v).toBe(3);
			expect(z[2].w).toBe(1);

			z = a.clone(true).joinBy(b, function (x) { return x.g; }, true);
			expect(z.length).toBe(3);
			expect(z[0].v).toBe(4);
			expect(z[1].v).toBe(4);
			expect(z[2].v).toBe(4);
			expect(z[2].w).toBe(1);
		});
	});

	describe('countBy()', function () {
		it('returns the number', function () {
			a = [1, 2, 3, 2];
			z = a.countBy(2);
			expect(z).toBe(2);

			z = a.countBy(function (x) { return x <= 2; });
			expect(z).toBe(3);
		});
	});

	describe('min()', function () {
		it('returns the member', function () {
			a = [2, 3, 1, 1];
			z = a.min();
			expect(z).toBe(1);

			a = [{ v: 2 }, { v: 3 }, { v: 1 }, { v: 1 }];
			z = a.min('v');
			expect(z).toBe(a[2]);

			z = a.min(function (x) { return x.v; });
			expect(z).toBe(a[2]);
		});
	});

	describe('max()', function () {
		it('returns the member', function () {
			a = [2, 3, 1, 1];
			z = a.max();
			expect(z).toBe(3);

			a = [{ v: 2 }, { v: 3 }, { v: 1 }, { v: 1 }];
			z = a.max('v');
			expect(z).toBe(a[1]);

			z = a.max(function (x) { return x.v; });
			expect(z).toBe(a[1]);
		});
	});

	describe('mod()', function () {
		it('returns the member', function () {
			a = [2, 3, 1, 1];
			z = a.mod();
			expect(z).toBe(1);

			a = [{ v: 2 }, { v: 3 }, { v: 1 }, { v: 1 }];
			z = a.mod('v');
			expect(z).toBe(a[2]);

			z = a.mod(function (x) { return x.v; });
			expect(z).toBe(a[2]);
		});
	});

	describe('sum()', function () {
		it('returns the number', function () {
			a = [2, 3, 1, 1];
			z = a.sum();
			expect(z).toBe(7);

			a = [{ v: 2 }, { v: 3 }, { v: 1 }, { v: 1 }];
			z = a.sum('v');
			expect(z).toBe(7);

			z = a.sum(function (x) { return x.v; });
			expect(z).toBe(7);
		});
	});

	describe('avg()', function () {
		it('returns the number', function () {
			a = [2, 3, 1, 1];
			z = a.avg();
			expect(z).toBe(1.75);

			a = [{ v: 2 }, { v: 3 }, { v: 1 }, { v: 1 }];
			z = a.avg('v');
			expect(z).toBe(1.75);

			z = a.avg(function (x) { return x.v; });
			expect(z).toBe(1.75);
		});
	});

	describe('norm()', function () {
		it('returns the new array', function () {
			a = [0, undefined, 1, null, 2, NaN, 3, Infinity, 'x', ''];
			z = a.norm();
			expect(z.length).toBe(4);
			expect(z[0]).toBe(1);
			expect(z[1]).toBe(2);
			expect(z[2]).toBe(3);
			expect(z[3]).toBe('x');

			a = [{ v: 0 }, {}, { v: 1 }, { v: null }, { v: 2 }, { v: NaN }, { v: 3 }, { v: Infinity }, { v: 'x' }, { v: '' }];
			z = a.norm('v');
			expect(z.length).toBe(4);
			expect(z[0]).toBe(a[2]);
			expect(z[1]).toBe(a[4]);
			expect(z[2]).toBe(a[6]);
			expect(z[3]).toBe(a[8]);
		});
	});

	describe('cast()', function () {
		it('returns the new array', function () {
			a = ['a', 1, '123', NaN, Infinity, true, 'FALSE', null, undefined, {}, [], function () { }];
			z = a.cast('string');
			expect(z.length).toBe(8);
			expect(z.has('[object Object]')).toBe(false);
			expect(a.cast('string')).toEqual(a.cast(String));

			z = a.cast('number');
			expect(z).toEqual([1, 123, Infinity]);
			expect(a.cast('number')).toEqual(a.cast(Number));

			z = a.cast('boolean');
			expect(z).toEqual([true, false]);
			expect(a.cast('boolean')).toEqual(a.cast(Boolean));

			z = a.cast('array');
			expect(z).toEqual([['a'], ['1', '2', '3'], ['F', 'A', 'L', 'S', 'E'], []]);
			expect(a.cast('array')).toEqual(a.cast(Array));

			z = a.cast('object');
			expect(z).toEqual([{}]);
			expect(a.cast('object')).toEqual(a.cast(Object));

			z = a.cast('function');
			expect(z.length).toBe(1);
			expect(z[0]).toBe(a[a.length - 1]);
			expect(a.cast('function')).toEqual(a.cast(Function));
		});
	});

	describe('cross()', function () {
		it('returns the new array', function () {
			a = [1, 2];
			b = [3, 4];
			z = a.cross(b);
			expect(a.length).toBe(2);
			expect(b.length).toBe(2);
			expect(z).toEqual([[1, 3], [1, 4], [2, 3], [2, 4]]);

			c = [5];
			z = a.cross(b).cross(c);
			expect(a.length).toBe(2);
			expect(b.length).toBe(2);
			expect(c.length).toBe(1);
			expect(z).toEqual([[1, 3, 5], [1, 4, 5], [2, 3, 5], [2, 4, 5]]);
		});

		it('throws an error', function () {
			expect([].cross).toThrowError();
		});
	});

	describe('zip()', function () {
		it('returns the new array', function () {
			a = [[1, 2], [3, 4]];
			z = a.zip(['a', 'b']);
			expect(a).toEqual([[1, 2], [3, 4]]);
			expect(z).toEqual([{ a: 1, b: 2 }, { a: 3, b: 4 }]);
		});

		it('throws an error', function () {
			expect([].zip).toThrowError();
			expect([].zip.bind([], [1])).toThrowError(TypeError);
		});
	});

	describe('seek()', function () {
		it('returns the new array', function () {
			a = [{ i: 1, v: [{ i: 11 }] }, { i: 2, v: [{ i: 3, v: [{ i: 4, v: [] }] }] }];
			expect(a.seek('v', 'i', 1).i).toBe(1);
			expect(a.seek('v', 'i', 2).i).toBe(2);
			expect(a.seek('v', 'i', 3).i).toBe(3);
			expect(a.seek('v', 'i', 4).i).toBe(4);
			expect(a.seek('v', 'i', 5)).toBeUndefined();
			expect(a.seek('v', function (x) { return x.i === 1; }).i).toBe(1);
			expect(a.seek('v', function (x) { return x.i === 2; }).i).toBe(2);
			expect(a.seek('v', function (x) { return x.i === 3; }).i).toBe(3);
			expect(a.seek('v', function (x) { return x.i === 4; }).i).toBe(4);
			expect(a.seek('v', function (x) { return x.i === 5; })).toBeUndefined();

		});
	});
});

describe('Object', function () {
	describe('isObject()', function () {
		it('returns a boolean', function () {
			expect(Object.isObject({})).toBe(true);
			expect(Object.isObject(new Object())).toBe(true);

			expect(Object.isObject([])).toBe(false);

			expect(Object.isObject(undefined)).toBe(false);
			expect(Object.isObject(null)).toBe(false);
		});
	});

	describe('isEmpty()', function () {
		it('returns a boolean', function () {
			expect(Object.isEmpty({})).toBe(true);
			expect(Object.isEmpty({ a: 1 })).toBe(false);
			expect(Object.isEmpty(new Object())).toBe(true);

			expect(Object.isEmpty([])).toBe(true);
			expect(Object.isEmpty([1, 2, 3])).toBe(false);

			expect(Object.isEmpty(new Map())).toBe(true);
			expect(Object.isEmpty(new Map([[1, 2]]))).toBe(false);

			expect(Object.isEmpty(new Set())).toBe(true);
			expect(Object.isEmpty(new Set([1, 2, 3]))).toBe(false);

			expect(Object.isEmpty(undefined)).toBe(false);
			expect(Object.isEmpty(null)).toBe(false);
		});
	});

	describe('isEqual()', function () {
		it('returns a boolean', function () {
			expect(Object.isEqual(undefined, undefined)).toBe(true);
			expect(Object.isEqual(undefined, null)).toBe(false);
			expect(Object.isEqual(null, null)).toBe(true);

			expect(Object.isEqual([], [])).toBe(true);
			expect(Object.isEqual([], {})).toBe(false);
			expect(Object.isEqual([1], [1])).toBe(true);
			expect(Object.isEqual([1], [1, 2])).toBe(false);
			expect(Object.isEqual([{ a: 1, b: { c: 2 } }], [{ a: 1, b: { c: 2 } }])).toBe(true);
			expect(Object.isEqual([{ a: 1, b: { c: 2 } }], [{ a: 1, b: {} }])).toBe(false);

			expect(Object.isEqual({}, {})).toBe(true);
			expect(Object.isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
			expect(Object.isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: {} })).toBe(false);

			expect(Object.isEqual(1, 1)).toBe(true);
			expect(Object.isEqual(1, 2)).toBe(false);
			expect(Object.isEqual(1, NaN)).toBe(false);
			expect(Object.isEqual(NaN, NaN)).toBe(true);
		});

		it('throws an error', function () {
			expect(Object.isEqual).toThrowError();
			expect(Object.isEqual.bind(null, 1)).toThrowError();
			expect(Object.isEqual.bind(null, 1, 2, 3)).toThrowError();
		});
	});
});

describe('Math', function () {
	describe('percent()', function () {
		it('returns the new array', function () {
			expect(Math.percent([0])).toEqual([0]);
			expect(Math.percent([0, 1])).toEqual([0, 100]);
			expect(Math.percent([0, 1, 3])).toEqual([0, 25, 75]);
			expect(Math.percent([0, 1, 3, 4, 8])).toEqual([0, 6, 19, 25, 50]);

			expect(Math.percent([1, 1, 1])).toEqual([34, 33, 33]);
			expect(Math.percent([229, 1, 1])).toEqual([98, 1, 1]);
			expect(Math.percent([229, 3, 3])).toEqual([98, 1, 1]);
			expect(Math.percent([229, 4, 4])).toEqual([96, 2, 2]);
			expect(Math.percent([242, 1, 2, 37])).toEqual([86, 1, 1, 12]);
		});

		it('throws an error', function () {
			expect(Math.percent.bind(null, [null])).toThrowError();
			expect(Math.percent.bind(null, ['abc'])).toThrowError();
		});		
	});
});

describe('Number', function () {
	describe('isNumber()', function () {
		it('returns a boolean', function () {
			expect(Number.isNumber(1)).toBe(true);
			expect(Number.isNumber(NaN)).toBe(false);
			expect(Number.isNumber(Infinity)).toBe(true);

			expect(Number.isNumber(undefined)).toBe(false);
			expect(Number.isNumber(null)).toBe(false);
			expect(Number.isNumber('')).toBe(false);
			expect(Number.isNumber('1')).toBe(false);
			expect(Number.isNumber({})).toBe(false);
			expect(Number.isNumber([])).toBe(false);
		});
	});

	describe('isSafeInteger()', function () {
		it('returns a boolean', function () {
			expect(Number.isSafeInteger(0)).toBe(true);

			expect(Number.isSafeInteger(Infinity)).toBe(false);
			expect(Number.isSafeInteger(-Infinity)).toBe(false);

			expect(Number.isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);
			expect(Number.isSafeInteger(Math.pow(2, 53))).toBe(false);
			expect(Number.isSafeInteger(-Math.pow(2, 53) + 1)).toBe(true);
			expect(Number.isSafeInteger(-Math.pow(2, 53))).toBe(false);
		});
	});
});

describe('String', function () {
	describe('isString()', function () {
		it('returns a boolean', function () {
			expect(String.isString('')).toBe(true);
			expect(String.isString(undefined)).toBe(false);
			expect(String.isString(null)).toBe(false);
			expect(String.isString(1)).toBe(false);
			expect(String.isString({})).toBe(false);
			expect(String.isString([])).toBe(false);
			expect(String.isString(new String())).toBe(false);
		});
	});

	describe('isEmpty()', function () {
		it('returns a boolean', function () {
			expect(String.isString('')).toBe(true);
			expect(String.isString('   ')).toBe(true);
			expect(String.isString('abc')).toBe(true);
			expect(String.isString(undefined)).toBe(false);
			expect(String.isString(null)).toBe(false);
		});
	});

	describe('contains()', function () {
		it('returns a boolean', function () {
			expect(''.contains('')).toBe(true);
			expect('abc'.contains('')).toBe(true);
			expect('abc'.contains('abc')).toBe(true);
			expect(''.contains('abc')).toBe(false);
			expect('abc'.contains('a')).toBe(true);
			expect('abc'.contains('b')).toBe(true);
			expect('abc'.contains('c')).toBe(true);
			expect('abc'.contains('d')).toBe(false);
			expect('abc'.contains('abc')).toBe(true);
		});
	});
});