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
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var ctx = arguments.length > 1 ? arguments[arguments.length - 1] : null;
	var idx = -1;
	var bnd;
	var nam;
	var tmp;
	var out;
	if (typeof ar0 === 'object') {
		if (ar0 instanceof Array) {
			this._a = ar0;
			this._m = true;

		} else if (ar0.constructor !== undefined && ar0.constructor.name === 'Enumerable' || ar0 instanceof Enumerable) {
			this._a = ar0.a;
			this._m = true;

		} else if (typeof (bnd = ar0.length) === 'number' && bnd >= 0) {
			this._a = new Array(ar0.length);
			while (++idx < bnd) {
				this._a[idx] = ar0[idx];
			}
			this._m = false;

		} else {
			out = [];
			if (typeof ar1 === 'string') {
				if (ar2 === undefined || typeof ar2 !== 'string') {
					ar2 = 'value';
				}
				for (nam in ar0) {
					if (ar0[nam] !== undefined && typeof ar0[nam] !== 'function' && nam.charAt(0) !== '_') {
						tmp = {};
						tmp[ar1] = nam;
						tmp[ar2] = ar0[nam];
						out.push(tmp);
					}
				}

			} else {
				for (nam in ar0) {
					if (ar0[nam] !== undefined && typeof ar0[nam] !== 'function' && nam.charAt(0) !== '_') {
						out.push({ name: nam, value: ar0[nam] });
					}
				}
			}
			this._a = out;
			this._m = false;
		}

	} else if (typeof ar0 === 'string') {
		this._a = ar0.split(ar1 || '');
		this._m = false;

	} else if (typeof w === 'undefined') {
		this._a = [];
		this._m = false;

	} else {
		throw 'input was not enumerable';
	}

	if (typeof ctx === 'object') {
		this._c = ctx;
	}
};

/*
	This returns
*/
Enumerable.prototype.toArray = function () {
	return this._a;
};

Enumerable.prototype.toString = function () {
	var ar0 = arguments[0] || '';
	if (typeof ar0 === 'string') {
		return this._a.join(ar0);

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.toImmutableArray = function () {
	if (this._m === true) {
		return this.clone()._a;

	} else {
		return this._a;
	}
};

Enumerable.prototype.clone = function () {
	var arr = this._a;
	var idx = -1;
	var bnd = this._a.length;
	var out = new Array(bnd);
	while (++idx < bnd) {
		out[idx] = arr[idx];
	}
	this._m = false;
	return new Enumerable(out, this._c);
};

Enumerable.prototype.create = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var out;
	if (ar0 === undefined) {
		throw 'input was not valid';

	} else if (ar1 === undefined || isNaN(ar1) || ar1 <= 0) {
		out = [ar0];

	} else {
		out = new Array(ar1);
		while (++idx < ar1) {
			out[idx] = ar0;
		}
	}
	return new Enumerable(out, this._c);
};

/*
  This returns a new immutable collection containing all elements in base collection that match the constraints.

  The parameters can be following:
	(function)
	(plain object)
*/
Enumerable.prototype.where = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var chk;
	var tmp;
	var nam;
	var out = [];
	if (typeof ar0 === 'function') {
		if (this._c) {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (ar0.call(this._c, tmp, idx)) {
					out.push(tmp);
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (ar0(tmp, idx)) {
					out.push(tmp);
				}
			}
		}

	} else if (typeof ar0 === 'object') {
		while (++idx < bnd) {
			chk = 1;
			tmp = this._a[i];
			for (nam in ar0) {
				chk &= (tmp[nam] === ar0[nam]);
				if (!chk) {
					break;
				}
			}
			if (chk) {
				out.push(tmp);
			}
		}

	} else {
		throw 'input was not valid';
	}
	return new Enumerable(out, this._c);
};

