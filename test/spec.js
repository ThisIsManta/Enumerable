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
		expect(a.length).toBe(3);
		expect(a[0]).toBe('1');
		expect(a[1]).toBe('2');
		expect(a[2]).toBe('3');

		a = Array.create('123', '2');
		expect(a.length).toBe(2);
		expect(a[0]).toBe('1');
		expect(a[1]).toBe('3');

		a = Array.create('1 $   3', /\s*\$\s*/);
		expect(a.length).toBe(2);
		expect(a[0]).toBe('1');
		expect(a[1]).toBe('3');
	});

	it('returns an array by giving nothing', function () {
		a = Array.create();
		expect(a.length).toBe(0);

		try {
			Array.create(undefined);
			fail();
		} catch (ex) { }

		try {
			Array.create(null);
			fail();
		} catch (ex) { }
	});

	it('returns an array by giving a dimension', function () {
		a = Array.create(3, null);
		expect(a.length).toBe(3);
		expect(a[0]).toBe(null);
		expect(a[1]).toBe(null);
		expect(a[2]).toBe(null);
	});
});

describe('bind()', function () {
	it('asserts a context', function () {
		c = {};
		expect([].bind(c)._s).toBe(c);
		expect([].bind(c).bind({})._s).not.toBe(c);
		expect([].bind(null)._s).toBeNull();
		expect([].bind(window)._s).toBeUndefined();

		try {
			expect([].bind()._s).to(null);
			fail();
		} catch (ex) { }
	});
});

