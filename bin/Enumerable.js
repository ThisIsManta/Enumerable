﻿/*
	A JavaScript library provides useful and handy query functions.
	https://github.com/ThisIsManta/Enumerable/wiki/Documentation

	anantachai.saothong@thomsonreuters.com
*/
var Enumerable = function Enumerable() {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var ar3 = arguments[3];
	var idx = -1;
	var bnd;
	var nam;
	var tmp;
	var ifn;
	var out;
	if (typeof ar0 === 'object') {
		if (ar0 instanceof Array) {
			this._a = ar0;
			this._m = true;

		} else if (ar0 !== null && ar0.constructor !== undefined && ar0.constructor.name === 'Enumerable' || ar0 instanceof Enumerable) {
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
			// Put *true* as the last parameter to include functions and all attributes that starts with underscore (_).
			ifn = arguments.length >= 2 && (arguments[arguments.length - 1] === true || arguments[arguments.length - 2] === true);
			if (typeof ar1 === 'string') {
				if (ar2 === undefined || typeof ar2 !== 'string') {
					ar2 = 'value';
				}
				for (nam in ar0) {
					if (ar0[nam] !== undefined && (ifn || typeof ar0[nam] !== 'function' && nam.charAt(0) !== '_')) {
						tmp = {};
						tmp[ar1] = nam;
						tmp[ar2] = ar0[nam];
						out.push(tmp);
					}
				}

			} else {
				for (nam in ar0) {
					if (ar0[nam] !== undefined && (ifn || typeof ar0[nam] !== 'function' && nam.charAt(0) !== '_')) {
						out.push({ name: nam, value: ar0[nam] });
					}
				}
			}
			this._a = out;
			this._m = false;
		}

	} else if (typeof ar0 === 'string') {
		if (typeof ar1 === 'string' || ar1 instanceof RegExp) {
			this._a = ar0.split(ar1);
		} else {
			this._a = ar0.split('');
		}
		this._m = false;

	} else if (arguments.length === 0) {
		this._a = [];
		this._m = false;

	} else if (typeof ar0 === 'number' && !isNaN(ar0) && isFinite(ar0) && ar0 >= 0) {
		this._a = new Array(ar0);
		if (ar1 !== undefined) {
			while (++idx < ar0) {
				this._a[idx] = ar1;
			}
		}
		this._m = false;

	} else {
		throw 'a parameter was not enumerable';
	}

	// Set the context of function
	if (arguments.length > 1 && typeof arguments[arguments.length - 1] === 'object' && !(arguments[arguments.length - 1] instanceof Array)) {
		this._s = arguments[arguments.length - 1];
	}
};

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
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.toObject = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = {};
	if (arguments.length === 0) {
		while (++idx < bnd) {
			out[idx.toString()] = this._a[idx];
		}

	} else if (typeof ar0 === 'string') {
		if (arguments.length === 1) {
			while (++idx < bnd) {
				tmp = this._a[idx][ar0];
				if (tmp !== undefined) {
					out[tmp] = this._a[idx];
				}
			}

		} else if (typeof ar1 === 'string') {
			while (++idx < bnd) {
				tmp = this._a[idx][ar0];
				if (tmp !== undefined) {
					out[tmp] = this._a[idx][ar1];
				}
			}

		} else if (typeof ar1 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = this._a[idx][ar0];
					if (tmp !== undefined) {
						out[tmp] = ar1.call(this._s, this._a[idx], idx);
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = this._a[idx][ar0];
					if (tmp !== undefined) {
						out[tmp] = ar1(this._a[idx], idx);
					}
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

	} else if (typeof ar0 === 'function') {
		if (arguments.length === 1) {
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

		} else if (typeof ar1 === 'string') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx).toString();
					out[tmp] = this._a[idx][ar1];
				}

			} else {
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx).toString();
					out[tmp] = this._a[idx][ar1];
				}
			}

		} else if (typeof ar1 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx).toString();
					out[tmp] = ar1.call(this._s, this._a[idx], idx);
				}

			} else {
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx).toString();
					out[tmp] = ar1(this._a[idx], idx);
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return out;
};

