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
const findNextNumberIndex = ctx => {
	const { value, pos: { start } } = ctx

	const index = value
		.split('')
		.findIndex((curr, i) => {
			return i >= start && isNumber(curr)
		})

	return index !== -1 ? [index, index] : null
}

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

export default {
	isFullValue,
	findFirstEmptyIndex,
	findAllowedIndex,

	findNextNumberIndex,
	findPrevNumberIndex
}