// LINQ lookalike by Manta (anantachai.saothong@thomsonreuters.com)
// Last modified on June 7th, 2014

/*
	This creates an immutable collection from a given parameter.

	The parameters can be the following:
		()
			This creates a new empty collection.
		(array)
			This creates a new collection from a given array.
		(plain object)
			This creates a new collection containing name-value pairs, excluding all functions and underscore sign leading properties.
		(array-like object)
			This creates a new collection from a given array-like object, only number-indexed properties will be used.
		(string)
			This creates a new collection of characters from a given string.
*/
var Enumerable = function Enumerable() {
	var w = arguments[0];
	var i = -1;
	var b;
	var t;
	var z;
	if (typeof w === 'object') {
		if (w instanceof Array) {
			this.a = w;
			this.m = true;
		} else if (w.constructor !== undefined && w.constructor.name === 'Enumerable' || w instanceof Enumerable) {
			this.a = w.a;
			this.m = true;
		} else if (typeof (b = w.length) === 'number' && b > 0 && w[0] !== undefined) {
			this.a = new Array(w.length);
			while (++i < b) {
				this.a[i] = w[i];
			}
			this.m = false;
		} else {
			z = [];
			for (var n in w) {
				if (w[n] !== undefined && typeof w[n] !== 'function' && n.charAt(0) !== '_') {
					z.push({ name: n, value: w[n] });
				}
			}
			this.a = z;
			this.m = false;
		}
	} else if (typeof w === 'string') {
		this.a = w.split('');
		this.m = false;
	} else if (typeof w === 'undefined') {
		this.a = [];
		this.m = false;
	} else {
		throw 'input was not enumerable';
	}
};

/*
	This returns
*/
Enumerable.prototype.toArray = function () {
	return this.a;
};

Enumerable.prototype.clone = function () {
	var a = this.a;
	var b = this.a.length;
	var z = new Array(b);
	var i = -1;
	while (++i < b) {
		z[i] = a[i];
	}
	this.m = false;
	return new Enumerable(z);
};

Enumerable.prototype.toImmutableArray = function () {
	if (this.m === true) {
		return this.clone().a;
	} else {
		return this.a;
	}
};

Enumerable.prototype.create = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i = -1;
	var z;
	if (w === undefined) {
		w = null;
	}
	if (x === undefined || isNaN(x) || x <= 0) {
		z = [];
	} else {
		z = new Array(x);
		while (++i < x) {
			z[i] = w;
		}
	}
	return new Enumerable(z);
};

/*
  This returns a new immutable collection containing all elements in base collection that match the constraints.

  The parameters can be following:
	(function)
	(plain object)
*/
Enumerable.prototype.where = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	var t;
	var z = [];
	if (typeof w === 'function') {
		while (++i < b) {
			t = this.a[i];
			if (w(t, i)) {
				z.push(t);
			}
		}
	} else if (typeof w === 'object') {
		while (++i < b) {
			t = true;
			for (var j in w) {
				t &= (this.a[i][j] === w[j]);
				if (t === false) {
					break;
				}
			}
			if (t === true) {
				z.push(this.a[i]);
			}
		}
	} else {
		throw 'no input was given';
	}
	return new Enumerable(z);
};

/*
		(function)
		(string)
*/
Enumerable.prototype.select = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	var z = new Array(b);
	if (typeof w === 'function') {
		while (++i < b) {
			z[i] = p(w[i], i);
		}
	} else if (typeof w === 'string') {
		if (w.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			z[i] = this.a[i][n];
		}
	} else {
		throw 'no input was given';
	}
	return new Enumerable(z);
};

/*
		(any, any)
			This replaces all occurrences of first parameter with second parameter.
*/
Enumerable.prototype.replace = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i = -1;
	var b = this.a.length;
	var z = this.toImmutableArray();
	if (w === undefined) {
		throw 'input was not valid';
	}
	if (typeof w === 'function') {
		while (++i < b) {
			if (w(z[i])) {
				z[i] = x;
			}
		}
	} else {
		while (++i < b) {
			if (z[i] === w) {
				z[i] = x;
			}
		}
	}
	return new Enumerable(z);
};