Enumerable.prototype.peekAt = function () {
	var ar0 = arguments[0];
	if (typeof ar0 === 'number') {
		if (!isNaN(ar0) && ar0 >= 0 && ar0 < this._a.length) {
			return this._a[ar0];
		} else {
			throw 'an index was out of range'
		}

	} else {
		throw 'one or more parameters were not valid';
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
	return new Enumerable(out, this._s);
};

Enumerable.prototype.where = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	var chk;
	var tmp;
	var nam;
	var out = [];
	if (typeof ar0 === 'function' && arguments.length === 1) {
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

	} else if (typeof ar0 === 'object' && arguments.length === 1) {
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

	} else if (typeof ar0 === 'string' && arguments.length === 2) {
		while (++idx < bnd) {
			tmp = this._a[idx];
			if (tmp[ar0] === ar1) {
				out.push(tmp);
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.select = function () {
	if (arguments.length === 1) {
		return this.selectAll.apply(this, arguments);

	} else if (arguments.length >= 2 && arguments.length <= 3) {
		return this.selectAny.apply(this, arguments);

	} else {
		throw 'one or more parameters were not valid';
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
			throw 'a name projector was empty';
		}
		while (++idx < bnd) {
			out[idx] = this._a[idx][ar0];
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.selectAny = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
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
				throw 'a name projector was empty';
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
			throw 'one or more parameters were not valid';
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
			throw 'one or more parameters were not valid';
		}

	} else if (typeof ar0 === 'string' && arguments.length === 3) {
		if (typeof ar2 === 'function') {
			if (this._s) {
				while (++idx < bnd) {
					tmp = this._a[idx];
					if (tmp[ar0] === ar1) {
						out.push(ar2.call(this._s, tmp, idx));
					}
				}

			} else {
				while (++idx < bnd) {
					tmp = this._a[idx];
					if (tmp[ar0] === ar1) {
						out.push(ar2(tmp, idx));
					}
				}
			}

		} else if (typeof ar2 === 'string') {
			if (ar1.length === 0) {
				throw 'a name projector was empty';
			}
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp !== undefined && tmp !== null && tmp[ar0] === ar1) {
					out.push(tmp[ar2]);
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

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
		throw 'one or more parameters were not valid';
	}
	return this;
};

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
			throw 'a start index was out of range';
		} else if (ar1 < 0 || ar1 > bnd) {
			throw 'a stop index was out of range';
		} else if (ar0 > ar1) {
			throw 'a start index was greater than stop index';
		} else {
			jdx = ar0 - 1;
			kdx = ar1;
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	while (++jdx < kdx) {
		out.push(this._a[jdx]);
	}
	return new Enumerable(out, this._s);
};

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
			throw 'a start index was out of range';
		} else if (ar0 < 0 || ar1 > bnd) {
			throw 'a stop index was out of range';
		} else if (ar0 > ar1) {
			throw 'a start index was greater than stop index';
		} else {
			out = this.toImmutableArray();
			out.splice(ar0, ar1 - ar0);
			return new Enumerable(out, this._s);
		}

	} else {
		throw 'one or more parameters were not valid';
	}
};

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
		if (typeof tmp === 'object' && tmp instanceof Array) {
			if (tmp.length > 0) {
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
			}
		} else {
			out.push(tmp);
		}
	}
	return new Enumerable(out, this._s);
};

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
		throw 'one or more parameters were not valid';

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

Enumerable.prototype.subsetOf = function () {
	var arr = new Enumerable(arguments[0]);
	var idx = -1;
	var bnd = this._a.length;
	while (++idx < bnd) {
		if (arr.contains(this._a[idx]) === false) {
			return false;
		}
	}
	return true;
};