/*
		(function)
		(string)
*/
Enumerable.prototype.select = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var out = new Array(bnd);
	if (typeof ar0 === 'function') {
		if (this._c) {
			while (++idx < bnd) {
				out[idx] = ar0.call(this._c, this._a[idx], idx);
			}

		} else {
			while (++idx < bnd) {
				out[idx] = ar0(this._a[idx], idx);
			}
		}

	} else if (typeof ar0 === 'string') {
		if (ar0.length > 0) {
			while (++idx < bnd) {
				out[idx] = this._a[idx][ar0];
			}

		} else {
			throw 'name was empty';
		}

	} else {
		throw 'no input was given';
	}
	return new Enumerable(out, this._c);
};

/*
		(any, any)
			This replaces all occurrences of first parameter with second parameter.
*/
Enumerable.prototype.replace = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	var out = this.toImmutableArray();
	if (ar0 === undefined) {
		throw 'input was not valid';
	}
	if (typeof ar0 === 'function') {
		if (this._c) {
			while (++idx < bnd) {
				if (ar0.call(this._c, out[idx])) {
					out[idx] = ar1;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0(out[idx])) {
					out[idx] = ar1;
				}
			}
		}

	} else {
		while (++idx < bnd) {
			if (out[idx] === ar0) {
				out[idx] = ar1;
			}
		}
	}
	return new Enumerable(out, this._c);
};

/*
		(function)
			This iterates the given function on current collection.
*/
Enumerable.prototype.invoke = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	if (typeof ar0 === 'function') {
		if (this._c) {
			while (++idx < bnd) {
				if (ar0.call(this._c, this._a[idx], idx) === false) {
					break;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx) === false) {
					break;
				}
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
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out;
	if (typeof ar0 === 'function') {
		tmp = bnd;
		if (this._c) {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx) === false) {
					tmp = idx;
					break;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0.call(this._c, this._a[idx], idx) === false) {
					tmp = idx;
					break;
				}
			}
		}
		return this.take.call(this, tmp, bnd);

	} else if (!isNaN(ar0) && isNaN(ar1)) {
		return this.take.call(this, ar0, bnd);

	} else if (!isNaN(ar0) && !isNaN(ar1)) {
		if (ar0 < 0 || ar0 > bnd) {
			throw 'start index was out of range';
		} else if (ar0 < 0 || ar1 > bnd) {
			throw 'stop index was out of range';
		} else if (ar0 > ar1) {
			throw 'start index was greater than stop index';
		} else {
			out = this.toImmutableArray();
			out.splice(ar0, ar1 - ar0);
			return new Enumerable(out, this._c);
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
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var jdx = -1;
	var kdx;
	var bnd = this._a.length;
	var out = [];
	if (typeof ar0 === 'function') {
		kdx = bnd;
		while (++idx < bnd) {
			if (ar0(this._a[idx], idx) === false) {
				kdx = idx;
				break;
			}
		}

	} else if (!isNaN(ar0) && isNaN(ar1)) {
		kdx = Math.min(ar0, bnd);

	} else if (!isNaN(ar0) && !isNaN(ar1)) {
		if (ar0 < 0 || ar0 > b) {
			throw 'start index was out of range';
		} else if (ar1 < 0 || ar1 > b) {
			throw 'stop index was out of range';
		} else if (ar0 > ar1) {
			throw 'start index was greater than stop index';
		} else {
			jdx = ar0 - 1;
			kdx = ar1;
		}

	} else {
		throw 'input was not valid';
	}
	while (++jdx < kdx) {
		out.push(this._a[jdx]);
	}
	return new Enumerable(out, this._c);
};

/*
		(function, +boolean)
		(string, +boolean)
*/
Enumerable.prototype.flatten = function () {
	var ar0 = !!arguments[0];
	var idx = -1;
	var jdx;
	var bnd = this._a.length;
	var len;
	var tmp;
	var out = [];
	while (++idx < bnd) {
		tmp = this._a[idx];
		if (typeof tmp === 'object' && tmp instanceof Array && tmp.length > 0) {
			if (ar0) {
				tmp = new Enumerable(tmp).flatten(ar0).toArray();
			}
			jdx = -1;
			len = tmp.length;
			while (++jdx < len) {
				out.push(tmp[jdx]);
			}
		} else {
			out.push(tmp);
		}
	}
	return new Enumerable(out, this._c);
};

/*
		()
			This returns true if and only if there is any element in current collection.
		(function)
		(any)

*/
Enumerable.prototype.any = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	if (bnd === 0) {
		return false;

	} else if (ar0 === undefined) {
		return true;

	} else if (typeof ar0 === 'function') {
		if (this._c) {
			while (++idx < bnd) {
				if (ar0.call(this._c, this._a[idx], idx) === true) {
					return true;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx) === true) {
					return true;
				}
			}
		}
		return false;

	} else {
		while (++idx < bnd) {
			if (this._a[idx] === ar0) {
				return true;
			}
		}
		return false;
	}
};

