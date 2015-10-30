**Enumerable** is a JavaScript library that provides useful and handy query functions.

# Constructor

You can use `new` keyword to create an enumerable.

Create a new enumerable with no member.

    new Enumerable();
    // This internally creates []

Create a new enumerable by giving an array.

    new Enumerable([1, 2]);
    // This internally copies [1, 2]

Create an enumerable by giving a plain object or an array-like object. Technically, this will create new array containing `name` and `value` object by default but you can change it by passing additional argument(s) to the constructor.

    new Enumerable({ x: 0, y: true, z: 'www' });
    // This internally creates [{ name: 'x', value: 0 }, { name: 'y', value: true }, { name: 'z', value: 'www' }]
    
    new Enumerable({ 0: 'aaa', 1: 'bbb', length: 2 });
    // This internally creates [{ name: '0', value: 'aaa' }, { name: '1', value: 'bbb' }]
    
    new Enumerable({ 0: 'aaa', 1: 'bbb', length: 2 }, 'myName');
    // This internally creates [{ myName: '0', value: 'aaa' }, { myName: '1', value: 'bbb' }]
    
    new Enumerable({ 0: 'aaa', 1: 'bbb', length: 2 }, 'myName', 'myValue');
    // This internally creates [{ myName: '0', myValue: 'aaa' }, { myName: '1', myValue: 'bbb' }]

By putting `true` as the last argument to include all functions and private properties as well.

    new Enumerable({ _p: true, f: function () { }, 0: 'aaa', length: 1 });
    // This internally creates [{ name: '0', value: 'aaa' }]

    new Enumerable({ _p: true, f: function () { }, 0: 'aaa', length: 1 }, true);
    // This internally creates [{ name: '_p', value: true }, { name: 'f', value: function () { } }, { name: '0', value: 'aaa' }]

Create a new enumerable by giving a string and an optional separator.

    new Enumerable('a book');
    // This internally creates ['a', ' ', 'b', 'o', 'o', 'k']
    
    new Enumerable('a book', ' ');
    // This internally creates ['a', 'book']
    
    new Enumerable('a book, a duck', /\, | |\,/g);
    // This internally creates ['a', 'book', 'a', 'duck']

Create a new enumerable by specify a length and a value for all members.

    new Enumerable(3, null);
    // This internally creates [null, null, null]
    
    new Enumerable(5, false);
    // This internally creates [false, false, false, false, false]

Keep in mind that the constructor does not accept `undefined` and `null`.

    new Enumerable(undefined);
    // This throws an exception
    
    new Enumerable(null);
    // This throws an exception

Set the context of function for further use by putting a context object as the last argument.

    new Enumerable([1, 2, 3], this);
    new Enumerable({ x: 0, y: true, z: 'www' }, this);
    new Enumerable({ 0: 'aaa', 1: 'bbb', length: 2 }, this);
    new Enumerable('a book', ' ', this);

---

# Methods

## toArray()

**Returns** an array of the current enumerable.

    new Enumerable([1, 2, 3]).toArray();
    // This returns [1, 2, 3]
    
    var e = new Enumerable([4, 5, 6]);
    var a = e.toArray();
    
    a.pop();
    // This returns 6
    
    e.toArray();
    // This returns [4, 5]
    
    console.log(a === e.toArray()); // true

## toImmutableArray()

**Returns** a copy of an array of the current enumerable.

    var a = [1, 2, 3];
    var e = new Enumerable(a);
    e.toImmutableArray();
    // This returns [1, 2, 3]
    
    console.log(a === e.toArray()) // true
    console.log(a === e.toImmutableArray()) // true

## toString()

**Returns** a string by concatenating all members. This assumes all members are string.

**Accepts**  
`()`. This uses empty string as a separator.  
`(string)` as a separator.

**Throws**  
one or more parameters were not valid.

    new Enumerable(['La', 'Da' 'Dee']).toString();
    // This returns 'LaDaDee'
    
    new Enumerable(['La', 'Da' 'Dee']).toString('-');
    // This returns 'La-Da-Dee'

## toObject()

**Returns** an object by constructing properties from all members.

**Accepts**  
`()`. This uses index as a name of property.  
`(string)` as a name projector.  
`(string, string)` as a name projector and a value projector respectively.  
`(function)` as a name generator.  
`(function, function)` as a name generator and a value projector respectively.  
`(string, function)` as a name projector and a value generator respectively.  
`(function, string)` as a name generator and a value projector respectively.

