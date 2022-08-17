import isNumber from './detail/isNumber'
import h from './cursor'

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
		pos,
		mask,
		char,
		prevValue,
		pos: { start, min, max, select },
		codes: { backspace, delete: del },
	} = ctx

	if (!isNumber(value[start - 1])) {
		pos.block = true
	}

	if (!value) {
		return mask
	} else {
		const arrayValue = value.split('')

		if (select.isSelect) {
			const {
				end,
				start,
			} = select

			const modifyPrevValue = prevValue
				.split('')
				.map((curr, i) => {
					return i >= min && i >= start && i < end && isNumber(curr)
						? ctx.char : curr
				})

			if (!backspace && !del) {
				if (!isNumber(value[start])) {
					Object.assign(arrayValue, prevValue.split(''))
				} else {
					modifyPrevValue.splice(start, 1, value[start])
					Object.assign(arrayValue, modifyPrevValue)
				}
			}
			
		} else {
			const validIndex = allowedCharIndices(char, mask)
				.findIndex(n => n === start)

			if (backspace || del) {
				ctx._validCounter = 0
	
				isNumber(prevValue[start])
					? arrayValue.splice(start, 0, char)
					: arrayValue.splice(start, 0, prevValue[start])
			} else {
				ctx._validCounter = validIndex !== -1 || start >= max ? 0 : 1
	
				if (!isNumber(arrayValue[start - 1])) {
					arrayValue.splice(start - 1, 1, ...arrayValue.splice(start, 1))
				} else {
					if (validIndex !== -1) {
						arrayValue.splice(start, 1)
					} else {
						const [s] = h.findNextAllowedIndex(ctx, true)
	
						arrayValue.splice(s, 1, ...arrayValue.splice(start - 1, 1))
					}
				}
			}
		}
		
		
		return mask.split('')
			.map((curr, i) => isNumber(arrayValue[i]) ? arrayValue[i] : curr)
			.join('')
	}
}