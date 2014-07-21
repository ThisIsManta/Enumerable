// A JavaScript library provides useful and handy query functions.
// Initiated by Manta (anantachai.saothong@thomsonreuters.com)
// Last modified on July 7th, 2014

/*
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
			this._a = ar0._a;
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

	} else if (typeof ar0 === 'undefined') {
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
	var ar0 = arguments[0];
	if (ar0 === undefined) {
		return this._a.join('');

	} else if (typeof ar0 === 'string') {
		return this._a.join(ar0);

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.toObject = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = {};
	if (ar0 === undefined) {
		while (++idx < bnd) {
			out[idx.toString()] = this._a[idx];
		}

	} else if (typeof ar0 === 'string') {
		while (++idx < bnd) {
			out[ar0 + idx.toString()] = this._a[idx];
		}

	} else if (typeof ar0 === 'function') { // Name generator function
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
	This returns a new collection containing all elements in base collection that match the constraints.

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
			tmp = this._a[idx];
			for (nam in ar0) {
				chk &= tmp[nam] === ar0[nam];
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
	if (arguments.length === 1) {
		return this.selectAll.apply(this, arguments);

	} else if (arguments.length === 2) {
		return this.selectSome.apply(this, arguments);

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.selectAll = function () {
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
		if (ar0.length === 0) {
			throw 'name was empty';
		}
		while (++idx < bnd) {
			out[idx] = this._a[idx][ar0];
		}

	} else {
		throw 'input was not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.selectSome = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	var chk;
	var tmp;
	var nam;
	var out = [];
	if (typeof ar0 === 'function') {
		if (typeof ar1 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = this._a[idx];
					if (ar0.call(this._s, tmp, idx)) {
						out.push(ar1.call(this._s, tmp, idx));
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = this._a[idx];
					if (ar0(tmp, idx)) {
						out.push(ar1(tmp, idx));
					}
				}
			}

		} else if (typeof ar1 === 'string') {
			if (ar1.length === 0) {
				throw 'name was empty';
			}
			if (this._s) {
				while (++idx < bnd) {
					tmp = this._a[idx];
					if (ar0.call(this._s, tmp, idx)) {
						out.push(tmp[ar1]);
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = this._a[idx];
					if (ar0(tmp, idx)) {
						out.push(tmp[ar1]);
					}
				}
			}

		} else {
			throw 'input was not valid';
		}

	} else if (typeof ar0 === 'object') {
		if (typeof ar1 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					chk = 1;
					tmp = this._a[idx];
					for (nam in ar0) {
						chk &= tmp[nam] === ar0[nam];
						if (!chk) {
							break;
						}
					}
					if (chk) {
						out.push(ar1.call(this._s, tmp, idx));
					}
				}

			} else {
				while (++idx < bnd) {
					chk = 1;
					tmp = this._a[idx];
					for (nam in ar0) {
						chk &= tmp[nam] === ar0[nam];
						if (!chk) {
							break;
						}
					}
					if (chk) {
						out.push(ar1(tmp, idx));
					}
				}
			}

		} else if (typeof ar1 === 'string') {
			while (++idx < bnd) {
				chk = 1;
				tmp = this._a[idx];
				for (nam in ar0) {
					chk &= tmp[nam] === ar0[nam];
					if (!chk) {
						break;
					}
				}
				if (chk) {
					out.push(tmp[ar1]);
				}
			}

		} else {
			throw 'input was not valid';
		}

	} else {
		throw 'input was not valid';
	}
	return new Enumerable(out, this._s);
};

/*
		(anything, anything)
			This replaces all occurrences of first parameter with second parameter.
		(anything, anything, number)
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

Enumerable.prototype.replaceAll = function () {
	if (arguments.length === 2) {
		return this.replace.call(this, arguments[0], arguments[1], Infinity);

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.replaceSome = function () {
	if (arguments.length === 3 && typeof arguments[2] === 'number' && isFinite(arguments[2])) {
		return this.replace.apply(this, arguments);

	} else {
		throw 'input was not valid';
	}
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
				if (ar0.call(this._s, this._a[idx], idx) === false) {
					tmp = idx;
					break;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx) === false) {
					tmp = idx;
					break;
				}
			}
		}
		return this.take.call(this, tmp, bnd);

	} else if (!isFinite(ar0) || ar0 === Number.MAX_VALUE) {
		return new Enumerable([], this._s);

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
		if (this._s) {
			while (++idx < bnd) {
				if (ar0.call(this._s, this._a[idx], idx) === false) {
					kdx = idx;
					break;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx) === false) {
					kdx = idx;
					break;
				}
			}
		}

	} else if (!isFinite(ar0) || ar0 === Number.MAX_VALUE) {
		return new Enumerable(this.toImmutableArray(), this._s);

	} else if (!isNaN(ar0) && isNaN(ar1)) {
		kdx = Math.min(ar0, bnd);

	} else if (!isNaN(ar0) && !isNaN(ar1)) {
		if (ar0 < 0 || ar0 > bnd) {
			throw 'start index was out of range';
		} else if (ar1 < 0 || ar1 > bnd) {
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
				if (ar0.call(this._s, this._a[idx], idx)) {
					return true;
				}
			}

		} else {
			while (++idx < bnd) {
				if (ar0(this._a[idx], idx)) {
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
				if (!ar0.call(this._s, this._a[idx], idx)) {
					return false;
				}
			}
		} else {
			while (++idx < bnd) {
				if (!ar0(this._a[idx], idx)) {
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

Enumerable.prototype.isSubsetOf = function () {
	var arr = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = arr.length;
	while (++idx < bnd) {
		if (this.indexOf(arr[idx]) < 0) {
			return false;
		}
	}
	return true;
};

/*
		(array)
		(array, function)
		(array-like object)
		(array-like object, function)
*/
Enumerable.prototype.isEquivalentTo = function () {
	var arr = new Enumerable(arguments[0]);
	var ar1 = arguments[1];
	var idx = -1;
	var jdx;
	var bnd = this._a.length;
	var cnd;
	var tmp;
	if (bnd !== arr._a.length || ((bnd === 0) !== (arr._a.length === 0))) {
		return false;

	} else if (ar1 === undefined) {
		while (++idx < bnd) {
			tmp = arr.indexOf(this._a[idx]);
			if (tmp < 0) {
				return false;
			} else {
				arr.removeAt(tmp);
			}
		}
		return arr._a.length === 0;

	} else if (typeof ar1 === 'function') {
		while (++idx < bnd) {
			tmp = this._a[idx];
			jdx = -1;
			cnd = arr._a.length;
			if (this._s) {
				while (++jdx < cnd) {
					if (ar1.call(this._s, tmp, arr._a[jdx])) {
						break;
					}
				}

			} else {
				while (++jdx < cnd) {
					if (ar1(tmp, arr._a[jdx])) {
						break;
					}
				}
			}
			if (jdx === cnd) {
				return false;
			} else {
				arr.removeAt(jdx);
			}
		}
		return arr._a.length === 0;

	} else {
		throw 'input was not valid';
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
	if (typeof ar1 === 'number') {
		if (ar1 >= 0 || ar1 <= bnd) {
			idx = ar1 - 1;
		} else {
			throw 'index was out of range';
		}
	}
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
	return -1;
};

Enumerable.prototype.lastIndexOf = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = this._a.length;
	if (typeof ar1 === 'number') {
		if (ar1 >= 0 || ar1 <= idx) {
			idx = ar1;
		} else {
			throw 'index was out of range';
		}
	}
	if (typeof ar0 === 'function') {
		if (this._s) {
			while (--idx >= 0) {
				if (ar0.call(this._s, this._a[idx], idx) === true) {
					return idx;
				}
			}

		} else {
			while (--idx >= 0) {
				if (ar0(this._a[idx], idx) === true) {
					return idx;
				}
			}
		}

	} else if (ar0 !== undefined && ar0 !== null) {
		while (--idx >= 0) {
			if (this._a[idx] === ar0) {
				return idx;
			}
		}

	} else {
		throw 'input was not valid';
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

	} else if (arguments.length === 0) {
		if (this._a.length === 1) {
			return this._a[0];

		} else {
			return null;
		}

	} else if (arguments.length === 1) {
		var idx = this.indexOf.call(this, arguments[0]);
		if (idx >= 0) {
			if (idx === this.lastIndexOf.call(this, arguments[0])) {
				return this._a[idx];

			} else {
				return null;
			}

		} else {
			return null;
		}

	} else {
		throw 'index was not supported';
	}
};