/*
		(function)
			This iterates the given function on current collection.
		(function, object)
			This iterates the given function on current collection but in given object context.
*/
Enumerable.prototype.invoke = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i = -1;
	var b = this.a.length;
	if (typeof w === 'function') {
		if (x === undefined) {
			while (++i < b) {
				w(this.a[i], i);
			}
		} else {
			while (++i < b) {
				w.call(x, this.a[i], i);
			}
		}
	} else {
		throw 'input was not a predicate';
	}
	return this;
};

/*
		(function)
		(number)
		(number, number)
*/
Enumerable.prototype.skip = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i = -1;
	var b = this.a.length;
	var t;
	var z;
	if (typeof w === 'function') {
		t = b;
		while (++i < b) {
			if (w(this.a[i], i) === false) {
				t = i;
				break;
			}
		}
		return this.take(t, b);
	} else if (!isNaN(w) && isNaN(x)) {
		return this.take(w, b);
	} else if (!isNaN(w) && !isNaN(x)) {
		if (w < 0 || w > b) {
			throw 'start index was out of range';
		} else if (x < 0 || x > b) {
			throw 'stop index was out of range';
		} else if (w > x) {
			throw 'start index was greater than stop index';
		} else {
			z = this.toImmutableArray();
			z.splice(w, x - w);
			return new Enumerable(z);
		}
	} else {
		throw 'input was not valid';
	}
};
/*
		(function)
		(number)
		(number, number)
*/
Enumerable.prototype.take = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i = -1;
	var j = -1;
	var k;
	var b = this.a.length;
	var z = [];
	if (typeof w === 'function') {
		k = b;
		while (++i < b) {
			if (w(this.a[i], i) === false) {
				k = i;
				break;
			}
		}
	} else if (!isNaN(w) && isNaN(x)) {
		k = Math.min(w, b);
	} else if (!isNaN(w) && !isNaN(x)) {
		if (w < 0 || w > b) {
			throw 'start index was out of range';
		} else if (x < 0 || x > b) {
			throw 'stop index was out of range';
		} else if (w > x) {
			throw 'start index was greater than stop index';
		}
	} else {
		throw 'input was not valid';
	}
	while (++j < t) {
		z.push(this.a[j]);
	}
	return new Enumerable(z);
};

/*
		(function, +boolean)
		(string, +boolean)
*/
Enumerable.prototype.flatten = function () {
	var w = arguments[0];
	var d = (typeof w === 'function' || typeof w === 'string') ? arguments[1] : w;
	var i = -1;
	var b = this.a.length;
	var j;
	var t;
	if (d === undefined) {
		d = false;
	} else {
		d = !!d;
	}
	var z = [];
	if (typeof w === 'function') {
		while (++i < b) {
			t = this.a[i];
			if (typeof t === 'object' && t instanceof Array && t.length > 0) {
				if (d) {
					t = new Enumerable(t).flatten(w, d).toArray();
				}
				for (j = 0; j < t.length; j++) {
					z.push(w(t[j], j));
				}
			} else {
				z.push(t);
			}
		}
	} else if (typeof w === 'string') {
		if (w.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			t = this.a[i];
			if (typeof t === 'object' && t instanceof Array && t.length > 0) {
				if (d) {
					t = new Enumerable(t).flatten(w, d).toArray();
				}
				for (j = 0; j < t.length; j++) {
					z.push(t[j][w]);
				}
			} else {
				z.push(t);
			}
		}
	} else {
		while (++i < b) {
			t = this.a[i];
			if (typeof t === 'object' && t instanceof Array && t.length > 0) {
				if (d) {
					t = new Enumerable(t).flatten(d).toArray();
				}
				for (j = 0; j < t.length; j++) {
					z.push(t[j]);
				}
			} else {
				z.push(t);
			}
		}
	}
	return new Enumerable(z);
};

