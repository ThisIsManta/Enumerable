// LINQ lookalike by Manta (anantachai.saothong@thomsonreuters.com)
// Last modified on 8th May 2014
var Enumerable = function Enumerable() {
    var a = arguments[0];
    if (typeof a==='object') {
        if (a instanceof Array) {
            this.a = a;
            this.m = true;
        } else if (a.constructor !== undefined && a.constructor.name === 'Enumerable' || a instanceof Enumerable) {
            this.a = a.a;
            this.m = true;
        } else {
            this.a = [];
            for (var n in a) {
                this.a.push({ name: n, value: a[n] });
            }
            this.m = false;
        }
    } else if (typeof a === 'string') {
        this.a = new Array(a.length);
        var i = 0;
        while (i < this.a.length) {
            this.a[i] = a.charAt(i);
            i++;
        }
        this.m = false;
    } else if (typeof a === 'undefined') {
        this.a = [];
        this.m = false;
    } else {
        throw 'input was not enumerable';
    }
};

Enumerable.prototype.toArray = function () {
    return this.a;
};

Enumerable.prototype.clone = function () {
    var z = new Array(this.a.length);
    var i = 0;
    while (i < z.length) {
        z[i] = this.a[i];
        i++;
    }
    this.m = false;
    return new Enumerable(z);
};

Enumerable.prototype.toImmutableArray = function () {
    if (this.m) {
        return this.clone().a;
    } else {
        return this.a;
    }
};

Enumerable.prototype.where = function () {
    var p = arguments[0];
    var o = arguments[0];
    var z = [];
    var i = 0;
    if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            if (p(this.a[i], i)) {
                z.push(this.a[i]);
            }
        }
    } else if (typeof o === 'object') {
        for (i = 0; i < this.a.length; i++) {
            var c = true;
            for (var j in o) {
                c &= (this.a[i][j] === o[j]);
                if (!c) {
                    break;
                }
            }
            if (c) {
                z.push(this.a[i]);
            }
        }
    } else {
        throw 'no input was given';
    }
    return new Enumerable(z);
};

Enumerable.prototype.select = function () {
    var p = arguments[0];
    var n = arguments[0];
    var z = new Array(this.a.length);
    var i = 0;
    if (typeof p === 'function') {
        while (i < this.a.length) {
            z[i] = p(this.a[i], i);
            i++;
        }
    } else if (typeof n === 'string') {
        if (n.length === 0) {
            throw 'name was empty';
        }
        while (i < this.a.length) {
            z[i] = this.a[i][n];
            i++;
        }
    } else {
        throw 'no input was given';
    }
    return new Enumerable(z);
};

Enumerable.prototype.replace = function () {
    var p = arguments[0];
    var s = arguments[0];
    var d = arguments[1];
    var i;
    var z = this.toImmutableArray();
    if (s === undefined || d === undefined) {
        throw 'input was not valid';
    }
    if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            if (p(this.a[i])) {
                z[i] = d;
            }
        }
    } else {
        for (i = 0; i < this.a.length; i++) {
            if (this.a[i] === s) {
                z[i] = d;
            }
        }
    }
    return new Enumerable(z);
};

Enumerable.prototype.invoke = function () {
    var p = arguments[0];
    if (typeof p === 'function') {
        for (var i = 0; i < this.a.length; i++) {
            p(this.a[i], i);
        }
    } else {
        throw 'predicate was needed';
    }
    return this;
};

Enumerable.prototype.skip = function () {
    var p = arguments[0];
    var c = arguments[0];
    var b = arguments[0];
    var f = arguments[1];
    var z = [];
    var i = 0;
    if (typeof p === 'function') {
        b = this.a.length;
        f = this.a.length;
        for (i = 0; i < this.a.length; i++) {
            if (!p(this.a[i], i)) {
                b = i;
                break;
            }
        }
        return this.take(b, f);
    } else if (!isNaN(c) && isNaN(f)) {
        return this.take(c, this.a.length);
    } else if (!isNaN(b) && !isNaN(f)) {
        z = this.toImmutableArray();
        z.splice(b, f - b);
        return new Enumerable(z);
    } else {
        throw 'input was not valid';
    }
};