**Throws**  
one or more parameters were not valid.

    new Enumerable(['a', 'book']).toObject();
    // This returns { "a": 'a', "book": 'book' }
    
    new Enumerable(['a', 'book']).toObject('length');
    // This returns { "1": 'a', "4": 'book' }
    
    new Enumerable(['a', 'book']).toObject('length', 'length');
    // This returns { "1": 1, "4": 4 }
    
    new Enumerable(['a', 'book']).toObject(function (x) { return x.length; });
    // This returns { "1": 'a', "4": 'book' }
    
    new Enumerable(['a', 'book']).toObject(function (x) { return x.length; }, function (x) { return x.toUpperCase(); });
    // This returns { "1": 'A', "4": 'BOOK' }

## toTable()

**Returns** the new enumerable that creates object(s) by using the given argument as the name list and the current enumerable as the value list. The current enumerable must be an _array of array(s)_.

**Accepts**  
`(array of string)` as a name list.

**Throws**  
one or more parameters were not valid.

    new Enumerable([[1, 2], [3, 4]]).toTable(['a', 'b']).toArray();
    // This returns [{ a: 1, b: 4 }, { a: 3, b: 4 }]

## peekAt()

**Returns** a member at specified index.

**Accepts**  
`(number)` as a zero-based index.

**Throws**  
an index was out of range.  
one or more parameters were not valid.

    new Enumerable(['La', 'Da', 'Dee']).peekAt(1);
    // This returns 'Da'

## clone()

**Returns** a copy of the current enumerable and also pass the content to the clone.

**Accepts** no parameter.

    var e = new Enumerable([1, 2, 3]);
    var z = e.clone();
    
    z.toArray();
    // This returns [1, 2, 3]
    
    console.log(e === z) // false
    console.log(e.toArray() === z.toArray()) // false

## where()

**Returns** the new enumerable where all members match the specified constraint.

**Accepts**  
`(function)` as a boolean generator.  
`(object)` as a property projector.  
`(string, anything)` as a name projector and value respectively.

**Throws**  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).where(function (x, i) { return x >= 2; }).toArray();
    // This returns [2, 3]
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).where({ job: 'Singer' }).toArray();
    // This returns [{ name: 'Bob', job: 'Singer' }, { name: 'Max', job: 'Singer' }]
    
    new Enumerable(([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).where('job', 'Singer').toArray();
    // This returns [{ name: 'Bob', job: 'Singer' }, { name: 'Max', job: 'Singer' }]

## select()

**Sees**  
selectAll(), in case of passing only one parameter.  
selectAny(), in case of passing two or more parameters.

## selectAll()

**Returns** the new enumerable that has all members manipulated.

**Accepts**  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
a name projector was empty.  
one or more parameters were not valid.

    new Enumerable(['Bob', 'Jeremy', 'Maximilian']).selectAll('length').toArray();
    // This returns [3, 6, 10]
    
    new Enumerable([1, 2, 3]).selectAll(function (x, i) { return x + i; }).toArray();
    // This returns [1, 3, 5]

## selectAny()

**Returns** the new enumerable that has zero or more members manipulated.

**Accepts**  
`(function, function)` as a boolean generator and a value generator respectively.  
`(function, string)` as a boolean generator and a name projector respectively.  
`(object, function)` as a property projector and a value generator respectively.  
`(object, string)` as a property projector and a name projector respectively.  
`(string, anything, function)` as a name projector, a target value and a value generator respectively.  
`(string, anything, string)` as a name projector, a target value and a name projector for value generation respectively.

**Throws**  
a name projector was empty.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).selectAny(function (x, i) { return x > 2; }, function (x, i) { return x + i; }).toArray();
    // This returns [5] because of 3 + 2

    new Enumerable(['Bob', 'Jeremy', 'Maximilian']).selectAny(function (x, i) { return x.indexOf('M') === 0; }, 'length').toArray();
    // This returns [10]
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).selectAny({ job: 'Singer' }, function (x, i) { return x.name; }).toArray();
    // This returns ['Bob', 'Max']
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).selectAny({ job: 'Singer' }, 'name').toArray();
    // This returns ['Bob', 'Max']
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).selectAny('job', 'Singer', function (x, i) { return x.name; }).toArray();
    // This returns ['Bob', 'Max']
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).selectAny('job', 'Singer', 'name').toArray();
    // This returns ['Bob', 'Max']

## invoke()

**Returns** the current enumerable and iterates on it.

**Accepts**  
`(function)` as an iterator.  
`(number, function)` as a zero-based start index and an iterator.  
`(number, number, function)` as a zero-based start index, a zero-based stop index and an iterator.  
`(number, number, number, function)` as a zero-based start index, a zero-based stop index, a number of step and an iterator.

**Throws**  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).invoke(function (x) { console.log(x); });
    // This prints:
    // 1
    // 2
    // 3
    
    new Enumerable([1, 2, 3]).invoke(2, 0, -2, function (x) { console.log(x); });
    // This prints:
    // 3
    // 1

## invokeWhile()

