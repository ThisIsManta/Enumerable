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
		a = [1, 2, 3];
		expect(a._s).toBeUndefined();
		expect(a.bind(null)._s).toBe(null);
		expect(a.bind(this)._s).toBe(this);
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
		a = [{ x: 1, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 6 }];
		z = a.toObject('x');
		expect(typeof z).toBe('object');
		expect(z['1']).toBe(a[0]);
		expect(z['2']).toBe(a[1]);
		expect(z['3']).toBe(a[2]);

		z = a.toObject(function (m, i) { return m.x; });
		expect(typeof z).toBe('object');
		expect(z['1']).toBe(a[0]);
		expect(z['2']).toBe(a[1]);
		expect(z['3']).toBe(a[2]);

		z = a.toObject('x', 'y');
		expect(typeof z).toBe('object');
		expect(z['1']).toBe(4);
		expect(z['2']).toBe(5);
		expect(z['3']).toBe(6);

		z = a.toObject('x', function (m, i) { return m.y; });
		expect(typeof z).toBe('object');
		expect(z['1']).toBe(4);
		expect(z['2']).toBe(5);
		expect(z['3']).toBe(6);

		z = a.toObject(function (m, i) { return m.x; }, 'y');
		expect(typeof z).toBe('object');
		expect(z['1']).toBe(4);
		expect(z['2']).toBe(5);
		expect(z['3']).toBe(6);

		z = a.toObject(function (m, i) { return m.x; }, function (m, i) { return m.y; });
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
		a = [1, [2], { x: null, y: { z: [3] } }];
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

describe('where()', function () {
	it('returns a new array by giving a filter', function () {
		a = [{ x: 1 }, { x: 2 }, { x: 3 }];
		z = a.where('x', 2);
		expect(z.length).toBe(1);
		expect(z[0]).toBe(a[1]);

		z = a.where({ x: 2 });
		expect(z.length).toBe(1);
		expect(z[0]).toBe(a[1]);

		z = a.where(function (m) { return m.x === 2; });
		expect(z.length).toBe(1);
		expect(z[0]).toBe(a[1]);
	});
});

describe('select()', function () {
	it('returns a new array by giving a selector', function () {
		a = [{ x: 1 }, { x: 2 }, { x: 3 }];
		z = a.select('x');
		expect(z.length).toBe(3);
		expect(z[0]).toBe(1);
		expect(z[1]).toBe(2);
		expect(z[2]).toBe(3);

		z = a.select(function (m) { return m.x; });
		expect(z.length).toBe(3);
		expect(z[0]).toBe(1);
		expect(z[1]).toBe(2);
		expect(z[2]).toBe(3);

		z = a.select(['x']);
		expect(z.length).toBe(3);
		expect(z[0]).toEqual({ x: 1 });
		expect(z[1]).toEqual({ x: 2 });
		expect(z[2]).toEqual({ x: 3 });
	});
});

describe('invoke()', function () {
	it('executes a function by giving a small array', function () {
		a = [{ x: 1 }, { x: 2 }, { x: 3 }];
		z = 0;
		a.invoke(function (m) { z += m.x; });
		expect(z).toBe(6);

		z = 0;
		a.invoke(1, function (m) { z += m.x; });
		expect(z).toBe(5);

		z = 0;
		a.invoke(1, 1, function (m) { z += m.x; });
		expect(z).toBe(2);

		z = 0;
		a.invoke(1, 0, function (m) { z += m.x; });
		expect(z).toBe(3);

		z = 0;
		a.invoke(1, 0, -1, function (m) { z += m.x; });
		expect(z).toBe(3);

		z = 0;
		a.invoke(2, 0, -2, function (m) { z += m.x; });
		expect(z).toBe(4);

		z = 0;
		a.invoke(function (m, i, a, b) {
			z += m.x;
			if (i === 1) {
				b();
			}
		});
		expect(z).toBe(3);
	});

	it('executes a function by giving a large array', function () {
		a = Array.create(2048, 1);
		z = 0;
		a.invoke(function (m) { z += m; });
		expect(z).toBe(2048);

		z = 0;
		a.invoke(function (m, i, a, b) {
			z += m;
			if (i === 1536 - 1) {
				b();
			}
		});
		expect(z).toBe(1536);
	});
});

describe('invokeAsync()', function () {
	it('executes a function', function (done) {
		a = [1, 2, 3];
		z = 0;
		p = a.invokeAsync(function (m, i, a, b) {
			z += m;
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
		p = a.invokeAsync(1, function (m, i, a, b) {
			z += m;
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
		p = a.invokeAsync(0, 1, function (m, i, a, b) {
			z += m;
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
		p = a.invokeAsync(1, 0, -1, function (m, i, a, b) {
			z += m;
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
		p = a.invokeAsync(function (m, i, a, b) {
			z += m;
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

	it('executes a function onward with a break', function (done) {
		a = [1, 2, 3];
		z = 0;
		p = a.invokeAsync(function (m, i, a, b) {
			z += m;
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
});