Enumerable.prototype.take = function () {
    var p = arguments[0];
    var c = arguments[0];
    var b = arguments[0];
    var f = arguments[1];
    var z = [];
    var i = 0;
    if (typeof p === 'function') {
        b = 0;
        f = this.a.length;
        for (i = 0; i < this.a.length; i++) {
            if (!p(this.a[i], i)) {
                f = i;
                break;
            }
        }
    } else if (!isNaN(c) && isNaN(f)) {
        b = 0;
        f = Math.min(this.a.length, c);
    } else if (!isNaN(b) && !isNaN(f)) {
        if (b < 0 || b > this.a.length) {
            throw 'start index was out of range';
        } else if (f < 0 || f > this.a.length) {
            throw 'stop index was out of range';
        } else if (b > f) {
            throw 'start index was greater than stop index';
        }
    } else {
        throw 'input was not valid';
    }
    for (i = b; i < f; i++) {
        z.push(this.a[i]);
    }
    return new Enumerable(z);
};

Enumerable.prototype.flatten = function () {
    var p = arguments[0];
    var n = arguments[0];
    var d = (typeof p === 'function' || typeof n === 'string') ? arguments[1] : arguments[0];
    var i = 0;
    var j;
    var t;
    if (d === undefined) {
        d = false;
    } else {
        d = !!d;
    }
    var z = [];
    if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            t = this.a[i];
            if (typeof t === 'object' && t instanceof Array && t.length > 0) {
                if (d) {
                    t = new Enumerable(t).flatten(p, d).toArray();
                }
                for (j = 0; j < t.length; j++) {
                    z.push(p(t[j], j));
                }
            } else {
                z.push(t);
            }
        }
    } else if (typeof n === 'string') {
        if (n.length === 0) {
            throw 'name was empty';
        }
        for (i = 0; i < this.a.length; i++) {
            t = this.a[i];
            if (typeof t === 'object' && t instanceof Array && t.length > 0) {
                if (d) {
                    t = new Enumerable(t).flatten(n, d).toArray();
                }
                for (j = 0; j < t.length; j++) {
                    z.push(t[j][n]);
                }
            } else {
                z.push(t);
            }
        }
    } else {
        for (i = 0; i < this.a.length; i++) {
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

Enumerable.prototype.any = function () {
    var p = arguments[0];
    var o = arguments[0];
    var i = 0;
    if (this.a.length === 0) {
        return false;
    } else if (o === undefined) {
        return true;
    } else if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            if (p(this.a[i], i)) {
                return true;
            }
        }
        return false;
    } else {
        for (i = 0; i < this.a.length; i++) {
            if (this.a[i] === o) {
                return true;
            }
        }
        return false;
    }
};

Enumerable.prototype.all = function () {
    var p = arguments[0];
    var o = arguments[0];
    var i = 0;
    if (this.a.length === 0) {
        return true;
    } else if (o === undefined) {
        throw 'input was not valid';
    } else if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            if (!p(this.a[i], i)) {
                return false;
            }
        }
        return true;
    } else {
        for (i = 0; i < this.a.length; i++) {
            if (this.a[i] !== o) {
                return false;
            }
        }
        return true;
    }
};

Enumerable.prototype.subsetOf = function () {
    var e = new Enumerable(arguments[0]);
    for (var i = 0; i < this.a.length; i++) {
        if (!e.contains(this.a[i])) {
            return false;
        }
    }
    return true;
};