**Returns** the current enumberable and iterates on it indefinitely until a given iterator returns `false` explicitly.

**Accepts**  
`(function)` as an iterator.

**Throws**  
one or more parameters were not valid.

    var a = 0;
    new Enumerable([1, 2, 3]).invokeWhile(function (x) { console.log(x); a += x; return a < 9; });
    // This prints:
    // 1
    // 2
    // 3
    // 1
    // 2
    // The value of a after the invocation is 9

## invokeUntil()

**Returns** the current enumberable and iterates on it indefinitely until a given iterator returns `true` explicitly.

**Sees**  
invokeWhile()

## invokeAsync()

**Returns** the current enumerable and iterates on it asynchronously.

**Accepts**  
`(function)` as an iterator.  
`(number, function)` as a zero-based start index and an iterator.  
`(number, number, function)` as a zero-based start index, a zero-based stop index and an iterator.  
`(number, number, number, function)` as a zero-based start index, a zero-based stop index, a step and an iterator.  
`(number, number, number, function, number)` as a zero-based start index, a zero-based stop index, a number of step, an iterator and a number of batch.

**Throws**  
one or more parameters were not valid.

    console.log(new Enumerable([1, 2, 3]).invokeAsync(function (x) { console.log(x); }).toArray());
    // This prints
    // 1
    // [1, 2, 3]
    // 2
    // 3
    
    console.log(new Enumerable([1, 2, 3]).invokeAsync(2, 0, -2, function (x) { console.log(x); }).toArray());
    // This prints
    // 3
    // [1, 2, 3]
    // 1
    
    console.log(new Enumerable([1, 2, 3]).invokeAsync(function (x) { console.log(x); }, 2).toArray());
    // This prints
    // 3
    // 1
    // [1, 2, 3]

**Notes** this function is very useful for non-blocking thread purposes.

## invokeWhich()

**Returns** the current enumerable and iterates on the given group. This function must be used after `groupBy`.

**Accepts**  
`(anything, function)` as a target value and an iterator.

**Throws**  
a call was not valid.  
one or more parameters were not valid.

    new Enumerable(['Tom', 'Tommy', 'Bob', 'Bobby']).groupBy('length').invokeWhich(3, function (name) { console.log(name); });
    // This prints:
    // Tom
    // Bob

**Sees**  
groupBy()

## take()

**Returns** the new enumerable with all or some of members. Always iterate on members from minimum index to maximum index. Just like `where()` but `take()` will stop iteration as soon as the constraint is false-like.

**Accepts**  
`(function)` as a boolean generator.  
`(number)` as a number of taken member starting from the leftmost.  
`(number, number)` as a start zero-based index and a stop zero-based index of taken member respectively. This is just like `String.substring()`.

**Throws**  
a start index was out of range.  
a stop index was out of range.  
a start index was greater than stop index.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).take(function (x, i) { return x <= 2; }).toArray();
    // This returns [1, 2]
    
    new Enumerable([1, 2, 3]).take(function (x, i) { return x >= 2; }).toArray();
    // This returns []
    
    new Enumerable([1, 2, 3]).take(2).toArray();
    // This returns [1, 2]
    
    new Enumerable([1, 2, 3]).take(Infinity).toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([1, 2, 3]).take(2, 3).toArray();
    // This returns [3]

## skip()

**Returns** the new enumerable with all or some of members. This is just like `take()` but the other way around.

**Accepts**  
`(function)` as a boolean generator.  
`(number)` as a number of skipped member starting from the leftmost.  
`(number, number)` as a start zero-based index and a stop zero-based index of skipped member respectively.

**Throws**  
a start index was out of range.  
a stop index was out of range.  
a start index was greater than stop index.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).skip(function (x, i) { return x <= 2; }).toArray();
    // This returns [3]
    
    new Enumerable([1, 2, 3]).skip(function (x, i) { return x >= 2; }).toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([1, 2, 3]).skip(2).toArray();
    // This returns [3]
    
    new Enumerable([1, 2, 3]).skip(Infinity).toArray();
    // This returns []
    
    new Enumerable([1, 2, 3]).skip(2, 3).toArray();
    // This returns [1, 2]

## flatten()

**Returns** the new enumerable that contains members of arrays inside the current enumerable.