/*
		()
			This returns true if and only if there is any element in current collection.
		(function)
		(any)

*/
Enumerable.prototype.any = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	if (b === 0) {
		return false;
	} else if (w === undefined) {
		return true;
	} else if (typeof w === 'function') {
		while (++i < b) {
			if (w(this.a[i], i) === true) {
				return true;
			}
		}
		return false;
	} else {
		while (++i < b) {
			if (this.a[i] === w) {
				return true;
			}
		}
		return false;
	}
};

Enumerable.prototype.all = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	if (b === 0) {
		return true;
	} else if (w === undefined) {
		throw 'input was not valid';
	} else if (typeof w === 'function') {
		while (++i < b) {
			if (p(this.a[i], i) === false) {
				return false;
			}
		}
		return true;
	} else {
		while (++i < b) {
			if (this.a[i] !== w) {
				return false;
			}
		}
		return true;
	}
};

Enumerable.prototype.subsetOf = function () {
	var e = new Enumerable(arguments[0]);
	var i = -1;
	var b = this.a.length;
	while (++i < b) {
		if (!e.contains(this.a[i])) {
			return false;
		}
	}
	return true;
};

Enumerable.prototype.equivalent = function () {
	var e = new Enumerable(arguments[0]);
	var i = -1;
	var b = this.a.length;
	var t;
	if (b !== e.a.length) {
		return false;
	} else {
		while (++i < b) {
			t = e.indexOf(this.a[i]);
			if (t < 0 || e.a.length === 0) {
				return false;
			} else {
				e.removeAt(t);
			}
		}
		return e.a.length === 0;
	}
};

/*
		(function)
		(function, number)
		(object)
		(object, number)
*/
Enumerable.prototype.indexOf = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i = -1;
	var b = this.a.length;
	if (!isNaN(x) && (x < 0 || x > b)) {
		throw 'index was out of range';
	} else {
		x = 0;
	}
	if (x < b) {
		if (typeof w === 'function') {
			while (++i < b) {
				if (w(this.a[i], i) === true) {
					return i;
				}
			}
		} else if (w !== undefined && w !== null) {
			while (++i < b) {
				if (this.a[i] === w) {
					return i;
				}
			}
		} else {
			throw 'input was not valid';
		}
	}
	return -1;
};

Enumerable.prototype.lastIndexOf = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i = this.a.length + 1;
	var b = this.a.length;
	if (!isNaN(x) && (x < 0 || x > b)) {
		throw 'index was out of range';
	} else {
		x = 0;
	}
	if (x < b) {
		if (typeof w === 'function') {
			while (--i >= x) {
				if (p(this.a[i], i) === true) {
					return i;
				}
			}
		} else if (w !== undefined && w !== null) {
			while (--i >= x) {
				if (this.a[i] === w) {
					return i;
				}
			}
		} else {
			throw 'input was not valid';
		}
	}
	return -1;
};

Enumerable.prototype.contains = function () {
	return this.indexOf(arguments[0], arguments[1]) >= 0;
};

Enumerable.prototype.firstOrNull = function () {
	var w = arguments[0];
	if (this.a.length === 0) {
		return null;
	} else if (w === undefined || w === null) {
		return this.a[0];
	}
	var i = this.indexOf(w);
	if (i >= 0) {
		return this.a[i];
	} else {
		return null;
	}
};

Enumerable.prototype.first = function () {
	if (this.a.length === 0) {
		throw 'array was empty';
	} else if (arguments.length === 0) {
		return this.a[0];
	} else {
		var i = this.indexOf(arguments[0]);
		if (i >= 0) {
			return this.a[i];
		} else {
			throw 'no element was matched';
		}
	}
};

Enumerable.prototype.lastOrNull = function () {
	var w = arguments[0];
	if (this.a.length === 0) {
		return null;
	} else if (w === undefined || w === null) {
		return this.a[this.a.length - 1];
	}
	var i = this.lastIndexOf(w);
	if (i >= 0) {
		return this.a[i];
	} else {
		return null;
	}
};

Enumerable.prototype.last = function () {
	if (this.a.length === 0) {
		throw 'array was empty';
	} else if (arguments.length === 0) {
		return this.a[this.a.length - 1];
	} else {
		var i = this.lastIndexOf(arguments[0]);
		if (i >= 0) {
			return this.a[i];
		} else {
			throw 'no element was matched';
		}
	}
};

