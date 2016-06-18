describe('create()', function () {
	it('asserts an array', function () {
		a = Array.create([1, 2, 3]);
		expect(a.length).toBe(3);
		expect(a[0]).toBe(1);
		expect(a[1]).toBe(2);
		expect(a[2]).toBe(3);
	});

	it('asserts an array-like', function () {
		a = Array.create({ length: 3, "0": 1, "1": 2, "2": 3 });
		expect(a.length).toBe(3);
		expect(a[0]).toBe(1);
		expect(a[1]).toBe(2);
		expect(a[2]).toBe(3);
	});

	it('asserts an object', function () {
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

	it('asserts a string', function () {
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

	it('asserts nothing', function () {
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
});

describe('toString()', function () {
	it('returns a string with commas-separated', function () {
		expect(['a', 'b', 'c'].toString()).toBe('a,b,c');
	});

	it('returns a string with custom-separated', function () {
		expect(['a', 'b', 'c'].toString(' ')).toBe('a b c');

		try {
			['a', 'b', 'c'].toString(0);
			fail();
		} catch (ex) { }
	});
});
