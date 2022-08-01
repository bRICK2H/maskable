import isNumber from './detail/isNumber'

const isFullValue = ctx => {
	const { char, value } = ctx

	return value.indexOf(char) === -1
}

const findFirstEmptyIndex = ctx => {
	const {
		char, value
	} = ctx
	,	index = value.indexOf(char)
	
	return index !== -1
		? [index, index] : null
}

const findNeighborNumberIndex = ctx => {
	const {
		node,
		value,
		pos: { min },
	} = ctx
	, arrValue = value.split('')
	, curr = node.selectionStart
	, next = arrValue
		.findIndex((n, i) => i >= curr && /\w/.test(n))
	, prev = arrValue
		.findLastIndex((n, i) => i >= min && i <= curr && /\w/.test(n))
	, offsetPrev = curr - prev
	, offsetNext = next - curr

	return offsetPrev < offsetNext
		? prev
		: offsetPrev > offsetNext
			? next + 1
			: next === prev
				? next + 1
				: prev + 1
}

const findAllowedIndex = ctx => {
	const {
		node,
		value,
		pos: { min, max },
	} = ctx
	, 	curr = node.selectionStart
	, 	index = curr < min
			? min + 1
			: curr > max
				? max
				: /\W/.test(value[curr - 1])
					? findNeighborNumberIndex(ctx)
					: curr

	return [index, index]
}

// --
// const findNextNumberIndex = ctx => {
// 	const { value, pos: { start } } = ctx

// 	const index = value
// 		.split('')
// 		.findIndex((curr, i) => {
// 			return i >= start && isNumber(curr)
// 		})

// 	return index !== -1 ? [index, index] : null
// }

const findPrevNumberIndex = ctx => {
	const {
		char,
		value,
		pos: { start, min }
	} = ctx

	if (value[start] === char) {
		return findFirstEmptyIndex(ctx)
	} else {
		const index = value
			.split('')
			.findLastIndex((curr, i) => {
				return i >= min && i <= start && isNumber(curr)
			})
	
		return index !== -1 ? [index + 1, index + 1] : null
	}
}

const findPrevAllowedIndex = (ctx) => {
	const {
		char,
		value,
		pos: { start, min },
	} = ctx
	, currSymbol = value[start]

	console.error(currSymbol)

	// return !isNumber(currSymbol) && currSymbol !== char
	// 	? findPrevCharIndex(ctx) : [start, start]

	return findPrevCharIndex(ctx) ?? [min, min]
	
	// return currSymbol !== char
	// 	? findPrevCharIndex(ctx) ?? [min, min]
	// 	: [start, start]
}

const findPrevCharIndex = ctx => {
	const {
		char,
		value,
		pos: { start, min }
	} = ctx

	const index = value
		.split('')
		.findLastIndex((curr, i) => {
			return i >= min && i <= start && isNumber(curr)
		})

	console.warn(index)

	return index !== -1 ? [index + 1, index + 1] : null
}

const findNextAllowedIndex = (ctx, jump = false) => {
	const {
		char,
		value,
		pos: { start},
	} = ctx
	, currSymbol = value[start - (jump ? 0 : 1)]

	return !isNumber(currSymbol) && currSymbol !== char
		? findNextCharIndex(ctx) : [start, start]
}

const findNextCharIndex = ctx => {
	const {
		char,
		value,
		pos: { start }
	} = ctx

	const index = value
		.split('')
		.findIndex((curr, i) => {
			return i >= start && (curr === char || isNumber(curr)) 
		})

	return index !== -1 ? [index, index] : null
}

export default {
	isFullValue,
	findFirstEmptyIndex,
	findAllowedIndex,

	// findNextNumberIndex,
	findPrevNumberIndex,
	findNextAllowedIndex,
	findPrevAllowedIndex,
}