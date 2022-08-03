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
		|| offsetPrev === offsetNext
			? prev + 1
			: next
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

const findLastNumberIndex = ctx => {
	const { char, value, pos: { max } } = ctx

	const arrayValue = value.split('')
	, numIndex = arrayValue.findLastIndex(curr => isNumber(curr))
	, symIndex = arrayValue.findIndex(curr => curr === char)
	, index = symIndex !== -1
		? symIndex
		: numIndex !== -1
			? numIndex + 1
			: max

	return index
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

const findBackspaceIndex = ctx => {
	const {
		char,
		value,
		pos: { start },
	} = ctx
	, currSymbol = value[start]
	, prevSymbol = value[start - 1]

	return currSymbol === char
		&& (!isNumber(prevSymbol) && prevSymbol !== char)
			? [start, start]
			: findPrevBackspaceIndex(ctx)
}

const findPrevBackspaceIndex = ctx => {
	const {
		value,
		pos: { start, min }
	} = ctx

	const index = value
		.split('')
		.findLastIndex((curr, i) => {
			return i >= min && i <= start && isNumber(curr)
		})

	return index !== -1
		? [index + 1, index + 1]
		: [min, min]
}

const findPrevAllowedIndex = (ctx) => {
	const {
		char,
		value,
		pos: { start },
	} = ctx
	, currSymbol = value[start]

	return !isNumber(currSymbol) && currSymbol !== char
		? findPrevCharIndex(ctx) : [start, start]
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
			return i >= min && i <= start && (curr === char || isNumber(curr))
		})

	return index !== -1
		? [index + 1, index + 1]
		: [min, min]
}

const findNextArrowRirghtIndex = ctx => {
	const {
		value,
		pos: { start, max },
	} = ctx

	const isNextNumber = value
		.split('')
		.some((curr, i) => i >= start - 1 && isNumber(curr))

	return isNextNumber
		? findNextAllowedIndex(ctx)
		: findNextOneCharIndex(ctx) ?? [max, max]
}

const findNextOneCharIndex = ctx => {
	const {
		char,
		value,
		pos: { start }
	} = ctx
	, index = value.indexOf(char, start - 1)

	return index !== -1 ? [index, index] : nul
	
}

const findNextAllowedIndex = (ctx, jump = false) => {
	const {
		char,
		value,
		pos: { start },
	} = ctx
	, currSymbol = value[start - (jump ? 0 : 1)]
	
	return !isNumber(currSymbol) && currSymbol !== char
		? findNextCharIndex(ctx)
		: [start, start]
}

const findNextCharIndex = ctx => {
	const {
		char,
		value,
		pos: { start, max }
	} = ctx

	const index = value
		.split('')
		.findIndex((curr, i) => {
			return i <= max && i >= start && (curr === char || isNumber(curr)) 
		})

	return index !== -1
		? [index, index]
		: [max, max]
}

export default {
	isFullValue,
	findAllowedIndex,	
	findBackspaceIndex,
	findFirstEmptyIndex,
	findLastNumberIndex,
	findPrevNumberIndex,
	findPrevAllowedIndex,
	findNextAllowedIndex,
	findNextArrowRirghtIndex,
}