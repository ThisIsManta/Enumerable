/*
 * @name Enumerable
 * @version 4.0.0
 * @author Anantachai Saothong <thisismanta@outlook.com>
 * @license MIT
 * git+https://github.com/ThisIsManta/Enumerable.git
*/
(function () {
	var ERR_INV = 'one or more parameters were not valid';
	var ERR_OOR = 'an index was out-of-range';
	var ERR_LEN = 'a length was not valid';
	var ERR_AES = 'a string cannot be empty';
	var ERR_AEA = 'an array cannot be empty';
	var ERR_MZM = 'an array had no members';
	var ERR_AMM = 'an array had more than one member';
	var ERR_MMM = 'an array had too many matching members';
	var ERR_NOB = 'one or more array members were not an object';
	var ERR_IWG = '[invokeWhich] must be called after [groupBy]';
	var ERR_BID = 'a non-object type was not allowed';

	Array.create = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var ar2 = arguments[2];
		var idx = -1;
		var nam;
		var tmp;
		var out;
		if (typeof ar0 === 'object') {
			if (ar0 instanceof Array) {
				out = ar0;
				out._m = true;

			} else if (typeof ar0.length === 'number') {
				var bnd = ar0.length;
				if (isInt(bnd) && bnd >= 0) {
					out = new Array(bnd);
					while (++idx < bnd) {
						out[idx] = ar0[idx];
					}
					out._m = false;

				} else {
					throw new Error(ERR_LEN);
				}

			} else {
				out = [];
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
				out._m = false;
			}

		} else if (typeof ar0 === 'string') {
			if (typeof ar1 === 'string' || ar1 instanceof RegExp) {
				out = ar0.split(ar1);

			} else {
				out = ar0.split('');
			}
			out._m = false;

		} else if (typeof ar0 === 'number' && isInt(ar0) && ar0 >= 0) {
			out = new Array(ar0);
			if (ar1 !== undefined) {
				while (++idx < ar0) {
					out[idx] = ar1;
				}
			}
			out._m = false;

		} else if (arguments.length === 0) {
			out = [];
			out._m = false;

		} else {
			throw new Error(ERR_INV);
		}
		return out;
	};

	Array.prototype.bind = function (ctx) {
		if (ctx === window) {
			console.warn('an array is binded to the window');

		} else if (typeof ctx === 'object') {
			this._s = ctx;

		} else {
			throw new TypeError(ERR_BID);
		}
		return this;
	};

	Array.prototype.unbind = function () {
		delete this._s;
		return this;
	};

	Array.prototype.clone = function (dep) {
		var out;
		if (dep === true) {
			out = (function (obj) {
				if (typeof obj === 'object' && obj !== null) {
					var out;
					var idx;
					if (obj instanceof Array) {
						var bnd = obj.length;
						out = new Array(bnd);
						idx = -1;
						while (++idx < bnd) {
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
			})(this);

		} else {
			out = this.slice(0);
		}
		out._m = false;
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.toImmutable = function () {
		if (this._m === undefined || this._m === true) {
			return this.clone();

		} else {
			return this;
		}
	};

	Array.prototype.toMap = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		var nam;
		var out = new Map();
		var ctx = this._s;
		if (arguments.length === 0) {
			while (++idx < bnd) {
				out.set(idx, this[idx]);
			}

		} else if (typeof ar0 === 'string') {
			if (arguments.length === 1) {
				while (++idx < bnd) {
					out.set(this[idx][ar0], this[idx]);
				}

			} else if (typeof ar1 === 'string') {
				while (++idx < bnd) {
					out.set(this[idx][ar0], this[idx][ar1]);
				}

			} else if (typeof ar1 === 'function') {
				while (++idx < bnd) {
					out.set(this[idx][ar0], ar1.call(ctx, this[idx], idx, this));
				}

			} else {
				throw new Error(ERR_INV);
			}

		} else if (typeof ar0 === 'function') {
			if (arguments.length === 1) {
				while (++idx < bnd) {
					out.set(ar0.call(ctx, this[idx], idx, this), this[idx]);
				}

			} else if (typeof ar1 === 'string') {
				while (++idx < bnd) {
					out.set(ar0.call(ctx, this[idx], idx, this), this[idx][ar1]);
				}

			} else if (typeof ar1 === 'function') {
				while (++idx < bnd) {
					out.set(ar0.call(ctx, this[idx], idx, this), ar1.call(ctx, this[idx], idx, this));
				}

			} else {
				throw new Error(ERR_INV);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return out;
	};

	Array.prototype.toObject = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		var nam;
		var out = {};
		var ctx = this._s;
		if (arguments.length === 0) {
			while (++idx < bnd) {
				nam = this[idx];
				out[nam.toString()] = nam;
			}

		} else if (typeof ar0 === 'string') {
			if (arguments.length === 1) {
				while (++idx < bnd) {
					nam = this[idx][ar0];
					if (nam !== undefined) {
						out[nam] = this[idx];
					}
				}

			} else if (typeof ar1 === 'string') {
				while (++idx < bnd) {
					nam = this[idx][ar0];
					if (nam !== undefined) {
						out[nam] = this[idx][ar1];
					}
				}

			} else if (typeof ar1 === 'function') {
				while (++idx < bnd) {
					nam = this[idx][ar0];
					if (nam !== undefined) {
						out[nam] = ar1.call(ctx, this[idx], idx, this);
					}
				}

			} else {
				throw new Error(ERR_INV);
			}

		} else if (typeof ar0 === 'function') {
			if (arguments.length === 1) {
				while (++idx < bnd) {
					nam = ar0.call(ctx, this[idx], idx, this).toString();
					out[nam] = this[idx];
				}

			} else if (typeof ar1 === 'string') {
				while (++idx < bnd) {
					nam = ar0.call(ctx, this[idx], idx, this).toString();
					out[nam] = this[idx][ar1];
				}

			} else if (typeof ar1 === 'function') {
				while (++idx < bnd) {
					nam = ar0.call(ctx, this[idx], idx, this).toString();
					out[nam] = ar1.call(ctx, this[idx], idx, this);
				}

			} else {
				throw new Error(ERR_INV);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return out;
	};

	var _toString = Array.prototype.toString;

	Array.prototype.toString = function () {
		var ar0 = arguments[0];
		if (arguments.length === 0) {
			return _toString.call(this);

		} else if (arguments.length === 1 && typeof ar0 === 'string') {
			return this.join(ar0);

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.where = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var chk;
		var tmp;
		var nam;
		var out = [];
		if (typeof ar0 === 'function' && arguments.length === 1) {
			out = this.filter(ar0, this._s);

		} else if (typeof ar0 === 'object' && arguments.length === 1) {
			while (++idx < bnd) {
				chk = 1;
				tmp = this[idx];
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
				tmp = this[idx];
				if (tmp[ar0] === ar1) {
					out[++jdx] = tmp;
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.select = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx;
		var bnd = this.length;
		var lim;
		var tmp;
		var out;
		if (typeof ar0 === 'function') {
			out = this.map(ar0, this._s);

		} else if (typeof ar0 === 'string') {
			out = new Array(bnd);
			if (ar0.length === 0) {
				throw new Error(ERR_AES);
			}
			while (++idx < bnd) {
				out[idx] = this[idx][ar0];
			}

		} else if (Array.isArray(ar0)) {
			lim = ar0.length;
			out = new Array(bnd);
			while (++idx < bnd) {
				jdx = -1;
				tmp = {};
				while (++jdx < lim) {
					tmp[ar0[jdx]] = this[idx][ar0[jdx]];
				}
				out[idx] = tmp;
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.invoke = function () {
		var fni = Array.prototype.slice.call(arguments).indexOf(function (itm) { return typeof itm === 'function'; });
		var idx = fni >= 1 ? arguments[0] : 0;
		var bnd = fni >= 2 ? arguments[1] : this.length - 1;
		var stp = fni >= 3 ? arguments[2] : (idx < bnd ? 1 : -1);
		var fnc = arguments[fni];
		var lim;
		var brk;
		var ctx = this._s;
		if (typeof fnc === 'function' && isInt(idx) && idx >= 0 && isInt(bnd) && isInt(stp) && stp !== 0) {
			if (bnd >= 0 && bnd < this.length) {
				if (stp === 1 && idx === 0 && bnd > 1024) {
					brk = function () { fnc = function () { }; idx = bnd; };
					lim = bnd % 8;
					while (idx <= lim) {
						fnc.call(ctx, this[idx], idx++, this, brk);
					}
					while (idx <= bnd) {
						fnc.call(ctx, this[idx], idx++, this, brk);
						fnc.call(ctx, this[idx], idx++, this, brk);
						fnc.call(ctx, this[idx], idx++, this, brk);
						fnc.call(ctx, this[idx], idx++, this, brk);
						fnc.call(ctx, this[idx], idx++, this, brk);
						fnc.call(ctx, this[idx], idx++, this, brk);
						fnc.call(ctx, this[idx], idx++, this, brk);
						fnc.call(ctx, this[idx], idx++, this, brk);
					}

				} else if (stp > 0) {
					brk = function () { idx = bnd; };
					while (idx <= bnd) {
						fnc.call(ctx, this[idx], idx, this, brk);
						idx += stp;
					}

				} else {
					brk = function () { idx = 0; };
					while (idx >= bnd) {
						fnc.call(ctx, this[idx], idx, this, brk);
						idx += stp;
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.invokeAsync = function () {
		var fni = Array.prototype.slice.call(arguments).indexOf(function (itm) { return typeof itm === 'function'; });
		var idx = fni >= 1 ? arguments[0] : 0;
		var bnd = fni >= 2 ? arguments[1] : this.length - 1;
		var stp = fni >= 3 ? arguments[2] : (idx < bnd ? 1 : -1);
		var fnc = arguments[fni];
		var btc = arguments[fni + 1] !== undefined ? arguments[fni + 1] : 1;
		var lim;
		var brk;
		var hdr;
		var xit;
		var arr = this;
		var ctx = this._s;
		var pwn;
		if (typeof fnc === 'function' && isInt(idx) && idx >= 0 && isInt(bnd) && isInt(stp) && stp !== 0 && isInt(btc) && btc > 0) {
			if (bnd >= 0 && bnd < this.length) {
				if (stp > 0) {
					pwn = new Promise(function (res, rej) {
						brk = function () {
							idx = bnd;
							xit = true;
						};
						hdr = function () {
							lim = btc;
							while (idx <= bnd && lim-- > 0) {
								fnc.call(ctx, arr[idx], idx, arr, brk);
								idx += stp;
							}
							if (idx <= bnd) {
								setTimeout(hdr, 2);

							} else if (xit === true) {
								rej();

							} else {
								res(arr);
							}
						};
					});

				} else {
					pwn = new Promise(function (res, rej) {
						brk = function () {
							idx = 0;
							xit = true;
						};
						hdr = function () {
							lim = btc;
							while (idx >= bnd && lim-- > 0) {
								fnc.call(ctx, arr[idx], idx, arr, brk);
								idx += stp;
							}
							if (idx >= bnd) {
								setTimeout(hdr, 2);

							} else if (xit === true) {
								rej();

							} else {
								res(arr);
							}
						};
					});
				}
				setTimeout(hdr);

			} else {
				throw new RangeError(ERR_OOR);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return pwn;
	};

	Array.prototype.invokeWhich = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		if (this._g === undefined) {
			throw new Error(ERR_IWG);

		} else if (typeof ar1 === 'function' && arguments.length === 2) {
			if (ar0 === undefined) {
				ar0 = 'undefined';

			} else if (ar0 === null) {
				ar0 = 'null';

			} else {
				ar0 = ar0.toString();
			}
			this._g[ar0].invoke(ar1);

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.take = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var jdx = 0;
		var kdx;
		var bnd = this.length;
		var out;
		if (typeof ar0 === 'function') {
			kdx = bnd;
			while (++idx < bnd) {
				if (ar0.call(this._s, this[idx], idx, this) === false) {
					kdx = idx;
					break;
				}
			}

		} else if (!isFinite(ar0) || ar0 === Number.MAX_SAFE_INTEGER) {
			out = [];

		} else if (isInt(ar0)) {
			if (ar0 < 0 || ar0 > bnd) {
				throw new RangeError(ERR_OOR);

			} else {
				jdx = ar0;
			}
			if (isInt(ar1)) {
				if (ar1 < 0 || ar1 > bnd) {
					throw new RangeError(ERR_OOR);

				} else if (ar0 > ar1) {
					throw new RangeError(ERR_SGS);

				} else {
					kdx = ar1;
				}
			}
			out = this.slice(jdx, kdx);

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.skip = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		var tmp;
		var out;
		if (typeof ar0 === 'function') {
			tmp = bnd;
			while (++idx < bnd) {
				if (ar0.call(this._s, this[idx], idx, this) === false) {
					tmp = idx;
					break;
				}
			}
			return this.take.call(this, tmp, bnd);

		} else if (!isFinite(ar0) || ar0 === Number.MAX_SAFE_INTEGER) {
			out = this.toImmutable();

		} else if (isInt(ar0)) {
			if (ar0 < 0 || ar0 > bnd) {
				throw new RangeError(ERR_OOR);

			} else {
				jdx = ar0;
			}
			if (isInt(ar1)) {
				if (ar1 < 0 || ar1 > bnd) {
					throw new RangeError(ERR_OOR);

				} else if (ar0 > ar1) {
					throw new RangeError(ERR_SGS);

				} else {
					kdx = ar1;
				}
				out = this.toImmutable();
				out.splice(ar0, ar1 - ar0);

			} else {
				out = this.slice(0, ar0);
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.flatten = function () {
		var ar0 = !!arguments[0];
		var idx = -1;
		var jdx;
		var kdx = -1;
		var bnd = this.length;
		var len;
		var tmp;
		var out = [];
		while (++idx < bnd) {
			tmp = this[idx];
			if (typeof tmp === 'object' && tmp instanceof Array) {
				if (tmp.length > 0) {
					if (ar0) {
						tmp = tmp.flatten(ar0);
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
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.any = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		if (bnd === 0) {
			return false;

		} else if (ar0 === undefined) {
			return true;

		} else if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				if (ar0.call(this._s, this[idx], idx, this)) {
					return true;
				}
			}
			return false;

		} else if (typeof ar0 === 'string' && arguments.length === 2) {
			while (++idx < bnd) {
				if (this[idx][ar0] === ar1) {
					return true;
				}
			}
			return false;

		} else {
			while (++idx < bnd) {
				if (this[idx] === ar0) {
					return true;
				}
			}
			return false;
		}
	};

	Array.prototype.all = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		if (bnd === 0) {
			return true;

		} else if (ar0 === undefined) {
			throw new Error(ERR_INV);

		} else if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				if (!ar0.call(this._s, this[idx], idx, this)) {
					return false;
				}
			}
			return true;

		} else if (typeof ar0 === 'string' && arguments.length === 2) {
			while (++idx < bnd) {
				if (this[idx][ar0] !== ar1) {
					return false;
				}
			}
			return true;

		} else {
			while (++idx < bnd) {
				if (this[idx] !== ar0) {
					return false;
				}
			}
			return true;
		}
	};

	Array.prototype.has = function () {
		return this.indexOf.apply(this, arguments) >= 0;
	};

	Array.prototype.isSame = function () {
		var ar0 = Array.create(arguments[0]);
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		if (bnd !== ar0.length) {
			return false;

		} else if (arguments.length === 1) {
			while (++idx < bnd) {
				if (this[idx] !== ar0[idx]) {
					return false;
				}
			}
			return true;

		} else if (typeof ar1 === 'function' && arguments.length === 2) {
			while (++idx < bnd) {
				if (ar1.call(this._s, this[idx], ar0[idx]) === false) {
					return false;
				}
			}
			return true;

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.isLike = function () {
		var ar0 = arguments[0].toImmutable();
		var ar1 = arguments[1];
		var idx = -1;
		var jdx;
		var bnd = this.length;
		var cnd;
		var tmp;
		if (bnd !== ar0.length || ((bnd === 0) !== (ar0.length === 0))) {
			return false;

		} else if (ar1 === undefined) {
			while (++idx < bnd) {
				tmp = ar0.indexOf(this[idx]);
				if (tmp < 0) {
					return false;

				} else {
					ar0.removeAt(tmp);
				}
			}
			return ar0.length === 0;

		} else if (typeof ar1 === 'function') {
			while (++idx < bnd) {
				tmp = this[idx];
				jdx = -1;
				cnd = ar0.length;
				while (++jdx < cnd) {
					if (ar1.call(this._s, tmp, ar0[jdx])) {
						break;
					}
				}
				if (jdx === cnd) {
					return false;

				} else {
					ar0.removeAt(jdx);
				}
			}
			return ar0.length === 0;

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.isSubset = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var bnd = this.length;
		while (++idx < bnd) {
			if (ar0.indexOf(this[idx]) === -1) {
				return false;
			}
		}
		return true;
	};

	Array.prototype.indexOf = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		if (arguments.length === 2) {
			if (isInt(ar1) && ar1 >= 0 && ar1 <= idx) {
				idx = ar1 - 1;

			} else {
				throw new RangeError(ERR_OOR);
			}
		}
		if (arguments.length >= 1) {
			if (typeof ar0 === 'function') {
				while (++idx < bnd) {
					if (ar0.call(this._s, this[idx], idx, this) === true) {
						return idx;
					}
				}

			} else {
				while (++idx < bnd) {
					if (this[idx] === ar0) {
						return idx;
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return -1;
	};

	Array.prototype.lastIndexOf = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = this.length;
		if (arguments.length === 2) {
			if (isInt(ar1) && ar1 >= 0 && ar1 <= idx) {
				idx = ar1;

			} else {
				throw new RangeError(ERR_OOR);
			}
		}
		if (arguments.length >= 1) {
			if (typeof ar0 === 'function') {
				while (--idx >= 0) {
					if (ar0.call(this._s, this[idx], idx, this) === true) {
						return idx;
					}
				}

			} else {
				while (--idx >= 0) {
					if (this[idx] === ar0) {
						return idx;
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return -1;
	};

	var _find = Array.prototype.find;

	Array.prototype.find = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx;
		if (typeof ar0 === 'function') {
			return _find.apply(this, arguments);

		} else if (typeof ar0 === 'string' && arguments.length === 2) {
			idx = this.indexOf.call(this, function (obj) { return obj[ar0] === ar1; });
			if (idx >= 0) {
				return this[idx];

			} else {
				return undefined;
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.firstOrNull = function () {
		if (this.length === 0) {
			return null;

		} else if (arguments.length === 0) {
			return this[0];

		} else {
			var idx = this.indexOf.apply(this, arguments);
			if (idx >= 0) {
				return this[idx];

			} else {
				return null;
			}
		}
	};

	Array.prototype.first = function () {
		if (this.length === 0) {
			throw new Error(ERR_AEA);

		} else if (arguments.length === 0) {
			return this[0];

		} else {
			var idx = this.indexOf.apply(this, arguments);
			if (idx >= 0) {
				return this[idx];

			} else {
				throw new Error(ERR_MZM);
			}
		}
	};

	Array.prototype.lastOrNull = function () {
		if (this.length === 0) {
			return null;

		} else if (arguments.length === 0) {
			return this[this.length - 1];

		} else {
			var idx = this.lastIndexOf.apply(this, arguments);
			if (idx >= 0) {
				return this[idx];

			} else {
				return null;
			}
		}
	};

	Array.prototype.last = function () {
		if (this.length === 0) {
			throw new Error(ERR_AEA);

		} else if (arguments.length === 0) {
			return this[this.length - 1];

		} else {
			var idx = this.lastIndexOf.apply(this, arguments);
			if (idx >= 0) {
				return this[idx];

			} else {
				throw new Error(ERR_MZM);
			}
		}
	};

	Array.prototype.singleOrNull = function () {
		if (this.length === 0) {
			return null;

		} else if (arguments.length === 0) {
			if (this.length === 1) {
				return this[0];

			} else {
				return null;
			}

		} else if (arguments.length === 1) {
			var idx = this.indexOf.call(this, arguments[0]);
			if (idx >= 0) {
				if (idx === this.lastIndexOf.call(this, arguments[0])) {
					return this[idx];

				} else {
					return null;
				}

			} else {
				return null;
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.single = function () {
		if (this.length === 0) {
			throw new Error(ERR_AEA);

		} else if (arguments.length === 0) {
			if (this.length === 1) {
				return this[0];

			} else {
				throw new Error(ERR_AMM);
			}

		} else if (arguments.length === 1) {
			var ar0 = arguments[0];
			var idx = this.indexOf.call(this, ar0);
			if (idx >= 0) {
				if (idx === this.lastIndexOf.call(this, ar0)) {
					return this[idx];

				} else {
					throw new Error(ERR_MMM);
				}

			} else {
				throw new Error(ERR_MZM);
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.distinct = function () {
		var ar0 = arguments[0];
		var hsh = {};
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var tmp;
		var nil = false;
		var out = [];
		if (ar0 === undefined) {
			while (++idx < bnd) {
				tmp = this[idx];
				if (tmp === undefined || tmp === null) {
					if (nil === false) {
						nil = true;
						out[++jdx] = tmp;
					}

				} else if (hsh[(tmp = tmp.toString())] === undefined) {
					hsh[tmp] = true;
					out[++jdx] = this[idx];
				}
			}

		} else if (typeof ar0 === 'string' && ar0.length > 0) {
			while (++idx < bnd) {
				tmp = this[idx][ar0];
				if (tmp === undefined || tmp === null) {
					if (nil === false) {
						nil = true;
						out[++jdx] = tmp;
					}

				} else if (hsh[(tmp = tmp.toString())] === undefined) {
					hsh[tmp] = true;
					out[++jdx] = this[idx];
				}
			}

		} else if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this[idx], idx, this);
				if (tmp === undefined || tmp === null) {
					if (nil === false) {
						nil = true;
						out[++jdx] = null;
					}

				} else if (hsh[(tmp = tmp.toString())] === undefined) {
					hsh[tmp] = true;
					out[++jdx] = this[idx];
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.add = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		if (arguments.length === 1) {
			this.push(ar0);

		} else if (arguments.length === 2 && isInt(ar1)) {
			if (ar1 >= 0 && ar1 <= this.length) {
				this.splice(ar1, 0, ar0);

			} else {
				throw new RangeError(ERR_OOR);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.addRange = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		if (arguments.length === 1) {
			Array.prototype.splice.apply(this, [this.length, 0].concat(ar0));

		} else if (arguments.length === 2 && isInt(ar1)) {
			if (ar1 >= 0 && ar1 <= this.length) {
				if (ar0.length === 1) {
					this.splice(ar1, 0, ar0[0]);

				} else if (ar0.length > 1) {
					Array.prototype.splice.apply(this, [ar1, 0].concat(ar0));
				}

			} else {
				throw new RangeError(ERR_OOR);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.remove = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx;
		if (arguments.length === 1) {
			idx = this.indexOf(ar0);
			if (idx === -1 || !isNaN(ar1) && idx > ar1) {
				return this;

			} else {
				return this.removeAt(idx);
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.removeAt = function () {
		var ar0 = arguments[0];
		if (arguments.length === 1) {
			if (isInt(ar0) && ar0 >= 0 && ar0 <= this.length) {
				this.splice(ar0, 1);

			} else {
				throw new RangeError(ERR_OOR);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.removeRange = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx;
		var bnd = ar0.length;
		if (arguments.length === 1) {
			while (++idx < bnd) {
				this.remove(ar0[idx]);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.removeAll = function () {
		if (arguments.length === 0) {
			this.splice(0, this.length);

		} else if (arguments.length === 1) {
			var ar0 = arguments[0];
			var idx = this.length;
			while (--idx >= 0) {
				if (this[idx] === ar0) {
					this.splice(idx, 1);
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.split = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var pvt = 0;
		var bnd = this.length;
		var out = [];
		var ctx = this._s;
		if (arguments.length !== 1) {
			throw new Error(ERR_INV);

		} else if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				if (ar0.call(ctx, this[idx], idx, this)) {
					out.push(this.slice(pvt, idx));
					pvt = idx + 1;
				}
			}

		} else {
			while (++idx < bnd) {
				if (this[idx] === ar0) {
					out.push(this.slice(pvt, idx));
					pvt = idx + 1;
				}
			}
		}
		if (this.length > 0 && pvt <= bnd) {
			out.push(this.slice(pvt));
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.splitAt = function () {
		var ar0 = arguments[0];
		var out = [];
		if (isInt(ar0) && arguments.length === 1) {
			if (ar0 >= 0 && ar0 < this.length) {
				out.push(this.slice(0, ar0));
				out.push(this.slice(ar0));
				if (this._s !== undefined) {
					out._s = this._s;
				}
				return out;

			} else {
				throw new RangeError(ERR_OOR);
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.replace = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var ar2 = arguments[2];
		var idx = -1;
		var bnd = this.length;
		var out = this.toImmutable();
		if (ar0 === undefined) {
			throw new Error(ERR_INV);
		}
		if (!isInt(ar2) || ar2 < 0) {
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
		return out;
	};

	Array.prototype.replaceAt = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var out = this.toImmutable();
		if (arguments.length !== 2) {
			throw new Error(ERR_INV);

		} else if (!isInt(ar0) || ar0 < 0 || ar0 >= out.length) {
			throw new RangeError(ERR_OOR);

		} else {
			out[ar0] = ar1;
		}
		return out;
	};

	Array.prototype.union = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx = this.length - 1;
		var bnd = ar0.length;
		var out = this.toImmutable();
		while (++idx < bnd) {
			if (!this.has(ar0[idx])) {
				out[++jdx] = ar0[idx];
			}
		}
		return out;
	};

	Array.prototype.intersect = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var out = [];
		while (++idx < bnd) {
			if (ar0.has(this[idx])) {
				out[++jdx] = this[idx];
			}
		}
		out._m = false;
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.difference = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var out = [];
		while (++idx < bnd) {
			if (!ar0.has(this[idx])) {
				out[++jdx] = this[idx];
			}
		}
		out._m = false;
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	var _reverse = Array.prototype.reverse;
	Array.prototype.reverse = function () {
		var out = this.toImmutable();
		_reverse.call(out);
		return out;
	};

	Array.prototype.sortBy = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var out;
		var ctx = this._s;
		if (arguments.length <= 2) {
			if (typeof ar0 === 'function') {
				out = this.select(function (val, idx) {
					return { v: val, r: ar0.call(ctx, val, idx, this), i: idx };
				});

			} else if (typeof ar0 === 'string') {
				if (ar0.length === 0) {
					throw new Error(ERR_AES);
				}
				out = this.select(function (val) {
					return { v: val, r: val[ar0] };
				});

			} else {
				throw new Error(ERR_INV);
			}
			if (ar1 === undefined || ar1 === true) {
				out.sort(function (x, y) {
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
				out.sort(function (x, y) {
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
				throw new Error(ERR_INV);
			}
			return out.select('v');

		} else {
			var lst = Array.prototype.slice.call(arguments).select(function (val, idx) {
				if (idx % 2 === 0) {
					if (typeof val === 'string') {
						return function (itm) { return itm[val]; };

					} else if (typeof val === 'function') {
						return val;

					} else {
						throw new Error(ERR_INV);
					}

				} else {
					return val === undefined ? true : !!val;
				}
			});
			if (lst.length % 2 === 1) {
				lst.push(true);
			}
			var idx;
			var bnd = lst.length / 2;
			var tmp;
			var x, y;
			out = this.clone();
			out.sort(function (cur, ano) {
				idx = -1;
				while (++idx < bnd) {
					x = lst[idx * 2].call(ctx, cur);
					y = lst[idx * 2].call(ctx, ano);
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

	Array.prototype.sortOn = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var bnd = ar0.count();
		var ctx = this._s;
		if (typeof ar1 === 'string' && ar1.length > 0) {
			var nam = ar1;
			ar1 = function (itm) {
				return itm[nam];
			};
		}
		if (this._a.length <= 1) {
			return this;

		} else if (arguments.length === 1) {
			return this.sortBy(function (itm, idx) {
				var tmp = ar0.indexOf(itm);
				return tmp >= 0 ? tmp : (bnd + idx);
			});

		} else if (typeof ar1 === 'function' && arguments.length === 2) {
			return this.sortBy(function (itm, idx) {
				var tmp = ar0.indexOf(ar1.apply(ctx, arguments));
				return tmp >= 0 ? tmp : (bnd + idx);
			});

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.groupOf = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var bnd = this.length;
		var tmp;
		var out;
		if (isInt(ar0) && ar0 > 0 && arguments.length === 1) {
			out = new Array(Math.ceil(bnd / ar0));
			while (++idx < bnd) {
				tmp = out[Math.floor(idx / ar0)];
				if (tmp === undefined) {
					tmp = out[Math.floor(idx / ar0)] = [];
				}
				tmp.push(this[idx]);
			}
			if (this._s !== undefined) {
				out._s = this._s;
			}
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.groupBy = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var bnd = this.length;
		var tmp;
		var att;
		var nam;
		var hsh = {};
		var map = {};
		var out = [];
		if (typeof ar0 === 'string') {
			if (ar0.length === 0) {
				throw new Error(ERR_AES);

			} else {
				att = ar0;
				ar0 = function (val) { return val[att]; };
			}
		}
		if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this[idx], idx, this);
				if (tmp === undefined) {
					nam = 'undefined';

				} else if (tmp === null) {
					nam = 'null';

				} else {
					nam = tmp.toString();
				}
				if (hsh[nam] === undefined) {
					hsh[nam] = [this[idx]];
					map[nam] = tmp;

				} else {
					hsh[nam].add(this[idx]);
				}
			}
			for (nam in hsh) {
				tmp = hsh[nam];
				tmp._m = false;
				tmp._s = this._s;
				tmp.name = map[nam];
				out.add(tmp);
			}

		} else {
			throw new Error(ERR_INV);
		}
		out._g = hsh;
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.joinBy = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var ar2 = typeof arguments[2] === 'function' ? arguments[2] : undefined;
		var ovr = typeof arguments[2] === 'boolean' ? arguments[2] : false;
		var idx = -1;
		var jdx;
		var bnd = this.length;
		var cnd = ar0.length;
		var tmp;
		var nam;
		var ctx = this._s;
		if (this.any(function (obj) { return typeof obj !== 'object'; }) || ar0.any(function (obj) { return typeof obj !== 'object'; })) {
			throw new Error(ERR_NOB);

		} else if (typeof ar1 === 'string') {
			if (ar1.length === 0) {
				throw new Error(ERR_AES);

			} else {
				while (++idx < bnd) {
					jdx = -1;
					tmp = null;
					while (++jdx < cnd) {
						if (ar0[jdx][ar1] === this[idx][ar1]) {
							tmp = ar0[jdx];
							break;
						}
					}
					if (tmp !== null) {
						if (ar2) {
							ar2.call(ctx, this[idx], tmp, this);

						} else {
							for (nam in tmp) {
								if (ovr === true) {
									this[idx][nam] = tmp[nam];

								} else if (this[idx][nam] === undefined) {
									this[idx][nam] = tmp[nam];
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
					if (ar1.call(ctx, this[idx], idx, this) === ar1.call(ctx, ar0[jdx], jdx, ar0)) {
						tmp = ar0[jdx];
						break;
					}
				}
				if (tmp !== null) {
					if (ar2) {
						ar2.call(ctx, this[idx], tmp, this);

					} else {
						for (nam in tmp) {
							if (ovr === true) {
								this[idx][nam] = tmp[nam];

							} else if (this[idx][nam] === undefined) {
								this[idx][nam] = tmp[nam];
							}
						}
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	Array.prototype.countBy = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var idx = -1;
		var bnd = this.length;
		var out = 0;
		var ctx = this._s;
		if (ar0 === undefined) {
			throw new Error(ERR_INV);

		} else if (typeof ar0 === 'string' && ar0.length > 0 && arguments.length === 2) {
			while (++idx < bnd) {
				if (this[idx][ar0] === ar1) {
					out++;
				}
			}

		} else if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				if (ar0.call(ctx, this[idx], idx, this)) {
					out++;
				}
			}

		} else {
			while (++idx < bnd) {
				if (this[idx] === ar0) {
					out++;
				}
			}
		}
		return out;
	};

	Array.prototype.min = function () {
		var ar0 = arguments[0];
		var idx = 0;
		var jdx = 0;
		var bnd = this.length;
		var tmp;
		var val;
		var ctx = this._s;
		if (bnd === 0) {
			return null;

		} else if (bnd === 1) {
			return this[0];

		} else {
			if (ar0 === undefined) {
				val = this[0];
				while (++idx < bnd) {
					tmp = this[idx];
					if (tmp < val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else if (typeof ar0 === 'string') {
				if (ar0.length === 0) {
					throw new Error(ERR_AES);
				}
				val = this[0][ar0];
				while (++idx < bnd) {
					tmp = this[idx][ar0];
					if (tmp < val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else if (typeof ar0 === 'function') {
				val = ar0.call(ctx, this[0], 0, this);
				while (++idx < bnd) {
					tmp = ar0.call(ctx, this[idx], idx, this);
					if (tmp < val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else {
				throw new Error(ERR_INV);
			}

			if (jdx >= 0) {
				return this[jdx];

			} else {
				return null;
			}
		}
	};

	Array.prototype.max = function () {
		var ar0 = arguments[0];
		var idx = 0;
		var jdx = 0;
		var bnd = this.length;
		var tmp;
		var val;
		var ctx = this._s;
		if (bnd === 0) {
			return null;

		} else if (bnd === 1) {
			return this[0];

		} else {
			if (ar0 === undefined) {
				val = this[0];
				while (++idx < bnd) {
					tmp = this[idx];
					if (tmp > val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else if (typeof ar0 === 'string') {
				if (ar0.length === 0) {
					throw new Error(ERR_AES);
				}
				val = this[0][ar0];
				while (++idx < bnd) {
					tmp = this[idx][ar0];
					if (tmp > val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else if (typeof ar0 === 'function') {
				val = ar0.call(ctx, this[0], 0, this);
				while (++idx < bnd) {
					tmp = ar0.call(ctx, this[idx], idx, this);
					if (tmp > val) {
						jdx = idx;
						val = tmp;
					}
				}

			} else {
				throw new Error(ERR_INV);
			}

			if (jdx >= 0) {
				return this[jdx];

			} else {
				return null;
			}
		}
	};

	Array.prototype.mod = function () {
		var ar0 = arguments[0];
		var hsh = {};
		var idx = -1;
		var bnd = this.length;
		var tmp;
		var ctx = this._s;
		if (bnd === 0) {
			return null;

		} else if (bnd === 1) {
			return this[0];

		} else {
			if (ar0 === undefined) {
				while (++idx < bnd) {
					tmp = this[idx].toString();
					if (hsh[tmp]) {
						hsh[tmp].c += 1;

					} else {
						hsh[tmp] = { i: idx, c: 1 };
					}
				}

			} else if (typeof ar0 === 'string') {
				if (ar0.length === 0) {
					throw new Error(ERR_AES);
				}
				while (++idx < bnd) {
					tmp = this[idx][ar0].toString();
					if (hsh[tmp]) {
						hsh[tmp].c += 1;

					} else {
						hsh[tmp] = { i: idx, c: 1 };
					}
				}

			} else if (typeof ar0 === 'function') {
				while (++idx < bnd) {
					tmp = ar0.call(ctx, this[idx], idx, this).toString();
					if (hsh[tmp]) {
						hsh[tmp].c += 1;

					} else {
						hsh[tmp] = { i: idx, c: 1 };
					}
				}

			} else {
				throw new Error(ERR_INV);
			}
			return this[Array.create(hsh).max(function (obj) { return obj.value.c; }).value.i];
		}
	};

	Array.prototype.sum = function () {
		var ar0 = arguments[0];
		var idx = 0;
		var bnd = this.length;
		var tmp;
		var val;
		var ctx = this._s;
		if (bnd === 0) {
			return 0;

		} else {
			if (ar0 === undefined) {
				val = this[0];
				while (++idx < bnd) {
					tmp = this[idx];
					if (isNaN(tmp) === false) {
						val += tmp;
					}
				}

			} else if (typeof ar0 === 'string') {
				if (ar0.length === 0) {
					throw new Error(ERR_AES);
				}
				val = this[0][ar0];
				while (++idx < bnd) {
					tmp = this[idx][ar0];
					if (isNaN(tmp) === false) {
						val += tmp;
					}
				}

			} else if (typeof ar0 === 'function') {
				val = ar0.call(ctx, this[0], 0, this);
				while (++idx < bnd) {
					tmp = ar0.call(ctx, this[idx], idx, this);
					if (isNaN(tmp) === false) {
						val += tmp;
					}
				}

			} else {
				throw new Error(ERR_INV);
			}
			return val;
		}
	};

	Array.prototype.avg = function () {
		return this.sum.apply(this, arguments) / this.length;
	};

	Array.prototype.norm = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var tmp;
		var out = [];
		var ctx = this._s;
		if (arguments.length === 0) {
			while (++idx < bnd) {
				tmp = this[idx];
				if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
					out[++jdx] = tmp;
				}
			}

		} else if (typeof ar0 === 'string') {
			while (++idx < bnd) {
				tmp = this[idx][ar0];
				if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
					out[++jdx] = this[idx];
				}
			}

		} else if (typeof ar0 === 'function') {
			while (++idx < bnd) {
				tmp = ar0.call(ctx, this[idx], idx, this);
				if (tmp && (typeof tmp !== 'string' || tmp.trim().length > 0) && (typeof tmp !== 'number' || isFinite(tmp))) {
					out[++jdx] = this[idx];
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.cast = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var tmp;
		var out = [];
		if (typeof ar0 === 'function') {
			ar0 = ar0.name;
		}
		if (typeof ar0 === 'string' && ar0.length > 0) {
			ar0 = ar0.toLowerCase();
			if (ar0 === 'string') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (tmp !== undefined && tmp !== null) {
						out[++jdx] = tmp.toString();
					}
				}

			} else if (ar0 === 'number') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (typeof tmp === 'number' && !isNaN(tmp)) {
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
					tmp = this[idx];
					if (tmp instanceof Array) {
						out[++jdx] = tmp;
					}
				}

			} else if (ar0 === 'function') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (typeof tmp === 'function') {
						out[++jdx] = tmp;
					}
				}

			} else if (ar0 === 'object') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (tmp !== null && typeof tmp === 'object' && !(tmp instanceof Array)) {
						out[++jdx] = tmp;
					}
				}

			} else if (typeof tmp === ar0) {
				while (++idx < bnd) {
					out[++jdx] = this[idx];
				}
			}
			if (this._s !== undefined) {
				out._s = this._s;
			}
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	Array.prototype.cross = function () {
		var arr = this._x === true ? this : this.select(function (tmp) { return [tmp]; });
		var ar0 = arguments[0];
		var idx = -1;
		var jdx;
		var kdx = -1;
		var bnd = this.length;
		var cnd = ar0.length;
		var out = new Array(bnd * cnd);
		while (++idx < bnd) {
			jdx = -1;
			while (++jdx < cnd) {
				out[++kdx] = [arr[idx]].add(ar0[jdx]);
			}
		}
		out._x = true;
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.assign = function () {
		var ar0 = arguments[0];
		var idx = -1;
		var jdx;
		var bnd = this.length;
		var cnd = ar0.length;
		var tmp;
		var out = new Array(this.length);
		if (ar0.all(function (itm) { return typeof itm === 'string'; })) {
			while (++idx < bnd) {
				tmp = {};
				jdx = -1;
				while (++jdx < cnd) {
					tmp[ar0[jdx]] = this[idx][jdx];
				}
				tmp = out[idx];
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	Array.prototype.seek = function () {
		var ar0 = arguments[0];
		var ar1 = arguments[1];
		var ar2 = arguments[2];
		var ctx = this._s;
		if (arguments.length >= 2 && typeof ar0 === 'string' && ar0.length > 0 && (typeof ar1 === 'string' && ar1.length > 0 || typeof ar1 === 'function')) {
			var skf = function (lst) {
				var idx = -1;
				var bnd = lst.length;
				var tmp;
				while (++idx < bnd) {
					if (typeof ar1 === 'string' && lst[idx][ar1] === ar2 || typeof ar1 === 'function' && ar1.call(ctx, lst[idx], idx, lst) === true) {
						return lst[idx];

					} else if (typeof lst[idx][ar0] === 'object' && lst[idx][ar0] instanceof Array && (tmp = skf(lst[idx][ar0])) !== undefined) {
						return tmp;
					}
				}
			};
			var out = skf(this._a);
			return out === undefined ? null : out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	var isInt = function (valu) {
		return typeof valu === 'number' && isFinite(valu) && Math.floor(valu) === valu && Math.abs(valu) <= Number.MAX_SAFE_INTEGER;
	};

	Object.isObject = function (ar0) {
		return typeof ar0 === 'object' && ar0 !== null && (ar0 instanceof Array) === false;
	};

	Object.isEqual = function (ar0, ar1) {
		if (ar0 === ar1) {
			return true;

		} else if (Array.isArray(ar0) && Array.isArray(ar1)) {
			return ar0.length === ar1.length && ar0.all(function (val, idx) { return Object.isEqual(ar0[idx], ar1[idx]); });

		} else if (Object.isObject(ar0) && Object.isObject(ar1)) {
			var ls0 = [];
			for (nam in ar0) {
				if (ar0[nam] !== undefined) {
					ls0.push(nam);
				}
			}
			var ls1 = [];
			for (nam in ar1) {
				if (ar1[nam] !== undefined) {
					ls1.push(nam);
				}
			}
			return ls0.isLike(ls1) && ls0.all(function (nam, idx) {
				return Object.isEqual(ar0[nam], ar1[nam]);
			});

		} else if (typeof ar0 === 'number' && typeof ar1 === 'number' && isNaN(ar0) && isNaN(ar1)) {
			return true;

		} else {
			return false;
		}
	};

	String.prototype.contains = function (val) {
		return this.indexOf(val) >= 0;
	};

	String.prototype.toRegExp = function (flg) {
		return new RegExp(this.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), flg);
	};

	String.prototype.toHashCode = function () {
		var idx = -1;
		var bnd = this.length;
		var out = 0;
		if (bnd === 0) {
			return out;

		} else {
			while (++idx < bnd) {
				out = ((out << 5) - out) + this.charCodeAt(idx);
				out |= 0;
			}
			return out;
		}
	};

	var XML_PAR = [['<', '&lt;'], ['>', '&gt;'], ['&', '&amp;'], ['"', '&quot;'], ['\'', '&apos;']];
	var XML_ENC = XML_PAR.toObject('0', '1');
	var XML_DEC = XML_PAR.toObject('1', '0');
	var XML_SYM = ('[' + XML_PAR.select('0') + ']').toRegExp('g');
	var XML_COD = ('(' + XML_PAR.select('1').join('|') + ')').toRegExp('g');
	var _encodeXML = function (chr) {
		return XML_ENC[chr];
	};
	var _decodeXML = function (chr) {
		return XML_DEC[chr];
	};

	String.prototype.toEncodedXML = function () {
		return this.replace(XML_SYM, _encodeXML);
	};

	String.prototype.toDecodedXML = function () {
		return this.replace(XML_COD, _decodeXML);
	};

	var WRD_CPH = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
	var WRD_CPX =
		/[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g;
	var WRD_BSC = /[a-zA-Z0-9]+/g;

	String.prototype.splitWords = function () {
		return this.match(WRD_CPH.test(this.toString()) ? WRD_CPX : WRD_BSC) || [];
	};

	var CAS_LAT = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
	var CAS_MAP = {
		"\xc0": 'A', "\xc1": 'A', "\xc2": 'A', "\xc3": 'A', "\xc4": 'A', "\xc5": 'A',
		"\xe0": 'a', "\xe1": 'a', "\xe2": 'a', "\xe3": 'a', "\xe4": 'a', "\xe5": 'a',
		"\xc7": 'C', "\xe7": 'c',
		"\xd0": 'D', "\xf0": 'd',
		"\xc8": 'E', "\xc9": 'E', "\xca": 'E', "\xcb": 'E',
		"\xe8": 'e', "\xe9": 'e', "\xea": 'e', "\xeb": 'e',
		"\xcC": 'I', "\xcd": 'I', "\xce": 'I', "\xcf": 'I',
		"\xeC": 'i', "\xed": 'i', "\xee": 'i', "\xef": 'i',
		"\xd1": 'N', "\xf1": 'n',
		"\xd2": 'O', "\xd3": 'O', "\xd4": 'O', "\xd5": 'O', "\xd6": 'O', "\xd8": 'O',
		"\xf2": 'o', "\xf3": 'o', "\xf4": 'o', "\xf5": 'o', "\xf6": 'o', "\xf8": 'o',
		"\xd9": 'U', "\xda": 'U', "\xdb": 'U', "\xdc": 'U',
		"\xf9": 'u', "\xfa": 'u', "\xfb": 'u', "\xfc": 'u',
		"\xdd": 'Y', "\xfd": 'y', "\xff": 'y',
		"\xc6": 'Ae', "\xe6": 'ae',
		"\xde": 'Th', "\xfe": 'th',
		"\xdf": 'ss'
	};
	var CAS_MAR = /[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]/g;
	var _convertLatinCase = function (chr) {
		return CAS_MAP[chr];
	};

	String.prototype.toEnglishCase = function () {
		return this.replace(CAS_LAT, _convertLatinCase).replace(CAS_MAR, '');
	};

	String.prototype.toCapitalWord = function (txt) {
		if (txt === undefined) {
			txt = this;
		}
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	};

	var CAS_APO = /['’]/g;

	String.prototype.toCamelCase = function () {
		return this.toEnglishCase().replace(CAS_APO, '').toLowerCase().splitWords().map(String.prototype.toCapitalWord).join('');
	};

	String.prototype.toKebabCase = function () {
		return this.toEnglishCase().replace(CAS_APO, '').toLowerCase().splitWords().join('-');
	};
})();