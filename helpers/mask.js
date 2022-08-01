import isNumber from './detail/isNumber'

const allowedCharIndices = (char, mask) => {
	return mask
		.split('')
		.reduce((acc, curr, i) => {
			if (curr === char) {
				acc.push(i + 1)
			}

			return acc
		}, [])
}

export default (ctx, value) => {
	const {
		mask,
		char,
		prevValue,
		pos: { start },
		codes: { backspace },
	} = ctx

	if (!value) {
		return mask
	} else {
		const arrayValue = value.split('')
			,	validIndex = allowedCharIndices(char, mask)
				.findIndex(n => n === start)

		if (backspace) {
			isNumber(prevValue[start])
				? arrayValue.splice(start, 0, char)
				: arrayValue.splice(start, 0, prevValue[start])
		} else {
			validIndex !== -1
				? arrayValue.splice(start, 1)
				: arrayValue.splice(start - 1, 1)
		}
		
		return mask.split('')
			.map((curr, i) => isNumber(arrayValue[i]) ? arrayValue[i] : curr)
			.join('')
	}
}