**Accepts**  
`()`. This performs a _shallow_ operation.  
`(boolean)` as a shallow/deep operation flag. `true`-like for _deep_ operation. Otherwise, _shallow_ operation.

    new Enumerable([[1, 2], [3], [4, [5]]).flatten().toArray();
    // This returns [1, 2, 3, 4, [5]]
    
    new Enumerable([[1, 2], [3], [4, [5]]).flatten(false).toArray();
    // This returns [1, 2, 3, 4, [5]]
    
    new Enumerable([[1, 2], [3], [4, [5]]).flatten(true).toArray();
    // This returns [1, 2, 3, 4, 5]

## any()

**Returns** `true` if and only if one or more members are match the constraint. Otherwise, `false`.

**Accepts**  
`()`. This will return `true` if there are one or more members inside the current enumerable. Otherwise, `false`.  
`(function)` as a boolean generator.  
`(anything)` as a target member.  
`(string, anything) as a name projector and a target value.

    new Enumerable().any();
    // This returns false
    
    new Enumerable([1, 2, 3]).any();
    // This returns true
    
    new Enumerable([1, 2, 3]).any(function (x, i) { return x > 2; });
    // This returns true
    
    new Enumerable([1, 2, 3]).any(4);
    // This returns false
    
    new Enumerable([1, 2, 3]).any(3);
    // This returns true
    
    new Enumerable([{ name: 'Tony' }, { name: 'Alex' }, { name: 'Josh' }]).any('name', 'Kris');
    // This returns false

    new Enumerable([{ name: 'Tony' }, { name: 'Alex' }, { name: 'Josh' }]).any('name', 'Alex');
    // This returns true

## all()

**Returns** `true` if and only if all members are match the constraint. Otherwise, `false`.

**Accepts**  
`(function)` as a boolean generator.  
`(anything)` as a target member.  
`(string, anything) as a name projector and a target value.

**Throws**  
one or more parameters were not valid

    new Enumerable([1, 2, 3]).all(function (x, i) { return typeof x === 'number'; });
    // This returns true
    
    new Enumerable([1, 2, 3]).all(2);
    // This returns false
    
    new Enumerable([2, 2, 2]).all(2);
    // This returns true

    new Enumerable([{ name: 'Tony' }, { name: 'Alex' }, { name: 'Josh' }]).all('name', 'Alex');
    // This returns false

    new Enumerable([{ name: 'Alex' }, { name: 'Alex' }, { name: 'Alex' }]).all('name', 'Alex');
    // This returns true

## subsetOf()

**Returns** `true` if and only if specified argument is a subset of current enumerable. Otherwise, `false`.

**Accepts**  
`(array-like)` as a target members.

    new Enumerable([1, 2]).subsetOf([1, 2, 3]);
    // This returns true

    new Enumerable([1, 2]).subsetOf([1, 2]);
    // This returns true

    new Enumerable([1, 2]).subsetOf([1, 4]);
    // This returns false

    new Enumerable([1, 2]).subsetOf([1]);
    // This returns false

    new Enumerable([]).subsetOf([1, 2, 3]);
    // This returns true

## equivalentTo()

**Returns** `true` if and only if specified argument have the same member as current enumerable. Otherwise, `false`.

**Accepts**  
`(array-like)` as a target members.  
`(array-like, function)` as a target members and an equality boolean generator.

**Throws**  
one or more parameters were not valid

    new Enumerable([1, 2, 3]).equivalentTo([1, 3]);
    // This returns false
    
    new Enumerable([1, 2, 3]).equivalentTo([1, 2, 3]);
    // This returns true
    
    new Enumerable([1, 2, 3]).equivalentTo([3, 1, 2]);
    // This returns true
    
    new Enumerable([1, 2, 3]).equivalentTo([2, 4, 6], function (x, y) { return x * 2 === y; });
    // This returns true

## indexOf()

**Returns** a zero-based index of a matched member. Iterates from minimum index to maximum index. Returns -1 if there is not matched member.

**Accepts**  
`(function)` as a boolean generator.  
`(function, number)` as a boolean generator and a start zero-based index.  
`(anything)` as a target member.  
`(anything, number)` as a target member and a start zero-based index.

**Throws**  
an index was out of range  
one or more parameters were not valid

    new Enumerable([1, 2, 3]).indexOf(function (x, i) { return x === 2; });
    // This returns 1
    
    new Enumerable([1, 2, 3]).indexOf(function (x, i) { return x === 2; }, 2);
    // This returns -1

## lastIndexOf()

**Returns** a zero-based index of a matched member. Iterates from maximum index to minimum index. Returns -1 if there is not matched member.

**Accepts**  
`(function)` as a boolean generator.  
`(function, number)` as a boolean generator and a start zero-based index. This start index is _different_ from `String.lastIndexOf()`.  
`(anything)` as a target member.  
`(anything, number)` as a target member and a start zero-based index. This start index is _different_ from `String.lastIndexOf()`.

**Throws**  
an index was out of range.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).lastIndexOf(function (x, i) { return x === 2; });
    // This returns 1
    
    new Enumerable([1, 2, 3]).lastIndexOf(function (x, i) { return x === 2; }, 2);
    // This returns 1

## contains()

**Returns** `true` if and only if found one or more specified member. Otherwise, `false`.

## find()

**Returns** a matched member or `null`. Just like `where()` but this will always return a member or null, not an enumerable. This is very similar to `firstOrNull()` but it just accepts different pattern of parameters.

**Accepts**  
`(string, anything)` as a name projector and a target value.

**Throws**  
one or more parameters were not valid.

    new Enumerable(['Bob', 'Jeremy', 'Maximilian']).find('length', 5);
    // This returns 'Jeremy'
    
    new Enumerable(['Bob', 'Jeremy', 'Maximilian']).find('length', 7);
    // This returns null

## first()

**Returns** a matched member or throw an exception. Iterates from minimum index to maximum index. If an enumerable has no member or cannot find any matched member, throw an exception.

**Accepts**  
`()`.  
`(function)` as a boolean generator.  
`(function, number)` as a boolean generator and a start zero-based index.

**Throws**  
an array was empty  
no element was matched  
one or more parameters were not valid

    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).first(function (x, i) { return x.job === 'Singer'; });
    // This returns { name: 'Bob', job: 'Singer' }
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).first(function (x, i) { return x.job === 'Dancer'; });
    // This throw an exception

