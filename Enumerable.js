/*
 * @name Enumerable
 * @version 4.1.0
 * @author Anantachai Saothong <thisismanta@outlook.com>
 * @license MIT
 * https://github.com/ThisIsManta/Enumerable.git
*/
(function () {
	var ERR_INV = 'one or more parameters were not valid';
	var ERR_OOR = 'an index was out-of-range';
	var ERR_LEN = 'a length was not valid';
	var ERR_AES = 'a string cannot be empty';
	var ERR_AEA = 'an array cannot be empty';
	var ERR_MZM = 'an array had no matching members';
	var ERR_AMM = 'an array had more than one matching member';
	var ERR_MMM = 'an array had too many matching members';
	var ERR_NOB = 'one or more array members were not an object';
	var ERR_NST = 'one or more array members were not a string';
	var ERR_IWG = '[invokeWhich] must be called after [groupBy]';
	var ERR_BID = 'a non-object type was not allowed';
	var ERR_IPR = 'a variable name was not allowed';

	var win;
	try {
		win = eval('window');
	} catch (err) {
		win = {};
	}

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given value is a function, otherwise <i>false</i>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * Function.isFunction(function () {});
	 * 
	 * // ES6's arrow function
	 * Function.isFunction(() => {});
	 * 
	 * Function.isFunction(undefined);
	 * 
	 * Function.isFunction(null);
	 * 
	 * Function.isFunction({});
	 * 
	 * Function.isFunction([]);
	 * </code>
	 */
	Function.isFunction = function (ar0) {
		return typeof ar0 === 'function' || Object.prototype.toString.call(ar0) === '[object Function]';
	};

	/**
	 * <p><b>Returns</b> a new function; once it is called, it will be executed if the last call was at least the given duration ago.</p>
	 * <p>The returned function has a special method called <i>cancel</i> that helps cancelling the defered execution.</p>
	 * <p><b>Accepts</b><br>
	 * <u>() – This returns a <i>setTimeout</i> function.</u><br>
	 * <u>(duration: <i>number</i>) – This accepts the duration in milliseconds.</u><br>
	 * </p>
	 * <code><!--
	 * clock = 0;
	 * setInterval(function () {
	 * 	clock += 100;
	 * }, 100);
	 * 
	 * f = function (a) {
	 * 	console.log('Called with ' + a + ' at ' + clock + ' ms');
	 * }.debounce(300);
	 * 
	 * f(0);
	 * 
	 * f(1);
	 * 
	 * // Called with 1 at 300 ms
	 * 
	 * setTimeout(function () {
	 * 	f(2);
	 * }, 400);
	 * 
	 * setTimeout(function () {
	 * 	f(3);
	 * }, 500);
	 * 
	 * // Called with 3 at 800 ms
	 * 
	 * setTimeout(function () {
	 * 	f(4);
	 * 	f.cancel();
	 * }, 900);
	 * --></code>
	 * <p><b>See also</b> <a>Function.prototype.immediate()</a></p>
	 * <meta keywords="immediate"/>
	 */
	Function.prototype.debounce = function (dur) {
		var tid, ctx, arg, fnc = this;
		if (arguments.length === 0 || Number.isSafeInteger(dur) && dur >= 0) {
			var hdr = function () {
				tid = undefined;
				fnc.apply(ctx, arg);
			};
			var out = function () {
				ctx = this;
				arg = Array.from(arguments);
				if (tid !== undefined) {
					clearTimeout(tid);
				}
				if (dur > 0) {
					tid = setTimeout(hdr, dur);

				} else {
					tid = setTimeout(hdr);
				}
			};
			out.cancel = function () {
				clearTimeout(tid);
				tid = undefined;
			};
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	Function.prototype.barrier = function (dur) {
		var tib, tid, ctx, arg, fnc = this;
		if (arguments.length === 0 || Number.isSafeInteger(dur) && dur >= 0) {
			var cls = function () {
				tib = undefined;
			};
			var hdr = function () {
				tid = undefined;
				fnc.apply(ctx, arg);
				if (dur > 0) {
					tib = setTimeout(cls, dur);

				} else {
					tib = setTimeout(cls);
				}
			};
			var out = function () {
				ctx = this;
				arg = Array.from(arguments);
				if (tib !== undefined) {
					// Back barrier
					clearTimeout(tib);
					if (dur > 0) {
						tib = setTimeout(cls, dur);

					} else {
						tib = setTimeout(cls);
					}

				} else {
					// Front barrier
					if (tid !== undefined) {
						clearTimeout(tid);
					}
					if (dur > 0) {
						tid = setTimeout(hdr, dur);

					} else {
						tid = setTimeout(hdr);
					}
				}
			};
			out.cancel = function () {
				clearTimeout(tid);
				tid = undefined;
				clearTimeout(tib);
				tib = undefined;
			};
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> a new function; once it is called, it will be executed immediately, and prevents the same function from being executed after the last call for the given duration.</p>
	 * <p>The returned function has a special method called <i>cancel</i> that helps cancelling the barrier execution.</p>
	 * <p><b>Accepts</b><br>
	 * <u>() – This returns the function normally.</u><br>
	 * <u>(duration: <i>number</i>) – This accepts the duration in milliseconds.</u><br>
	 * </p>
	 * <code><!--
	 * clock = 0;
	 * setInterval(function () {
	 * 	clock += 100;
	 * }, 100);
	 * 
	 * f = function (a) {
	 * 	console.log('Called with ' + a + ' at ' + clock + ' ms');
	 * }.immediate(300);
	 * 
	 * f(0);
	 * 
	 * // Called with 0 at 0 ms
	 * 
	 * f(1);
	 * 
	 * setTimeout(function () {
	 * 	f(2);
	 * }, 400);
	 * 
	 * // Called with 2 at 400 ms
	 * 
	 * setTimeout(function () {
	 * 	f(3);
	 * }, 500);
	 * 
	 * setTimeout(function () {
	 * 	f.cancel();
	 * 	f(4);
	 * }, 900);
	 * 
	 * // Called with 4 at 900 ms
	 * --></code>
	 * <p><b>See also</b> <a>Function.prototype.debounce()</a></p>
	 * <meta keywords="debounce"/>
	 */
	Function.prototype.immediate = function (dur) {
		if (arguments.length === 0 || dur === 0) {
			return this;

		} else if (Number.isSafeInteger(dur) && dur > 0) {
			var tid, fnc = this;
			var hdr = function () {
				tid = undefined;
			};
			var out = function () {
				if (tid === undefined) {
					fnc.apply(this, arguments);

				} else {
					clearTimeout(tid);
				}
				tid = setTimeout(hdr, dur);
			};
			out.cancel = function () {
				clearTimeout(tid);
				tid = undefined;
			};
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> a new function that remembers its recent arguments and the returned value; once the same set of arguments is supplied, the cached value is returned without running the actual function.</p>
	 * <p>The returned function has a special method called <i>forget</i> that helps clearing the cached arguments and values.</p>
	 * <p><b>Accepts</b><br>
	 * <u>() – This remembers up to 8 recent arguments.</u><br>
	 * <u>(recentCount: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = { b: 1 };
	 * var f = function (x) { return x.b + 1; }.cache();
	 * 
	 * f(a);
	 * 
	 * // Changes the inner value, but still the same object reference
	 * a.b = 3;
	 * 
	 * // Expects to get the same result because of the same object reference
	 * f(a);
	 * 
	 * // Forgets all the cached arguments
	 * f.forget();
	 * 
	 * // Expects to get the new result because of cache missing
	 * f(a);
	 * </code>
	 */
	Function.prototype.cache = function (ar0) {
		var bnd = arguments.length > 0 ? ar0 : 8;
		var fnc = this;
		var key = [];
		var val = [];
		if (Number.isSafeInteger(bnd) && bnd > 0) {
			var out = function () {
				var arg = Array.from(arguments);
				if (key.length > 0 && Object.isEqual(key[0], arg)) {
					return val[0];

				} else if (key.length > 1 && Object.isEqual(key[1], arg)) {
					return val[1];

				} else {
					var idx = key.indexOf(function (itm) {
						return Object.isEqual(itm, arg);
					});
					if (idx === -1) {
						key.unshift(arg);
						val.unshift(fnc.apply(this, arguments));
						if (key.length > bnd) {
							key.pop();
							val.pop();
						}

					} else {
						key.unshift(arg);
						val.unshift(val[idx]);
						key.splice(idx + 1, 1);
						val.splice(idx + 1, 1);
					}
				}
				return val[0];
			};
			out.forget = function () {
				key = [];
				val = [];
			};
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> an array from the given array-like or object.</p>
	 * <p>If the source is an object, functions and private properties will be excluded, unless the last parameter is <i>true</i>. A private property is a member of an object that its name starts with an underscore sign</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This creates an empty array.<br>
	 * <u>(source: <i>array</i>)</u> – The parameter can be an object that has "length" property.<br>
	 * <u>(source: <i>string</i>)</u><br>
	 * <u>(source: <i>string</i>, separator: <i>string</i>)</u><br>
	 * <u>(source: <i>string</i>, separator: <i>RegExp</i>)</u><br>
	 * <u>(source: <i>object</i>, [includeEverything: <i>boolean</i>])</u><br>
	 * <u>(source: <i>object</i>, nameProperty: <i>string</i>, [includeEverything: <i>boolean</i>])</u><br>
	 * <u>(source: <i>object</i>, nameProperty: <i>string</i>, valueProperty: <i>string</i>, [includeEverything: <i>boolean</i>])</u><br>
	 * </p>
	 * <code>
	 * Array.create();
	 * 
	 * var a = [1, 2, 3];
	 * var z = Array.create(a);
	 * console.log(z);
	 * 
	 * console.log(a === z);
	 * 
	 * Array.create('Alex,Brad,Chad');
	 * 
	 * Array.create('Alex,Brad,Chad', ',');
	 * 
	 * Array.create({
	 * 	"0": 'Alex',
	 * 	"1": 'Brad',
	 * 	"2": 'Chad',
	 * 	length: 3
	 * });
	 * 
	 * var b = {
	 * 	Alex: 'Singer',
	 * 	Brad: 'Dancer',
	 * 	Chad: 'Singer',
	 * 	_private: true,
	 * 	someWork: function () {}
	 * };
	 * Array.create(b);
	 * 
	 * Array.create(b, 'name', 'work');
	 * 
	 * Array.create(b, 'name', 'work', true);
	 * 
	 * Array.create(3, null);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from">Array.from()</a></p>
	 * <meta keywords="from"/>
	 */
	Array.create = function (ar0, ar1, ar2) {
		var idx = -1;
		var nam;
		var tmp;
		var out;
		if (typeof ar0 === 'object' && ar0 !== null) {
			if (ar0 instanceof Array) {
				out = ar0;
				out._m = true;

			} else if (ar0 instanceof Map) {
				out = new Array(ar0.size);
				ar0.forEach(function (val, key) {
					out[++idx] = [key, val];
				});
				out._m = false;

			} else if (typeof ar0.length === 'number') {
				var bnd = ar0.length;
				if (Number.isSafeInteger(bnd) && bnd >= 0) {
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

		} else if (Number.isSafeInteger(ar0) && ar0 >= 0) {
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

	/**
	 * <p><b>Returns</b> the current array and stores the given object as a context for further use in functions.</p>
	 * <p>Passing an <i>undefined</i> or <i>null</i> will delete the existing context.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(context: <i>object</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = { z: 0 };
	 * [1, 2, 3].bind(a).invoke(function (x) { this.z += x; });
	 * 
	 * console.log(a.z);
	 * </code>
	 * <meta keywords="context"/>
	 */
	Array.prototype.bind = function (ctx) {
		if (arguments.length === 0) {
			throw new TypeError(ERR_BID);

		} else if (ctx === undefined || ctx === null) {
			delete this._s;

		} else if (typeof ctx === 'object') {
			this._s = ctx;
		}
		return this;
	};

	var _clone = function (obj) {
		if (typeof obj === 'object' && obj !== null) {
			var out;
			var idx;
			if (obj instanceof Array) {
				var bnd = obj.length;
				out = new Array(bnd);
				idx = -1;
				while (++idx < bnd) {
					out[idx] = _clone(obj[idx]);
				}
				return out;

			} else {
				out = {};
				for (idx in obj) {
					out[idx] = _clone(obj[idx]);
				}
				return out;
			}

		} else {
			return obj;
		}
	};

	/**
	 * <p><b>Returns</b> a new array with members that has identical members to the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This does a shallow copy on all members.<br>
	 * <u>(deep: <i>boolean</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [{ q: { r: true } }];
	 * var z = a.clone();
	 * console.log(a === z);
	 * 
	 * console.log(a[0] === z[0]);
	 * 
	 * console.log(a[0].q === z[0].q);
	 * 
	 * z = a.clone(true);
	 * console.log(a === z);
	 * 
	 * console.log(a[0] === z[0]);
	 * 
	 * console.log(a[0].q === z[0].q);
	 * </code>
	 * <meta keywords="copy,slice,duplicate"/>
	 */
	Array.prototype.clone = function (ar0) {
		var out;
		if (ar0) {
			out = _clone(this);

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

	/**
	 * <p><b>Returns</b> an object with properties that are derived from all members.</p>
	 * <p>The members must implement <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString">toString()</a> method.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, valueProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, valueProjector: <i>function&lt;anything&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, value: <i>anything</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, valueProjector: <i>function&lt;anything&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, valueProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, value: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * ['a', 'b', 'c'].toObject();
	 *
	 * ['a', 'b', 'c'].toObject(function (x) {
	 * 	return x.toUpperCase();
	 * });
	 * </code>
	 * <meta keywords="hash,dictionary,map"/>
	 */
	Array.prototype.toObject = function (ar0, ar1) {
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
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = this[idx];
					}
				}

			} else if (typeof ar1 === 'string') {
				while (++idx < bnd) {
					nam = this[idx][ar0];
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = this[idx][ar1];
					}
				}

			} else if (Function.isFunction(ar1)) {
				while (++idx < bnd) {
					nam = this[idx][ar0];
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = ar1.call(ctx, this[idx], idx, this);
					}
				}

			} else {
				while (++idx < bnd) {
					nam = this[idx][ar0];
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = ar1;
					}
				}
			}

		} else if (Function.isFunction(ar0)) {
			if (arguments.length === 1) {
				while (++idx < bnd) {
					nam = ar0.call(ctx, this[idx], idx, this);
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = this[idx];
					}
				}

			} else if (typeof ar1 === 'string') {
				while (++idx < bnd) {
					nam = ar0.call(ctx, this[idx], idx, this);
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = this[idx][ar1];
					}
				}

			} else if (Function.isFunction(ar1)) {
				while (++idx < bnd) {
					nam = ar0.call(ctx, this[idx], idx, this);
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = ar1.call(ctx, this[idx], idx, this);
					}
				}

			} else {
				while (++idx < bnd) {
					nam = ar0.call(ctx, this[idx], idx, this);
					if (nam === null) {
						nam = 'null';
					}
					if (nam !== undefined) {
						out[nam.toString()] = ar1;
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return out;
	};

	/**
	 * <p><b>Returns</b> an ES6 Map object with key-value pairs that are derived from all members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, valueProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, valueProjector: <i>function&lt;anything&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, value: <i>anything</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, valueProjector: <i>function&lt;anything&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, valueProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, value: <i>anything</i>)</u><br>
	 * </p>
	 * <code><!--
	 * ['a', 'b', 'c'].toMap();
	 * // Map { 0 => "a", 1 => "b", 2 => "c" }
	 *
	 * ['a', 'b', 'c'].toMap(function (x) {
	 * 	return x.toUpperCase();
	 * });
	 * // Map { "A" => "a", "B" => "b", "C" => "c"}
	 * --></code>
	 * <meta keywords="hash,dictionary,map"/>
	 */
	Array.prototype.toMap = function (ar0, ar1) {
		var idx = -1;
		var bnd = this.length;
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

			} else if (Function.isFunction(ar1)) {
				while (++idx < bnd) {
					out.set(this[idx][ar0], ar1.call(ctx, this[idx], idx, this));
				}

			} else {
				while (++idx < bnd) {
					out.set(this[idx][ar0], ar1);
				}
			}

		} else if (Function.isFunction(ar0)) {
			if (arguments.length === 1) {
				while (++idx < bnd) {
					out.set(ar0.call(ctx, this[idx], idx, this), this[idx]);
				}

			} else if (typeof ar1 === 'string') {
				while (++idx < bnd) {
					out.set(ar0.call(ctx, this[idx], idx, this), this[idx][ar1]);
				}

			} else if (Function.isFunction(ar1)) {
				while (++idx < bnd) {
					out.set(ar0.call(ctx, this[idx], idx, this), ar1.call(ctx, this[idx], idx, this));
				}

			} else {
				while (++idx < bnd) {
					out.set(ar0.call(ctx, this[idx], idx, this), ar1);
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return out;
	};

	var _toString = Array.prototype.toString;

	/**
	 * <p><b>Returns</b> a string that is the result of concatenating all members.</p>
	 * <p>This extends the native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString">toString</a> method.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This uses a comma as a separator.<br>
	 * <u>(separator: <i>string</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3].toString();
	 *
	 * [1, 2, 3].toString('-');
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join">Array.prototype.join()</a></p>
	 * <meta keywords="text,join,concat"/>
	 */
	Array.prototype.toString = function (ar0) {
		if (arguments.length === 0) {
			return _toString.call(this);

		} else if (arguments.length === 1 && typeof ar0 === 'string') {
			return this.join(ar0);

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> a new array with only members that meet the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>object</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, expectedValue: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.where(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.where({ work: 'Singer' });
	 * 
	 * a.where('work', 'Singer');
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter">Array.prototype.filter()</a>, <a>Array.prototype.norm()</a></p>
	 * <meta keywords="filter"/>
	 */
	Array.prototype.where = function (ar0, ar1) {
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var chk;
		var tmp;
		var nam;
		var out = [];
		if (Function.isFunction(ar0) && arguments.length === 1) {
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

	/**
	 * <p><b>Returns</b> a new array with members that is the results of running the given argument.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(valueProjector: <i>function&lt;anything&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>number</i>)</u><br>
	 * <u>(nameProjector: <i>array&lt;string&gt;</i>)</u> – This creates an object containing the given property name(s).<br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.select(function (x) { return x.name; });
	 * 
	 * a.select('name');
	 * 
	 * a.select(['name']);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">Array.prototype.map()</a></p>
	 * <meta keywords="map"/>
	 */
	Array.prototype.select = function (ar0) {
		var idx = -1;
		var jdx;
		var bnd = this.length;
		var lim;
		var tmp;
		var out;
		if (arguments.length !== 1) {
			throw new Error(ERR_INV);
		}
		if (Function.isFunction(ar0)) {
			out = new Array(bnd);
			while (++idx < bnd) {
				out[idx] = ar0.call(this._s, this[idx], idx, this);;
			}

		} else if (typeof ar0 === 'string' || Number.isSafeInteger(ar0) && (ar0 = ar0.toString())) {
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

	/**
	 * <p><b>Returns</b> the current array after iterates on all members. Whenever the given iterator returns <i>false</i>, the invocation will be stopped immediately.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(iterator: <i>function</i>)</u><br>
	 * <u>(startIndex: <i>number</i>, iterator: <i>function</i>)</u><br>
	 * <u>(startIndex: <i>number</i>, stopIndex: <i>number</i>, iterator: <i>function</i>)</u><br>
	 * <u>(startIndex: <i>number</i>, stopIndex: <i>number</i>, stepCount: <i>number</i>, iterator: <i>function</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.invoke(function (x) { console.log(x); });
	 * 
	 * a.invoke(1, function (x) { console.log(x); });
	 * 
	 * a.invoke(1, 3, 2, function (x) { console.log(x); });
	 * 
	 * a.invoke(function (x, i) {
	 * 	console.log(x);
	 * 	if (i === 1) {
	 * 		return false;
	 * 	}
	 * });
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach">Array.prototype.forEach()</a></p>
	 */
	Array.prototype.invoke = function (ar0, ar1, ar2) {
		var fni = Array.from(arguments).indexOf(Function.isFunction);
		var idx = fni >= 1 ? ar0 : 0;
		var bnd = fni >= 2 ? ar1 : this.length;
		var stp = fni >= 3 ? ar2 : (idx < bnd ? 1 : -1);
		var fnc = arguments[fni];
		var brk;
		var ctx = this._s;
		if (Function.isFunction(fnc) && Number.isSafeInteger(idx) && idx >= 0 && Number.isSafeInteger(bnd) && Number.isSafeInteger(stp) && stp !== 0) {
			if (bnd >= 0 && bnd <= this.length) {
				if (idx === 0 && bnd >= 1024 && stp === 1) {
					while (idx < bnd % 8 && brk !== false) {
						brk = fnc.call(ctx, this[idx], idx++, this);
					}
					while (idx < bnd && brk !== false) {
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
						if (brk !== false) brk = fnc.call(ctx, this[idx], idx++, this);
					}

				} else if (stp > 0) {
					while (idx < bnd && brk !== false) {
						brk = fnc.call(ctx, this[idx], idx, this);
						idx += stp;
					}

				} else {
					idx--;
					while (idx >= bnd && brk !== false) {
						brk = fnc.call(ctx, this[idx], idx, this);
						idx += stp;
					}
				}

			} else {
				throw new RangeError(ERR_OOR);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	/**
	 * <p><b>Returns</b> a new <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a> then iterates on all members asynchronously.</p>
	 * <p>Whenever the given iterator returns <i>false</i>, the invocation will be stopped immediately. Each iteration has a delay of 2 milliseconds. The default batch count is 1.</p>
	 * <p>This is very useful when doing some time-consuming work without freezing the user interface.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(iterator: <i>function</i>, [batchCount: <i>number</i>])</u><br>
	 * <u>(startIndex: <i>number</i>, iterator: <i>function</i>, [batchCount: <i>number</i>])</u><br>
	 * <u>(startIndex: <i>number</i>, stopIndex: <i>number</i>, iterator: <i>function</i>, [batchCount: <i>number</i>])</u><br>
	 * <u>(startIndex: <i>number</i>, stopIndex: <i>number</i>, stepCount: <i>number</i>, iterator: <i>function</i>, [batchCount: <i>number</i>])</u><br>
	 * </p>
	 * <code><!--
	 * [1, 2, 3].invokeAsync(function (x) { console.log(x); });
	 * console.log('4');
	 * setTimeout(function () {
	 * 	console.log('5');
	 * });
	 * // 4
	 * // 1
	 * // 5
	 * // 2
	 * // 3
	 * 
	 * [1, 2, 3].invokeAsync(function (x) { console.log(x); }, 2);
	 * console.log('4');
	 * setTimeout(function () {
	 * 	console.log('5');
	 * });
	 * // 4
	 * // 1
	 * // 2
	 * // 5
	 * // 3
	 * --></code>
	 */
	Array.prototype.invokeAsync = function (ar0, ar1, ar2) {
		var fni = Array.from(arguments).indexOf(Function.isFunction);
		var idx = fni >= 1 ? ar0 : 0;
		var bnd = fni >= 2 ? ar1 : this.length;
		var stp = fni >= 3 ? ar2 : (idx < bnd ? 1 : -1);
		var fnc = arguments[fni];
		var btc = arguments[fni + 1] !== undefined ? arguments[fni + 1] : 1;
		var hdr;
		var arr = this;
		var ctx = this._s;
		var pwn;
		if (Function.isFunction(fnc) && Number.isSafeInteger(idx) && idx >= 0 && Number.isSafeInteger(bnd) && Number.isSafeInteger(stp) && stp !== 0 && Number.isSafeInteger(btc) && btc > 0) {
			if (bnd >= 0 && bnd <= this.length) {
				if (stp > 0) {
					pwn = new Promise(function (res, rej) {
						hdr = function () {
							var lim = btc;
							var brk;
							while (idx < bnd && lim-- > 0 && brk !== false) {
								brk = fnc.call(ctx, arr[idx], idx, arr);
								idx += stp;
							}
							if (brk === false) {
								rej();

							} else if (idx < bnd) {
								setTimeout(hdr, 2);

							} else {
								res(arr);
							}
						};
					});

				} else {
					idx--;
					pwn = new Promise(function (res, rej) {
						hdr = function () {
							var lim = btc;
							var brk;
							while (idx >= bnd && lim-- > 0 && brk !== false) {
								brk = fnc.call(ctx, arr[idx], idx, arr);
								idx += stp;
							}
							if (brk === false) {
								rej();

							} else if (idx >= bnd) {
								setTimeout(hdr, 2);

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

	/**
	 * <p><b>Returns</b> the current array after iterates on the members that meet the given group.</p>
	 * <p>This must be called after <a>Array.prototype.groupBy()</a> method. Whenever the given iterator returns <i>false</i>, the invocation will be stopped immediately.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(groupName: <i>anything</i>, iterator: <i>function</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * var g = a.groupBy('work');
	 * console.log(g);
	 * 
	 * g.invokeWhich('Singer', function (x) { console.log(x); });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.groupBy()</a></p>
	 */
	Array.prototype.invokeWhich = function (ar0, ar1) {
		if (this._g === undefined) {
			throw new Error(ERR_IWG);

		} else if (Function.isFunction(ar1) && arguments.length === 2) {
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

	/**
	 * <p><b>Returns</b> a new array with only members that are in the given range.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u> – This stops when the given condition is <i>false</i>.<br>
	 * <u>(memberCount: <i>number</i>)</u><br>
	 * <u>(startIndex: <i>number</i>, stopIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.take(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.take(1);
	 * 
	 * a.take(1, 2);
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.where()</a></p>
	 * <meta keywords="head,skip,where,filter"/>
	 */
	Array.prototype.take = function (ar0, ar1) {
		var idx = -1;
		var bnd = this.length;
		var out;
		if (Function.isFunction(ar0)) {
			while (++idx < bnd) {
				if (ar0.call(this._s, this[idx], idx, this) === false) {
					break;
				}
			}
			out = this.slice(0, idx);

		} else if (!isFinite(ar0) || ar0 >= Number.MAX_SAFE_INTEGER) {
			out = this.toImmutable();

		} else if (Number.isSafeInteger(ar0)) {
			if (ar0 < 0 || ar0 > bnd) {
				throw new RangeError(ERR_OOR);
			}
			if (Number.isSafeInteger(ar1)) {
				if (ar1 < 0 || ar1 > bnd) {
					throw new RangeError(ERR_OOR);

				} else if (ar0 > ar1) {
					throw new RangeError(ERR_SGS);
				}
				out = this.slice(ar0, ar1);

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

	/**
	 * <p><b>Returns</b> a new array with only members that are not in the given range.</p>
	 * <p>This is a reverse implementation of <a>Array.prototype.take()</a> method.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u> – This stops when the given condition is <i>false</i>.<br>
	 * <u>(memberCount: <i>number</i>)</u><br>
	 * <u>(startIndex: <i>number</i>, stopIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.skip(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.skip(1);
	 * 
	 * a.skip(1, 2);
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.where()</a></p>
	 * <meta keywords="take,where,filter"/>
	 */
	Array.prototype.skip = function (ar0, ar1) {
		var idx = -1;
		var bnd = this.length;
		var tmp;
		var out;
		if (Function.isFunction(ar0)) {
			tmp = bnd;
			while (++idx < bnd) {
				if (ar0.call(this._s, this[idx], idx, this) === false) {
					tmp = idx;
					break;
				}
			}
			return this.take.call(this, tmp, bnd);

		} else if (!isFinite(ar0) || ar0 >= Number.MAX_SAFE_INTEGER) {
			out = [];

		} else if (Number.isSafeInteger(ar0)) {
			if (ar0 < 0 || ar0 > bnd) {
				throw new RangeError(ERR_OOR);
			}
			if (Number.isSafeInteger(ar1)) {
				if (ar1 < 0 || ar1 > bnd) {
					throw new RangeError(ERR_OOR);

				} else if (ar0 > ar1) {
					throw new RangeError(ERR_SGS);
				}
				out = this.toImmutable();
				out.splice(ar0, ar1 - ar0);

			} else {
				out = this.slice(ar0);
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	/**
	 * <p><b>Returns</b> a new array without first and last members that match the value or the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.trim(function (x) { return x.work === 'Singer'; });
	 * 
	 * [0, 1, 0, 2, 0, 3, 0, 0].trim(0);
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.where()</a></p>
	 * <meta keywords="where,filter"/>
	 */
	Array.prototype.trim = function (ar0) {
		var idx = -1;
		var bnd = this.length;
		var out = this.toImmutable();
		if (Function.isFunction(ar0)) {
			while (--bnd >= 0) {
				if (!ar0.call(this._s, this[bnd], bnd, this)) {
					out.splice(bnd + 1, this.length - bnd);
					break;
				}
			}
			while (++idx < bnd) {
				if (!ar0.call(this._s, this[idx], idx, this)) {
					out.splice(0, idx);
					break;
				}
			}

		} else {
			while (--bnd >= 0) {
				if (Object.isEqual(this[bnd], ar0) === false) {
					out.splice(bnd + 1, this.length - bnd);
					break;
				}
			}
			while (++idx < bnd) {
				if (Object.isEqual(this[idx], ar0) === false) {
					out.splice(0, idx);
					break;
				}
			}
		}
		return out;
	};

	/**
	 * <p><b>Returns</b> a new array with all members that have nested array members flatten.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This does a shallow flattening on all members.<br>
	 * <u>(deep: <i>boolean</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [1, [2, [3]]];
	 * a.flatten();
	 * 
	 * a.flatten(true);
	 * </code>
	 */
	Array.prototype.flatten = function (ar0) {
		var idx = -1;
		var jdx;
		var kdx = -1;
		var bnd = this.length;
		var len;
		var tmp;
		var out = [];
		while (++idx < bnd) {
			tmp = this[idx];
			if (Array.isArray(tmp)) {
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

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if one or more members match the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This returns <i>true</i> if the current array is not empty.<br>
	 * <u>(value: <i>anything</i>)</u> – This is similar to <a>Array.prototype.has()</a>.<br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, value: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.any();
	 * 
	 * a.any(a[0]);
	 * 
	 * a.any(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.any(function (x) { return x.work === 'Doctor'; });
	 * 
	 * a.any('work', 'Singer');
	 * 
	 * a.any('work', 'Doctor');
	 * 
	 * [].any();
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.all()</a>, <a>Array.prototype.where()</a></p>
	 * <meta keywords="some"/>
	 */
	Array.prototype.any = function (ar0, ar1) {
		var idx = -1;
		var bnd = this.length;
		if (bnd === 0) {
			return false;

		} else if (arguments.length === 0) {
			return true;

		} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if all members match the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, value: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer', year: 22 },
	 * 	{ name: 'Brad', work: 'Dancer', year: 18 },
	 * 	{ name: 'Chad', work: 'Singer', year: 26 }
	 * ];
	 * 
	 * a.all(a[0]);
	 * 
	 * a.all(function (x) { return x.year <= 30; });
	 * 
	 * a.all(function (x) { return x.year >= 20; });
	 * 
	 * a.all('work', 'Singer');
	 * 
	 * a.all('work', 'Doctor');
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.any()</a>, <a>Array.prototype.where()</a></p>
	 * <meta keywords="every"/>
	 */
	Array.prototype.all = function (ar0, ar1) {
		var idx = -1;
		var bnd = this.length;
		if (bnd === 0) {
			return true;

		} else if (arguments.length === 0) {
			throw new Error(ERR_INV);

		} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if all members match the value or the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * <u>(value: <i>anything</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.has(function (x) { return x.name === 'Alex'; });
	 * 
	 * a.has(function (x) { return x.name === 'Zedd'; });
	 * 
	 * a.has(a[1]);
	 * 
	 * a.has(a[1], 0);
	 * 
	 * a.has(a[1], 2);
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.indexOf()</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes">Array.prototype.includes()</a></p>
	 * <meta keywords="contains,includes,indexof"/>
	 */
	Array.prototype.has = function () {
		return this.indexOf.apply(this, arguments) >= 0;
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if all members match the given array.</p>
	 * <p>The difference between this method and <a>Object.isEqual()</a> is, this method does a shallow comparison for reference object only.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(another: <i>array</i>)</u><br>
	 * <u>(another: <i>array</i>, comparer: <i>function&lt;boolean&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3].isEqual([1, 2, 3]);
	 * 
	 * [1, 2, 3].isEqual([1, 3, 2]);
	 * 
	 * [1, 2, {}].isEqual([1, 2, {}]);
	 * 
	 * [1, 2, {}].isEqual([1, 2, {}], function (x, y) { return Object.isEqual(x, y); });
	 * </code>
	 * <p><b>See also</b> <a>Object.isEqual()</a></p>
	 */
	Array.prototype.isEqual = function (ar0, ar1) {
		ar0 = Array.create(ar0);
		var idx = -1;
		var bnd = this.length;
		if (bnd !== ar0.length) {
			return false;

		} else if (arguments.length === 1) {
			while (++idx < bnd) {
				if (Array.isArray(this[idx]) && Array.isArray(ar0[idx]) && this[idx].isEqual(ar0[idx])) {
					continue;

				} else if (this[idx] !== ar0[idx]) {
					return false;
				}
			}
			return true;

		} else if (Function.isFunction(ar1) && arguments.length === 2) {
			while (++idx < bnd) {
				if (!ar1.call(this._s, this[idx], ar0[idx])) {
					return false;
				}
			}
			return true;

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if all members match the given array.</p>
	 * <p>The difference between this method and <a>Array.prototype.isEqual()</a> is, this method does not check the order of members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(another: <i>array</i>)</u><br>
	 * <u>(another: <i>array</i>, comparer: <i>function&lt;boolean&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3].isAlike([1, 2, 3]);
	 * 
	 * [1, 2, 3].isAlike([1, 3, 2]);
	 * 
	 * [1, 2, {}].isAlike([1, {}, 2]);
	 * 
	 * [1, 2, {}].isAlike([1, {}, 2], function (x, y) { return Object.isEqual(x, y); });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.isEqual()</a></p>
	 * <meta keywords="equal"/>
	 */
	Array.prototype.isAlike = function (ar0, ar1) {
		ar0 = Array.create(ar0).toImmutable();
		var idx = -1;
		var jdx;
		var bnd = this.length;
		var cnd;
		var tmp;
		if (bnd !== ar0.length || ((bnd === 0) !== (ar0.length === 0))) {
			return false;

		} else if (arguments.length === 1) {
			while (++idx < bnd) {
				tmp = ar0.indexOf(this[idx]);
				if (tmp < 0) {
					return false;

				} else {
					ar0.removeAt(tmp);
				}
			}
			return ar0.length === 0;

		} else if (Function.isFunction(ar1) && arguments.length === 2) {
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

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the current array is a proper subset of the given array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(another: <i>array</i>)</u><br>
	 * <u>(another: <i>array</i>, comparer: <i>function&lt;boolean&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3].isSubset([1, 2, 3]);
	 * 
	 * [1, 2, 3].isSubset([1, 3, 2]);
	 * 
	 * [1, 2, 3].isSubset([1, 2]);
	 * 
	 * [1, 2].isSubset([1, 2, 3]);
	 * 
	 * [1, 2, {}].isSubset([1, {}, 2]);
	 * 
	 * [1, 2, {}].isSubset([1, {}, 2], function (x, y) { return Object.isEqual(x, y); });
	 * </code>
	 */
	Array.prototype.isSubset = function (ar0, ar1) {
		ar0 = Array.create(ar0);
		var arr = this;
		var idx = -1;
		var bnd = this.length;
		var ctx = ar0._s;
		ar0._s = this._s;
		if (arguments.length === 1) {
			while (++idx < bnd) {
				if (ar0.indexOf(this[idx]) === -1) {
					return false;
				}
			}

		} else if (Function.isFunction(ar1) && arguments.length === 2) {
			var fnc = function (itm) { return ar1.call(this, arr[idx], itm); };
			while (++idx < bnd) {
				if (ar0.indexOf(fnc) === -1) {
					return false;
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (ctx === undefined) {
			delete ar0._s;

		} else {
			ar0._s = ctx;
		}
		return true;
	};

	var _indexOf = Array.prototype.indexOf;

	/**
	 * <p><b>Returns</b> a number of index that match the given condition, otherwise -1.</p>
	 * <p>This extends the native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf">Array.prototype.indexOf()</a> method.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * <u>(expectedValue: <i>anything</i>)</u><br>
	 * <u>(expectedValue: <i>anything</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].indexOf(2);
	 * 
	 * [1, 2, 3, 2].indexOf(2, 2);
	 * 
	 * [1, 2, 3, 2].indexOf(function (x) { return x === 2; });
	 * 
	 * [1, 2, 3, 2].indexOf(function (x) { return x === 2; }, 2);
	 * </code>
	 */
	Array.prototype.indexOf = function (ar0, ar1) {
		var idx = -1;
		var bnd = this.length;
		if (arguments.length >= 1) {
			if (Function.isFunction(ar0)) {
				if (Number.isSafeInteger(ar1)) {
					if (ar1 >= 0) {
						idx = ar1 - 1;

					} else {
						idx = bnd + ar1 - 1;
					}
				}
				if (idx < 0) {
					idx = -1;
				}
				while (++idx < bnd) {
					if (ar0.call(this._s, this[idx], idx, this)) {
						return idx;
					}
				}
				return -1;

			} else {
				return _indexOf.apply(this, arguments);
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	var _lastIndexOf = Array.prototype.lastIndexOf;

	/**
	 * <p><b>Returns</b> a number of index that match the given condition, otherwise -1.</p>
	 * <p>This extends the native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf">Array.prototype.lastIndexOf()</a> method.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * <u>(expectedValue: <i>anything</i>)</u><br>
	 * <u>(expectedValue: <i>anything</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].lastIndexOf(2);
	 * 
	 * [1, 2, 3, 2].lastIndexOf(2, 2);
	 * 
	 * [1, 2, 3, 2].lastIndexOf(function (x) { return x === 2; });
	 * 
	 * [1, 2, 3, 2].lastIndexOf(function (x) { return x === 2; }, 2);
	 * </code>
	 */
	Array.prototype.lastIndexOf = function (ar0, ar1) {
		var idx = this.length;
		if (arguments.length >= 1) {
			if (Function.isFunction(ar0)) {
				if (Number.isSafeInteger(ar1)) {
					if (ar1 >= 0) {
						idx = ar1;

					} else {
						idx = this.length + ar1 + 1;
					}
				}
				if (idx < 0) {
					idx = this.length;
				}
				while (--idx >= 0) {
					if (ar0.call(this._s, this[idx], idx, this)) {
						return idx;
					}
				}
				return -1;

			} else {
				return _lastIndexOf.apply(this, arguments);
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	var _find = Array.prototype.find;

	/**
	 * <p><b>Returns</b> the first member that meets the given condition, otherwise <i>undefined</i>.</p>
	 * <p>This extends the native find method.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, expectedValue: <i>anything</i>)</u>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.find(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.find('work', 'Dancer');
	 * 
	 * a.find('work', 'Doctor');
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.first()</a>, <a>Array.prototype.firstOrNull()</a></p>
	 * <meta keywords="first,search"/>
	 */
	Array.prototype.find = function (ar0, ar1) {
		var idx;
		if (Function.isFunction(ar0)) {
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

	var _createFirstOrLast = function (ins, dfi, emp, nof) {
		return function () {
			if (this.length === 0) {
				return emp.call(this);

			} else if (arguments.length === 0) {
				return dfi.call(this);

			} else {
				var idx = this[ins].apply(this, arguments);
				if (idx >= 0) {
					return this[idx];

				} else {
					return nof.call(this);
				}
			}
		};
	};

	/**
	 * <p><b>Returns</b> the first member that meets the given condition, otherwise throws an exception.<p>
	 * </p>This throws the exception if the current array is empty.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This returns the first member.<br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.first();
	 * 
	 * a.first(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.first(function (x) { return x.work === 'Doctor'; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.find()</a>, <a>Array.prototype.firstOrNull()</a></p>
	 * <meta keywords="find"/>
	 */
	Array.prototype.first = _createFirstOrLast(
		'indexOf',
		function () { return this[0]; },
		function () { throw new Error(ERR_AEA); },
		function () { throw new Error(ERR_MZM); }
	);

	/**
	 * <p><b>Returns</b> the first member that meets the given condition, otherwise null.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This returns the first member.<br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.firstOrNull();
	 * 
	 * a.firstOrNull(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.firstOrNull(function (x) { return x.work === 'Doctor'; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.find()</a>, <a>Array.prototype.first()</a></p>
	 * <meta keywords="find"/>
	 */
	Array.prototype.firstOrNull = _createFirstOrLast(
		'indexOf',
		function () { return this[0]; },
		function () { return null; },
		function () { return null; }
	);

	/**
	 * <p><b>Returns</b> the last member that meets the given condition, otherwise throws an exception.</p>
	 * <p>This throws the exception if the current array is empty.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This returns the last member.<br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.last();
	 * 
	 * a.last(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.last(function (x) { return x.work === 'Doctor'; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.find()</a>, <a>Array.prototype.lastOrNull()</a></p>
	 * <meta keywords="find"/>
	 */
	Array.prototype.last = _createFirstOrLast(
		'lastIndexOf',
		function () { return this[this.length - 1]; },
		function () { throw new Error(ERR_AEA); },
		function () { throw new Error(ERR_MZM); }
	);

	/**
	 * <p><b>Returns</b> the last member that meets the given condition, otherwise null.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This returns the last member.<br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.lastOrNull();
	 * 
	 * a.lastOrNull(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.lastOrNull(function (x) { return x.work === 'Doctor'; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.find()</a>, <a>Array.prototype.last()</a></p>
	 * <meta keywords="find"/>
	 */
	Array.prototype.lastOrNull = _createFirstOrLast(
		'lastIndexOf',
		function () { return this[this.length - 1]; },
		function () { return null; },
		function () { return null; }
	);

	/**
	 * <p><b>Returns</b> the one and only member that meets the given condition, otherwise throws an exception.</p>
	 * <p>This throws the exception if the current array is empty.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This returns the one and only member.<br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.single();
	 * 
	 * a.single(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.single(function (x) { return x.work === 'Dancer'; });
	 * 
	 * a.single(function (x) { return x.work === 'Doctor'; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.find()</a>, <a>Array.prototype.singleOrNull()</a></p>
	 * <meta keywords="find"/>
	 */
	Array.prototype.single = function (ar0) {
		if (this.length === 0) {
			throw new Error(ERR_AEA);

		} else if (arguments.length === 0) {
			if (this.length === 1) {
				return this[0];

			} else {
				throw new Error(ERR_AMM);
			}

		} else if (arguments.length === 1) {
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

	/**
	 * <p><b>Returns</b> the one and only member that meets the given condition, otherwise null.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This returns the last member.<br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.singleOrNull();
	 * 
	 * a.singleOrNull(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.singleOrNull(function (x) { return x.work === 'Dancer'; });
	 * 
	 * a.singleOrNull(function (x) { return x.work === 'Doctor'; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.find()</a>, <a>Array.prototype.single()</a></p>
	 * <meta keywords="find"/>
	 */
	Array.prototype.singleOrNull = function (ar0) {
		if (this.length === 0) {
			return null;

		} else if (arguments.length === 0) {
			if (this.length === 1) {
				return this[0];

			} else {
				return null;
			}

		} else if (arguments.length === 1) {
			var idx = this.indexOf.call(this, ar0);
			if (idx >= 0) {
				if (idx === this.lastIndexOf.call(this, ar0)) {
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

	/**
	 * <p><b>Returns</b> the unique members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(valueProjector: <i>function</i>)</u> – This treats <i>undefined</i> and <i>null</i> like the same.<br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].distinct();
	 * 
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * a.distinct('work');
	 * 
	 * a.distinct(function (x) { return x.work; });
	 * </code>
	 * <meta keywords="unique"/>
	 */
	Array.prototype.distinct = function (ar0) {
		var hsh = {};
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var tmp;
		var udf = false;
		var nil = false;
		var out = [];
		if (arguments.length === 0) {
			while (++idx < bnd) {
				tmp = this[idx];
				if (tmp === undefined) {
					if (udf === false) {
						udf = true;
						out[++jdx] = this[idx];
					}

				} else if (tmp === null) {
					if (nil === false) {
						nil = true;
						out[++jdx] = this[idx];
					}

				} else if (hsh[(tmp = tmp.toString())] === undefined) {
					hsh[tmp] = true;
					out[++jdx] = this[idx];
				}
			}

		} else if (typeof ar0 === 'string' && ar0.length > 0 && arguments.length === 1) {
			while (++idx < bnd) {
				tmp = this[idx][ar0];
				if (tmp === undefined) {
					if (udf === false) {
						udf = true;
						out[++jdx] = this[idx];
					}

				} else if (tmp === null) {
					if (nil === false) {
						nil = true;
						out[++jdx] = this[idx];
					}

				} else if (hsh[(tmp = tmp.toString())] === undefined) {
					hsh[tmp] = true;
					out[++jdx] = this[idx];
				}
			}

		} else if (Function.isFunction(ar0) && arguments.length === 1) {
			while (++idx < bnd) {
				tmp = ar0.call(this._s, this[idx], idx, this);
				if (tmp === undefined) {
					if (udf === false) {
						udf = true;
						out[++jdx] = this[idx];
					}

				} else if (tmp === null) {
					if (nil === false) {
						nil = true;
						out[++jdx] = this[idx];
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

	/**
	 * <p><b>Returns</b> the current array that has the given member added.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u> – This appends the given value to the current array.<br>
	 * <u>(value: <i>anything</i>, targetIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3];
	 * 
	 * a.add(4);
	 * 
	 * a.add(5, 0);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push">Array.prototype.push()</a>, <a>Array.prototype.addRange()</a></p>
	 * <meta keywords="push,append,insert,splice"/>
	 */
	Array.prototype.add = function (ar0, ar1) {
		if (arguments.length === 1 || ar1 === this.length) {
			this.push(ar0);

		} else if (Number.isSafeInteger(ar1) && arguments.length === 2) {
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

	/**
	 * <p><b>Returns</b> the current array that has the given members added.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>)</u> – This appends the given members to the current array.<br>
	 * <u>(values: <i>array&lt;anything&gt;</i>, targetIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3];
	 * 
	 * a.addRange([4]);
	 * 
	 * a.addRange([5], 0);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push">Array.prototype.push()</a>, <a>Array.prototype.add()</a></p>
	 * <meta keywords="push,append,insert,splice"/>
	 */
	Array.prototype.addRange = function (ar0, ar1) {
		ar0 = Array.create(ar0);
		if (arguments.length === 1 || ar1 === this.length) {
			Array.prototype.splice.apply(this, [this.length, 0].concat(ar0));

		} else if (Number.isSafeInteger(ar1) && arguments.length === 2) {
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

	/**
	 * <p><b>Returns</b> the current array that has the given member of the first occurrence removed.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * <u>(value: <i>anything</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3, 2];
	 * 
	 * a.remove(2);
	 * 
	 * a.remove(3, 2);
	 * 
	 * a.remove(3, 1);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">Array.prototype.splice()</a>, <a>Array.prototype.removeAll()</a>, <a>Array.prototype.removeAt()</a>, <a>Array.prototype.removeRange()</a></p>
	 * <meta keywords="splice"/>
	 */
	Array.prototype.remove = function (ar0, ar1) {
		var idx;
		if (arguments.length <= 2) {
			idx = this.indexOf(ar0);
			if (idx >= 0 && (!Number.isSafeInteger(ar1) || idx >= ar1)) {
				return this.removeAt(idx);

			} else {
				return this;
			}

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> the current array that has the given index removed.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(targetIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3, 2];
	 * 
	 * a.removeAt(1);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">Array.prototype.splice()</a>, <a>Array.prototype.remove()</a>, <a>Array.prototype.removeAll()</a>, <a>Array.prototype.removeRange()</a></p>
	 * <meta keywords="splice"/>
	 */
	Array.prototype.removeAt = function (ar0) {
		if (arguments.length === 1) {
			if (Number.isSafeInteger(ar0) && ar0 >= 0 && ar0 <= this.length) {
				this.splice(ar0, 1);

			} else {
				throw new RangeError(ERR_OOR);
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	/**
	 * <p><b>Returns</b> the current array that has the given members removed.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3, 2];
	 * 
	 * a.removeRange([2]);
	 * 
	 * a.removeRange([3, 2]);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">Array.prototype.splice()</a>, <a>Array.prototype.remove()</a>, <a>Array.prototype.removeAll()</a>, <a>Array.prototype.removeAt()</a></p>
	 * <meta keywords="splice"/>
	 */
	Array.prototype.removeRange = function (ar0) {
		ar0 = Array.create(ar0);
		var idx = -1;
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

	/**
	 * <p><b>Returns</b> the current array that has the given member of all occurrences removed.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u> – This removes all members.<br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * <u>(value: <i>anything</i>, startIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3, 2];
	 * 
	 * a.removeAll(2);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">Array.prototype.splice()</a>, <a>Array.prototype.remove()</a>, <a>Array.prototype.removeAt()</a>, <a>Array.prototype.removeRange()</a></p>
	 * <meta keywords="splice"/>
	 */
	Array.prototype.removeAll = function (ar0) {
		if (arguments.length === 0) {
			this.splice(0, this.length);

		} else if (arguments.length === 1) {
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

	/**
	 * <p><b>Returns</b> a new nested array that have the current array split at the given member.</p>
	 * <p>This excludes the given member of all occurrences.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * <u>(valueProjector: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, valueProperty: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2, 3, 4].split(3);
	 * 
	 * [1, 2, 3, 2, 3, 4].split(function (x) { return x === 3; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.splitAt()</a>, <a>Array.prototype.groupOf()</a></p>
	 */
	Array.prototype.split = function (ar0, ar1) {
		var idx = -1;
		var pvt = 0;
		var bnd = this.length;
		var out = [];
		var ctx = this._s;
		if (arguments.length === 1) {
			if (Function.isFunction(ar0)) {
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

		} else if (typeof ar0 === 'string' && arguments.length === 2) {
			while (++idx < bnd) {
				if (this[idx][ar0] === ar1) {
					out.push(this.slice(pvt, idx));
					pvt = idx + 1;
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this.length > 0 && pvt <= bnd) {
			out.push(this.slice(pvt));
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	/**
	 * <p><b>Returns</b> a new nested array with members have the current array split at the given index.</p>
	 * <p>This always creates two nested arrays without removing any members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(targetIndex: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].splitAt(2);
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.split()</a></p>
	 */
	Array.prototype.splitAt = function (ar0) {
		var out = [];
		if (Number.isSafeInteger(ar0) && arguments.length === 1) {
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

	/**
	 * <p><b>Returns</b> the current array with members have the given member replaced.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(targetValue: <i>anything</i>, replacement: <i>anything</i>)</u> – This replaces the given value of all occurrences.<br>
	 * <u>(targetValue: <i>anything</i>, replacement: <i>anything</i>, operationCount: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3, 2];
	 * 
	 * a.replace(2, 4);
	 * 
	 * a.replace(4, 5, 1);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">Array.prototype.splice()</a>, <a>Array.prototype.replaceAt()</a></p>
	 * <meta keywords="splice"/>
	 */
	Array.prototype.replace = function (ar0, ar1, ar2) {
		var idx = -1;
		var bnd = this.length;
		if (arguments.length >= 2) {
			if (!Number.isSafeInteger(ar2)) {
				ar2 = Infinity;
			}
			if (Function.isFunction(ar0)) {
				while (++idx < bnd && ar2 > 0) {
					if (ar0.call(this._s, this[idx], idx, this)) {
						this[idx] = ar1;
						ar2--;
					}
				}

			} else {
				while (++idx < bnd && ar2 > 0) {
					if (this[idx] === ar0) {
						this[idx] = ar1;
						ar2--;
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	/**
	 * <p><b>Returns</b> the current array with members have the given index replaced.</p>
	 * <p>This mutates the current array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(targetIndex: <i>number</i>, replacement: <i>anything</i>)</u> – This replaces the given value of all occurrences.<br>
	 * </p>
	 * <code>
	 * a = [1, 2, 3, 2];
	 * 
	 * a.replaceAt(1, 4);
	 * 
	 * console.log(a);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">Array.prototype.splice()</a>, <a>Array.prototype.replace()</a></p>
	 * <meta keywords="splice"/>
	 */
	Array.prototype.replaceAt = function (ar0, ar1) {
		if (arguments.length !== 2) {
			throw new Error(ERR_INV);

		} else if (!Number.isSafeInteger(ar0) || ar0 < 0 || ar0 >= this.length) {
			throw new RangeError(ERR_OOR);

		} else {
			this[ar0] = ar1;
		}
		return this;
	};

	/**
	 * <p><b>Returns</b> a new array with members appear in the current array and members appear exclusively in the given array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].union([1, 4, 5]);
	 * </code>
	 * <meta keywords="set"/>
	 */
	Array.prototype.union = function (ar0) {
		ar0 = Array.create(ar0);
		var idx = -1;
		var jdx = this.length - 1;
		var bnd = ar0.length;
		var out = this.toImmutable();
		if (arguments.length === 1) {
			while (++idx < bnd) {
				if (!this.has(ar0[idx])) {
					out[++jdx] = ar0[idx];
				}
			}
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> a new array with members appear in both the current array and the given members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].intersect([1, 4, 5]);
	 * </code>
	 * <meta keywords="set"/>
	 */
	Array.prototype.intersect = function (ar0) {
		ar0 = Array.create(ar0);
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var out = [];
		if (arguments.length === 1) {
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

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> a new array with members appear in the current array but not the given members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].difference([1, 4, 5]);
	 * </code>
	 * <meta keywords="set"/>
	 */
	Array.prototype.difference = function (ar0) {
		ar0 = Array.create(ar0);
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var out = [];
		if (arguments.length === 1) {
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

		} else {
			throw new Error(ERR_INV);
		}
	};

	var _sort = Array.prototype.sort;

	/**
	 * <p><b>Returns</b> a new array with members that have been sorted by the given condition.</p>
	 * <p>The default sorting order is according to the string Unicode points.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, reverse: <i>boolean</i>, ...)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, reverse: <i>boolean</i>, ...)</u><br>
	 * <u>(orderSpecifiers: <i>array&lt;anything&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, orderSpecifiers: <i>array&lt;anything&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>, orderSpecifiers: <i>array&lt;anything&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.sortBy('work');
	 * 
	 * a.sortBy(function (x) { return x.work; });
	 * 
	 * a.sortBy(function (x) { return x.work; }, true);
	 * 
	 * a.sortBy('work', true, 'name', true);
	 * 
	 * a.sortBy([a[0], a[2], a[1]]);
	 * 
	 * a.sortBy('work', ['Singer', 'Dancer']);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort">Array.prototype.sort()</a></p>
	 */
	Array.prototype.sortBy = function (ar0, ar1) {
		var out;
		var ctx = this._s;
		if (arguments.length <= 2) {
			if (Array.isArray(ar0)) {
				if (typeof ar0 === 'string' && ar0.length > 0) {
					var nam = ar0;
					ar0 = function (itm) {
						return itm[nam];
					};
				}
				var end = this.length;
				if (arguments.length === 1) {
					out = this.select(function (itm, idx) {
						var tmp = ar0.indexOf(itm);
						return { v: itm, r: tmp >= 0 ? tmp : (end + idx) };
					});

				} else if (Function.isFunction(ar0)) {
					out = this.select(function (itm, idx) {
						var tmp = ar1.indexOf(ar0.apply(ctx, arguments));
						return { v: itm, r: tmp >= 0 ? tmp : (end + idx) };
					});

				} else {
					throw new Error(ERR_INV);
				}
				ar0 = undefined;

			} else if (Function.isFunction(ar0)) {
				out = this.select(function (itm, idx) {
					return { v: itm, r: ar0.call(ctx, itm, idx, this), i: idx };
				});

			} else if (typeof ar0 === 'string') {
				if (ar0.length === 0) {
					throw new Error(ERR_AES);
				}
				out = this.select(function (itm) {
					return { v: itm, r: itm[ar0] };
				});

			} else {
				throw new Error(ERR_INV);
			}
			if (this.length <= 0) {
				return this;

			} else if (ar1 !== true) {
				_sort.call(out, function (x, y) {
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

			} else {
				_sort.call(out, function (x, y) {
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
			}
			return out.select('v');

		} else {
			var lst = Array.from(arguments).select(function (val, idx) {
				if (idx % 2 === 0) {
					if (typeof val === 'string') {
						return function (itm) { return itm[val]; };

					} else if (Function.isFunction(val)) {
						return val;

					} else {
						throw new Error(ERR_INV);
					}

				} else {
					return val === undefined ? true : !!val;
				}
			});
			if (lst.length % 2 === 1) {
				lst.push(false);
			}
			var idx;
			var bnd = lst.length / 2;
			var tmp;
			var x;
			var y;
			out = this.clone();
			_sort.call(out, function (cur, ano) {
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
					return tmp * (lst[idx * 2 + 1] === true ? -1 : 1);
				}
				return 0;
			});
			return out;
		}
	};

	/**
	 * <p><b>Returns</b> a new nested array with members groupped by the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(nameProjector: <i>function&lt;string&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.groupBy('work');
	 * 
	 * a.groupBy(function (x) { return x.work; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.invokeWhich()</a></p>
	 */
	Array.prototype.groupBy = function (ar0) {
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
		if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> a new nested array with members groupped into the given number.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(count: <i>number</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.groupOf(2);
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.split()</a></p>
	 */
	Array.prototype.groupOf = function (ar0) {
		var idx = -1;
		var bnd = this.length;
		var tmp;
		var out;
		if (Number.isSafeInteger(ar0) && ar0 > 0 && arguments.length === 1) {
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

	/**
	 * <p><b>Returns</b> a new array with members merged with the given values.</p>
	 * <p>All members must be an object. Although this does not mutate the current array, the members of the current array may be mutated.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>, nameProjector: <i>string</i></u><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>, nameProjector: <i>string</i>, overwrite: <i>boolean</i>)</u><br>
	 * </p>
	 * <code>
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * var b = [
	 * 	{ name: 'Alex', year: 22 },
	 * 	{ name: 'Brad', year: 18 }
	 * ];
	 * 
	 * a.joinBy(b, 'name');
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.split()</a></p>
	 */
	Array.prototype.joinBy = function (ar0, ar1, ar2) {
		ar0 = Array.create(ar0);
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
						for (nam in tmp) {
							if (ar2) {
								this[idx][nam] = tmp[nam];

							} else if (this[idx][nam] === undefined) {
								this[idx][nam] = tmp[nam];
							}
						}
					}
				}
			}

		} else if (Function.isFunction(ar1)) {
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
					for (nam in tmp) {
						if (ar2) {
							this[idx][nam] = tmp[nam];

						} else if (this[idx][nam] === undefined) {
							this[idx][nam] = tmp[nam];
						}
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		return this;
	};

	/**
	 * <p><b>Returns</b> a number of members that match the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u><br>
	 * <u>(condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * <u>(nameProjector: <i>string</i>, value: <i>anything</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].countBy(2);
	 * 
	 * var a = [
	 * 	{ name: 'Alex', work: 'Singer' },
	 * 	{ name: 'Brad', work: 'Dancer' },
	 * 	{ name: 'Chad', work: 'Singer' }
	 * ];
	 * 
	 * a.countBy(a[0]);
	 * 
	 * a.countBy(function (x) { return x.work === 'Singer'; });
	 * 
	 * a.countBy('work', 'Singer');
	 * </code>
	 */
	Array.prototype.countBy = function (ar0, ar1) {
		var idx = -1;
		var bnd = this.length;
		var out = 0;
		var ctx = this._s;
		if (arguments.length < 1 || arguments.length > 2) {
			throw new Error(ERR_INV);

		} else if (typeof ar0 === 'string') {
			while (++idx < bnd) {
				if (this[idx][ar0] === ar1) {
					out++;
				}
			}

		} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> the member that has the smallest according to the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(valueProjector: <i>function&lt;number&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].min();
	 * 
	 * var a = [
	 * 	{ name: 'Alex', year: 22 },
	 * 	{ name: 'Brad', year: 18 },
	 * 	{ name: 'Chad', year: 26 }
	 * ];
	 * 
	 * a.min('year');
	 * 
	 * a.min(function (x) { return x.year; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.max()</a>, <a>Array.prototype.mod()</a></p>
	 */
	Array.prototype.min = function (ar0) {
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

			} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> the member that has the largest according to the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(valueProjector: <i>function&lt;number&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].max();
	 * 
	 * var a = [
	 * 	{ name: 'Alex', year: 22 },
	 * 	{ name: 'Brad', year: 18 },
	 * 	{ name: 'Chad', year: 26 }
	 * ];
	 * 
	 * a.max('year');
	 * 
	 * a.max(function (x) { return x.year; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.min()</a>, <a>Array.prototype.mod()</a></p>
	 * <p><b>See also</b> <a>Array.prototype.split()</a></p>
	 */
	Array.prototype.max = function (ar0) {
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

			} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> the member that appears most often according to the given condition.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(valueProjector: <i>function&lt;number&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].mod();
	 * 
	 * var a = [
	 * 	{ name: 'Alex', year: 22 },
	 * 	{ name: 'Brad', year: 18 },
	 * 	{ name: 'Chad', year: 26 }
	 * ];
	 * 
	 * a.mod('year');
	 * 
	 * a.mod(function (x) { return x.year; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.min()</a>, <a>Array.prototype.max()</a></p>
	 * <meta keywords="mode"/>
	 */
	Array.prototype.mod = function (ar0) {
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

			} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> a total number that represents all the members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(valueProjector: <i>function&lt;number&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].sum();
	 * 
	 * var a = [
	 * 	{ name: 'Alex', year: 22 },
	 * 	{ name: 'Brad', year: 18 },
	 * 	{ name: 'Chad', year: 26 }
	 * ];
	 * 
	 * a.sum('year');
	 * 
	 * a.sum(function (x) { return x.year; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.avg()</a></p>
	 * <meta keywords="total"/>
	 */
	Array.prototype.sum = function (ar0) {
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

			} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> an average number that represents all the members.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(valueProjector: <i>function&lt;number&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3, 2].avg();
	 * 
	 * var a = [
	 * 	{ name: 'Alex', year: 22 },
	 * 	{ name: 'Brad', year: 18 },
	 * 	{ name: 'Chad', year: 26 }
	 * ];
	 * 
	 * a.avg('year');
	 * 
	 * a.avg(function (x) { return x.year; });
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.avg()</a></p>
	 * <meta keywords="mean,average"/>
	 */
	Array.prototype.avg = function () {
		return this.sum.apply(this, arguments) / this.length;
	};

	/**
	 * <p><b>Returns</b> a new array with members that have <i>undefined</i>, <i>null</i>, <i>false</i>, <i>0</i>, empty string, white-space-only string and non-finite numbers removed.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(nameProjector: <i>string</i>)</u><br>
	 * <u>(valueProjector: <i>function&lt;number&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [undefined, null, false, 0, 1, '', ' ', Infinity].norm();
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.where()</a></p>
	 * <meta keywords="where,filter,compact,clean"/>
	 */
	Array.prototype.norm = function (ar0) {
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

		} else if (Function.isFunction(ar0)) {
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

	/**
	 * <p><b>Returns</b> a new array with members that have been converted to the target type.</p>
	 * <p>If a member cannot be converted to the given type, the member will be excluded from the new array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(typeName: <i>string</i>)</u> – The possible values are <i>string</i>, <i>number</i>, <i>boolean</i>, <i>array</i>, <i>object</i>, <i>function</i> and <a href="http://jquery.com/"><i>jQuery</i></a>.<br>
	 * <u>(typeClass: <i>anything</i>)</u> – The possible values are <i>String</i>, <i>Number</i>, <i>Boolean</i>, <i>Array</i>, <i>Object</i>, <i>Function</i> and <a href="http://jquery.com/"><i>jQuery</i></a>.<br>
	 * </p>
	 * <code>
	 * [1, 2, 3].cast('string');
	 * 
	 * ['1', '2', '3'].cast(Number);
	 * 
	 * ['true', 'TRUE', 'False', 'FaLsE', 0, 1].cast('boolean');
	 * 
	 * [{ "0": 1, "1": 2, "2": 3, length: 3 }].cast(Array);
	 * 
	 * [1, {}, []].cast('object');
	 * <!--
	 * ['<a></a>', document.createElement('b'), $('<i></i>')].cast(jQuery);
	 * // [$(<a></a>), $(<b></b>), $(<i></i>)]
	 * -->
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.where()</a></p>
	 * <meta keywords="select"/>
	 */
	Array.prototype.cast = function (ar0) {
		var nam = Function.isFunction(ar0) ? ar0.name : ar0;
		var idx = -1;
		var jdx = -1;
		var bnd = this.length;
		var tmp;
		var out = [];
		if (typeof nam === 'string') {
			nam = nam.toLowerCase();
			if (nam === 'string') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (typeof tmp === 'string') {
						out[++jdx] = tmp;

					} else if (tmp !== undefined && tmp !== null && tmp.toString !== undefined && Function.isFunction(tmp) === false) {
						tmp = tmp.toString();
						if (/^\[object \w+\]$/.test(tmp) === false) {
							out[++jdx] = tmp;
						}
					}
				}

			} else if (nam === 'number') {
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

			} else if (nam === 'boolean') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (tmp !== undefined && tmp !== null && tmp.toString !== undefined) {
						tmp = tmp.toString().trim().toLowerCase();
						if (tmp === 'true') {
							out[++jdx] = true;

						} else if (tmp === 'false') {
							out[++jdx] = false;
						}
					}
				}

			} else if (nam === 'array') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (Array.isArray(tmp)) {
						out[++jdx] = tmp;

					} else if (tmp !== undefined && tmp !== null && typeof tmp !== 'function' && Number.isSafeInteger(tmp.length)) {
						out[++jdx] = Array.create(tmp);
					}
				}

			} else if (nam === 'object') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (tmp !== null && typeof tmp === 'object' && !Array.isArray(tmp)) {
						out[++jdx] = tmp;
					}
				}

			} else if (nam === 'function') {
				while (++idx < bnd) {
					tmp = this[idx];
					if (Function.isFunction(tmp)) {
						out[++jdx] = tmp;
					}
				}

			} else if (win.jQuery !== undefined && (nam === 'jquery' || ar0 === win.jQuery)) {
				while (++idx < bnd) {
					tmp = this[idx];
					if (typeof tmp === 'string' || typeof tmp === 'object' && (tmp instanceof HTMLElement || tmp instanceof jQuery)) {
						out[++jdx] = win.jQuery(tmp);
					}
				}

			} else {
				throw new Error(ERR_INV);
			}
			if (this._s !== undefined) {
				out._s = this._s;
			}
			return out;

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> a new array with members that are the results of <a href="https://en.wikipedia.org/wiki/Cartesian_product">Cartesian product</a>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(values: <i>array&lt;anything&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [1, 2, 3].cross([4, 5]);
	 * </code>
	 * <meta keywords="product,set,tuple"/>
	 */
	Array.prototype.cross = function (ar0) {
		ar0 = Array.create(ar0);
		var idx = -1;
		var jdx;
		var kdx = -1;
		var bnd = this.length;
		var cnd = ar0.length;
		var out = new Array(bnd * cnd);
		if (arguments.length === 1) {
			if (this._x === true) {
				while (++idx < bnd) {
					jdx = -1;
					while (++jdx < cnd) {
						out[++kdx] = this[idx].slice(0).add(ar0[jdx]);
					}
				}

			} else {
				while (++idx < bnd) {
					jdx = -1;
					while (++jdx < cnd) {
						out[++kdx] = [this[idx]].add(ar0[jdx]);
					}
				}
			}

		} else {
			throw new Error(ERR_INV);
		}
		out._x = true;
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	/**
	 * <p><b>Returns</b> a new array of objects that members are constructed by the given array as property names and the current array as values.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(propertyNames: <i>array&lt;string&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * [[1, 2], [3]].zip(['a', 'b']);
	 * </code>
	 */
	Array.prototype.zip = function (ar0) {
		ar0 = Array.create(ar0);
		var idx = -1;
		var jdx;
		var bnd = this.length;
		var cnd = ar0.length;
		var tmp;
		var out = new Array(this.length);
		if (arguments.length === 1) {
			if (ar0.all(function (itm) { return typeof itm === 'string'; })) {
				while (++idx < bnd) {
					tmp = {};
					jdx = -1;
					while (++jdx < cnd) {
						tmp[ar0[jdx]] = this[idx][jdx];
					}
					if (tmp !== undefined) {
						out[idx] = tmp;
					}
				}

			} else {
				throw new TypeError(ERR_NST);
			}

		} else {
			throw new Error(ERR_INV);
		}
		if (this._s !== undefined) {
			out._s = this._s;
		}
		return out;
	};

	/**
	 * <p><b>Returns</b> the member that matches the given condition.</p>
	 * <p>This searches through a nested-tree-structured array.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(treeProjector: <i>string</i>, nameProjector: <i>string</i>, expectedValue: <i>anything</i>)</u><br>
	 * <u>(treeProjector: <i>string</i>, condition: <i>function&lt;boolean&gt;</i>)</u><br>
	 * </p>
	 * <code>
	 * a = [
	 * 	{ name: 'Dave', work: 'CFO' },
	 * 	{ name: 'Josh', work: 'CTO', team: [
	 * 		{ name: 'Alex' },
	 * 		{ name: 'Adam', team: [
	 * 			{ name: 'Brad' },
	 * 			{ name: 'Bill' }
	 * 		] }
	 * 	] },
	 * 	{ name: 'Kris', work: 'COO', team: [
	 * 		{ name: 'Tony' },
	 * 		{ name: 'Mike' }
	 * 	] }
	 * ];
	 * 
	 * a.seek('team', 'name', 'Bill');
	 * 
	 * a.seek('team', 'name', 'Todd');
	 * 
	 * a.seek('team', function (x) { return x.name === 'Mike'; });
	 * </code>
	 * <meta keywords="find,search,tree"/>
	 */
	Array.prototype.seek = function (ar0, ar1, ar2) {
		var ctx = this._s;
		if (arguments.length >= 2 && typeof ar0 === 'string' && ar0.length > 0 && (typeof ar1 === 'string' && ar1.length > 0 || Function.isFunction(ar1))) {
			return (function (lst) {
				var idx = -1;
				var bnd = lst.length;
				var tmp;
				while (++idx < bnd) {
					if (typeof ar1 === 'string' && lst[idx][ar1] === ar2 || Function.isFunction(ar1) && ar1.call(ctx, lst[idx], idx, lst)) {
						return lst[idx];

					} else if (Array.isArray(lst[idx][ar0]) && (tmp = arguments.callee(lst[idx][ar0])) !== undefined) {
						return tmp;
					}
				}
			})(this);

		} else {
			throw new Error(ERR_INV);
		}
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given value is an object, but not an array nor a function, otherwise <i>false</i>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u>
	 * </p>
	 * <code>
	 * Object.isObject({});
	 * 
	 * Object.isObject(new Object());
	 * 
	 * Object.isObject(new String());
	 * 
	 * Object.isObject(function () {});
	 * 
	 * Object.isObject([]);
	 * 
	 * Object.isObject(undefined);
	 * 
	 * Object.isObject(null);
	 * </code>
	 */
	Object.isObject = function (ar0) {
		return typeof ar0 === 'object' && ar0 !== null && (ar0 instanceof Array) === false && Object.prototype.toString.call(ar0) !== '[object Function]';
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given value is an object with no own properties, an empty array, an empty <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map">Map</a> or an empty <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set</a>, otherwise <i>false</i>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u>
	 * </p>
	 * <code>
	 * Object.isEmpty({});
	 * 
	 * Object.isEmpty({ a: 1 });
	 * 
	 * Object.isEmpty([]);
	 * 
	 * Object.isEmpty(undefined);
	 * 
	 * Object.isEmpty(null);
	 * 
	 * Object.isEmpty([1, 2, 3]);
	 * 
	 * Object.isEmpty(new Map());
	 * 
	 * Object.isEmpty(new Set());
	 * 
	 * </code>
	 */
	Object.isEmpty = function (ar0) {
		var nam;
		if (ar0 instanceof Map || ar0 instanceof Set) {
			return ar0.size === 0;

		} else if (Object.isObject(ar0)) {
			for (nam in ar0) {
				if (Object.prototype.hasOwnProperty.call(ar0, nam)) {
					return false;
				}
			}
			return true;

		} else if (Array.isArray(ar0)) {
			return ar0.length === 0;

		} else {
			return false;
		}
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given parameters are identical, otherwise <i>false</i>.</p>
	 * <p>This performs deep array/object comparison.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(firstValue: <i>anything</i>, secondValue: <i>anything</i>)</u>
	 * </p>
	 * <code>
	 * Object.isEqual({ a: { b: 1 } }, { a: { b: 1 } });
	 * 
	 * Object.isEqual({ a: { b: 1 } }, { a: { b: 1, c: 2 } });
	 * 
	 * Object.isEqual([1, 2, 3], [1, 2, 3]);
	 * 
	 * Object.isEqual([1, 2, 3], [4, 5, 6]);
	 * 
	 * Object.isEqual(NaN, NaN);
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.isEqual()</a></p>
	 */
	Object.isEqual = function (ar0, ar1) {
		if (arguments.length !== 2) {
			throw new Error(ERR_INV);

		} else if (ar0 === ar1) {
			return true;

		} else if (Array.isArray(ar0) && Array.isArray(ar1)) {
			return ar0.length === ar1.length && ar0.all(function (itm, idx) {
				return Object.isEqual(ar0[idx], ar1[idx]);
			});

		} else if (Object.isObject(ar0) && Object.isObject(ar1)) {
			var nam;
			var ls0 = Array.create();
			for (nam in ar0) {
				if (ar0[nam] !== undefined) {
					ls0.push(nam);
				}
			}
			var ls1 = Array.create();
			for (nam in ar1) {
				if (ar1[nam] !== undefined) {
					ls1.push(nam);
				}
			}
			return ls0.isAlike(ls1) && ls0.all(function (nam) {
				return Object.isEqual(ar0[nam], ar1[nam]);
			});

		} else if (typeof ar0 === 'number' && typeof ar1 === 'number' && isNaN(ar0) && isNaN(ar1)) {
			return true;

		} else {
			return false;
		}
	};

	var _extend = function (ar0, ar1) {
		var nam;
		for (nam in ar1) {
			if (ar1.hasOwnProperty(nam)) {
				if (Object.isObject(ar0[nam]) && Object.isObject(ar1[nam])) {
					_extend(ar0[nam], ar1[nam]);

				} else if (ar1[nam] !== undefined) {
					ar0[nam] = ar1[nam];
				}
			}
		}
	};

	/**
	 * <p><b>Returns</b> the target object with members copied from the given sources.</p>
	 * <p>This performs deep copy and ignores the sources that are not an object, unlike <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign">Object.assign()</a>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(target: <i>object</i>, ...sources: <i>object</i>)</u>
	 * </p>
	 * <code>
	 * Object.merge({ a: { b: 1 } }, { a: { b: 2, c: 3 } }, { a: { c: 4 } });
	 * 
	 * Object.merge({ a: { b: 1 } }, { a: undefined, d: null });
	 * 
	 * Object.merge({ a: { b: 1 } }, undefined, null, 0, 1, true, false, [1, 2, 3]);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign">Object.assign()</a>, <a>Object.clone()</a></p>
	 * <meta keywords="assign,extend"/>
	 */
	Object.merge = function (ar0) {
		if (Object.isObject(ar0) === false) {
			throw new Error(ERR_INV);
		}
		var arr = Array.from(arguments).slice(1);
		var idx = -1;
		var bnd = arr.length;
		while (++idx < bnd) {
			if (Object.isObject(arr[idx])) {
				_extend(ar0, arr[idx]);
			}
		}
		return ar0;
	};

	/**
	 * <p><b>Returns</b> a deep copy of the given object.</p>
	 * <p>This does not re-instantiate the given object from its class.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(source: <i>object</i>)</u>
	 * </p>
	 * <code>
	 * var a = { b: { c: 2, d: function () {}, e: [4, 5, 6] } };
	 * 
	 * var z = Object.clone(a);
	 * console.log(z);
	 * 
	 * console.log(a === z);
	 * 
	 * console.log(a.b === z.b);
	 * 
	 * console.log(a.b.c === z.b.c);
	 * 
	 * console.log(a.b.d === z.b.d);
	 * 
	 * console.log(a.b.e === z.b.e);
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign">Object.assign()</a>, <a>Object.merge()</a></p>
	 * <meta keywords="copy"/>
	 */
	Object.clone = function (ar0) {
		var out;
		var nam;
		var idx = -1;
		var bnd;
		if (Object.isObject(ar0)) {
			out = {};
			for (nam in ar0) {
				out[nam] = Object.clone(ar0[nam]);
			}
			return out;

		} else if (Array.isArray(ar0)) {
			bnd = ar0.length;
			out = new Array(bnd);
			while (++idx < bnd) {
				out[idx] = Object.clone(ar0[idx]);
			}
			return out;

		} else {
			return ar0;
		}
	};

	/**
	 * <p><b>Returns</b> an array of the adjusted integers that represent the percentage of the given numbers.</p>
	 * <p>This is very helpful when you want to calculate the percentage from three or more values which the traditional method below does not produce 100%.</p>
	 * <code><!--
	 * function calculateTraditionalPercentage (numbers) {
	 * 	var total = numbers.sum();
	 * 	return numbers.select(function (number) {
	 * 		return Math.round((number / total) * 100);
	 * 	});
	 * }
	 * --></code>
	 * <p>The traditional method above could be problematic if the inputs are irrational because <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math/round">Math.round</a> rounds the outputs to the nearest integers which the total output may not be 100%.</p>
	 * <code><!--
	 * calculateTraditionalPercentage([1, 1, 1])
	 * // [33, 33, 33]
	 * 
	 * calculateTraditionalPercentage([229, 1, 1])
	 * // [99, 0, 0]
	 * 
	 * calculateTraditionalPercentage([229, 4, 4])
	 * // [97, 2, 2]
	 * --></code>
	 * <p>While using <a>Math.percent</a> adjusts the outputs automatically, so the total output will always be 100%.</p>
	 * <code>
	 * Math.percent([0]);
	 * 
	 * Math.percent([0, 1]);
	 * 
	 * Math.percent([0, 1, 3]);
	 * 
	 * Math.percent([1, 1, 1]);
	 * 
	 * Math.percent([229, 1, 1]);
	 * 
	 * Math.percent([229, 4, 4]);
	 * </code>
	 */
	Math.percent = function (ar0) {
		if (Array.isArray(ar0) === false || ar0.length > 0 && ar0.any(function (val) { return Number.isNumber(val) === false || isFinite(val) === false; })) {
			throw new Error(ERR_INV);
		}

		var sum = ar0.sum();
		if (sum === 0) {
			return ar0.clone();
		}

		var raw = ar0.select(function (val) { return val / sum * 100 });
		var out = raw.select(Math.round);

		while (raw.any(function (val) { return val > 0 && val < 1; })) {
			var idx = raw.indexOf(function (val) { return val > 0 && val < 1; });
			raw[idx] = NaN;
			pct -= out[idx];
			out[idx] = 1;
			pct += 1;
		}

		var pct = out.sum();
		if (pct === 100) {
			return out;
		}

		var tmp;
		var idx;
		var bnd = out.length;
		while (pct !== 100 && raw.all(isNaN) === false) {
			if (pct < 100) {
				tmp = raw.max(function (val) { return val - Math.floor(val); });
				idx = -1;
				while (++idx < bnd) {
					if (raw[idx] === tmp) {
						raw[idx] = NaN;
						out[idx] += 1;
						pct += 1;
					}
				}

			} else {
				tmp = raw.min(function (val) { return val - Math.floor(val); });
				idx = -1;
				while (++idx < bnd) {
					if (raw[idx] === tmp) {
						raw[idx] = NaN;
						out[idx] -= 1;
						pct -= 1;
					}
				}
			}
		}

		if (pct < 100) {
			tmp = out.min();
			idx = -1;
			while (++idx < bnd) {
				if (out[idx] === tmp && pct !== 100) {
					out[idx] += 1;
					pct += 1;
				}
			}

		} else {
			tmp = out.max();
			idx = bnd;
			while (--idx >= 0) {
				if (out[idx] === tmp && pct !== 100) {
					out[idx] -= 1;
					pct -= 1;
				}
			}
		}

		return out;
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given argument is number and not <i>NaN</i>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>any</i>)</u>
	 * </p>
	 * <code>
	 * Number.isNumber(0);
	 * 
	 * Number.isNumber(1);
	 * 
	 * Number.isNumber(NaN);
	 * 
	 * Number.isNumber(Infinity);
	 * 
	 * Number.isNumber(undefined);
	 * 
	 * Number.isNumber(null);
	 * 
	 * Number.isNumber({});
	 * 
	 * Number.isNumber([]);
	 * </code>
	 */
	Number.isNumber = function (ar0) {
		return typeof ar0 === 'number' && isNaN(ar0) === false;
	};

	Number.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

	Number.isSafeInteger = Number.isSafeInteger || function (ar0) {
		return Number.isNumber(ar0) && isFinite(ar0) && Math.floor(ar0) === ar0 && Math.abs(ar0) <= Number.MAX_SAFE_INTEGER;
	};

	var THOUSAND_GROUP_SEPARATOR = (1234).toLocaleString().match(/\d(\D)\d{3}/)[1];
	var FLOATING_POINT_SEPARATOR = (0.1).toLocaleString().match(/\d(\D)\d/)[1];

	Number.COUNTER = { minDecimalPlace: NaN, maxDecimalPlace: 2, addThousandSeparators: true };

	Number.CURRENCY = { minDecimalPlace: NaN, maxDecimalPlace: 6, addThousandSeparators: true };

	Number.PERCENT = { minDecimalPlace: NaN, maxDecimalPlace: 2, addThousandSeparators: false, largeNumberScale: null };

	/**
	 * <p>
	 * minDecimalPlace
	 * maxDecimalPlace
	 * addThousandSeparators
	 * largeNumberScale
	 * spare
	 * </p>
	 */
	Number.prototype.format = function (opt) {
		var val = this.valueOf();
		if (isNaN(val) || !isFinite(val)) {
			return opt.spare === undefined ? '' : opt.spare;
		}

		var gmr = _resolve(String.GRAMMAR);

		opt = opt || {};
		var minDecimalPlace = opt.minDecimalPlace === undefined ? NaN : parseInt(opt.minDecimalPlace);
		var maxDecimalPlace = opt.maxDecimalPlace === undefined ? 6 : parseInt(opt.maxDecimalPlace);
		var addThousandSeparators = opt.addThousandSeparators === undefined ? true : opt.addThousandSeparators;
		var largeNumberScale = opt.largeNumberScale === undefined ? gmr.largeNumberScales : opt.largeNumberScale;

		var isNegativeNumber = val < 0;

		var out = Math.abs(val);

		// Normalizes the value according to the large number scale
		var largeNumberEntry = Array.isArray(largeNumberScale) ? largeNumberScale.find(function (itm) { return out >= itm.startingValue; }) : null;
		if (largeNumberEntry) {
			out = out / largeNumberEntry.scalingFactor;
		}

		// Rounds the integral part
		var integralPartNumber = Math.floor(out);

		// Determines the decimal place number
		var decimalPlaceNumber = 0;
		if (!isNaN(minDecimalPlace)) {
			decimalPlaceNumber = minDecimalPlace;

		} else if (out.toString().indexOf('.') >= 0) {
			decimalPlaceNumber = /\d+$/.exec(out.toString())[0].length;
		}
		if (!isNaN(maxDecimalPlace)) {
			decimalPlaceNumber = Math.min(decimalPlaceNumber, maxDecimalPlace);
		}

		// Rounds the fraction part
		var mantissaPartNumber;
		if (out.toString().indexOf('.') >= 0) {
			var mantissaPartString = /\d+$/.exec(out.toString())[0];
			if (mantissaPartString.length > decimalPlaceNumber) {
				// Use Math.round(...) instead of Number.toFixed(...) because the latter one sometimes return a wrong rounding floating number; take (0.345).toFixed(2) for example
				mantissaPartNumber = Math.round(parseFloat(mantissaPartString.substring(0, decimalPlaceNumber) + '.' + mantissaPartString.substring(decimalPlaceNumber))) / Math.pow(10, decimalPlaceNumber);
				if (mantissaPartNumber >= 1) {
					integralPartNumber += 1;
					mantissaPartNumber -= 1;
				}

			} else {
				mantissaPartNumber = parseFloat('0.' + mantissaPartString);
			}

		} else {
			mantissaPartNumber = 0;
		}

		// Inserts thousand separators to the integral part
		var integralPartText;
		if (addThousandSeparators) {
			integralPartText = integralPartNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, String.isString(gmr.thousandGroupSeparator) ? gmr.thousandGroupSeparator : THOUSAND_GROUP_SEPARATOR);

		} else {
			integralPartText = integralPartNumber.toString();
		}

		// Adds a decimal place sign before the mantissa part
		var mantissaPartText = '';
		if (decimalPlaceNumber > 0) {
			mantissaPartText = (String.isString(gmr.floatingPointSeparator) ? gmr.floatingPointSeparator : FLOATING_POINT_SEPARATOR) + /\d+$/.exec(mantissaPartNumber.toFixed(decimalPlaceNumber))[0];
		}

		// Combines parts together
		out = integralPartText + mantissaPartText;

		// Converts to local digits
		if (String.isString(gmr.digits)) {
			out = out.split('').select(function (num) {
				return (/\d/.test(num)) ? gmr.digits.charAt(num) : num;
			}).join('');
		}

		// Adds a minus sign
		if (isNegativeNumber && out !== '0') {
			out = '-' + out;
		}

		// Adds the large number notation
		if (largeNumberEntry) {
			out = (largeNumberEntry.prefix || '') + out + (largeNumberEntry.suffix || '');
		}

		return out;
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given value has a type of string, otherwise <i>false</i>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u>
	 * </p>
	 * <code>
	 * String.isString('abc');
	 * 
	 * String.isString(undefined);
	 * 
	 * String.isString(null);
	 * 
	 * String.isString({});
	 * 
	 * String.isString([]);
	 * </code>
	 */
	String.isString = function (ar0) {
		return typeof ar0 === 'string';
	}

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given value is an empty string or a white-space-only string, otherwise <i>false</i>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(value: <i>anything</i>)</u>
	 * </p>
	 * <code>
	 * String.isEmpty('');
	 * 
	 * String.isEmpty('   ');
	 * 
	 * String.isEmpty('abc');
	 * 
	 * String.isEmpty(undefined);
	 * 
	 * String.isEmpty(null);
	 * </code>
	 */
	String.isEmpty = function (ar0) {
		return String.isString(ar0) && (ar0.length === 0 || /^\s+$/.test(ar0));
	};

	/**
	 * <p><b>Returns</b> <i>true</i> if and only if the given string is part of the current string, otherwise <i>false</i>.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(expectedValue: <i>string</i>)</u>
	 * </p>
	 * <code>
	 * 'this is what you came for'.contains('what');
	 * 
	 * 'this is what you came for'.contains('WHAT');
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes">String.prototype.includes()</a></p>
	 * <meta keywords="include,indexof"/>
	 */
	String.prototype.contains = function (ar0) {
		return this.indexOf(ar0) >= 0;
	};

	/**
	 * <p><b>Returns</b> a number that is the result of hashing.</p>
	 * <p>The result is always an interger that can be a negative integer.</p>
	 * <code>
	 * 'this is what you came for'.toHashCode();
	 * </code>
	 */
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

	var XML_PAR = [['<', '&lt;'], ['>', '&gt;'], ['&', '&amp;'], ['"', '&quot;']];
	var XML_ENC = XML_PAR.toObject('0', '1');
	var XML_DEC = XML_PAR.toObject('1', '0');
	var XML_SYM = new RegExp('[' + XML_PAR.select('0').join('').replace(/\\/g, '\\\\') + ']', 'g');
	var XML_COD = new RegExp('(' + XML_PAR.select('1').join('|').replace(/\\/g, '\\\\') + ')', 'g');
	var _encodeXML = function (chr) {
		return XML_ENC[chr];
	};
	var _decodeXML = function (chr) {
		return XML_DEC[chr];
	};

	/**
	 * <p><b>Returns</b> a string that has all <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML">XML characters</a> unescaped.</p>
	 * <code>
	 * 'Alex & Brad say "0 < 1 but 2 > 1"'.toEncodedXML();
	 * </code>
	 * <p><b>See also</b> <a>String.prototype.toDecodedXML()</a></p>
	 * <meta keywords="html,escape,character"/>
	 */
	String.prototype.toEncodedXML = function () {
		return this.replace(XML_SYM, _encodeXML);
	};

	/**
	 * <p><b>Returns</b> a string that has all <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML">XML characters</a> escaped. This is a reverse implementation of <a>String.prototype.toEncodedXML/=()</a></p>
	 * <code><!--
	 * 'Alex &amp; Brad say &quot;0 &lt; 1 but 2 &gt; 1&quot;'.toDecodedXML();
	 * // 'Alex & Brad say "0 < 1 but 2 > 1"'
	 * --></code>
	 * <p><b>See also</b> <a>String.prototype.toEncodedXML()</a></p>
	 * <meta keywords="html,escape,unescape,character"/>
	 */
	String.prototype.toDecodedXML = function () {
		return this.replace(XML_COD, _decodeXML);
	};

	var WRD_CPH = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
	var WRD_CPL =
		/[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g;
	var WRD_BSC = /[a-zA-Z0-9]+/g;

	var _splitWords = function (ar0) {
		return ar0.match(WRD_CPH.test(ar0) ? WRD_CPL : WRD_BSC) || [];
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
	var _replaceLatin = function (chr) {
		return CAS_MAP[chr];
	};

	/**
	 * <p><b>Returns</b> a string that has Latin characters converted to English characters, if possible.</p>
	 * <code>
	 * 'Åsmund Renée Jørn'.toEnglishCase();
	 * </code>
	 * <meta keywords="latin">
	 */
	String.prototype.toEnglishCase = function () {
		return this.replace(CAS_LAT, _replaceLatin).replace(CAS_MAR, '');
	};

	var _capitalizeWord = function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	};

	/**
	 * <p><b>Returns</b> a string that has the first character of each word capitalized, except the word that was in capital already.</p>
	 * <code>
	 * 'Alexander and the terrible, horrible, no good, very BAD day (movie)'.toCapitalCase();
	 * </code>
	 * <meta keywords="english">
	 */
	String.prototype.toCapitalCase = function () {
		var txt = this.toString()
		var idx = 0;
		var bnd = txt.length;
		var tmp;
		var out = [txt.charAt(0)];
		var chr = /\w/.test(out[0]);
		if (bnd === 0) {
			return txt;
		}
		while (++idx < bnd) {
			tmp = txt.charAt(idx);
			if (/\w/.test(tmp) === chr) {
				out[out.length - 1] += tmp;

			} else {
				out.push(tmp);
			}
			chr = /\w/.test(tmp);
		}
		idx = -1;
		bnd = out.length;
		while (++idx < bnd) {
			tmp = out[idx];
			if (tmp === tmp.toUpperCase()) {
				out[idx] = tmp;

			} else {
				out[idx] = _capitalizeWord(tmp);
			}
		}
		return out.join('');
	};

	var CAS_APO = /['’]/g;

	/**
	 * <p><b>Returns</b> a string that has words concatenated and cases converted to <a href="https://en.wikipedia.org/wiki/CamelCase">camel case</a>.</p>
	 * <code>
	 * '_this-is*what you   CAME^For$'.toCamelCase();
	 * </code>
	 * <p><b>See also</b> <a>String.prototype.toTrainCase()</a></p>
	 */
	String.prototype.toCamelCase = function () {
		var txt = _splitWords(this.toEnglishCase().replace(CAS_APO, '')).map(_capitalizeWord).join('');
		if (txt.length > 0) {
			txt = txt[0].toLowerCase() + txt.substring(1);
		}
		return txt;
	};

	/**
	 * <p><b>Returns</b> a string that has dash(es) separated and cases converted to small.</p>
	 * <code>
	 * '_this-is*what you   CAME^For$'.toTrainCase();
	 * </code>
	 * <p><b>See also</b> <a>String.prototype.toCamelCase()</a></p>
	 */
	String.prototype.toTrainCase = function () {
		return _splitWords(this.toEnglishCase().replace(CAS_APO, '')).join('-').toLowerCase();
	};

	/**
	 * <p><b>Returns</b> the last index of the given closing string.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(startingText: <i>string</i>, closingText: <i>string</i>)</u>
	 * </p>
	 * <code>
	 * '(()())'.latchOf('(', ')');
	 * </code>
	 * <p><b>See also</b> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf">String.prototype.indexOf()</a></p>
	 * <meta keywords="index"/>
	 */
	String.prototype.latchOf = function (str, end) {
		var num = 0;
		var idx = -1;
		var bnd = this.length;
		while (++idx < bnd) {
			if (this.substring(idx, idx + str.length) === str) {
				num++;
				idx += str.length - 1;

			} else if (this.substring(idx, idx + end.length) === end) {
				num--;
				if (num === 0) {
					return idx;
				}
				idx += end.length - 1;
			}
		}
		return -1;
	};

	/**
	 * <p><b>Defines</b> the dictionary for <a>String.prototype.translate()</a>.</p>
	 * <code><!--
	 * Object.merge(String.DICTIONARY, {
	 * 	'fr-FR': {
	 * 		'apple': 'pomme',
	 * 		'banana': 'banane'
	 * 	},
	 * 	'th-TH': {
	 * 		'apple': 'แอปเปิล',
	 * 		'banana': 'กล้วย'
	 * 	}
	 * });
	 * --></code>
	 * <p><b>See also</b> <a>String.LOCALE</a>, <a>String.prototype.translate()</a></p>
	 * <meta keywords="language,culture,translation,localization,l10n,internationalization,i18n"/>
	 */
	String.DICTIONARY = {
		'en-US': {}
	};

	/**
	 * <p><b>Defines</b> the grammar rules for <a>Number.prototype.format()</a> and <a>String.prototype.format()</a>.</p>
	 * <p>The default value is grammar rules for American English.</p>
	 * <code><!--
	 * Object.merge(String.GRAMMAR, {
	 * 	'th-TH': {
	 * 		series: function (items) { return items.length <= 1 ? items.join(' ') : items.take(items.length - 1).join(' ') + 'และ' + items.last(); },
	 * 		digits: '๐๑๒๓๔๕๖๗๘๙'
	 * 	}
	 * });
	 * --></code>
	 * <p><b>See also</b> <a>String.LOCALE</a>, <a>String.prototype.format()</a></p>
	 * <meta keywords="rules,language,culture,translation,localization,l10n,internationalization,i18n"/>
	 */
	String.GRAMMAR = {
		'en-US': {
			series: function (items) { return items.length <= 1 ? items.join('') : (items.take(items.length - 1).join(', ') + ' and ' + items.last()); },
			plural: function (words, count) { return count === 1 || words.length === 1 ? words[0] : words[1]; },
			digits: null,
			thousandGroupSeparator: ',',
			floatingPointSeparator: '.',
			largeNumberScales: [
				{ suffix: 'T', startingValue: 1e12, scalingFactor: 1e12 },
				{ suffix: 'B', startingValue: 1e9, scalingFactor: 1e9 },
				{ suffix: 'M', startingValue: 1e6, scalingFactor: 1e6 },
				{ suffix: 'K', startingValue: 1e3, scalingFactor: 1e3 },
			],
		},
		'es-ES': {
			thousandGroupSeparator: '.',
			floatingPointSeparator: ',',
		},
		'th-TH': {
			series: function (items) { return items.length <= 1 ? items.join(' ') : items.take(items.length - 1).join(' ') + 'และ' + items.last(); },
	  		plural: null,
	  		digits: null,
		},
	};

	var _resolve = function (obj, loc) {
		if (arguments.length === 1) {
			loc = String.LOCALE;
		}
		var tmp = obj[loc];
		if (String.isString(tmp)) {
			return _resolve(obj, tmp);
		
		} else if (tmp === undefined && loc.length > 2) {
			loc = loc.split('-');
			lot = loc[loc.length - 2];
			tmp = Object.keys(obj).find(function (key) {
				return key.split('-').has(loc);
			});
		}
		return tmp === undefined ? obj['en-US'] : tmp;
	};

	/**
	 * <p><b>Defines</b> the current language-culture code for <a>String.prototype.translate()</a> and <a>String.prototype.format()</a>.</p>
	 * <p>The value should be a string based on <i>xx-YY</i> pattern, where <i>xx</i> is two-letter lower-case <a href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes" title="ISO 639-1">language code</a> and <i>YY</i> is two-letter upper-case <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" title="ISO 3166-1 alpha-2">country code</a>.</p>
	 * <p>The default value is the same as <i>window.navigator.language</i>.</p>
	 * <code>
	 * String.LOCALE = 'th-TH';
	 * 
	 * String.LOCALE = 'ja-JP';
	 * 
	 * String.LOCALE = 'zh-CN';
	 * </code>
	 * <p><b>See also</b> <a>String.DICTIONARY</a></p>
	 * <meta keywords="language,culture,translation,localization,l10n,internationalization,i18n"/>
	 */
	String.LOCALE = win.navigator && win.navigator.language || 'en-US';

	/**
	 * <p><b>Returns</b> the string that matched the given key and <a>String.LOCALE</a> in <a>String.DICTIONARY</a>, otherwise the original value.</p>
	 * <p></p>
	 * <code>
	 * Object.merge(String.DICTIONARY, {
	 * 	'th-TH': {
	 * 		'apple': 'แอปเปิล',
	 * 		'banana': 'กล้วย'
	 * 	}
	 * });
	 * 
	 * String.LOCALE = 'th-TH';
	 * 
	 * 'apple'.translate();
	 * 
	 * 'banana'.translate();
	 * 
	 * 'coconut'.translate();
	 * </code>
	 * <meta keywords="language,culture,translation,localization,l10n,internationalization,i18n"/>
	 */
	String.prototype.translate = function () {
		var key = this.toString();
		var tmp = _resolve(String.DICTIONARY) || String.DICTIONARY['en-US'];
		return tmp !== undefined && tmp[key] || key;
	};

	var INTERPOLATION_HASH = {};
	var INTERPOLATION_SIZE = 0;

	var _pluralize = function (lst, $$t) {
		var idx = $$t.length;
		return function () {
			var gmr = _resolve(String.GRAMMAR);
			var out;
			if (gmr !== undefined && gmr.plural) {
				var dst = 1;
				var tmp;
				while (idx - dst >= 0 || idx + dst < $$t.length) {
					if (Number.isNumber(tmp = $$t[idx - dst])) {
						out = gmr.plural(lst, tmp);
						break;

					} else if (Array.isArray(tmp)) {
						out = gmr.plural(lst, tmp.length);
						break;

					} else if (Number.isNumber(tmp = $$t[idx + dst])) {
						out = gmr.plural(lst, tmp);
						break;

					} else if (Array.isArray(tmp)) {
						out = gmr.plural(lst, tmp.length);
						break;

					} else {
						dst += 1;
					}
				}
			}
			return out === undefined ? lst[0] : out;
		};
	};

	var _serialize = function (lst) {
		var gmr = _resolve(String.GRAMMAR);
		return gmr !== undefined && gmr.series ? gmr.series(lst) : lst.join(', ');
	};

	/**
	 * <p><b>Returns</b> the .</p>
	 * <p><b>Accepts</b><br>
	 * <u>()</u><br>
	 * <u>(options: <i>object</i>)</u>
	 * </p>
	 * <code>
	 * template = '${members} $[is|are] alright';
	 * template.format({ members: ['Alex'] });
	 * 
	 * template.format({ members: ['Alex', 'Brad', 'Cody'] });
	 * 
	 * template = 'There $[is|are] ${count} $[person|people] in this room';
	 * template.format({ count: 1 });
	 * 
	 * template.format({ count: 5 });
	 * </code>
	 * <code>
	 * Object.merge(String.GRAMMAR, {
	 * 	'th-TH': {
	 * 		series: function (items) { return items.length <= 1 ? items.join(' ') : items.take(items.length - 1).join(' ') + 'และ' + items.last(); },
	 * 		digits: '๐๑๒๓๔๕๖๗๘๙'
	 * 	}
	 * });
	 * 
	 * String.LOCALE = 'th-TH';
	 * 
	 * '${subject}มีลูกแมวเหมียวรวมกันทั้งหมด ${count} ตัว'.format({ subject: ["มานะ", "มานี", "วินัย"], count: 12 });
	 * </code>
	 * <meta keywords="evaluate,insert,process,replace,interpolation,language,culture,translation,localization,l10n,internationalization,i18n"/>
	 */
	String.prototype.format = function (opt) {
		var key = this.toString();
		var pvt = 0;
		var idx;
		var jdx;
		var bnd = this.length;
		var $$i = opt;
		var $$o = [];
		var $$t = [];
		var $$p = _pluralize;
		var nam;
		var vrs = ''
		var exe = '';
		var tmp;
		var out = '';
		if (Object.isObject(opt)) {
			for (nam in opt) {
				if (/\$\$\w/.test(nam)) {
					throw new Error(ERR_IPR);

				} else if (nam.startsWith('_') === false && opt.hasOwnProperty(nam)) {
					vrs += ',' + nam + '=$$i.' + nam;
				}
			}
		}
		if (vrs.length > 0) {
			vrs = 'var ' + vrs.substring(1) + ';'
		}
		if (INTERPOLATION_HASH[key] !== undefined) {
			exe = INTERPOLATION_HASH[key];

		} else {
			while (pvt < bnd) {
				idx = this.indexOf('$', pvt);
				if (idx >= 0) {
					if (this.charAt(idx + 1) === '{') { // Do not remove "}" sign because of an issue with String.prototype.latchOf() in Gruntfile.js
						jdx = this.substring(idx).latchOf('{', '}');
						if (jdx >= 0) {
							exe += '$$o.push(' + JSON.stringify(this.substring(pvt, idx)) + ');';
							exe += '$$o.push($$t.length);';
							exe += '$$t.push(' + this.substring(idx + 2, idx + jdx) + ');';
							pvt = idx + jdx + 1;

						} else {
							exe += '$$o.push(' + JSON.stringify(this.substring(pvt, idx + 2)) + ');';
							pvt = idx + 2;
						}

					} else if (this.charAt(idx + 1) === '[') {
						jdx = this.substring(idx).latchOf('[', ']');
						if (jdx >= 0) {
							exe += '$$o.push(' + JSON.stringify(this.substring(pvt, idx)) + ');';
							exe += '$$o.push($$t.length);';
							exe += '$$t.push($$p(' + JSON.stringify(this.substring(idx + 2, idx + jdx).split('|')) + ',$$t));';
							pvt = idx + jdx + 1;

						} else {
							exe += '$$o.push(' + JSON.stringify(this.substring(pvt, idx + 2)) + ');';
							pvt = idx + 2;
						}

					} else {
						exe += '$$o.push(' + JSON.stringify(this.substring(pvt, idx + 2)) + ');';
						pvt = idx + 2;
					}

				} else {
					exe += '$$o.push(' + JSON.stringify(this.substring(pvt)) + ');';
					pvt = bnd;
				}
			}
			INTERPOLATION_HASH[key] = exe;
			INTERPOLATION_SIZE += 1;
			if (INTERPOLATION_SIZE > 1024) {
				INTERPOLATION_HASH = {};
			}
		}
		eval('(function(){' + vrs + exe + '})();');
		idx = -1;
		bnd = $$o.length;
		while (++idx < bnd) {
			tmp = $$o[idx];
			if (Number.isNumber(tmp)) {
				tmp = $$t[tmp];
				if (Number.isNumber(tmp)) {
					out += tmp.format();

				} else if (Array.isArray(tmp)) {
					out += _serialize(tmp);

				} else if (Function.isFunction(tmp)) {
					out += tmp();

				} else {
					out += tmp;
				}

			} else {
				out += tmp;
			}
		}
		return out;
	};

	var REG_CHR = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

	/**
	 * <p><b>Returns</b> the string that have the <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_meaning_in_regular_expressions">regular expression special characters</a> escaped.</p>
	 * <p><b>Accepts</b><br>
	 * <u>(text: <i>string</i>)</u><br>
	 * </p>
	 * <code>
	 * RegExp.escape('($-100)*');
	 * </code>
	 * <meta keywords="string"/>
	 */
	RegExp.escape = function (txt) {
		return txt.replace(REG_CHR, '\\$&');
	};

	/**
	 * <p><b>Returns</b> a new array with name-value paris that are copied from the current map.</p>
	 * <code>
	 * new Map().set(1, 'a').set(2, 'b').toArray();
	 * </code>
	 * <p><b>See also</b> <a>Array.create()</a></p>
	 */
	Map.prototype.toArray = function () {
		return Array.create(this);
	};

	/**
	 * <p><b>Returns</b> a new object with properties that are copied from the current map.</p>
	 * <code>
	 * new Map().set(1, 'a').set(2, 'b').toObject();
	 * </code>
	 * <p><b>See also</b> <a>Array.prototype.toObject()</a></p>
	 */
	Map.prototype.toObject = function () {
		var out = {};
		this.forEach(function (val, key) {
			if (key === undefined) {
				key = 'undefined';

			} else if (key === null) {
				key = 'null';

			} else if (typeof key !== 'string') {
				key = key.toString();
			}
			out[key] = val;
		});
		return out;
	};
})();