Enumerable.prototype.equivalentTo = function () {
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
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.indexOf = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = this._a.length;
	if (typeof ar1 === 'number') {
		if (ar1 >= 0 || ar1 <= bnd) {
			idx = ar1 - 1;
		} else {
			throw 'an index was out of range';
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

	} else if (ar0 !== undefined) {
		while (++idx < bnd) {
			if (this._a[idx] === ar0) {
				return idx;
			}
		}

	} else {
		throw 'one or more parameters were not valid';
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
			throw 'an index was out of range';
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

	} else if (ar0 !== undefined) {
		while (--idx >= 0) {
			if (this._a[idx] === ar0) {
				return idx;
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return -1;
};

Enumerable.prototype.contains = function () {
	return this.indexOf.apply(this, arguments) >= 0;
};

Enumerable.prototype.find = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	if (typeof ar0 === 'string' && arguments.length === 2) {
		var idx = this.indexOf.call(this, function (obj) { return obj[ar0] === ar1; });
		if (idx >= 0) {
			return this._a[idx];

		} else {
			return null;
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return null;

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
		throw 'an array was empty';

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
		throw 'an array was empty';

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
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.single = function () {
	if (this._a.length === 0) {
		throw 'an array was empty';

	} else if (arguments.length === 0) {
		if (this._a.length === 1) {
			return this._a[0];

		} else {
			throw 'an array was contained more than one element';
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
		throw 'one or more parameters were not valid';
	}
};

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
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.replace = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var idx = -1;
	var bnd = this._a.length;
	var out = this.toImmutableArray();
	if (ar0 === undefined) {
		throw 'one or more parameters were not valid';
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

Enumerable.prototype.add = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var out = this.toImmutableArray();
	if (ar1 === undefined) {
		out.push(ar0);
		this._a = out;

	} else if (typeof ar1 !== 'number' || isNaN(ar1) || ar1 < 0 || ar1 > this._a.length) {
		throw 'an index was out of range';

	} else {
		out.splice(ar1, 0, ar0);
		this._a = out;
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
		throw 'an index was out of range';

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
		throw 'one or more parameters were not valid';

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
		throw 'an index was out of range';

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

Enumerable.prototype.removeAll = function () {
	var out = this.toImmutableArray();
	if (arguments.length === 0) {
		out.splice(0, this._a.length);
		
	} else if (arguments.length === 1) {
		var ar0 = arguments[0];
		var idx = out.length;
		while (--idx >= 0) {
			if (out[idx] === ar0) {
				out.splice(idx, 1);
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	this._a = out;
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
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.sortBy = function () {
	var ar0 = arguments[0];
	var out;
	if (arguments.length === 0) {
		return new Enumerable(this.toImmutableArray().sort(), this._s);

	} else {
		if (typeof ar0 === 'function') {
			if (this._s) {
				out = this.select(function (val, idx) { return { i: idx, v: val, r: ar0.call(this._s, val, idx) }; });
			} else {
				out = this.select(function (val, idx) { return { i: idx, v: val, r: ar0(val, idx) }; });
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			out = this.select(function (val, idx) { return { i: idx, v: val, r: val[ar0] }; });

		} else {
			throw 'one or more parameters were not valid';
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
		throw 'one or more parameters were not valid';
	}
	var s = this._s;
	out.asEnumerable = function () {
		return new Enumerable(this, s);
	};
	return out;
};

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
		throw 'one or more parameters were not valid';
	}
	return this;
};

Enumerable.prototype.count = function () {
	if (arguments.length === 0) {
		return this._a.length;

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.countBy = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var out = 0;
	var tmp;
	if (ar0 === undefined) {
		out = this._a.length;

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx);
				if (typeof tmp === 'number') {
					out += tmp;
					
				} else if (tmp) {
					out += 1;
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx);
				if (typeof tmp === 'number') {
					out += tmp;
					
				} else if (tmp) {
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
	var idx = 0;
	var jdx = 0;
	var bnd = this._a.length;
	var tmp;
	var val;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return this._a[0];

	} else {
		if (ar0 === undefined) {
			val = this._a[0];
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp < val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			val = this._a[0][ar0];
			while (++idx < bnd) {
				tmp = this._a[idx][ar0];
				if (tmp < val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			if (this._s) {
				val = ar0.call(this._s, this._a[0], 0);
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx);
					if (tmp < val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else {
				val = ar0(this._a[0], 0);
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx);
					if (tmp < val) {
						jdx = idx;
						val = tmp;
					}
				}
			}

		} else {
			throw 'one or more parameters were not valid';
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
	var idx = 0;
	var jdx = 0;
	var bnd = this._a.length;
	var tmp;
	var val;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return this._a[0];

	} else {
		if (ar0 === undefined) {
			val = this._a[0];
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp > val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			val = this._a[0][ar0];
			while (++idx < bnd) {
				tmp = this._a[idx][ar0];
				if (tmp > val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			if (this._s) {
				val = ar0.call(this._s, this._a[0], 0);
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx);
					if (tmp > val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else {
				val = ar0(this._a[0], 0);
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx);
					if (tmp > val) {
						jdx = idx;
						val = tmp;
					}
				}
			}

		} else {
			throw 'one or more parameters were not valid';
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
				throw 'a name projector was empty';
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
			throw 'one or more parameters were not valid';
		}
		return this._a[new Enumerable(hsh).max(function (obj) { return obj.value.c; }).value.i];
	}
};

Enumerable.prototype.sum = function () {
	var ar0 = arguments[0];
	var idx = 0;
	var bnd = this._a.length;
	var tmp;
	var val;
	if (bnd === 0) {
		return 0;

	} else {
		if (ar0 === undefined) {
			val = this._a[0];
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (isNaN(tmp) === false) {
					val += tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			val = this._a[0][ar0];
			while (++idx < bnd) {
				tmp = this._a[idx][ar0];
				if (isNaN(tmp) === false) {
					val += tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			if (this._s) {
				val = ar0.call(this._s, this._a[0], 0);
				while (++idx < bnd) {
					tmp = ar0.call(this._s, this._a[idx], idx);
					if (isNaN(tmp) === false) {
						val += tmp;
					}
				}

			} else {
				val = ar0(this._a[0], 0);
				while (++idx < bnd) {
					tmp = ar0(this._a[idx], idx);
					if (isNaN(tmp) === false) {
						val += tmp;
					}
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}
		return val;
	}
};

Enumerable.prototype.avg = function () {
	return this.sum.apply(this, arguments) / this._a.length;
};

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
			if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
				out.push(tmp);
			}
		}

	} else if (typeof ar0 === 'string') {
		while (++idx < bnd) {
			tmp = this._a[idx][ar0];
			if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
				out.push(this._a[idx]);
			}
		}

	} else if (typeof ar0 === 'function') {
		if (this._s) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this._a[idx], idx);
				if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
					out.push(this._a[idx]);
				}
			}

		} else {
			while (++idx < bnd) {
				tmp = ar0(this._a[idx], idx);
				if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
					out.push(this._a[idx]);
				}
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.cast = function () {
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = this._a.length;
	var tmp;
	var out = [];
	if (typeof ar0 === 'string' && ar0.length > 0) {
		ar0 = ar0.toLowerCase();
		if (ar0 === 'string') {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp !== undefined && tmp !== null) {
					out.push(tmp.toString());
				}
			}

		} else if (ar0 === 'number') {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (typeof tmp === 'number') {
					out.push(tmp);

				} else if (typeof tmp === 'string') {
					tmp = parseFloat(tmp);
					if (!isNaN(tmp)) {
						out.push(tmp);
					}
				}
			}

		} else if (ar0 === 'array') {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp instanceof Array) {
					out.push(tmp);
				}
			}

		} else if (ar0 === 'object') {
			while (++idx < bnd) {
				tmp = this._a[idx];
				if (tmp !== null && typeof tmp === 'object' && !(tmp instanceof Array)) {
					out.push(tmp);
				}
			}

		} else if (typeof tmp === ar0) {
			while (++idx < bnd) {
				out.push(this._a[idx]);
			}
		}
		return new Enumerable(out, this._s);

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.define = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	if (arguments.length === 2 && typeof ar0 === 'string' && ar0.length > 0) {
		if (typeof ar1 === 'function') {
			Enumerable.prototype[ar0] = ar1;

		} else if (typeof ar1 === 'string' && typeof Enumerable.prototype[ar1] === 'function') {
			Enumerable.prototype[ar0] = Enumerable.prototype[ar1];

		} else {
			throw 'one or more parameters were not valid';
		}

	} else {
		throw 'one or more parameters were not valid';
	}
};