Enumerable.prototype.all = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	if (bnd === 0) {
		return true;

	} else if (ar0 === undefined) {
		throw 'input was empty';

	} else if (typeof ar0 === 'function') {
		if (this._c) {
			while (++idx < bnd) {
				if (ar0.call(this._c, this._a[idx], idx) === false) {
					return false;
				}
			}
		} else {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx) === false) {
					return false;
				}
			}
		}
		return true;

	} else {
		while (++idx < bnd) {
			if (this._a[idx] !== ar0) {
				return false;
			}
		}
		return true;
	}
};

Enumerable.prototype.subsetOf = function () {
	var arr = new Enumerable(arguments[0]).a;
	var idx = -1;
	var bnd = arr.length;
	while (++idx < bnd) {
		if (this.indexOf.call(this, arr[idx]) < 0) {
			return false;
		}
	}
	return true;
};

Enumerable.prototype.equivalent = function () {
	var arr = new Enumerable(arguments[0]);
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	if (bnd !== arr.a.length) {
		return false;

	} else {
		while (++idx < bnd) {
			tmp = arr.indexOf.call(this, this._a[idx]);
			if (tmp < 0 || arr.a.length === 0) {
				return false;
			} else {
				arr.removeAt(tmp);
			}
		}
		return arr.a.length === 0;
	}
};

/*
		(function)
		(function, number)
		(object)
		(object, number)
*/
Enumerable.prototype.indexOf = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	if (!isNaN(ar1) && (ar1 < 0 || ar1 > b)) {
		throw 'index was out of range';
	} else {
		ar1 = 0;
	}
	if (ar1 < bnd) {
		if (typeof ar0 === 'function') {
			if (this._c) {
				while (++idx < bnd) {
					if (ar0.call(this._c, this._a[idx], idx) === true) {
						return idx;
					}
				}

			} else {
				while (++idx < bnd) {
					if (ar0(this._a[idx], idx) === true) {
						return idx;
					}
				}
			}

		} else if (ar0 !== undefined && ar0 !== null) {
			while (++idx < bnd) {
				if (this._a[idx] === ar0) {
					return idx;
				}
			}

		} else {
			throw 'input was not valid';
		}
	}
	return -1;
};

Enumerable.prototype.lastIndexOf = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = this._a.length + 1;
	var bnd = this._a.length;
	if (!isNaN(ar1) && (ar1 < 0 || ar1 > b)) {
		throw 'index was out of range';
	} else {
		ar1 = 0;
	}
	if (ar1 < bnd) {
		if (typeof ar0 === 'function') {
			if (this._c) {
				while (--idx >= ar1) {
					if (ar0.call(this._c, this._a[idx], idx) === true) {
						return idx;
					}
				}

			} else {
				while (--idx >= ar1) {
					if (ar0(this._a[idx], idx) === true) {
						return idx;
					}
				}
			}

		} else if (ar0 !== undefined && ar0 !== null) {
			while (--idx >= ar1) {
				if (this._a[idx] === ar0) {
					return idx;
				}
			}

		} else {
			throw 'input was not valid';
		}
	}
	return -1;
};

Enumerable.prototype.contains = function () {
	return this.indexOf.apply(this, arguments) >= 0;
};