Enumerable.prototype.singleOrNull = function () {
	var w = arguments[0];
	if (this.a.length === 0) {
		return null;
	}
	var i = this.indexOf(w);
	if (i >= 0 && i === this.lastIndexOf(w)) {
		return this.a[i];
	} else {
		return null;
	}
};

Enumerable.prototype.single = function () {
	var w = arguments[0];
	if (this.a.length === 0) {
		throw 'array was empty';
	}
	var i = this.indexOf(w);
	if (i >= 0) {
		if (i === this.lastIndexOf(w)) {
			return this.a[i];
		} else {
			throw 'more than one element was matched';
		}
	} else {
		throw 'no element was matched';
	}
};

/*
		(string)
		(function)
*/
Enumerable.prototype.distinct = function () {
	var w = arguments[0];
	var h = {};
	var p;
	var b = this.a.length;
	var v;
	var t;
	var r = false;
	var z = [];
	if (typeof w === 'string' && w.length > 0) {
		p = function (t, i) { return t[n]; };
	} else if (typeof w !== 'function') {
		p = function (t) { return t; };
	}
	while (++i < b) {
		v = this.a[i];
		if (v === undefined || v === null) {
			if (r === false) {
				z.push(null);
				r = true;
			}
		} else if (!h[(t = p(v, i).toString())]) {
			h[t] = true;
			z.push(v);
		}
	}
	return new Enumerable(z);
};

Enumerable.prototype.add = function () {
	if (arguments[1] === undefined) {
		var z = this.toImmutableArray();
		z.push(arguments[0]);
		this.a = z;
		return this;
	} else {
		return this.addRange([arguments[0]], arguments[1]);
	}
};

Enumerable.prototype.addRange = function () {
	var e = new Enumerable(arguments[0]);
	var i = arguments[1];
	var j = -1;
	var b = e.a.length;
	if (i !== undefined && isNaN(i) || i < 0 || i > this.a.length) {
		throw 'index was out of range';
	}
	var z = this.toImmutableArray();
	if (i === undefined) {
		z = z.concat(e.a);
	} else if (b === 1) {
		z.splice(i, 0, e.a[0]);
	} else if (b > 0) {
		while (++j < b) {
			z.splice(i + j, 0, e.a[j]);
		}
	}
	this.a = z;
	return this;
};

Enumerable.prototype.remove = function () {
	var w = arguments[0];
	var x = arguments[1];
	var i;
	if (w !== undefined) {
		i = this.indexOf(w);
		if (i === -1 || !isNaN(x) && i > x) {
			return this;
		} else {
			return this.removeAt(i);
		}
	} else {
		throw 'input was not valid';
	}
};

// TO DO BUG FIX
Enumerable.prototype.removeAt = function () {
	var i = arguments[0];
	if (i === undefined || i === null || i < 0 || i > this.a.length) {
		throw 'index was out of range';
	} else {
		var z = this.toImmutableArray();
		z.splice(i, 1);
		this.a = z;
		return this;
	}
};

Enumerable.prototype.removeRange = function () {
	var e = new Enumerable(arguments[0]);
	var i = -1;
	var b = e.a.length;
	while (++i < b) {
		this.remove(e.a[i]);
	}
	return this;
};

Enumerable.prototype.union = function () {
	var e = new Enumerable(arguments[0]);
	var i = -1;
	var b = e.a.length;
	var z = this.toImmutableArray();
	while (++i < b) {
		if (!this.contains(e.a[i])) {
			z.push(e.a[i]);
		}
	}
	return new Enumerable(z);
};

Enumerable.prototype.intersect = function () {
	var e = new Enumerable(arguments[0]);
	var i = -1;
	var b = e.a.length;
	var z = [];
	while (++i < b) {
		if (this.contains(e.a[i])) {
			z.push(e.a[i]);
		}
	}
	return new Enumerable(z);
};

