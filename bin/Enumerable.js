/*
	A JavaScript library provides useful and handy query functions.
	https://github.com/ThisIsManta/Enumerable/wiki

	anantachai.saothong@thomsonreuters.com
*/
var Enumerable = function Enumerable() {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var idx = -1;
	var bnd;
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
			var out = [];
			var nam;
			var tmp;
			// Put *true* as the last parameter to include functions and all attributes that starts with underscore (_).
			var ifn = arguments.length >= 2 && (arguments[arguments.length - 1] === true || arguments[arguments.length - 2] === true);
			if (typeof ar1 === 'string') {
				if (ar2 === undefined || typeof ar2 !== 'string') {
					ar2 = 'value';
				}
				for (nam in ar0) {
					if (ar0[nam] !== undefined && (ifn || typeof ar0[nam] !== 'function' && nam.charAt(0) !== '_')) {
						tmp = {};
						tmp[ar1] = nam;
						tmp[ar2] = ar0[nam];
						out[++idx] = tmp;
					}
				}

			} else {
				for (nam in ar0) {
					if (ar0[nam] !== undefined && (ifn || typeof ar0[nam] !== 'function' && nam.charAt(0) !== '_')) {
						out[++idx] = { name: nam, value: ar0[nam] };
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

	} else {
		this._s = this;
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
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	var tmp;
	var out = {};
	if (arguments.length === 0) {
		while (++idx < bnd) {
			tmp = arr[idx];
			out[tmp] = tmp;
		}

	} else if (typeof ar0 === 'string') {
		if (arguments.length === 1) {
			while (++idx < bnd) {
				tmp = arr[idx][ar0];
				if (tmp !== undefined) {
					out[tmp] = arr[idx];
				}
			}

		} else if (typeof ar1 === 'string') {
			while (++idx < bnd) {
				tmp = arr[idx][ar0];
				if (tmp !== undefined) {
					out[tmp] = arr[idx][ar1];
				}
			}

		} else if (typeof ar1 === 'function') {
			while (++idx < bnd) {
				tmp = arr[idx][ar0];
				if (tmp !== undefined) {
					out[tmp] = ar1.call(this._s, arr[idx], idx, arr);
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

	} else if (typeof ar0 === 'function') {
		if (arguments.length === 1) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, arr[idx], idx, arr).toString();
				out[tmp] = arr[idx];
			}

		} else if (typeof ar1 === 'string') {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, arr[idx], idx, arr).toString();
				out[tmp] = arr[idx][ar1];
			}

		} else if (typeof ar1 === 'function') {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, arr[idx], idx, arr).toString();
				out[tmp] = ar1.call(this._s, arr[idx], idx, arr);
			}

		} else {
			throw 'one or more parameters were not valid';
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return out;
};

Enumerable.prototype.clone = function (idp) {
	var arr = this._a;
	var ar0 = arguments[0];
	this._m = false;
	if (ar0 === true) {
		var dpc = function (obj) {
			if (typeof obj === 'object') {
				var out;
				var idx;
				if (obj instanceof Array) {
					out = [];
					idx = 0;
					var bnd = obj.length;
					for (; idx < bnd; idx++) {
						out[idx] = arguments.callee(obj[idx]);
					}
					return out;

				} else {
					out = {};
					for (idx in obj) {
						out[idx] = arguments.callee(obj[idx]);
					}
					return out;
				}

			} else {
				return obj;
			}
		};
		return new Enumerable(dpc(arr), this._s);

	} else {
		var idx = -1;
		var bnd = arr.length;
		var out = new Array(bnd);
		while (++idx < bnd) {
			out[idx] = arr[idx];
		}
		return new Enumerable(out, this._s);
	}
};

Enumerable.prototype.where = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var chk;
	var tmp;
	var nam;
	var out = [];
	if (typeof ar0 === 'function' && arguments.length === 1) {
		while (++idx < bnd) {
			tmp = arr[idx];
			if (ar0.call(this._s, tmp, idx, arr)) {
				out[++jdx] = tmp;
			}
		}

	} else if (typeof ar0 === 'object' && arguments.length === 1) {
		while (++idx < bnd) {
			chk = 1;
			tmp = arr[idx];
			for (nam in ar0) {
				chk &= tmp[nam] === ar0[nam];
				if (!chk) {
					break;
				}
			}
			if (chk) {
				out[++jdx] = tmp;
			}
		}

	} else if (typeof ar0 === 'string' && arguments.length === 2) {
		while (++idx < bnd) {
			tmp = arr[idx];
			if (tmp[ar0] === ar1) {
				out[++jdx] = tmp;
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
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = arr.length;
	var out = new Array(bnd);
	if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			out[idx] = ar0.call(this._s, arr[idx], idx, arr);
		}

	} else if (typeof ar0 === 'string') {
		if (ar0.length === 0) {
			throw 'a name projector was empty';
		}
		while (++idx < bnd) {
			out[idx] = arr[idx][ar0];
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.selectAny = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var chk;
	var tmp;
	var nam;
	var out = [];
	if (typeof ar0 === 'function') {
		if (typeof ar1 === 'function') {
			while (++idx < bnd) {
				tmp = arr[idx];
				if (ar0.call(this._s, tmp, idx, arr)) {
					out[++jdx] = ar1.call(this._s, tmp, idx, arr);
				}
			}

		} else if (typeof ar1 === 'string') {
			if (ar1.length === 0) {
				throw 'a name projector was empty';
			}
			while (++idx < bnd) {
				tmp = arr[idx];
				if (ar0.call(this._s, tmp, idx, arr)) {
					out[++jdx] = tmp[ar1];
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

	} else if (typeof ar0 === 'object') {
		if (typeof ar1 === 'function') {
			while (++idx < bnd) {
				chk = 1;
				tmp = arr[idx];
				for (nam in ar0) {
					chk &= tmp[nam] === ar0[nam];
					if (!chk) {
						break;
					}
				}
				if (chk) {
					out[++jdx] = ar1.call(this._s, tmp, idx, arr);
				}
			}

		} else if (typeof ar1 === 'string') {
			while (++idx < bnd) {
				chk = 1;
				tmp = arr[idx];
				for (nam in ar0) {
					chk &= tmp[nam] === ar0[nam];
					if (!chk) {
						break;
					}
				}
				if (chk) {
					out[++jdx] = tmp[ar1];
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

	} else if (typeof ar0 === 'string' && arguments.length === 3) {
		if (typeof ar2 === 'function') {
			while (++idx < bnd) {
				tmp = arr[idx];
				if (tmp[ar0] === ar1) {
					out[++jdx] = ar2.call(this._s, tmp, idx, arr);
				}
			}

		} else if (typeof ar2 === 'string') {
			if (ar1.length === 0) {
				throw 'a name projector was empty';
			}
			while (++idx < bnd) {
				tmp = arr[idx];
				if (tmp !== undefined && tmp !== null && tmp[ar0] === ar1) {
					out[++jdx] = tmp[ar2];
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
	var arr = this._a;
	var scp = this._s;
	var fnc = new Enumerable(arguments).lastOrNull(function (tmp) { return typeof tmp === 'function'; });
	var idx = arguments.length > 1 ? arguments[0] : 0;
	var bnd = arguments.length > 2 ? arguments[1] : this._a.length - 1;
	var stp = arguments.length > 3 ? arguments[2] : (idx < bnd ? 1 : -1);
	var lim;
	var brk;
	if (fnc !== null && typeof idx === 'number' && !isNaN(idx) && isFinite(idx) && typeof bnd === 'number' && !isNaN(bnd) && isFinite(bnd) && typeof stp === 'number' && !isNaN(stp) && stp !== 0 && isFinite(stp)) {
		if (bnd >= 0 && bnd < this._a.length) {
			if (stp === 1 && idx === 0 && bnd > 1024) {
				brk = function () { fnc = function () { }; idx = bnd; };
				lim = bnd % 8;
				while (idx <= lim) {
					fnc.call(scp, arr[idx], idx++, arr, brk);
				}
				while (idx <= bnd) {
					fnc.call(scp, arr[idx], idx++, arr, brk);
					fnc.call(scp, arr[idx], idx++, arr, brk);
					fnc.call(scp, arr[idx], idx++, arr, brk);
					fnc.call(scp, arr[idx], idx++, arr, brk);
					fnc.call(scp, arr[idx], idx++, arr, brk);
					fnc.call(scp, arr[idx], idx++, arr, brk);
					fnc.call(scp, arr[idx], idx++, arr, brk);
					fnc.call(scp, arr[idx], idx++, arr, brk);
				}

			} else if (stp > 0) {
				brk = function () { idx = bnd; };
				while (idx <= bnd) {
					fnc.call(scp, arr[idx], idx, arr, brk); idx += stp;
				}

			} else {
				brk = function () { idx = 0; };
				while (idx >= bnd) {
					fnc.call(scp, arr[idx], idx, arr, brk); idx += stp;
				}
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return this;
};

Enumerable.prototype.invokeWhile = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx;
	var bnd = arr.length;
	var tmp;
	if (typeof ar0 === 'function') {
		while (true) {
			idx = -1;
			while (++idx < bnd) {
				if (tmp === false) {
					return this;
				}
				tmp = ar0.call(this._s, arr[idx], idx, arr);
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.invokeUntil = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx;
	var bnd = arr.length;
	var tmp;
	if (typeof ar0 === 'function') {
		while (true) {
			idx = -1;
			while (++idx < bnd) {
				if (tmp === true) {
					return this;
				}
				tmp = ar0.call(this._s, arr[idx], idx, arr);
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.invokeAsync = function () {
	var arr = this._a;
	var scp = this._s;
	var tmp = new Enumerable(arguments).indexOf(function (tmp) { return typeof tmp === 'function'; });
	var fnc = arguments[tmp];
	var idx = tmp > 0 ? arguments[0] : 0;
	var bnd = tmp > 1 ? arguments[1] : this._a.length - 1;
	var stp = tmp > 2 ? arguments[2] : (idx < bnd ? 1 : -1);
	var btc = (tmp >= 0 && tmp !== arguments.length - 1) ? arguments[arguments.length - 1] : 1;
	var lim;
	var brk;
	var hdr;
	if (typeof fnc === 'function' && typeof idx === 'number' && !isNaN(idx) && isFinite(idx) && typeof bnd === 'number' && !isNaN(bnd) && isFinite(bnd) && typeof stp === 'number' && !isNaN(stp) && stp !== 0 && isFinite(stp) && !isNaN(btc) && isFinite(btc) && btc > 0) {
		if (bnd >= 0 && bnd < this._a.length) {
			if (stp > 0) {
				brk = function () { idx = bnd; };
				hdr = function () {
					lim = btc;
					while (idx <= bnd && lim-- > 0) {
						fnc.call(scp, arr[idx], idx, arr, brk); idx += stp;
					}
					if (idx <= bnd) {
						setTimeout(hdr, 2);
					}
				};
				hdr();

			} else {
				brk = function () { idx = 0; };
				hdr = function () {
					lim = btc;
					while (idx >= bnd && lim-- > 0) {
						fnc.call(scp, arr[idx], idx, arr, brk); idx += stp;
					}
					if (idx >= bnd) {
						setTimeout(hdr, 2);
					}
				};
				hdr();
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return this;
};

Enumerable.prototype.invokeWhich = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd;
	var tmp;
	if (this._g === undefined) {
		throw 'a call was not valid';

	} else if (arguments.length === 2 && typeof ar1 === 'function') {
		if (ar0 === undefined) {
			ar0 = 'undefined';

		} else if (ar0 === null) {
			ar0 = 'null';

		} else {
			ar0 = ar0.toString();
		}
		this._g[ar0].invoke(ar1);

	} else {
		throw 'one or more parameters were not valid';
	}
	return this;
};

Enumerable.prototype.take = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var jdx = -1;
	var kdx;
	var ldx = -1;
	var bnd = arr.length;
	var out = [];
	if (typeof ar0 === 'function') {
		kdx = bnd;
		while (++idx < bnd) {
			if (ar0.call(this._s, arr[idx], idx, arr) === false) {
				kdx = idx;
				break;
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
		out[++ldx] = arr[jdx];
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.skip = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	var tmp;
	var out;
	if (typeof ar0 === 'function') {
		tmp = bnd;
		while (++idx < bnd) {
			if (ar0.call(this._s, arr[idx], idx, arr) === false) {
				tmp = idx;
				break;
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
	var arr = this._a;
	var ar0 = !!arguments[0];
	var idx = -1;
	var jdx;
	var kdx = -1;
	var bnd = arr.length;
	var len;
	var tmp;
	var out = [];
	while (++idx < bnd) {
		tmp = arr[idx];
		if (typeof tmp === 'object' && tmp instanceof Array) {
			if (tmp.length > 0) {
				if (ar0) {
					tmp = new Enumerable(tmp).flatten(ar0).toArray();
				}
				jdx = -1;
				len = tmp.length;
				while (++jdx < len) {
					out[++kdx] = tmp[jdx];
				}
			}

		} else {
			out[++kdx] = tmp;
		}
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.any = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	if (bnd === 0) {
		return false;

	} else if (ar0 === undefined) {
		return true;

	} else if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			if (ar0.call(this._s, arr[idx], idx, arr)) {
				return true;
			}
		}
		return false;

	} else if (typeof ar0 === 'string' && arguments.length === 2) {
		while (++idx < bnd) {
			if (arr[idx][ar0] === ar1) {
				return true;
			}
		}
		return false;

	} else {
		while (++idx < bnd) {
			if (arr[idx] === ar0) {
				return true;
			}
		}
		return false;
	}
};

Enumerable.prototype.all = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	if (bnd === 0) {
		return true;

	} else if (ar0 === undefined) {
		throw 'one or more parameters were not valid';

	} else if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			if (!ar0.call(this._s, arr[idx], idx, arr)) {
				return false;
			}
		}
		return true;

	} else if (typeof ar0 === 'string' && arguments.length === 2) {
		while (++idx < bnd) {
			if (arr[idx][ar0] !== ar1) {
				return false;
			}
		}
		return true;

	} else {
		while (++idx < bnd) {
			if (arr[idx] !== ar0) {
				return false;
			}
		}
		return true;
	}
};

Enumerable.prototype.subsetOf = function () {
	var arr = this._a;
	var ar0 = new Enumerable(arguments[0])._a;
	var idx = -1;
	var bnd = arr.length;
	while (++idx < bnd) {
		if (ar0.indexOf(arr[idx]) === -1) {
			return false;
		}
	}
	return true;
};

Enumerable.prototype.equalsTo = function () {
	var arr = this._a;
	var ar0 = new Enumerable(arguments[0])._a;
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	if (bnd !== ar0.length) {
		return false;

	} else if (ar1 === undefined) {
		while (++idx < bnd) {
			if (arr[idx] !== ar0[idx]) {
				return false;
			}
		}
		return true;

	} else if (typeof ar1 === 'function') {
		while (++idx < bnd) {
			if (ar1.call(this._s, arr[idx], ar0[idx]) === false) {
				return false;
			}
		}
		return true;

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.equivalentTo = function () {
	var arr = this._a;
	var ar0 = new Enumerable(arguments[0]);
	var ar1 = arguments[1];
	var idx = -1;
	var jdx;
	var bnd = arr.length;
	var cnd;
	var tmp;
	if (bnd !== ar0._a.length || ((bnd === 0) !== (ar0._a.length === 0))) {
		return false;

	} else if (ar1 === undefined) {
		while (++idx < bnd) {
			tmp = ar0.indexOf(arr[idx]);
			if (tmp < 0) {
				return false;

			} else {
				ar0.removeAt(tmp);
			}
		}
		return ar0._a.length === 0;

	} else if (typeof ar1 === 'function') {
		while (++idx < bnd) {
			tmp = arr[idx];
			jdx = -1;
			cnd = ar0._a.length;
			while (++jdx < cnd) {
				if (ar1.call(this._s, tmp, ar0._a[jdx])) {
					break;
				}
			}
			if (jdx === cnd) {
				return false;

			} else {
				ar0.removeAt(jdx);
			}
		}
		return ar0._a.length === 0;

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.indexOf = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	if (typeof ar1 === 'number') {
		if (ar1 >= 0 || ar1 <= bnd) {
			idx = ar1 - 1;

		} else {
			throw 'an index was out of range';
		}
	}
	if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			if (ar0.call(this._s, arr[idx], idx, arr) === true) {
				return idx;
			}
		}

	} else if (ar0 !== undefined) {
		while (++idx < bnd) {
			if (arr[idx] === ar0) {
				return idx;
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return -1;
};

Enumerable.prototype.lastIndexOf = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = arr.length;
	if (typeof ar1 === 'number') {
		if (ar1 >= 0 || ar1 <= idx) {
			idx = ar1;

		} else {
			throw 'an index was out of range';
		}
	}
	if (typeof ar0 === 'function') {
		while (--idx >= 0) {
			if (ar0.call(this._s, arr[idx], idx, arr) === true) {
				return idx;
			}
		}

	} else if (ar0 !== undefined) {
		while (--idx >= 0) {
			if (arr[idx] === ar0) {
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
	if (typeof ar0 === 'string' && arguments.length >= 2) {
		var idx = this.indexOf.call(this, function (obj) { return obj[ar0] === ar1; });
		if (idx >= 0) {
			return this._a[idx];

		} else if (arguments.length > 2) {
			return arguments[2];

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
	var arr = this._a;
	var ar0 = arguments[0];
	var hsh = {};
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var nam;
	var tmp;
	var nil = false;
	var out = [];
	if (ar0 === undefined) {
		while (++idx < bnd) {
			tmp = arr[idx];
			if (tmp === undefined || tmp === null) {
				if (nil === false) {
					nil = true;
					out[++jdx] = tmp;
				}

			} else if (hsh[(tmp = tmp.toString())] === undefined) {
				hsh[tmp] = true;
				out[++jdx] = arr[idx];
			}
		}

	} else if (typeof ar0 === 'string' && ar0.length > 0) {
		while (++idx < bnd) {
			tmp = arr[idx][ar0];
			if (tmp === undefined || tmp === null) {
				if (nil === false) {
					nil = true;
					out[++jdx] = tmp;
				}

			} else if (hsh[(tmp = tmp.toString())] === undefined) {
				hsh[tmp] = true;
				out[++jdx] = arr[idx];
			}
		}

	} else if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			tmp = ar0.call(this._s, arr[idx], idx, arr);
			if (tmp === undefined || tmp === null) {
				if (nil === false) {
					nil = true;
					out[++jdx] = null;
				}

			} else if (hsh[(tmp = tmp.toString())] === undefined) {
				hsh[tmp] = true;
				out[++jdx] = arr[idx];
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
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

Enumerable.prototype.add = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = this._a.length - 1;
	var out = this.toImmutableArray();
	if (ar1 === undefined) {
		out[++idx] = ar0;

	} else if (typeof ar1 !== 'number' || isNaN(ar1) || ar1 < 0 || ar1 > this._a.length) {
		throw 'an index was out of range';

	} else {
		out.splice(ar1, 0, ar0);
	}
	this._a = out;
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
		while (++idx < bnd && ar2 > 0) {
			if (ar0.call(this._s, out[idx], idx, out)) {
				out[idx] = ar1;
				ar2--;
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

Enumerable.prototype.replaceAt = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var out = this.toImmutableArray();
	if (arguments.length !== 2 || typeof ar0 !== 'number') {
		throw 'one or more parameters were not valid';

	} else if (ar0 < 0 || ar0 >= out.length) {
		throw 'an index was out of range';

	} else {
		out[ar0] = ar1;
	}
	this._a = out;
	return this;
};

Enumerable.prototype.union = function () {
	var ar0 = new Enumerable(arguments[0])._a;
	var idx = -1;
	var jdx = this._a.length - 1;
	var bnd = ar0.length;
	var out = this.toImmutableArray();
	while (++idx < bnd) {
		if (!this.contains(ar0[idx])) {
			out[++jdx] = ar0[idx];
		}
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.intersect = function () {
	var arr = this._a;
	var ar0 = new Enumerable(arguments[0]);
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var out = [];
	while (++idx < bnd) {
		if (ar0.contains(arr[idx])) {
			out[++jdx] = arr[idx];
		}
	}
	out = new Enumerable(out, this._s);
	out._m = false;
	return out;
};

Enumerable.prototype.difference = function () {
	var arr = this._a;
	var ar0 = new Enumerable(arguments[0]);
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var out = [];
	while (++idx < bnd) {
		if (!ar0.contains(arr[idx])) {
			out[++jdx] = arr[idx];
		}
	}
	out = new Enumerable(out, this._s);
	out._m = false;
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
	if (arguments[0] === undefined || arguments[0] === true) {
		return new Enumerable(this.toImmutableArray().sort(), this._s);

	} else if (arguments[0] === false) {
		return this.sortBy(function (val) { return val; }, false);

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.sortBy = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var out;
	var scp = this._s;
	if (arguments.length <= 2) {
		if (typeof ar0 === 'function') {
			out = this.select(function (val, idx) { return { v: val, r: ar0.call(scp, val, idx, arr), i: idx }; });

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			out = this.select(function (val) { return { v: val, r: val[ar0] }; });

		} else {
			throw 'one or more parameters were not valid';
		}
		if (ar1 === undefined || ar1 === true) {
			out._a.sort(function (x, y) {
				if (x.r === y.r) {
					return x.i - y.i;

				} else {
					if (x.r > y.r || x.r === undefined || x.r === null || x.r === '') {
						return 1;
					}
					if (x.r < y.r || y.r === undefined || y.r === null || y.r === '') {
						return -1;
					}
					return x.r - y.r;
				}
			});

		} else if (ar1 === false) {
			out._a.sort(function (x, y) {
				if (x.r === y.r) {
					return x.i - y.i;

				} else {
					if (x.r > y.r || x.r === undefined || x.r === null || x.r === '') {
						return -1;
					}
					if (x.r < y.r || y.r === undefined || y.r === null || y.r === '') {
						return 1;
					}
					return y.r - x.r;
				}
			});

		} else {
			throw 'one or more parameters were not valid';
		}
		return out.select('v');

	} else {
		var lst = new Enumerable(arguments).select(function (val, idx) {
			if (idx % 2 === 0) {
				if (typeof val === 'string') {
					return function (itm) { return itm[val]; };

				} else if (typeof val === 'function') {
					return val;

				} else {
					throw 'one or more parameters were not valid';
				}

			} else {
				return val === undefined ? true : !!val;
			}
		}).toArray();
		if (lst.length % 2 === 1) {
			lst.push(true);
		}
		var idx;
		var bnd = lst.length / 2;
		var tmp;
		var x, y;
		out = this.clone();
		out._a.sort(function (cur, ano) {
			idx = -1;
			while (++idx < bnd) {
				x = lst[idx * 2].call(scp, cur);
				y = lst[idx * 2].call(scp, ano);
				if (x === undefined || x === null || x === '') {
					if (y === undefined || y === null || y === '') {
						continue;

					} else {
						tmp = 1;
					}

				} else if (y === undefined || y === null || y === '') {
					tmp = -1;

				} else if (x === y) {
					continue;

				} else {
					tmp = (x < y) ? -1 : 1;
				}
				return tmp * (lst[idx * 2 + 1] ? 1 : -1);
			}
			return 0;
		});
		return out;
	}
};

Enumerable.prototype.groupOf = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = arr.length;
	var tmp;
	var out;
	if (typeof ar0 === 'number' && ar0 > 0 && arguments.length === 1) {
		out = new Array(Math.ceil(bnd / ar0));
		while (++idx < bnd) {
			tmp = out[Math.floor(idx / ar0)];
			if (tmp === undefined) {
				tmp = out[Math.floor(idx / ar0)] = [];
			}
			tmp.push(arr[idx]);
		}
		return new Enumerable(out, this._s);

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.groupBy = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = -1;
	var bnd = arr.length;
	var tmp;
	var att;
	var nam;
	var hsh = {};
	var map = {};
	var out = new Enumerable();
	out._s = this._s;
	out._g = hsh;
	if (typeof ar0 === 'string') {
		if (ar0.length === 0) {
			throw 'a name was empty';

		} else {
			att = ar0;
			ar0 = function (val) { return val[att]; };
		}
	}
	if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			tmp = ar0.call(this._s, arr[idx], idx, arr);
			if (tmp === undefined) {
				nam = 'undefined';

			} else if (tmp === null) {
				nam = 'null';

			} else {
				nam = tmp.toString();
			}
			if (hsh[nam] === undefined) {
				hsh[nam] = new Enumerable([arr[idx]]);
				map[nam] = tmp;

			} else {
				hsh[nam].add(arr[idx]);
			}
		}
		for (nam in hsh) {
			tmp = hsh[nam];
			tmp._s = this._s;
			tmp._m = false;
			tmp.name = map[nam];
			out.add(tmp);
		}

	} else {
		throw 'one or more parameters were not valid';
	}
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
	var bnd = arr.length;
	var cnd = ar0._a.length;
	var tmp;
	var nam;
	if (this.any(function (obj) { return typeof obj !== 'object'; }) || ar0.any(function (obj) { return typeof obj !== 'object'; })) {
		throw 'one or more element was not an object';

	} else if (typeof ar1 === 'string') {
		if (ar1.length === 0) {
			throw 'a name was empty';

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
						arr.call(this._s, arr[idx], tmp, arr);

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
		while (++idx < bnd) {
			jdx = -1;
			tmp = null;
			while (++jdx < cnd) {
				if (ar1.call(this._s, arr[idx], idx, arr) === ar1.call(this._s, ar0._a[jdx], jdx, ar0._a)) {
					tmp = ar0._a[jdx];
					break;
				}
			}
			if (tmp !== null) {
				if (ar2) {
					arr.call(this._s, arr[idx], tmp, arr);

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
	var arr = this._a;
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var idx = -1;
	var bnd = arr.length;
	var out = 0;
	var tmp;
	if (ar0 === undefined) {
		throw 'one or more parameters were not valid';

	} else if (typeof ar0 === 'string' && ar0.length > 0 && arguments.length === 2) {
		while (++idx < bnd) {
			if (arr[idx][ar0] === ar1) {
				out++;
			}
		}

	} else if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			if (ar0.call(this._s, arr[idx], idx, arr)) {
				out++;
			}
		}

	} else {
		while (++idx < bnd) {
			if (arr[idx] === ar0) {
				out++;
			}
		}
	}
	return out;
};

Enumerable.prototype.min = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = 0;
	var jdx = 0;
	var bnd = arr.length;
	var tmp;
	var val;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return arr[0];

	} else {
		if (ar0 === undefined) {
			val = arr[0];
			while (++idx < bnd) {
				tmp = arr[idx];
				if (tmp < val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			val = arr[0][ar0];
			while (++idx < bnd) {
				tmp = arr[idx][ar0];
				if (tmp < val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			val = ar0.call(this._s, arr[0], 0, arr);
			while (++idx < bnd) {
				tmp = ar0.call(this._s, arr[idx], idx, arr);
				if (tmp < val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

		if (jdx >= 0) {
			return arr[jdx];

		} else {
			return null;
		}
	}
};

Enumerable.prototype.max = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = 0;
	var jdx = 0;
	var bnd = arr.length;
	var tmp;
	var val;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return arr[0];

	} else {
		if (ar0 === undefined) {
			val = arr[0];
			while (++idx < bnd) {
				tmp = arr[idx];
				if (tmp > val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			val = arr[0][ar0];
			while (++idx < bnd) {
				tmp = arr[idx][ar0];
				if (tmp > val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			val = ar0.call(this._s, arr[0], 0, arr);
			while (++idx < bnd) {
				tmp = ar0.call(this._s, arr[idx], idx, arr);
				if (tmp > val) {
					jdx = idx;
					val = tmp;
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}

		if (jdx >= 0) {
			return arr[jdx];

		} else {
			return null;
		}
	}
};

Enumerable.prototype.mod = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var hsh = {};
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var tmp;
	if (bnd === 0) {
		return null;

	} else if (bnd === 1) {
		return arr[0];

	} else {
		if (ar0 === undefined) {
			while (++idx < bnd) {
				tmp = arr[idx].toString();
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
				tmp = arr[idx][ar0].toString();
				if (hsh[tmp]) {
					hsh[tmp].c += 1;
				} else {
					hsh[tmp] = { i: idx, c: 1 };
				}
			}

		} else if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, arr[idx], idx, arr).toString();
				if (hsh[tmp]) {
					hsh[tmp].c += 1;
				} else {
					hsh[tmp] = { i: idx, c: 1 };
				}
			}

		} else {
			throw 'one or more parameters were not valid';
		}
		return arr[new Enumerable(hsh).max(function (obj) { return obj.value.c; }).value.i];
	}
};

Enumerable.prototype.sum = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = 0;
	var bnd = arr.length;
	var tmp;
	var val;
	if (bnd === 0) {
		return 0;

	} else {
		if (ar0 === undefined) {
			val = arr[0];
			while (++idx < bnd) {
				tmp = arr[idx];
				if (isNaN(tmp) === false) {
					val += tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw 'a name projector was empty';
			}
			val = arr[0][ar0];
			while (++idx < bnd) {
				tmp = arr[idx][ar0];
				if (isNaN(tmp) === false) {
					val += tmp;
				}
			}

		} else if (typeof ar0 === 'function') {
			val = ar0.call(this._s, arr[0], 0, arr);
			while (++idx < bnd) {
				tmp = ar0.call(this._s, arr[idx], idx, arr);
				if (isNaN(tmp) === false) {
					val += tmp;
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
	var arr = this._a;
	var ar0 = arguments[0];
	var hsh = {};
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var tmp;
	var out = [];
	if (arguments.length === 0) {
		while (++idx < bnd) {
			tmp = arr[idx];
			if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
				out[++jdx] = tmp;
			}
		}

	} else if (typeof ar0 === 'string') {
		while (++idx < bnd) {
			tmp = arr[idx][ar0];
			if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
				out[++jdx] = arr[idx];
			}
		}

	} else if (typeof ar0 === 'function') {
		while (++idx < bnd) {
			tmp = ar0.call(this._s, arr[idx], idx, arr);
			if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
				out[++jdx] = arr[idx];
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.cast = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = -1;
	var jdx = -1;
	var bnd = arr.length;
	var tmp;
	var out = [];
	if (typeof ar0 === 'string' && ar0.length > 0) {
		ar0 = ar0.toLowerCase();
		if (ar0 === 'string') {
			while (++idx < bnd) {
				tmp = arr[idx];
				if (tmp !== undefined && tmp !== null) {
					out[++jdx] = tmp.toString();
				}
			}

		} else if (ar0 === 'number') {
			while (++idx < bnd) {
				tmp = arr[idx];
				if (typeof tmp === 'number') {
					if (!isNaN(tmp)) {
						out[++jdx] = tmp;
					}

				} else if (typeof tmp === 'string') {
					tmp = parseFloat(tmp);
					if (!isNaN(tmp)) {
						out[++jdx] = tmp;
					}
				}
			}

		} else if (ar0 === 'array') {
			while (++idx < bnd) {
				tmp = arr[idx];
				if (tmp instanceof Array) {
					out[++jdx] = tmp;
				}
			}

		} else if (ar0 === 'object') {
			while (++idx < bnd) {
				tmp = arr[idx];
				if (tmp !== null && typeof tmp === 'object' && !(tmp instanceof Array)) {
					out[++jdx] = tmp;
				}
			}

		} else if (typeof tmp === ar0) {
			while (++idx < bnd) {
				out[++jdx] = arr[idx];
			}
		}
		return new Enumerable(out, this._s);

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.prototype.cross = function () {
	var arr = this._x ? this.toArray() : this.select(function (tmp) { return [tmp]; }).toArray();
	var ar0 = new Enumerable(arguments[0])._a;
	var idx = -1;
	var jdx;
	var kdx = -1;
	var bnd = arr.length;
	var cnd = ar0.length;
	var out = new Array(bnd * cnd);
	while (++idx < bnd) {
		jdx = -1;
		while (++jdx < cnd) {
			out[++kdx] = new Enumerable(arr[idx]).clone().add(ar0[jdx]).toArray();
		}
	}
	out = new Enumerable(out, this._s);
	out._x = true;
	return out;
};

Enumerable.prototype.toTable = function () {
	var arr = this._a;
	var ar0 = arguments[0];
	var idx = -1;
	var jdx;
	var bnd = arr.length;
	var cnd = ar0.length;
	var out = new Array(arr.length);
	if (new Enumerable(ar0).all(function (itm) { return typeof itm === 'string'; })) {
		while (++idx < bnd) {
			out[idx] = {};
			jdx = -1;
			while (++jdx < cnd) {
				out[idx][ar0[jdx]] = arr[idx][jdx];
			}
		}

	} else {
		throw 'one or more parameters were not valid';
	}
	return new Enumerable(out, this._s);
};

Enumerable.prototype.seek = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	var ar2 = arguments[2];
	var scp = this._s;
	if (arguments.length >= 2 && typeof ar0 === 'string' && ar0.length > 0 && (typeof ar1 === 'string' && ar1.length > 0 || typeof ar1 === 'function')) {
		var skf = function (lst) {
			var idx = -1;
			var bnd = lst.length;
			var tmp;
			while (++idx < bnd) {
				if (typeof ar1 === 'string' && lst[idx][ar1] === ar2 || typeof ar1 === 'function' && ar1.call(scp, lst[idx], idx, lst) === true) {
					return lst[idx];

				} else if (typeof lst[idx][ar0] === 'object' && lst[idx][ar0] instanceof Array && (tmp = skf(lst[idx][ar0])) !== undefined) {
					return tmp;
				}
			}
		};
		var out = skf(this._a);
		return out === undefined ? null : out;

	} else {
		throw 'one or more parameters were not valid';
	}
};

Enumerable.define = function () {
	var ar0 = arguments[0];
	var ar1 = arguments[1];
	if (arguments.length === 2 && typeof ar0 === 'string' && ar0.length > 0) {
		if (typeof ar1 === 'function') {
			if (Enumerable.prototype[ar0] !== undefined) {
				console.warn('a function has been redefined');
			}
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