Enumerable.prototype.firstOrNull = function () {
	var ar0 = arguments[0];
	if (this._a.length === 0) {
		return null;

	} else if (ar0 === undefined || ar0 === null) {
		return this._a[0];
	}
	var idx = this.indexOf.apply(this, arguments);
	if (idx >= 0) {
		return this._a[idx];

	} else {
		return null;
	}
};

Enumerable.prototype.first = function () {
	if (this._a.length === 0) {
		throw 'array was empty';

	} else if (arguments.length === 0) {
		return this._a[0];

	} else {
		var idx = this.indexOf.apply(this, arguments);
		if (idx >= 0) {
			return this._a[idx];
		} else {
			throw 'no element was matched';
		}
	}
};

Enumerable.prototype.lastOrNull = function () {
	var ar0 = arguments[0];
	if (this._a.length === 0) {
		return null;

	} else if (ar0 === undefined || ar0 === null) {
		return this._a[this._a.length - 1];
	}
	var idx = this.lastIndexOf.apply(this, arguments);
	if (idx >= 0) {
		return this._a[idx];

	} else {
		return null;
	}
};

Enumerable.prototype.last = function () {
	if (this._a.length === 0) {
		throw 'array was empty';

	} else if (arguments.length === 0) {
		return this._a[this._a.length - 1];

	} else {
		var idx = this.lastIndexOf.apply(this, arguments);
		if (idx >= 0) {
			return this._a[idx];

		} else {
			throw 'no element was matched';
		}
	}
};

Enumerable.prototype.singleOrNull = function () {
	if (this._a.length === 0) {
		return null;
	}
	var idx = this.indexOf.apply(this, arguments);
	if (idx >= 0 && idx === this.lastIndexOf.apply(this, arguments)) {
		return this._a[idx];

	} else {
		return null;
	}
};