Enumerable.prototype.single = function () {
	if (this._a.length === 0) {
		throw 'array was empty';

	} else if (arguments.length === 0) {
		if (this._a.length === 1) {
			return this._a[0];

		} else {
			throw 'array was contained more than one element';
		}

	} else if (arguments.length === 1) {
		var idx = this.indexOf.call(this, arguments[0]);
		if (idx >= 0) {
			if (idx === this.lastIndexOf.call(this, arguments[0])) {
				return this._a[idx];

			} else {
				throw 'more than one element were matched';
			}

		} else {
			throw 'no element was matched';
		}

	} else {
		throw 'index was not supported';
	}
};

/*
		(string)
		(function)

		This function treats undefined and null values as the same thing.
*/
Enumerable.prototype.distinct = function () {
	var ar0 = arguments[0];
	var hsh = {};
	var idx = -1;
	var bnd = this._a.length;
	var nam;
	var tmp;
	var nil = false;
	var out = [];
	if (ar0 === undefined) {
		while (++idx < bnd) {
			tmp = this._a[idx];
			if (tmp === undefined || tmp === null) {
				if (nil === false) {
					nil = true;
					out.push(tmp);
				}

			} else if (hsh[(tmp = tmp.toString())] === undefined) {
				hsh[tmp] = true;
				out.push(this._a[idx]);
			}
		}

	} else if (typeof ar0 === 'string' && ar0.length > 0) {
		while (++idx < bnd) {
			tmp = this._a[idx][ar0];
			if (tmp === undefined || tmp === null) {
				if (nil === false) {
					nil = true;
					out.push(tmp);
				}

			} else if (hsh[(tmp = tmp.toString())] === undefined) {
				hsh[tmp] = true;
				out.push(this._a[idx]);
			}
		}

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx);
				if (tmp === undefined || tmp === null) {
					if (nil === false) {
						nil = true;
						out.push(null);
					}

				} else if (hsh[(tmp = tmp.toString())] === undefined) {
					hsh[tmp] = true;
					out.push(this._a[idx]);
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx);
				if (tmp === undefined || tmp === null) {
					if (nil === false) {
						nil = true;
						out.push(null);
					}

				} else if (hsh[(tmp = tmp.toString())] === undefined) {
					hsh[tmp] = true;
					out.push(this._a[idx]);
				}
			}
		}

	} else {
		throw 'input was not valid';
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

	} else if (typeof ar1 === 'number') {
		if (!isNaN(ar1) && ar1 >= 0 && ar1 <= this._a.length) {
			out.splice(ar1, 0, ar0);
			this._a = out;

		} else {
			throw 'index was out of range';
		}
	}
	return this;
};