## firstOrNull()

Just like `first()` but will return `null` instead of throwing an exception.

    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).firstOrNull(function (x, i) { return x.job === 'Singer'; });
    // This returns { name: 'Bob', job: 'Singer' }
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).firstOrNull(function (x, i) { return x.job === 'Dancer'; });
    // This returns null

## last()

Just like `first()` but iterate from the rightmost index to the zeroth index.

    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).last(function (x, i) { return x.job === 'Singer'; });
    // This returns { name: 'Max', job: 'Singer' }
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).last(function (x, i) { return x.job === 'Dancer'; });
    // This throw an exception

## lastOrNull()

Just like `firstOrNull()` but iterate from rightmost index to the zeroth index.

    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).lastOrNull(function (x, i) { return x.job === 'Singer'; });
    // This returns { name: 'Max', job: 'Singer' }
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).lastOrNull(function (x, i) { return x.job === 'Dancer'; });
    // This returns null

## single()

Just like `first()` but will throw an exception if and only if found more than one matched member.

**Throws**  
an array was empty  
an array was contained more than one element  
no element was matched  
more than one element were matched  
one or more parameters were not valid

    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).single(function (x, i) { return x.job === 'Singer'; });
    // This throw an exception
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).single(function (x, i) { return x.job === 'Composer'; });
    // This return { name: 'Jim', job: 'Composer' }
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).single(function (x, i) { return x.job === 'Dancer'; });
    // This throw an exception

## singleOrNull()

Just like `first()` but will return `null` if and only if found more than one matched member.

**Throws**  
one or more parameters were not valid

    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).singleOrNull(function (x, i) { return x.job === 'Singer'; });
    // This returns null
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).singleOrNull(function (x, i) { return x.job === 'Composer'; });
    // This return { name: 'Jim', job: 'Composer' }
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).singleOrNull(function (x, i) { return x.job === 'Dancer'; });
    // This returns null

## distinct()

**Returns** the new enumerable that an individual member appears only once. `undefined` and `null` will be treated the same way.

**Accepts**  
`()`.  
`(string)` as a name projector.  
`(function)` as a name generator.

**Throws**  
one or more parameters were not valid

    new Enumerable([1, 2, 2, 1, 3, 2]).distinct().toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).distinct('job').toArray();
    // This returns [{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }]
    
    new Enumerable([{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }, { name: 'Max', job: 'Singer' }]).distinct(function (x, i) { return x.job; }).toArray();
    // This returns [{ name: 'Bob', job: 'Singer' }, { name: 'Jim', job: 'Composer' }]

## replace()

**Returns** a new enumerable that zero or more members are replaced with a specified member for a specified time.

**Accepts**  
`(anything, anything)` as a target member and a replacement.  
`(function, anything)` as a value generator and a replacement.  
`(anything, anything, number)` as a target member, a replacement and a number of replacing operation.  
`(function, anything, number)` as a value generator, a replacement and a number of replacing operation.

**Throws**  
one or more parameters were not valid

    new Enumerable([1, 2, 2, 1, 3, 2]).replace(2, 4).toArray();
    // This returns [1, 4, 4, 1, 3, 4]
    
    new Enumerable([1, 2, 2, 1, 3, 2]).replace(2, 4, 1).toArray();
    // This returns [1, 4, 2, 1, 3, 2]

## replaceAt()

**Returns** a new enumerable that a member is replaced with a specified member at a specified index.

**Accepts**  
`(number, anything)` as a zero-based index and a replacement.

**Throws**  
an index was out of range  
one or more parameters were not valid

    new Enumerable([1, 2, 3]).replaceAt(1, 4).toArray();
    // This returns [1, 4, 3]

## add()