Enumerable.prototype.single = function () {
	if (this._a.length === 0) {
		throw 'array was empty';
	}
	var idx = this.indexOf.apply(this, arguments);
	if (idx >= 0) {
		if (idx === this.lastIndexOf.apply(this, arguments)) {
			return this._a[idx];

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
	var ar0 = arguments[0];
	var hsh = {};
	var idx = -1;
	var bnd = this._a.length;
	var nam;
	var val;
	var tmp;
	var nil = false;
	var out = [];
	if (ar0 === undefined) {
		ar0 = function (obj) { return obj; };

	} else if (typeof ar0 === 'string' && ar0.length > 0) {
		nam = ar0;
		ar0 = function (obj) { return obj[nam]; };

	} else if (typeof ar0 !== 'function') {
		throw 'input was not valid';
	}
	if (this._c) {
		while (++idx < bnd) {
			val = this._a[idx];
			if (val === undefined || val === null) {
				if (nil === false) {
					out.push(null);
					nil = true;
				}
			} else if (!hsh[(tmp = ar0.call(this._c, val, idx).toString())]) {
				hsh[tmp] = true;
				out.push(val);
			}
		}
	} else {
		while (++idx < bnd) {
			val = this._a[idx];
			if (val === undefined || val === null) {
				if (nil === false) {
					out.push(null);
					nil = true;
				}
			} else if (!hsh[(tmp = ar0(val, idx).toString())]) {
				hsh[tmp] = true;
				out.push(val);
			}
		}
	}
	return new Enumerable(out, this._c);
};

Enumerable.prototype.add = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var out = this.toImmutableArray();
	if (ar1 === undefined) {
		out.push(ar0);
		this._a = out;
	} else if (typeof ar1 === 'number' && ar1 >= 0 && ar1 <= this._a.length) {
		out.splice(ar1, 0, ar0);
		this._a = out;
	}
	return this;
};

Enumerable.prototype.addRange = function () {
	var arr = new Enumerable(arguments[0]).a;
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	var out = this.toImmutableArray();
	if (ar1 === undefined) {
		out = out.concat(arr);

	} else if (typeof ar1 !== 'number' || !isFinite(ar1) || ar1 < 0 || ar1 > this._a.length) {
		throw 'index was out of range';

	} else if (bnd === 1) {
		out.splice(ar1, 0, arr[0]);

	} else if (bnd > 0) {
		while (++idx < bnd) {
			out.splice(ar1 + idx, 0, arr[idx]);
		}
	}
	this.a = out;
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
	if (i === undefined || i === null || i < 0 || i > this._a.length) {
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
	var b = this._a.length;
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
	var b = this._a.length;
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
				t = w(this._a[i], i).toString();
				if (h[t] === undefined) {
					h[t] = z.length;
					z[h[t]].push({ name: t, values: new Enumerable() });
				}
				z[h[t]].values.add(this._a[i]);
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
	var b = this._a.length;
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
				t = w.firstOrNull(x(this._a[i]));
				if (t !== null) {
					for (u in t) {
						this._a[i][u] = t[u];
					}
				}
			}
		} else {
			while (++i < b) {
				t = w.firstOrNull(x(this._a[i]));
				if (t !== null) {
					for (u in t) {
						if (this._a[i][u] === undefined) {
							this._a[i][u] = t[u];
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
	var b = this._a.length;
	var z = 0;
	if (typeof w === 'function') {
		while (++i < b) {
			if (w(this._a[i], i)) {
				z += 1;
			}
		}
	} else if (w !== undefined) {
		while (++i < b) {
			if (this._a[i] === w) {
				z += 1;
			}
		}
	} else {
		z = this._a.length;
	}
	return z;
};

Enumerable.prototype.min = function () {
	var w = arguments[0];
	var i = -1;
	var b = this._a.length;
	var t;
	var z = Number.MAX_VALUE;
	if (typeof w === 'function') {
		while (++i < b) {
			t = w(this._a[i], i);
			if (!isNaN(t) && isFinite(t) && t < z) {
				z = t;
			}
		}
	} else if (typeof w === 'string') {
		if (w.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			t = this._a[i][w];
			if (!isNaN(t) && isFinite(t) && t < z) {
				z = t;
			}
		}
	} else {
		while (++i < b) {
			t = this._a[i];
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
	var b = this._a.length;
	var t;
	var z = Number.MIN_VALUE;
	if (typeof w === 'function') {
		while (++i < b) {
			t = w(this._a[i], i);
			if (!isNaN(t) && isFinite(t) && t > z) {
				z = t;
			}
		}
	} else if (typeof w === 'string') {
		if (w.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			t = this._a[i][w];
			if (!isNaN(t) && isFinite(t) && t > z) {
				z = t;
			}
		}
	} else {
		while (++i < b) {
			t = this._a[i];
			if (!isNaN(t) && isFinite(t) && t > z) {
				z = t;
			}
		}
	}
	return z;
};

Enumerable.prototype.mid = function () {
	return this._a[Math.floor(this._a.length / 2)];
};

Enumerable.prototype.sum = function () {
	var w = arguments[0];
	var i = -1;
	var b = this._a.length;
	var t;
	var z = 0;
	if (typeof p === 'function') {
		while (++i < b) {
			t = p(this._a[i], i);
			if (!isNaN(t) && isFinite(t)) {
				z += t;
			}
		}
	} else if (typeof n === 'string') {
		if (n.length === 0) {
			throw 'name was empty';
		}
		while (++i < b) {
			t = this._a[i][n];
			if (!isNaN(t) && isFinite(t)) {
				z += t;
			}
		}
	} else {
		while (++i < b) {
			t = this._a[i];
			if (!isNaN(t) && isFinite(t)) {
				z += t;
			}
		}
	}
	return z;
};

Enumerable.prototype.average = function () {
	return this.sum(arguments[0]) / this._a.length;
};

Enumerable.prototype.interpolate = function () {
	var w = arguments[0];
	var h = [];
	var i = 0;
	var j;
	var k;
	var b = this._a.length;
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
						w = this._a[i][h[j].n];
					} else {
						w = this._a[h[j].n];
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

//Enumerable.prototype.norm = function () {
//	var i = -1;
//	var b = this._a.length;
//	var z = this.toImmutableArray();
//	while (++i < b) {

//	}
//};