Enumerable.prototype.addRange = function () {
	var ar0 = new Enumerable(arguments[0])._a;
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = ar0.length;
	var out = this.toImmutableArray();
	if (ar1 === undefined) {
		out = out.concat(ar0);

	} else if (typeof ar1 !== 'number' || isNaN(ar1) || ar1 < 0 || ar1 > this._a.length) {
		throw 'index was out of range';

	} else if (bnd === 1) {
		out.splice(ar1, 0, ar0[0]);

	} else if (bnd > 0) {
		while (++idx < bnd) {
			out.splice(ar1 + idx, 0, ar0[idx]);
		}
	}
	this._a = out;
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
	var ar0 = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = ar0.length;
	while (++idx < bnd) {
		this.remove(ar0[idx]);
	}
	return this;
};

Enumerable.prototype.union = function () {
	var ar0 = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = ar0.length;
	var out = this.toImmutableArray();
	while (++idx < bnd) {
		if (!this.contains(ar0[idx])) {
			out.push(ar0[idx]);
		}
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.intersect = function () {
	var ar0 = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = ar0.length;
	var out = [];
	while (++idx < bnd) {
		if (this.contains(ar0[idx])) {
			out.push(ar0[idx]);
		}
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.difference = function () {
	var ar0 = new Enumerable(arguments[0])._a;
	var idx = -1;
	var jdx;
	var bnd = ar0.length;
	var out = new Enumerable(this.toImmutableArray(), this._s);
	out._m = false;
	while (++idx < bnd) {
		jdx = out.indexOf(ar0[idx]);
		if (jdx >= 0) {
			out._a.splice(jdx, 1);
		}
	}
	return out;
};

Enumerable.prototype.reverse = function () {
	var arr = this._a;
	var idx = -1;
	var bnd = this._a.length;
	var out = new Array(bnd);
	while (++idx < bnd) {
		out[idx] = arr[bnd - idx - 1];
	}
	this._m = false;
	return new Enumerable(out, this._s);
};

Enumerable.prototype.sort = function () {
	if (arguments.length === 0) {
		return this.sortBy();

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.sortBy = function () {
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
	return out;
};

/*
		(collection, string, +function, +boolean)
		(collection, function, +function, +boolean)
*/
Enumerable.prototype.joinBy = function () {
	var arr = this._a;
	var ar0 = new Enumerable(arguments[0]);
	var ar1 = arguments[1];
	var ar2 = typeof arguments[2] === 'function' ? arguments[2] : undefined;
	var ovr = typeof arguments[2] === 'boolean' ? arguments[2] : false;
	var idx = -1;
	var jdx;
	var bnd = this._a.length;
	var cnd = ar0._a.length;
	var tmp;
	var nam;
	if (this.any(function (obj) { return typeof obj !== 'object'; }) || ar0.any(function (obj) { return typeof obj !== 'object'; })) {
		throw 'one or more element was not an object';

	} else if (typeof ar1 === 'string') {
		if (ar1.length === 0) {
			throw 'name was empty';

		} else {
			while (++idx < bnd) {
				jdx = -1;
				tmp = null;
				while (++jdx < cnd) {
					if (ar0._a[jdx][ar1] === arr[idx][ar1]) {
						tmp = ar0._a[jdx];
						break;
					}
				}
				if (tmp !== null) {
					if (ar2) {
						if (this._s) {
							arr.call(this._s, arr[idx], tmp);
						} else {
							arr(arr[idx], tmp);
						}

					} else {
						for (nam in tmp) {
							if (ovr === true) {
								arr[idx][nam] = tmp[nam];
							} else if (arr[idx][nam] === undefined) {
								arr[idx][nam] = tmp[nam];
							}
						}
					}
				}
			}
		}

	} else if (typeof ar1 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				jdx = -1;
				tmp = null;
				while (++jdx < cnd) {
					if (ar1.call(this._s, ar0._a[jdx]) === ar1.call(this._s, arr[idx])) {
						tmp = ar0._a[jdx];
						break;
					}
				}
				if (tmp !== null) {
					if (ar2) {
						if (this._s) {
							arr.call(this._s, arr[idx], tmp);
						} else {
							arr(arr[idx], tmp);
						}

					} else {
						for (nam in tmp) {
							if (ovr === true) {
								arr[idx][nam] = tmp[nam];
							} else if (arr[idx][nam] === undefined) {
								arr[idx][nam] = tmp[nam];
							}
						}
					}
				}
			}

		} else {
			while (++idx < bnd) {
				jdx = -1;
				tmp = null;
				while (++jdx < cnd) {
					if (ar1(ar0._a[jdx]) === ar1(arr[idx])) {
						tmp = ar0._a[jdx];
						break;
					}
				}
				if (tmp !== null) {
					if (ar2) {
						if (this._s) {
							arr.call(this._s, arr[idx], tmp);
						} else {
							arr(arr[idx], tmp);
						}

					} else {
						for (nam in tmp) {
							if (ovr === true) {
								arr[idx][nam] = tmp[nam];
							} else if (arr[idx][nam] === undefined) {
								arr[idx][nam] = tmp[nam];
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
	if (arguments.length === 0) {
		return this._a.length;

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.countBy = function () {
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
	var jdx = -1;
	var bnd = this._a.length;
	var tmp;
	var val = Number.MAX_VALUE;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return this._a[0];

	} else {
		if (ar0 === undefined) {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp < val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'name was empty';
			}
			while (++idx < bnd) {
				tmp = this._a[idx][ar0];
				if (tmp < val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx);
					if (tmp < val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx);
					if (tmp < val) {
						jdx = idx;
						val = tmp;
					}
				}
			}

		} else {
			throw 'input was not valid';
		}
		if (jdx >= 0) {
			return this._a[jdx];

		} else {
			return null;
		}
	}
};

Enumerable.prototype.max = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var jdx = -1;
	var bnd = this._a.length;
	var tmp;
	var val = Number.MIN_VALUE;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return this._a[0];

	} else {
		if (ar0 === undefined) {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp > val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'name was empty';
			}
			while (++idx < bnd) {
				tmp = this._a[idx][ar0];
				if (tmp > val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx);
					if (tmp > val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx);
					if (tmp > val) {
						jdx = idx;
						val = tmp;
					}
				}
			}

		} else {
			throw 'input was not valid';
		}
		if (jdx >= 0) {
			return this._a[jdx];

		} else {
			return null;
		}
	}
};

Enumerable.prototype.mod = function () {
	var ar0 = arguments[0];
	var hsh = {};
	var idx = -1;
	var jdx = -1;
	var bnd = this._a.length;
	var tmp;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return this._a[0];

	} else {
		if (ar0 === undefined) {
			while (++idx < bnd) {
				tmp = this._a[idx].toString();
				if (hsh[tmp]) {
					hsh[tmp].c += 1;
				} else {
					hsh[tmp] = { i: idx, c: 1 };
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'name was empty';
			}
			while (++idx < bnd) {
				tmp = this._a[idx][ar0].toString();
				if (hsh[tmp]) {
					hsh[tmp].c += 1;
				} else {
					hsh[tmp] = { i: idx, c: 1 };
				}
			}

		} else if (typeof ar0 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx).toString();
					if (hsh[tmp]) {
						hsh[tmp].c += 1;
					} else {
						hsh[tmp] = { i: idx, c: 1 };
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx).toString();
					if (hsh[tmp]) {
						hsh[tmp].c += 1;
					} else {
						hsh[tmp] = { i: idx, c: 1 };
					}
				}
			}

		} else {
			throw 'input was not valid';
		}
		return this._a[new Enumerable(hsh).max(function (obj) { return obj.value.c; }).value.i];
	}
};

Enumerable.prototype.sum = function () {
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = 0;
	if (arguments.length === 0) {
		while (++idx < bnd) {
			tmp = this._a[idx];
			if (!isNaN(tmp) && isFinite(tmp)) {
				out += tmp;
			}
		}

	} else {
		throw 'input was not valid';
	}
	return out;
};

Enumerable.prototype.avg = function () {
	if (arguments.length === 0) {
		return this.sum() / this._a.length;

	} else {
		throw 'input was not valid';
	}
};

Enumerable.prototype.interpolate = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var hsh = [];
	var idx = 0;
	var jdx;
	var kdx;
	var tmp;
	var prm = 'var ';
	var out = '';
	if (typeof ar0 === 'string' && typeof ar1 === 'object') {
		while (idx < ar0.length) {
			jdx = ar0.indexOf('<%=', idx);
			if (jdx >= 0) {
				hsh.push(ar0.substring(idx, jdx));
				kdx = ar0.indexOf('%>', jdx);
				if (kdx === -1) {
					throw 'template was not valid';
				}
				tmp = ar0.substring(jdx + 3, kdx).trim();
				if (tmp.length > 0) {
					hsh.push({ e: tmp });
					idx = kdx + 2;
				}

			} else {
				hsh.push(ar0.substring(idx));
				idx = ar0.length;
			}
		}
		for (tmp in ar1) {
			prm += tmp + '=' + JSON.stringify(typeof ar1[tmp] === 'function' ? ar1[tmp].apply(ar1, this._a) : ar1[tmp]) + ',';
		}
		if (prm === 'var ') {
			prm = '';
		} else {
			prm = prm.substring(0, prm.length - 1) + ';';
		}
		jdx = -1;
		kdx = hsh.length;
		while (++jdx < kdx) {
			if (typeof hsh[jdx] === 'string') {
				out += hsh[jdx];

			} else if ((tmp = hsh[jdx].e) !== undefined) {
				out += eval(prm + tmp).toString();
			}
		}

	} else {
		throw 'input was not valid';
	}
	return out;
};

/*
	This function removes undefined, null, empty string, only white space string, not a number, infinity elements from the original array.
*/
Enumerable.prototype.norm = function () {
	var ar0 = arguments[0];
	var hsh = {};
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = [];
	if (arguments.length === 0) {
		while (++idx < bnd) {
			tmp = this._a[idx];
			if (tmp && (typeof tmp !== 'string' || tmp.trim() > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
				out.push(tmp);
			}
		}

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx);
				if (tmp && (typeof tmp !== 'string' || tmp.trim() > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
					out.push(this._a[idx]);
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx);
				if (tmp && (typeof tmp !== 'string' || tmp.trim() > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
					out.push(this._a[idx]);
				}
			}
		}

	} else {
		throw 'input was not valid';
	}
	this._a = out;
	this._m = false;
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
	return this;
};