**Returns** the current enumerable that has a member added.

**Accepts**  
`(anything)` as an adding member.  
`(anything, number)` as an adding member and its zero-based index.

**Throws**  
an index was out of range

    new Enumerable([1, 2, 3]).add(4).toArray();
    // This returns [1, 2, 3, 4]
    
    new Enumerable([1, 2, 3]).add(4, 0).toArray();
    // This returns [4, 1, 2, 3]
    
    new Enumerable([1, 2, 3]).add(4, 4).toArray();
    // This throw an exception

## addRange()

**Returns** the current enumerable that has one or more members added.

**Accepts**  
`(array-like)` as adding members.  
`(array-like, number)` as adding members and a start zero-based index.

**Throws**  
an index was out of range

    new Enumerable([1, 2, 3]).addRange([4, 5]).toArray();
    // This returns [1, 2, 3, 4, 5]
    
    new Enumerable([1, 2, 3]).add([4, 5], 0).toArray();
    // This returns [4, 5, 1, 2, 3]
    
    new Enumerable([1, 2, 3]).add([4, 5] 4).toArray();
    // This throw an exception
    
    new Enumerable([1, 2, 3]).add(6).toArray();
    // This throw an exception

## remove()

**Returns** the current enumerable that has zero or one member removed.

**Accepts**  
`(anything)` as a removing member.
`(anything, number)` as a removing member and a start zero-based index.

**Throws**  
one or more parameters were not valid

    new Enumerable([1, 2, 3]).remove(1).toArray();
    // This returns [2, 3]
    
    new Enumerable([1, 2, 3]).remove(4).toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([1, 2, 3, 2]).remove(2, 3).toArray();
    // This returns [1, 3, 2]

## removeAt()

**Returns** the current enumerable that has a member at specified index removed.

**Accepts**  
`(number)` as a zero-based index.

**Throws**  
an index was out of range
one or more parameters were not valid

    new Enumerable([1, 2, 3]).removeAt(1).toArray();
    // This returns [1, 3]

## removeRange()

**Returns** the current enumerable that has zero or more members which present in specified array-like removed.

**Accepts**  
`(array-like)` as removing members.

**Throws**  
a parameter was not enumerable

    new Enumerable([1, 2, 3]).removeRange([1]).toArray();
    // This returns [2, 3]
    
    new Enumerable([1, 2, 3]).removeRange([4]).toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([1, 2, 3, 2]).removeRange([2, 3]).toArray();
    // This returns [1, 2]

## removeAll()

**Returns** the current enumerable that has zero or more members removed. If you pass nothing, this will clear up all member inside the current enumerable.

**Accepts**  
`()`.  
`(anything)` as a removing member.

**Throws**  
one or more parameters were not valid

    new Enumerable([1, 2, 3]).removeAll().toArray();
    // This returns []
    
    new Enumerable([1, 2, 3, 2]).removeAll(2).toArray();
    // This returns [1, 3]

## union()

**Returns** the new enumerable that has no duplicated with the members inside the specified array-like.

**Accepts**  
`(array-like)`.

**Throws**  
a parameter was not enumerable

    new Enumerable([1, 2, 3]).union([1]).toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([1, 2, 3]).union([4]).toArray();
    // This returns [1, 2, 3, 4]
    
    new Enumerable([1, 2, 3]).union([3, 4]).toArray();
    // This returns [1, 2, 3, 4]

## intersect()

**Returns** the new enumerable that has only members which present in the current enumerable and the specified array-like.

**Accepts**  
`(array-like)`.

**Throws**  
a parameter was not enumerable

    new Enumerable([1, 2, 3]).intersect([1]).toArray();
    // This returns [1]
    
    new Enumerable([1, 2, 3]).intersect([4]).toArray();
    // This returns []
    
    new Enumerable([1, 2, 3]).intersect([3, 4]).toArray();
    // This returns [3]

## difference()

**Returns** the new enumerable that has only members which present in the current enumerable but the specified array-like.

**Accepts**  
`(array-like)`.

**Throws**  
a parameter was not enumerable

    new Enumerable([1, 2, 3]).difference([1]).toArray();
    // This returns [2, 3]
    
    new Enumerable([1, 2, 3]).difference([4]).toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([1, 2, 3]).difference([3, 4]).toArray();
    // This returns [1, 2]

## reverse()

**Returns** the new enumerable that has members in reversed order.

**Accepts**  
`()`.

    new Enumerable([1, 2, 3]).reverse().toArray();
    // This returns [3, 2, 1]

## sort()

**Returns** the new enumerable that has members sorted by natural order.

**Accepts**  
`()`.

**Throws**  
one or more parameters were not valid

    new Enumerable([3, 1, 2]).sort().toArray();
    // This returns [1, 2, 3]

## sortBy()