Enumerable.prototype.difference = function () {
	var e = new Enumerable(arguments[0]);
	var i = -1;
	var j;
	var b = e.a.length;
	var z = new Enumerable(this.toImmutableArray());
	z.m = false;
	while (++i < b) {
		j = z.indexOf(e.a[i]);
		if (j >= 0) {
			z.a.splice(j, 1);
		}
	}
	return z;
};

Enumerable.prototype.reverse = function () {
	var a = this.a;
	var b = this.a.length;
	var z = new Array(b);
	var i = -1;
	while (++i < b) {
		z[i] = a[b - i];
	}
	this.m = false;
	return new Enumerable(z);
};

Enumerable.prototype.sort = function () {
	return this.orderBy();
};

Enumerable.prototype.orderBy = function () {
	var w = arguments[0];
	var z;
	if (w !== undefined && w !== null) {
		if (typeof w === 'function') {
			z = this.select(function (x, i) { return { i: i, v: x, r: w(x, i) }; });
		} else if (typeof w === 'string') {
			if (w.length === 0) {
				throw 'name was empty';
			}
			z = this.select(function (x, i) { return { i: i, v: x, r: x[w] }; });
		} else {
			throw 'input was not valid';
		}
		z.a.sort(function (x, y) {
			if (x.r === y.r) {
				return x.i - y.i;
			} else {
				if (x.r > y.r || x.r === void 0) {
					return 1;
				}
				if (x.r < y.r || y.r === void 0) {
					return -1;
				}
				return x.r - y.r;
			}
		});
		return z.select(function (x) { return x.v; });
	} else {
		return new Enumerable(this.toImmutableArray().sort());
	}
};

Enumerable.prototype.groupBy = function () {
	var w = arguments[0];
	var h = {};
	var i = -1;
	var b = this.a.length;
	var t;
	var z = [];
	if (w !== undefined && w !== null) {
		if (typeof w === 'string') {
			if (w.length === 0) {
				throw 'name was empty';
			} else {
				w = function (x) { return x[w]; };
			}
		}
		if (typeof w === 'function') {
			while (++i < b) {
				t = w(this.a[i], i).toString();
				if (h[t] === undefined) {
					h[t] = z.length;
					z[h[t]].push({ name: t, values: new Enumerable() });
				}
				z[h[t]].values.add(this.a[i]);
			}
		} else {
			throw 'input was not valid';
		}
	} else {
		throw 'input was not valid';
	}
	return new Enumerable(z);
};

/*
		(collection, string, +boolean)
		(collection, function, +boolean)
*/
Enumerable.prototype.joinBy = function () {
	var w = new Enumerable(arguments[0]);
	var x = arguments[1];
	var y = arguments[2];
	var i = -1;
	var b = this.a.length;
	var t;
	var u;
	if (this.any(function (o) { return typeof o !== 'object'; }) || w.any(function (o) { return typeof o !== 'object'; })) {
		throw 'one or more element was not an object';
	}
	if (typeof x === 'string') {
		if (x.length === 0) {
			throw 'name was empty';
		}
		x = function (o) { return o[x] === w.a[x]; };
	}
	if (typeof x === 'function') {
		if (y === true) {
			while (++i < b) {
				t = w.firstOrNull(x(this.a[i]));
				if (t !== null) {
					for (u in t) {
						this.a[i][u] = t[u];
					}
				}
			}
		} else {
			while (++i < b) {
				t = w.firstOrNull(x(this.a[i]));
				if (t !== null) {
					for (u in t) {
						if (this.a[i][u] === undefined) {
							this.a[i][u] = t[u];
						}
					}
				}
			}
		}
	} else {
		throw 'input was not valid';
	}
	return this;
};

Enumerable.prototype.count = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	var z = 0;
	if (typeof w === 'function') {
		while (++i < b) {
			if (w(this.a[i], i)) {
				z += 1;
			}
		}
	} else if (w !== undefined) {
		while (++i < b) {
			if (this.a[i] === w) {
				z += 1;
			}
		}
	} else {
		z = this.a.length;
	}
	return z;
};