Enumerable.prototype.equivalent = function () {
    var e = new Enumerable(arguments[0]);
    var t;
    if (this.a.length !== e.a.length) {
        return false;
    } else {
        for (var i = 0; i < this.a.length; i++) {
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

Enumerable.prototype.indexOf = function () {
    var p = arguments[0];
    var o = arguments[0];
    var b = arguments[1];
    var i = 0;
    if (!isNaN(b) && (b < 0 || b > this.a.length)) {
        throw 'index was out of range';
    } else {
        b = 0;
    }
    if (b < this.a.length) {
        if (typeof p === 'function') {
            for (i = b; i < this.a.length; i++) {
                if (p(this.a[i], i)) {
                    return i;
                }
            }
        } else if (o !== undefined && o !== null) {
            for (i = b; i < this.a.length; i++) {
                if (this.a[i] === o) {
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
    var p = arguments[0];
    var o = arguments[0];
    var b = arguments[1];
    var i = 0;
    if (!isNaN(b) && (b < 0 || b > this.a.length)) {
        throw 'index was out of range';
    } else {
        b = 0;
    }
    if (b < this.a.length) {
        if (typeof p === 'function') {
            for (i = this.a.length - 1; i >= b; i--) {
                if (p(this.a[i], i)) {
                    return i;
                }
            }
        } else if (o !== undefined && o !== null) {
            for (i = this.a.length - 1; i >= b; i--) {
                if (this.a[i] === o) {
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
    if (this.a.length === 0) {
        return null;
    } else if (arguments[0] === undefined || arguments[0] === null) {
        return this.a[0];
    }
    var i = this.indexOf(arguments[0]);
    if (i >= 0) {
        return this.a[i];
    } else {
        return null;
    }
};

Enumerable.prototype.first = function () {
    if (this.a.length === 0) {
        throw 'array was empty';
    }
    var i = this.indexOf(arguments[0]);
    if (i >= 0) {
        return this.a[i];
    } else {
        throw 'no element was matched';
    }
};

Enumerable.prototype.lastOrNull = function () {
    if (this.a.length === 0) {
        return null;
    } else if (arguments[0] === undefined || arguments[0] === null) {
        return this.a[this.a.length - 1];
    }
    var i = this.lastIndexOf(arguments[0]);
    if (i >= 0) {
        return this.a[i];
    } else {
        return null;
    }
};

Enumerable.prototype.last = function () {
    if (this.a.length === 0) {
        throw 'array was empty';
    }
    var i = this.lastIndexOf(arguments[0]);
    if (i >= 0) {
        return this.a[i];
    } else {
        throw 'no element was matched';
    }
};

Enumerable.prototype.singleOrNull = function () {
    if (this.a.length === 0) {
        return null;
    }
    var i = this.indexOf(arguments[0]);
    if (i >= 0 && i === this.lastIndexOf(arguments[0])) {
        return this.a[i];
    } else {
        return null;
    }
};

Enumerable.prototype.single = function () {
    if (this.a.length === 0) {
        throw 'array was empty';
    }
    var i = this.indexOf(arguments[0]);
    if (i >= 0) {
        if (i === this.lastIndexOf(arguments[0])) {
            return this.a[i];
        } else {
            throw 'more than one element was matched';
        }
    } else {
        throw 'no element was matched';
    }
};

Enumerable.prototype.distinct = function () {
    var p = arguments[0];
    var n = arguments[0];
    var h = {};
    var z = [];
    var x = false;
    if (typeof n === 'string' && n.length > 0) {
        p = function (x, i) { return x[n]; };
    } else if (typeof p !== 'function') {
        p = function (x) { return x; };
    }
    for (var i = 0; i < this.a.length; i++) {
        if (this.a[i] === undefined || this.a[i] === null) {
            if (!x) {
                z.push(null);
            }
            x = true;
        } else if (!h['_' + p(this.a[i], i).toString()]) {
            h['_' + p(this.a[i], i).toString()] = true;
            z.push(this.a[i]);
        }
    }
    return new Enumerable(z);
};

Enumerable.prototype.add = function () {
    if (arguments[1] === undefined) {
        this.a = this.toImmutableArray().push(arguments[0]);
        return this;
    } else {
        return this.addRange([arguments[0]], arguments[1]);
    }
};

Enumerable.prototype.addRange = function () {
    var e = new Enumerable(arguments[0]);
    var i = arguments[1];
    if (i !== undefined && isNaN(i) || i < 0 || i > this.a.length) {
        throw 'index was out of range';
    }
    var z = this.toImmutableArray();
    if (i === undefined) {
        z = z.concat(e.a);
    } else if (e.a.length === 1) {
        z.splice(i, 0, e.a[0]);
    } else if (e.a.length > 0) {
        for (var j = 0; j < e.a.length; j++) {
            z.splice(i + j, 0, e.a[j]);
        }
    }
    this.a = z;
    return this;
};

Enumerable.prototype.remove = function () {
    var p = arguments[0];
    var o = arguments[0];
    var b = arguments[1];
    var i = -1;
    if (typeof p === 'function') {
        i = this.indexOf(p);
    } else if (o !== undefined) {
        i = this.indexOf(o);
    } else {
        throw 'input was not valid';
    }
    if (i === -1 || !isNaN(b) && i > b) {
        return this;
    } else {
        return this.removeAt(i);
    }
};

Enumerable.prototype.removeAt = function () {
    var i = arguments[0];
    if (i === undefined || i === null || i < 0 || i > this.a.length) {
        throw 'index was out of range';
    } else {
        this.a = this.toImmutableArray().splice(i, 1);
        return this;
    }
};

Enumerable.prototype.removeRange = function () {
    var e = new Enumerable(arguments[0]);
    for (var i = 0; i < e.a.length; i++) {
        this.remove(e.a[i]);
    }
    return this;
};

Enumerable.prototype.union = function () {
    var e = new Enumerable(arguments[0]);
    var z = this.toImmutableArray();
    for (var i = 0; i < e.a.length; i++) {
        if (!this.contains(e.a[i])) {
            z.push(e.a[i]);
        }
    }
    return new Enumerable(z);
};

Enumerable.prototype.intersect = function () {
    var e = new Enumerable(arguments[0]);
    var z = [];
    for (var i = 0; i < e.a.length; i++) {
        if (this.contains(e.a[i])) {
            z.push(e.a[i]);
        }
    }
    return new Enumerable(z);
};

Enumerable.prototype.difference = function () {
    var e = new Enumerable(arguments[0]);
    var j;
    var z = this.toImmutableArray();
    for (var i = 0; i < e.a.length; i++) {
        j = this.indexOf(e.a[i]);
        if (j >= 0) {
            z.splice(j, 1);
        }
    }
    return new Enumerable(z);
};

Enumerable.prototype.reverse = function () {
    return new Enumerable(this.toImmutableArray().reverse());
};

Enumerable.prototype.sort = function () {
    return this.orderBy();
};

Enumerable.prototype.orderBy = function () {
    var p = arguments[0];
    var n = arguments[0];
    if (p !== undefined && p !== null) {
        var z = null;
        if (typeof p === 'function') {
            z = this.select(function (x, i) { return { i: i, v: x, r: p(x, i) }; });
        } else if (typeof n === 'string') {
            if (n.length === 0) {
                throw 'name was empty';
            }
            z = this.select(function (x, i) { return { i: i, v: x, r: x[n] }; });
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
    var p = arguments[0];
    var n = arguments[0];
    var h = {};
    var z = [];
    if (p !== undefined && p !== null) {
        if (typeof n === 'string') {
            if (n.length === 0) {
                throw 'name was empty';
            } else {
                p = function (x) { return x[n]; };
            }
        }
        if (typeof p === 'function') {
            for (var i = 0; i < this.a.length; i++) {
                var g = '_' + p(this.a[i], i).toString();
                if (h[g] === undefined) {
                    h[g] = z.length;
                    z[h[g]].push({ name: g, value: new Enumerable() });
                }
                z[h[g]].value.add(this.a[i]);
            }
        } else {
            throw 'input was not valid';
        }
    } else {
        throw 'input was not valid';
    }
    return new Enumerable(z);
};

Enumerable.prototype.joinBy = function () {
    var p = arguments[0];
    var n = arguments[0];
    var e = new Enumerable(arguments[1]);
    var r = arguments[2];
    var i;
    var m;
    var t;
    if (this.any(function (o) { return typeof o !== 'object'; }) || e.any(function (o) { return typeof o !== 'object'; })) {
        throw 'one or more element was not an object';
    }
    if (typeof n === 'string') {
        if (n.length === 0) {
            throw 'name was empty';
        }
        p = function (o) { return o[n] === e.a[n]; };
    }
    if (typeof p === 'function') {
        if (r === true) {
            for (i = 0; i < this.a.length; i++) {
                t = e.firstOrNull(p(this.a[i]));
                if (t !== null) {
                    for (m in t) {
                        this.a[i][m] = t[m];
                    }
                }
            }
        } else {
            for (i = 0; i < this.a.length; i++) {
                t = e.firstOrNull(p(this.a[i]));
                if (t !== null) {
                    for (m in t) {
                        if (this.a[i][m] === undefined) {
                            this.a[i][m] = t[m];
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
    var p = arguments[0];
    var o = arguments[0];
    var i = 0;
    var z = 0;
    if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            if (p(this.a[i], i)) {
                z += 1;
            }
        }
    } else if (o !== undefined) {
        for (i = 0; i < this.a.length; i++) {
            if (this.a[i] === o) {
                z += 1;
            }
        }
    } else {
        z = this.a.length;
    }
    return z;
};

Enumerable.prototype.min = function () {
    var p = arguments[0];
    var n = arguments[0];
    var i = 0;
    var t;
    var z = Number.MAX_VALUE;
    if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            t = p(this.a[i], i);
            if (!isNaN(t) && isFinite(t) && t < z) {
                z = t;
            }
        }
    } else if (typeof n === 'string') {
        if (n.length === 0) {
            throw 'name was empty';
        }
        for (i = 0; i < this.a.length; i++) {
            t = this.a[i][n];
            if (!isNaN(t) && isFinite(t) && t < z) {
                z = t;
            }
        }
    } else {
        for (i = 0; i < this.a.length; i++) {
            if (!isNaN(this.a[i]) && isFinite(this.a[i]) && this.a[i] < z) {
                z = this.a[i];
            }
        }
    }
    return z;
};

Enumerable.prototype.max = function () {
    var p = arguments[0];
    var n = arguments[0];
    var i = 0;
    var t;
    var z = Number.MIN_VALUE;
    if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            t = p(this.a[i], i);
            if (!isNaN(t) && isFinite(t) && t > z) {
                z = t;
            }
        }
    } else if (typeof n === 'string') {
        if (n.length === 0) {
            throw 'name was empty';
        }
        for (i = 0; i < this.a.length; i++) {
            t = this.a[i][n];
            if (!isNaN(t) && isFinite(t) && t > z) {
                z = t;
            }
        }
    } else {
        for (i = 0; i < this.a.length; i++) {
            if (!isNaN(this.a[i]) && isFinite(this.a[i]) && this.a[i] > z) {
                z = this.a[i];
            }
        }
    }
    return z;
};

Enumerable.prototype.mid = function () {
    return this.a[Math.floor(this.a.length / 2)];
};

Enumerable.prototype.sum = function () {
    var p = arguments[0];
    var n = arguments[0];
    var i = 0;
    var t;
    var z = 0;
    if (typeof p === 'function') {
        for (i = 0; i < this.a.length; i++) {
            t = p(this.a[i], i);
            if (!isNaN(t) && isFinite(t)) {
                z += t;
            }
        }
    } else if (typeof n === 'string') {
        if (n.length === 0) {
            throw 'name was empty';
        }
        for (i = 0; i < this.a.length; i++) {
            t = this.a[i][n];
            if (!isNaN(t) && isFinite(t)) {
                z += t;
            }
        }
    } else {
        for (i = 0; i < this.a.length; i++) {
            if (!isNaN(this.a[i]) && isFinite(this.a[i])) {
                z += this.a[i];
            }
        }
    }
    return z;
};

Enumerable.prototype.average = function () {
    return this.sum(arguments[0]) / this.a.length;
};

Enumerable.prototype.interpolate = function () {
    var t = arguments[0];
    var h = [];
    var i = 0;
    var j;
    var k;
    var z = new Array(this.a.length);
    if (this.all(function (o) { return typeof o !== 'object'; })) {
        throw 'one or more element was not an object';
    }
    if (typeof t === 'string') {
        while (i < t.length) {
            j = t.indexOf('<%=', i);
            if (j >= 0) {
                h.push(t.substring(i, j));
                k = t.indexOf('%>', j);
                if (k === -1) {
                    throw 'template was not valid';
                }
                h.push({ n: t.substring(j + 3, k).trim() });
                i = k + 2;
            } else {
                h.push(t.substring(i));
                i = t.length;
            }
        }
        for (i = 0; i < this.a.length; i++) {
            z[i] = '';
            for (j = 0; j < h.length; j++) {
                if (typeof h[j] === 'string') {
                    z[i] += h[j];
                } else {
                    t = this.a[i][h[j].n];
                    if (t !== undefined && t !== null) {
                        z[i] += t.toString();
                    }
                }
            }
        }
    } else {
        throw 'input was not valid';
    }
    return new Enumerable(z);
};