**Returns** the new enumerable that has only members which present in the current enumerable but the specified array-like.

**Accepts**  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
a name projector was empty  
one or more parameters were not valid

    new Enumerable([3, 1, 2]).sortBy().toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([{ name: 'Tony' }, { name: 'Alex' }, { name: 'Josh' }]).sortBy('name').toArray();
    // This returns [{ name: 'Alex' }, { name: 'Josh' }, { name: 'Tony' }]
    
    new Enumerable([{ name: 'Tony' }, { name: 'Alex' }, { name: 'Josh' }]).sortBy(function (x) { return x.name; }).toArray();
    // This returns [{ name: 'Alex' }, { name: 'Josh' }, { name: 'Tony' }]

## groupOf()

**Returns** the new enumerable of array(s).

**Accepts**  
`(number)` as the maximum number of member per group.

**Throws**  
one or more parameters were not valid

    new Enumerable(['Tom', 'Tommy', 'Bob', 'Bobby', 'Kris']).groupOf(2).toArray();
    // This returns [['Tom', 'Tommy'], ['Bob', 'Bobby'], ['Kris']]

## groupBy()

**Returns** the new enumerable of enumberable(s) which has a special property `name`.

**Accepts**  
`(string)` as a name projector.  
`(function)` as a name generator.

**Throws**  
a name was empty  
one or more parameters were not valid

    new Enumerable(['Tom', 'Tommy', 'Bob', 'Bobby']).groupBy('length').toArray();
    // This returns [new Enumerable(['Tom', 'Bob']), new Enumerable(['Tommy', 'Bobby'])]
    
    new Enumerable(['Tom', 'Tommy', 'Bob', 'Bobby']).groupBy(function (x) { return x.charAt(0); }).toArray();
    // This returns [new Enumerable(['Bob', 'Bobby']), new Enumerable(['Tom', 'Tommy'])]
    
    new Enumerable(['Tom', 'Tommy', 'Bob', 'Bobby']).groupBy(function (x) { return x.charAt(0); }).select('name').toArray();
    // This returns ['B', 'T']

## joinBy()

**Returns** the new enumerable that is created by combining the current enumerable with a specified enumerable. Either the current enumerable or a specified enumerable must have object as members.

**Accepts**  
`(array-like, function)` as another enumerable and a name projector.  
`(array-like, function, boolean)` as another enumerable, a name projector and overwrite flag.

**Throws**  
a name was empty.  
one or more parameters were not valid.

    new Enumerable([{ name: 'Tom' }, { name: 'Bob', age: 25 }]).joinBy([{ name: 'Tom', age: 18 }, { name: 'Bob', age: 26 }], 'name').toArray();
    // This returns [{ name: 'Tom', age: 18 }, { name: 'Bob', age: 25 }]
    
    new Enumerable([{ name: 'Tom' }, { name: 'Bob', age: 25 }]).joinBy([{ name: 'Tom', age: 18 }, { name: 'Bob', age: 26 }], 'name', true).toArray();
    // This returns [{ name: 'Tom', age: 18 }, { name: 'Bob', age: 26 }]

## count()

**Returns** a number of member in the current enumerable.

**Accepts**  
`()`.

**Throws**  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).count();
    // This returns 3

## countBy()

**Returns** a number of member in the current enumerable.

**Accepts**  
`(function)` as a boolean generator.  
`(anything)` as a target value.  
`(string, anything)` as a name projector and a target value.

**Throws**  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).countBy();
    // This returns 3
    
    new Enumerable([1, 2, 3]).countBy(2);
    // This returns 1
        
    new Enumerable([1, 2, 3]).countBy(function (x) { return x === 2; });
    // This returns 1

## min()

**Returns** a member that has minimum value. In case of an empty enumerable, returns `null`.

**Accepts**  
`()`.  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
a name projector was empty.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).min();
    // This returns 1
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).min('tall');
    // This returns { tall: 150 }
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).min(function (x) { return x.tall; });
    // This returns { tall: 150 }

## max()

**Returns** a member that has maximum value. If the current enumerable is empty, this will return `null`.

**Accepts**  
`()`.  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
a name projector was empty.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).max();
    // This returns 3
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).max('tall');
    // This returns { tall: 170 }
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).max(function (x) { return x.tall; });
    // This returns { tall: 170 }

## mod()

**Returns** a member that appears most often. If two or more members appear most often, this will return the leftmost member that appeared most often.

**Accepts**  
`()`.  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
a name projector was empty.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).mod();
    // This returns 1
    
    new Enumerable([1, 2, 2, 3]).mod();
    // This returns 2
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 160 }, { tall: 170 }]).mod('tall');
    // This returns { tall: 160 }
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 160 }, { tall: 170 }]).max(function (x) { return x.tall; });
    // This returns { tall: 160 }

