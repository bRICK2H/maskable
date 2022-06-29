const isFullValue = ctx => {
	const { char, value } = ctx

	return value.indexOf(char) === -1
}

const findFirstEmptyIndex = ctx => {
	const {
		char, value, pos: { max }
	} = ctx
		,	index = value.indexOf(char)
	
	return index !== -1
		? [index, index]
		: [max, max]
}

const findPrevNumberIndex = ctx => {
	const {
		node,
		char,
		value,
		pos: { min }
	} = ctx
	, arrValue = value.split('')
	, curr = node.selectionStart
	, prev = arrValue
		.findLastIndex((n, i) => i >= min && i <= curr && /\w/.test(n) && n !== char)
	
	return prev !== -1
		? [prev + 1, prev + 1]
		: [min, min]
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

export default {
	isFullValue,
	findFirstEmptyIndex,
	findPrevNumberIndex,
	findAllowedIndex,
}