describe('unbind()', function () {
	it('asserts no contexts', function () {
		expect([].unbind()._s).toBeUndefined();
		expect([].bind({}).unbind()._s).toBeUndefined();
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
	it('returns giving', function () {

	});

	it('returns ', function () {

	});
});

describe('toObject()', function () {
	it('returns an object by giving nothing', function () {
		z = [1, 2, 3].toObject();
		expect(typeof z).toBe('object');
		expect(z['1']).toBe(1);
		expect(z['2']).toBe(2);
		expect(z['3']).toBe(3);
	});

	it('returns an object by giving a name projector', function () {
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
	it('returns a string with commas-separated by default', function () {
		expect(['a', 'b', 'c'].toString()).toBe('a,b,c');
	});

	it('returns a string by giving custom-separated', function () {
		expect(['a', 'b', 'c'].toString(' ')).toBe('a b c');

		try {
			['a', 'b', 'c'].toString(0);
			fail();
		} catch (ex) { }
	});
});

describe('where()', function () {
	it('returns a new array', function () {
		a = [{ v: 1 }, { v: 2 }, { v: 3 }];
		z = a.where('v', 2);
		expect(z.length).toBe(1);
		expect(z[0]).toBe(a[1]);

		z = a.where({ v: 2 });
		expect(z.length).toBe(1);
		expect(z[0]).toBe(a[1]);

		z = a.where(function (x) { return x.v === 2; });
		expect(z.length).toBe(1);
		expect(z[0]).toBe(a[1]);
	});
});

describe('select()', function () {
	it('returns a new array', function () {
		a = [{ v: 1 }, { v: 2 }, { v: 3 }];
		z = a.select('v');
		expect(z.length).toBe(3);
		expect(z[0]).toBe(1);
		expect(z[1]).toBe(2);
		expect(z[2]).toBe(3);

		z = a.select(function (x) { return x.v; });
		expect(z.length).toBe(3);
		expect(z[0]).toBe(1);
		expect(z[1]).toBe(2);
		expect(z[2]).toBe(3);

		z = a.select(['v']);
		expect(z.length).toBe(3);
		expect(z[0]).toEqual({ v: 1 });
		expect(z[1]).toEqual({ v: 2 });
		expect(z[2]).toEqual({ v: 3 });
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
		a.groupBy(function (x) {
			return x <= 2;
		}).invokeWhich(true, function (x, i) {
			expect(x).toBe([1, 2][i]);
		});
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
	it('returns a new array', function () {
		a = [1, 2, 3].take(function (x) { return x <= 2; });
		expect(a.length).toBe(2);
		expect(a[0]).toBe(1);
		expect(a[1]).toBe(2);

		a = [1, 2, 3].take(Infinity);
		expect(a.length).toBe(3);
		expect(a[0]).toBe(1);
		expect(a[1]).toBe(2);
		expect(a[2]).toBe(3);

		a = [1, 2, 3].take(Number.MAX_SAFE_INTEGER);
		expect(a.length).toBe(3);
		expect(a[0]).toBe(1);
		expect(a[1]).toBe(2);
		expect(a[2]).toBe(3);

		a = [1, 2, 3].take(1);
		expect(a.length).toBe(2);
		expect(a[0]).toBe(2);
		expect(a[1]).toBe(3);

		a = [1, 2, 3].take(1, 2);
		expect(a.length).toBe(1);
		expect(a[0]).toBe(2);
	});
});

describe('skip()', function () {
	it('returns a new array', function () {
		a = [1, 2, 3];
		z = a.skip(function (x) { return x <= 2; });
		expect(z.length).toBe(1);
		expect(z[0]).toBe(3);

		z = a.skip(Infinity);
		expect(z.length).toBe(0);

		z = a.skip(Number.MAX_SAFE_INTEGER);
		expect(z.length, 0);

		z = a.skip(1);
		expect(z.length).toBe(1);
		expect(z[0]).toBe(1);

		z = a.skip(1, 2);
		expect(z.length).toBe(2);
		expect(z[0]).toBe(1);
		expect(z[1]).toBe(3);
	});
});

describe('flatten()', function () {
	it('returns a new array', function () {
		a = [1, 2, [3, 4, 5], 6].flatten();
		expect(a.length).toBe(6);
		for (i = 0; i < a.length; i++) {
			expect(a[i]).toBe(i + 1);
		}

		a = [[1, 2, 3], [4, [5, 6]]].flatten();
		expect(a.length).toBe(5);
		expect(Array.isArray(a[4])).toBe(true);
		expect(a[4].length).toBe(2);

		a = [[1, 2, 3], [4, [5, 6]], []].flatten(true);
		expect(a.length).toBe(6);
		for (i = 0; i < a.length; i++) {
			expect(a[i]).toBe(i + 1);
		}
	});
});

describe('any()', function () {
	it('returns a boolean', function () {
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
	it('returns a boolean', function () {
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

	it('throws an error because of invalid parameters', function () {
		a = [1, 2, 3];
		expect(a.all.bind(a)).toThrowError();
	});
});

describe('has()', function () {
	it('returns a boolean', function () {
		a = [1, 2, 3];
		expect(a.has(2)).toBe(true);
		expect(a.has(4)).toBe(false);
	});

	it('throws an error because of invalid parameters', function () {
		a = [1, 2, 3];
		expect(a.has.bind(a)).toThrowError();
	});
});

describe('isSame()', function () {
	it('returns a boolean', function () {
		a = [1, 2, 3];
		expect(a.isSame([1])).toBe(false);
		expect(a.isSame([1, 2, 3])).toBe(true);
		expect(a.isSame([1, 3, 2])).toBe(false);
		expect(a.isSame([1, 1, 1])).toBe(false);
		expect(a.isSame([1, 2, 3, 4])).toBe(false);
		expect(a.isSame([0, 1, 2], function (x, y) { return x === y + 1; })).toBe(true);
	});

	it('throws an error because of invalid parameters', function () {
		a = [1, 2, 3];
		expect(a.isSame.bind(a)).toThrowError();
	});
});

describe('isLike()', function () {
	it('returns a boolean', function () {
		a = [1, 2, 3];
		expect(a.isLike([1])).toBe(false);
		expect(a.isLike([1, 2, 3])).toBe(true);
		expect(a.isLike([1, 3, 2])).toBe(true);
		expect(a.isLike([1, 1, 1])).toBe(false);
		expect(a.isLike([1, 2, 3, 4])).toBe(false);
		expect(a.isLike([0, 1, 2], function (x, y) { return x === y + 1; })).toBe(true);
	});

	it('throws an error because of invalid parameters', function () {
		a = [1, 2, 3];
		expect(a.isSame.bind(a)).toThrowError();
	});
});

describe('isPart()', function () {
	it('returns a boolean', function () {
		a = [1, 2, 3];
		expect(a.isPart([1])).toBe(false);
		expect(a.isPart([1, 2, 3])).toBe(true);
		expect(a.isPart([1, 3, 2])).toBe(true);
		expect(a.isPart([1, 1, 1])).toBe(false);
		expect(a.isPart([1, 2, 3, 4])).toBe(true);
		expect(a.isPart([0, 1, 2], function (x, y) { return x === y + 1; })).toBe(true);
	});

	it('throws an error because of invalid parameters', function () {
		a = [1, 2, 3];
		expect(a.isPart.bind(a)).toThrowError();
	});
});

describe('indexOf()', function () {
	it('returns a number', function () {
		a = [1, 2, 1];
		expect(a.indexOf(1)).toBe(0);
		expect(a.indexOf(4)).toBe(-1);
		expect(a.indexOf(1, 0)).toBe(0);
		expect(a.indexOf(1, 1)).toBe(2);
		expect(a.indexOf(1, 1)).toBe(2);
		expect(a.indexOf(function (x) { return x === 1; })).toBe(0);
		expect(a.indexOf(function (x) { return x === 4; })).toBe(-1);
		expect(a.indexOf(function (x) { return x === 1; }, 0)).toBe(0);
		expect(a.indexOf(function (x) { return x === 1; }, 1)).toBe(2);
		expect(a.indexOf(function (x) { return x === 1; }, 1)).toBe(2);
	});

	it('throws an error because of invalid parameters', function () {
		a = [1, 2, 3];
		expect(a.indexOf.bind(a)).toThrowError();
		expect(a.indexOf.bind(a, 1, -1)).toThrowError(RangeError);
		expect(a.indexOf.bind(a, 1, 4)).toThrowError(RangeError);
	});
});

describe('lastIndexOf()', function () {
	it('returns a number', function () {
		a = [1, 2, 1];
		expect(a.lastIndexOf(1)).toBe(2);
		expect(a.lastIndexOf(4)).toBe(-1);
		expect(a.lastIndexOf(1, 3)).toBe(2);
		expect(a.lastIndexOf(1, 1)).toBe(0);
		expect(a.lastIndexOf(1, 1)).toBe(0);
		expect(a.lastIndexOf(function (x) { return x === 1; })).toBe(2);
		expect(a.lastIndexOf(function (x) { return x === 4; })).toBe(-1);
		expect(a.lastIndexOf(function (x) { return x === 1; }, 3)).toBe(2);
		expect(a.lastIndexOf(function (x) { return x === 1; }, 1)).toBe(0);
		expect(a.lastIndexOf(function (x) { return x === 1; }, 1)).toBe(0);
	});

	it('throws an error because of invalid parameters', function () {
		a = [1, 2, 3];
		expect(a.lastIndexOf.bind(a)).toThrowError();
		expect(a.lastIndexOf.bind(a, 1, -1)).toThrowError(RangeError);
		expect(a.lastIndexOf.bind(a, 1, 4)).toThrowError(RangeError);
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

	it('throws an error because of invalid parameters', function () {
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
	it('returns the first matched member or throws an error', function () {
		a = [{ v: 1 }, { v: 2 }, { v: 1 }];
		expect(a.first).toThrowError();
		expect(a.first()).toBe(a[0]);
		expect(a.first(function (x) { return x.v === 1; })).toBe(a[0]);
		expect(a.first.bind(a, function (x) { return x.v === 4; })).toThrowError();
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
	it('returns the first matched member or throws an error', function () {
		a = [{ v: 1 }, { v: 2 }, { v: 1 }];
		expect(a.last).toThrowError();
		expect(a.last()).toBe(a[2]);
		expect(a.last(function (x) { return x.v === 1; })).toBe(a[2]);
		expect(a.last.bind(a, function (x) { return x.v === 4; })).toThrowError();
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
	it('returns the first matched member or throws an error', function () {
		a = [{ v: 1 }, { v: 2 }, { v: 1 }];
		expect(a.single).toThrowError();
		expect([1].single()).toBe(1);
		expect(a.single.bind([1, 2, 3])).toThrowError();
		expect(a.single.bind(a, function (x) { return x.v === 1; })).toThrowError();
		expect(a.single(function (x) { return x.v === 2; })).toBe(a[1]);
		expect(a.single.bind(a, function (x) { return x.v === 4; })).toThrowError();
	});
});

describe('distinct()', function () {
	it('returns a new array which has unique members', function () {
		a = [1, 2, 1, 2, 2, undefined, null];
		z = a.distinct();
		expect(z.length).toBe(3);
		expect(z[0]).toBe(1);
		expect(z[1]).toBe(2);
		expect(z[2]).toBeUndefined();

		a = [{ v: 1 }, { v: 2 }, { v: 1 }, { v: undefined }, { v: null }];
		z = a.distinct('v');
		expect(z.length).toBe(3);
		expect(z[0]).toBe(a[0]);
		expect(z[1]).toBe(a[1]);
		expect(z[2]).toBe(a[3]);

		z = a.distinct(function (x) { return x.v; });
		expect(z.length).toBe(3);
		expect(z[0]).toBe(a[0]);
		expect(z[1]).toBe(a[1]);
		expect(z[2]).toBe(a[3]);
	});

	it('throws an error', function () {
		expect([].distinct.bind(null, null)).toThrowError();
	});
});