## sum()

**Returns** a total numeric value of members.

**Accepts**  
`()`.  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
a name projector was empty.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).sum();
    // This returns 6
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).sum('tall');
    // This returns 480
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).sum(function (x) { return x.tall; });
    // This returns 480

## avg()

**Returns** a numeric value of members divided by the length.

**Accepts**  
`()`.  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
a name projector was empty.  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).avg();
    // This returns 2
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).avg('tall');
    // This returns 160
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: 170 }]).avg(function (current) { return current.tall; });
    // This returns 160

## norm()

**Returns** the new enumerable that has undefined, null, empty string, white spaces, not a number (`NaN`), infinity number removed.

**Accepts**  
`()`.  
`(string)` as a name projector.  
`(function)` as a value generator.

**Throws**  
one or more parameters were not valid.

    new Enumerable([1, undefined, null, 2, '', '    ', NaN, Infinity, 3]).norm().toArray();
    // This returns [1, 2, 3]
    
    new Enumerable([{ tall: 150 }, { tall: 160 }, { tall: null }, { tall: 170 }]).norm('tall').toArray();
    // This returns [{ tall: 150 }, { tall: 160 }, { tall: 170 }]

## cast()

**Returns** the new enumerable that contains only specified type.

**Accepts**  
`('string')`, `('number')`, `('array')` or `('object')` as a type.

**Throws**  
one or more parameters were not valid.

    new Enumerable([1, undefined, null, 2, '', '    ', NaN, Infinity, 3]).cast('number').toArray();
    // This returns [1, 2, Infinity, 3]

**Notes**  
For `number` type, this function will automatically convert the numeric string, such as `'123'`, to a number and it will discard `NaN` value.  
For `object` type, this function will consider all arrays as the non-object.

## cross()

**Returns** the new enumerable that contains a Cartesian product from the current enumerable and the given array. The current enumerable must be an _array of array_.

**Accepts**  
`(array-like)` as a multiplier array.

**Throws**  
one or more parameters were not valid.

    new Enumerable([1, 2, 3]).cross([4, 5]).toArray();
    // This returns [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]
    
    new Enumerable([1, 2, 3]).cross([4, 5]).cross([6, 7]).toArray();
    // This returns [[1, 4, 6], [1, 4, 7], [1, 5, 6], [1, 5, 7], [2, 4, 6], [2, 4, 7], [2, 5, 6], [2, 5, 7], [3, 4, 6], [3, 4, 7], [3, 5, 6], [3, 5, 7]]

## seek()

**Returns** a matched member or `null`. Just like `find()` but this will travel in an enumberable recursively.

**Accepts**  
`(string, function)` as a property projector and an equality boolean generator.
`(string, string, anything)` as a property projector, a name projector and a target value.

**Throws**  
one or more parameters were not valid.

    var organization = [
        { name: 'Dave', work: 'CFO' },
        { name: 'Josh', work: 'CTO', reporters: [
            { name: 'Alex' },
            { name: 'Adam', reporters: [
                { name: 'Brad' },
                { name: 'Bill' }
            ] }
        ] },
        { name: 'Kris', work: 'COO', reporters: [
            { name: 'Tony' },
            { name: 'Mike' }
        ] }
    ];
    
    new Enumerable(organization).seek('reporters', 'name', 'Bill');
    // This returns { name: 'Bill' }
    
    new Enumerable(organization).seek('reporters', 'name', 'Todd');
    // This returns null
    
    new Enumerable(organization).seek('reporters', function (person) { return person.name === 'Mike'; });
    // This returns { name: 'Mike' }

## define()

**Returns** nothing but attaches a user-defined function to all enumerable globally. If a function name was already existed, this would overwrite an existing function and print a warning message to the console.

Calling `this` inside the specified function will give you the current enumerable.

The followings are internal variables you should know:  
`this._a` as an array refers to the array.  
`this._m` as Boolean refers to the mutable state.  
`this._s` as an object refers to the scope that passed as the last parameter of the constructor (if any).
`this._x` as Boolean refers to the state whether the current enumerable is the product of `cross()` function or not.

**Accepts**  
`(string, function)` as a function name and a function respectively.  
`(string, string)` as a new function name and an existing function name.

**Throws**  
one or more parameters were not valid.  

    Enumerable.define('increase', function (amount) {
        for (var index = 0; index < this._a.length; index--) {
            this._a[index] += amount;
        }
        return this;
    });
    // After this point, you can call increase function immediately
    
    new Enumerable([1, 2, 3]).increase(5).toArray();
    // This returns [6, 7, 8]
    
    // Create a synonym function
    Enumerable.define('up', 'increase');
    
    new Enumerable([1, 2, 3]).up(5).toArray();
    // This returns [6, 7, 8]
