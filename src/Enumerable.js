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

	if (arguments.length > 1 && typeof arguments[arguments.length - 1] === 'object') {
		this._s = arguments[arguments.length - 1];
	}
};

/*
	This returns
*/
Enumerable.prototype.toArray = function () {
	return this._a;
};

Enumerable.prototype.toImmutableArray = function () {
	if (this._m === true) {
		return this.clone()._a;

	} else {
		return this._a;
	}
};

Enumerable.prototype.toString = function () {
	if (typeof this._o === 'string') {
		return this._o;

	} else {
		var ar0 = arguments[0] || '';
		if (typeof ar0 === 'string') {
			return this._a.join(ar0);

		} else {
			throw 'input was not valid';
		}
	}
};

Enumerable.prototype.toObject = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = {};
	if (ar0 === undefined) {
		while (++idx < bnd) {
			out[idx.toString()] = this._a[idx];
		}

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx).toString();
				out[tmp] = this._a[idx];
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx).toString();
				out[tmp] = this._a[idx];
			}
		}

	} else {
		throw 'input was not valid';
	}
	return out;
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
	return new Enumerable(out, this._s);
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
	return new Enumerable(out, this._s);
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
		if (this._s) {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (ar0.call(this._s, tmp, idx)) {
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
	return new Enumerable(out, this._s);
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
		if (this._s) {
			while (++idx < bnd) {
				out[idx] = ar0.call(this._s, this._a[idx], idx);
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
	return new Enumerable(out, this._s);
};

/*
		(any, any)
			This replaces all occurrences of first parameter with second parameter.
		(any, any, number)
			This replaces some occurrences of first parameter with second parameter by third parameter times.
*/
Enumerable.prototype.replace = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var idx = -1;
	var bnd = this._a.length;
	var out = this.toImmutableArray();
	if (ar0 === undefined) {
		throw 'input was not valid';
	}
	if (typeof ar2 !== 'number' || ar2 < 0) {
		ar2 = Infinity;
	}
	if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd && ar2 > 0) {
				if (ar0.call(this._s, out[idx])) {
					out[idx] = ar1;
					ar2--;
				}
			}

		} else {
			while (++idx < bnd && ar2 > 0) {
				if (ar0(out[idx])) {
					out[idx] = ar1;
					ar2--;
				}
			}
		}

	} else {
		while (++idx < bnd && ar2 > 0) {
			if (out[idx] === ar0) {
				out[idx] = ar1;
				ar2--;
			}
		}
	}
	return new Enumerable(out, this._s);
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
		if (this._s) {
			while (++idx < bnd) {
				if (ar0.call(this._s, this._a[idx], idx) === false) {
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
		if (this._s) {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx) === false) {
					tmp = idx;
					break;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0.call(this._s, this._a[idx], idx) === false) {
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
			return new Enumerable(out, this._s);
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
	return new Enumerable(out, this._s);
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
			if (len > 1) {
				out = out.concat(tmp);

			} else {
				while (++jdx < len) {
					out.push(tmp[jdx]);
				}
			}
		} else {
			out.push(tmp);
		}
	}
	return new Enumerable(out, this._s);
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
		if (this._s) {
			while (++idx < bnd) {
				if (ar0.call(this._s, this._a[idx], idx) === true) {
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
		if (this._s) {
			while (++idx < bnd) {
				if (ar0.call(this._s, this._a[idx], idx) === false) {
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
		if (this.indexOf(arr[idx]) < 0) {
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
			tmp = arr.indexOf(this._a[idx]);
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
			if (this._s) {
				while (++idx < bnd) {
					if (ar0.call(this._s, this._a[idx], idx) === true) {
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
			if (this._s) {
				while (--idx >= ar1) {
					if (ar0.call(this._s, this._a[idx], idx) === true) {
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
			throw 'more than one element were matched';
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
	if (this._s) {
		while (++idx < bnd) {
			val = this._a[idx];
			if (val === undefined || val === null) {
				if (nil === false) {
					out.push(null);
					nil = true;
				}
			} else if (!hsh[(tmp = ar0.call(this._s, val, idx).toString())]) {
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
	return new Enumerable(out, this._s);
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
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx;
	if (ar0 === undefined) {
		throw 'input was not valid';

	} else {
		idx = this.indexOf(ar0);
		if (idx === -1 || !isNaN(ar1) && idx > ar1) {
			return this;
		} else {
			return this.removeAt(idx);
		}
	}
};

Enumerable.prototype.removeAt = function () {
	var ar0 = arguments[0];
	if (ar0 === undefined || ar0 === null || ar0 < 0 || ar0 > this._a.length) {
		throw 'index was out of range';

	} else {
		var out = this.toImmutableArray();
		out.splice(ar0, 1);
		this._a = out;
		return this;
	}
};

Enumerable.prototype.removeRange = function () {
	var arr = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = arr.length;
	while (++idx < bnd) {
		this.remove(arr[idx]);
	}
	return this;
};

Enumerable.prototype.union = function () {
	var arr = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = e.a.length;
	var out = this.toImmutableArray();
	while (++idx < bnd) {
		if (!this.contains(arr[idx])) {
			out.push(arr[idx]);
		}
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.intersect = function () {
	var arr = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = e.a.length;
	var out = [];
	while (++idx < bnd) {
		if (this.contains(arr[idx])) {
			out.push(arr[idx]);
		}
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.difference = function () {
	var arr = new Enumerable(arguments[0])._a;
	var idx = -1;
	var jdx;
	var bnd = arr.length;
	var out = new Enumerable(this.toImmutableArray());
	out._m = false;
	while (++idx < bnd) {
		jdx = out.indexOf(arr[idx]);
		if (jdx >= 0) {
			out._a.splice(jdx, 1);
		}
	}
	return out;
};

Enumerable.prototype.reverse = function () {
	var arr = this._a;
	var idx = 0;
	var bnd = this._a.length;
	var out = new Array(bnd);
	while (++idx < bnd) {
		out[idx] = arr[bnd - idx];
	}
	this._m = false;
	return new Enumerable(out, this._s);
};

Enumerable.prototype.sort = function () {
	return this.orderBy();
};

Enumerable.prototype.orderBy = function () {
	var ar0 = arguments[0];
	var out;
	if (ar0 !== undefined && ar0 !== null) {
		if (typeof ar0 === 'function') {
			if (this._s) {
				out = this.select(function (val, idx) { return { i: idx, v: val, r: ar0.call(this._s, val, idx) }; });
			} else {
				out = this.select(function (val, idx) { return { i: idx, v: val, r: ar0(val, idx) }; });
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'name was empty';
			}
			out = this.select(function (val, idx) { return { i: idx, v: val, r: val[ar0] }; });

		} else {
			throw 'input was not valid';
		}

		out._a.sort(function (x, y) {
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
		return out.select(function (val) { return val.v; });

	} else {
		return new Enumerable(this.toImmutableArray().sort(), this._s);
	}
};

Enumerable.prototype.groupBy = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var nam;
	var out = {};
	if (ar0 !== undefined && ar0 !== null) {
		if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'name was empty';

			} else {
				nam = ar0;
				ar0 = function (val) { return val[nam]; };
			}
		}
		if (typeof ar0 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx).toString();
					if (out[tmp] === undefined) {
						out[tmp] = [this._a[idx]];
					} else {
						out[tmp].push(this._a[idx]);
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx).toString();
					if (out[tmp] === undefined) {
						out[tmp] = [this._a[idx]];
					} else {
						out[tmp].push(this._a[idx]);
					}
				}
			}
			for (tmp in out) {
				out[tmp] = new Enumerable(out[tmp]);
				out[tmp]._m = false;
			}

		} else {
			throw 'input was not valid';
		}
	} else {
		throw 'input was not valid';
	}
	return out;
};

/*
		(collection, string, +boolean)
		(collection, function, +boolean)
*/
Enumerable.prototype.joinBy = function () {
	var arr = new Enumerable(arguments[0]);
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var nam;
	if (this.any(function (obj) { return typeof obj !== 'object'; }) || w.any(function (obj) { return typeof obj !== 'object'; })) {
		throw 'one or more element was not an object';
	}
	if (typeof ar1 === 'string') {
		if (ar1.length === 0) {
			throw 'name was empty';
		}
		ar1 = function (obj) { return obj[ar1] === arr.a[ar1]; };
	}
	if (typeof ar1 === 'function') {
		if (ar2 === true) {
			if (this._s) {
				while (++idx < bnd) {
					tmp = arr.firstOrNull(ar1.call(this._s, this._a[idx]));
					if (tmp !== null) {
						for (nam in tmp) {
							this._a[idx][nam] = tmp[nam];
						}
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = arr.firstOrNull(ar1(this._a[idx]));
					if (tmp !== null) {
						for (nam in tmp) {
							this._a[idx][nam] = tmp[nam];
						}
					}
				}
			}

		} else {
			if (this._s) {
				while (++idx < bnd) {
					tmp = arr.firstOrNull(ar1(this._a[idx]));
					if (tmp !== null) {
						for (nam in tmp) {
							if (this._a[idx][nam] === undefined) {
								this._a[idx][nam] = tmp[nam];
							}
						}
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = arr.firstOrNull(ar1.call(this._s, this._a[idx]));
					if (tmp !== null) {
						for (nam in tmp) {
							if (this._a[idx][nam] === undefined) {
								this._a[idx][nam] = tmp[nam];
							}
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
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var out = 0;
	if (ar0 === undefined) {
		out = this._a.length;

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				if (ar0.call(this._s, this._a[idx], idx)) {
					out += 1;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx)) {
					out += 1;
				}
			}
		}

	} else {
		while (++idx < bnd) {
			if (this._a[idx] === ar0) {
				out += 1;
			}
		}
	}
	return out;
};

Enumerable.prototype.min = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = Number.MAX_VALUE;
	if (ar0 === undefined) {
		while (++idx < bnd) {
			tmp = this._a[idx];
			if (!isNaN(tmp) && isFinite(tmp) && tmp < out) {
				out = tmp;
			}
		}

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx);
				if (!isNaN(tmp) && isFinite(tmp) && tmp < out) {
					out = tmp;
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx);
				if (!isNaN(tmp) && isFinite(tmp) && tmp < out) {
					out = tmp;
				}
			}
		}

	} else if (typeof ar0 === 'string') {
		if (ar0.length === 0) {
			throw 'name was empty';
		}
		while (++idx < bnd) {
			tmp = this._a[idx][ar0];
			if (!isNaN(tmp) && isFinite(tmp) && tmp < out) {
				out = tmp;
			}
		}

	} else {
		throw 'input was not valid';
	}
	return out;
};

Enumerable.prototype.max = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = Number.MIN_VALUE;
	if (ar0 === undefined) {
		while (++idx < bnd) {
			tmp = this._a[idx];
			if (!isNaN(tmp) && isFinite(tmp) && tmp > out) {
				out = tmp;
			}
		}

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx);
				if (!isNaN(tmp) && isFinite(tmp) && tmp > out) {
					out = tmp;
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx);
				if (!isNaN(tmp) && isFinite(tmp) && tmp > out) {
					out = tmp;
				}
			}
		}

	} else if (typeof ar0 === 'string') {
		if (ar0.length === 0) {
			throw 'name was empty';
		}
		while (++idx < bnd) {
			tmp = this._a[idx][ar0];
			if (!isNaN(tmp) && isFinite(tmp) && tmp > out) {
				out = tmp;
			}
		}

	} else {
		throw 'input was not valid';
	}
	return out;
};

Enumerable.prototype.mid = function () {
	return this._a[Math.floor(this._a.length / 2)];
};

Enumerable.prototype.sum = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = 0;
	if (ar0 === undefined) {
		while (++idx < bnd) {
			tmp = this._a[idx];
			if (!isNaN(tmp) && isFinite(tmp)) {
				out += tmp;
			}
		}

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx);
				if (!isNaN(tmp) && isFinite(tmp)) {
					out += tmp;
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx);
				if (!isNaN(tmp) && isFinite(tmp)) {
					out += tmp;
				}
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

	}
	return z;
};

Enumerable.prototype.average = function () {
	return this.sum(arguments[0]) / this._a.length;
};

Enumerable.prototype.interpolate = function () {
	var ar0 = arguments[0];
	var hsh = [];
	var idx = 0;
	var jdx;
	var kdx;
	var out = '';
	if (typeof ar0 === 'string') {
		if (this._i && this._i[ar0]) {
			hsh = this._i[ar0];

		} else {
			while (idx < ar0.length) {
				jdx = ar0.indexOf('<%=', idx);
				if (jdx >= 0) {
					hsh.push(ar0.substring(idx, jdx));
					kdx = ar0.indexOf('%>', jdx);
					if (kdx === -1) {
						throw 'template was not valid';
					}
					hsh.push({ n: ar0.substring(jdx + 3, kdx).trim() });
					idx = kdx + 2;
				} else {
					hsh.push(ar0.substring(idx));
					idx = ar0.length;
				}
			}
			this._i = {};
			this._i[ar0] = hsh;
		}
		jdx = -1;
		kdx = hsh.length;
		while (++jdx < kdx) {
			if (typeof hsh[jdx] === 'string') {
				out += hsh[jdx];

			} else if (hsh[jdx].n !== '') {
				ar0 = this._a[hsh[jdx].n];
				if (typeof ar0 === 'function') {
					if (this._s) {
						out += ar0.call(this._s).toString();

					} else {
						out += ar0().toString();
					}

				} else if (ar0 !== undefined && ar0 !== null) {
					out += ar0.toString();
				}
			}
		}
		this._o = out;

	} else {
		throw 'input was not valid';
	}
	return this;
};

/*
	This adds user-define function or overrides a pre-define function of Enumerable.
		(string, function)
*/
Enumerable.prototype.define = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	if (typeof ar0 === 'string' && typeof ar1 === 'function') {
		Enumerable.prototype[ar0] = ar1;

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.combo = function () {
	if (this.q === undefined) {
		this.q = [];
	}
};

Enumerable.prototype.norm = function () {
	var idx = this._a.length;
	var tmp;
	var out = this.toImmutableArray();
	while (--idx >= 0) {
		tmp = out[idx];
		if (tmp === undefined || tmp === null || typeof tmp === 'string' && tmp.trim() === 0 || typeof tmp === 'number' && (isNaN(tmp) || isFinite(tmp))) {
			out.splice(idx, 1);
		}
	}
	return new Enumerable(out, this._s);
};