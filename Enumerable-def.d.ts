declare global {
	interface Function {
		// static isFunction(value: any): boolean

		debounce(): () => any
		debounce(duration: number): () => any

		immediate(): () => any
		immediate(duration: number): () => any

		cache(): () => any
		cache(recentCount: number): () => any // TODO: "forget" method
	}

	interface Array<T> {
		// static create(...)

		// bind()

		clone(deep?: boolean): Array<T>

		toObject(): object
		toObject(memberNameForOutputName: string, memberNameForOutputValue: string): object
		toObject(memberNameForOutputName: string, outputValueGenerator: (value: T, index?: number, array?: Array<T>) => any): object
		toObject(memberNameForOutputName: string, value: any): object
		toObject(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => string | number | boolean | undefined | null): object
		toObject(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => string | number | boolean | undefined | null, memberNameForOutputValue: string): object
		toObject(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => string | number | boolean | undefined | null, outputValueGenerator: (value: T, index?: number, array?: Array<T>) => any): object
		toObject(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => string | number | boolean | undefined | null, value: any): object

		toMap<K, V>(): Map<K, V>
		toMap<K, V>(memberNameForOutputName: string): Map<K, V>
		toMap<K, V>(memberNameForOutputName: string, memberNameForOutputValue: string): Map<K, V>
		toMap<K, V>(memberNameForOutputName: string, outputValueGenerator: (value: T, index?: number, array?: Array<T>) => V): Map<K, V>
		toMap<K, V>(memberNameForOutputName: string, value: V): Map<K, V>
		toMap<K, V>(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => K): Map<K, V>
		toMap<K, V>(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => K, memberNameForOutputValue: string): Map<K, V>
		toMap<K, V>(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => K, outputValueGenerator: (value: T, index?: number, array?: Array<T>) => V): Map<K, V>
		toMap<K, V>(memberNameProjectorForOutputName: (value: T, index?: number, array?: Array<T>) => K, value: V): Map<K, V>

		toString(separator?: string): string

		where(condition: (value: T, index?: number, array?: Array<T>) => boolean): Array<T>
		where(condition: object): Array<T>
		where(memberName: string, memberValue: any): Array<T>

		select(outputValueGenerator: (value: T, index?: number, array?: Array<T>) => any): Array<any>
		select(memberName: string | number, memberValue: any): Array<any>
		select(memberNames: Array<string>): Array<any>

		invoke(iterator: (value: T, index?: number, array?: Array<T>) => void | boolean): Array<T>
		invoke(startIndex: number, iterator: (value: T, index?: number, array?: Array<T>) => void | boolean): Array<T>
		invoke(startIndex: number, stopIndex: number, iterator: (value: T, index?: number, array?: Array<T>) => void | boolean): Array<T>
		invoke(startIndex: number, stopIndex: number, stepCount: number, iterator: (value: T, index?: number, array?: Array<T>) => void | boolean): Array<T>

		invokeAsync(iterator: (value: T, index?: number, array?: Array<T>) => void | boolean, batchCount?: number): Promise<Array<T>>
		invokeAsync(startIndex: number, iterator: (value: T, index?: number, array?: Array<T>) => void | boolean, batchCount?: number): Promise<Array<T>>
		invokeAsync(startIndex: number, stopIndex: number, iterator: (value: T, index?: number, array?: Array<T>) => void | boolean, batchCount?: number): Promise<Array<T>>
		invokeAsync(startIndex: number, stopIndex: number, stepCount: number, iterator: (value: T, index?: number, array?: Array<T>) => void | boolean, batchCount?: number): Promise<Array<T>>

		invokeWhich(groupName: any, iterator: (value: T, index?: number, array?: Array<T>) => void | boolean): Array<T>

		take(condition: (value: T, index?: number, array?: Array<T>) => boolean): Array<T>
		take(memberCount: number): Array<T>
		take(startIndex: number, stopIndex: number): Array<T>

		skip(condition: (value: T, index?: number, array?: Array<T>) => boolean): Array<T>
		skip(memberCount: number): Array<T>
		skip(startIndex: number, stopIndex: number): Array<T>

		trim(condition: (value: T, index?: number, array?: Array<T>) => boolean): Array<T>
		trim(member: T): Array<T>

		flatten(deep?: boolean): Array<T>

		any(): boolean;
		any(condition: (value: T, index?: number, array?: Array<T>) => boolean): boolean;
		any(member: T): boolean;
		any(memberName: string, memberValue: any): boolean;

		all(condition: (value: T, index?: number, array?: Array<T>) => boolean): boolean;
		all(member: T): boolean;
		all(memberName: string, memberValue: any): boolean;

		has(condition: (value: T, index?: number, array?: Array<T>) => boolean): boolean;
		has(member: any, startIndex?: number): boolean;

		isEqual(array: any[], comparer?: (value: T, valueFromGivenArray: any) => boolean): boolean

		isAlike(array: any[], comparer?: (value: T, valueFromGivenArray: any) => boolean): boolean

		isSubset(array: any[], comparer?: (value: T, valueFromGivenArray: any) => boolean): boolean

		indexOf(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): number
		indexOf(member: T, startIndex?: number): number

		lastIndexOf(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): number
		lastIndexOf(member: T, startIndex?: number): number

		find(memberName: string, memberValue: any): T | undefined

		first(): T
		first(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): T

		firstOrNull(): T | null
		firstOrNull(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): T | null

		last(): T
		last(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): T

		lastOrNull(): T | null
		lastOrNull(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): T | null

		single(): T
		single(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): T

		singleOrNull(): T | null
		singleOrNull(condition: (value: T, index?: number, array?: Array<T>) => boolean, startIndex?: number): T | null

		distinct(): Array<T>
		distinct(memberName: string): Array<T>
		distinct(memberNameProjector: (value: T, index?: number, array?: Array<T>) => any): Array<T>

		add(member: T, targetIndex?: number): Array<T>

		addRange(members: Array<T>, targetIndex?: number): Array<T>

		remove(member: T, startIndex?: number): Array<T>

		removeAt(index: number): Array<T>

		removeRange(members: Array<T>): Array<T>

		removeAll(): Array<T>
		removeAll(members: Array<T>): Array<T>

		split(member: T): Array<Array<T>>
		split(condition: (value: T, index?: number, array?: Array<T>) => boolean): Array<Array<T>>
		split(memberName: string, memberValue: any): Array<Array<T>>

		splitAt(index: number): Array<Array<T>>

		replace(member: T, replacement: T, replacementCount?: number): Array<T>

		replaceAt(index: number, replacement: T): Array<T>

		union(members: Array<T>): Array<T>

		intersect(members: Array<T>): Array<T>

		difference(members: Array<T>): Array<T>

		sortBy(memberName: string, reverse?: boolean): Array<T>
		// sortBy(specifiers: Array<string, boolean>): Array<T>

		groupBy(memberName: string): Array<Array<T>>
		groupBy(memberNameProjector: (value: T, index?: number, array?: Array<T>) => any): Array<Array<T>>

		groupOf(maxGroupMemberCount: number): Array<Array<T>>

		joinBy(members: Array<T>, memberName: string, overwrite?: boolean): Array<T>

		countBy(member: T): number
		countBy(memberName: string): number
		countBy(condition: (value: T, index?: number, array?: Array<T>) => boolean): number

		min(): T | null
		min(memberName: string): T
		min(evaluator: (value: T, index?: number, array?: Array<T>) => number): T

		max(): T | null
		max(memberName: string): T
		max(evaluator: (value: T, index?: number, array?: Array<T>) => number): T

		mod(): T | null
		mod(memberName: string): T
		mod(evaluator: (value: T, index?: number, array?: Array<T>) => number): T

		sum(): number
		sum(memberName: string): number
		sum(evaluator: (value: T, index?: number, array?: Array<T>) => number): number

		avg(): number
		avg(memberName: string): number
		avg(evaluator: (value: T, index?: number, array?: Array<T>) => number): number

		norm(): Array<T>
		norm(memberName: string): Array<T>
		norm(evaluator: (value: T, index?: number, array?: Array<T>) => any): Array<T>

		cast(typeName: 'string'): Array<string>
		cast(typeName: 'number'): Array<number>
		cast(typeName: 'boolean'): Array<boolean>
		cast(typeName: 'array'): Array<Array<any>>
		cast(typeName: 'object'): Array<object>
		cast(typeName: 'function'): Array<Function>
		cast<Q>(typeClass: { new(): Q }): Array<Q>

		cross(array: Array<any>): Array<Array<any>>

		zip(propertyNames: Array<string>): Array<object>

		seek(memberNameForTreeTraversal: string, memberName: string, innerValue: any): any
		seek(memberNameForTreeTraversal: string, condition: (value: T, index?: number, array?: Array<T>) => boolean): any
	}

	interface Number {
		format(options: NumberFormattingOptions): string
	}

	interface String {
		contains(value: string): boolean

		toHashCode(): string

		toEncodedXML(): string

		toDecodedXML(): string

		toEnglishCase(): string

		toCapitalCase(): string

		toCamelCase(): string

		toTrainCase(): string

		latchOf(openPair: string, closePair: string): number
	}

	interface Map<K, V> {
		toArray(): Array<KeyValuePair<K, V>>

		toObject(): object
	}
}

export interface KeyValuePair<K, V> extends Array<any> {
	[0]: K
	[1]: V
}

export interface NumberFormattingOptions {
	minDecimalPlace?: number
	maxDecimalPlace?: number
	addThousandSeparators?: boolean
	largeNumberScale?: Array<{ scalingFactor: number, prefix: string, suffix: string }>
	fallbackValue?: string
}

/*~ For example, declaring a method on the module (in addition to its global side effects) */
// export function doSomething(): void;

export { };