Enumerable.prototype.min = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	var t;
	var z = Number.MAX_VALUE;
	if (typeof w === 'function') {
		while (++i < b) {
			t = w(this.a[i], i);
			if (!isNaN(t) && isFinite(t) && t < z) {
				z = t;
			}
		}
	} else if (typeof w === 'string') {
		if (w.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			t = this.a[i][w];
			if (!isNaN(t) && isFinite(t) && t < z) {
				z = t;
			}
		}
	} else {
		while (++i < b) {
			t = this.a[i];
			if (!isNaN(t) && isFinite(t) && t < z) {
				z = t;
			}
		}
	}
	return z;
};

Enumerable.prototype.max = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	var t;
	var z = Number.MIN_VALUE;
	if (typeof w === 'function') {
		while (++i < b) {
			t = w(this.a[i], i);
			if (!isNaN(t) && isFinite(t) && t > z) {
				z = t;
			}
		}
	} else if (typeof w === 'string') {
		if (w.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			t = this.a[i][w];
			if (!isNaN(t) && isFinite(t) && t > z) {
				z = t;
			}
		}
	} else {
		while (++i < b) {
			t = this.a[i];
			if (!isNaN(t) && isFinite(t) && t > z) {
				z = t;
			}
		}
	}
	return z;
};

Enumerable.prototype.mid = function () {
	return this.a[Math.floor(this.a.length / 2)];
};

Enumerable.prototype.sum = function () {
	var w = arguments[0];
	var i = -1;
	var b = this.a.length;
	var t;
	var z = 0;
	if (typeof p === 'function') {
		while (++i < b) {
			t = p(this.a[i], i);
			if (!isNaN(t) && isFinite(t)) {
				z += t;
			}
		}
	} else if (typeof n === 'string') {
		if (n.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			t = this.a[i][n];
			if (!isNaN(t) && isFinite(t)) {
				z += t;
			}
		}
	} else {
		while (++i < b) {
			t = this.a[i];
			if (!isNaN(t) && isFinite(t)) {
				z += t;
			}
		}
	}
	return z;
};

Enumerable.prototype.average = function () {
	return this.sum(arguments[0]) / this.a.length;
};

Enumerable.prototype.interpolate = function () {
	var w = arguments[0];
	var h = [];
	var i = 0;
	var j;
	var k;
	var b = this.a.length;
	var t;
	var z = new Array(b);
	if (typeof w === 'string') {
		while (i < w.length) {
			j = w.indexOf('<%=', i);
			if (j >= 0) {
				h.push(w.substring(i, j));
				k = w.indexOf('%>', j);
				if (k === -1) {
					throw 'template was not valid';
				}
				h.push({ n: w.substring(j + 3, k).trim() });
				i = k + 2;
			} else {
				h.push(w.substring(i));
				i = w.length;
			}
		}
		i = -1;
		j = -1;
		k = h.length;
		if (new Enumerable(h).where(function (o) { return typeof o === 'object'; }).any(function (o) { return isNaN(o.n); })) {
			if (this.any(function (o) { return typeof o !== 'object'; })) {
				throw 'one or more element was not an object';
			} else {
				t = true;
			}
		} else {
			t = false;
		}
		while (++i < b) {
			z[i] = '';
			j = -1;
			while (++j < k) {
				if (typeof h[j] === 'string') {
					z[i] += h[j];
				} else if (h[j].n !== '') {
					if (t === true) {
						w = this.a[i][h[j].n];
					} else {
						w = this.a[h[j].n];
					}
					if (typeof w === 'function') {
						z[i] += w().toString();
					} else if (w !== undefined && w !== null) {
						z[i] += w.toString();
					}
				}
			}
		}
	} else {
		throw 'input was not valid';
	}
	return new Enumerable(z);
};

/*
	This adds user-define function or overrides a pre-define function of Enumerable.
		(string, function)
*/
Enumerable.prototype.define = function () {
	var w = arguments[0];
	var x = arguments[1];
	if (typeof w === 'string' && typeof x === 'function') {
		Enumerable.prototype[w] = x;
	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.combo = function () {
	if (this.q === undefined) {
		this.q = [];
	}
};