import isNumber from '../helpers/detail/isNumber'
import formatMask from '../helpers/mask'
import getSeparator from '../helpers/detail/separator'

const arrayFill = (array, n, isArray = false) => {
	const arr = new Array(n).fill(null)
		, tmp = [...array]

	return arr.map(() => {
		const value = tmp.splice(0, n)

		return isArray
			? value : value.join('')
	})
}

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

const getMaskedTime = (ctx, value) => {
	const {
		mask, char
	} = ctx

	return mask
		.split('')
		.map(el => {
			if (el === char) {
				return value.length
					? value.splice(0, 1)
					: char
			}

			return el
		})
		.join('')
}

const getValidHours = (ctx, value) => {
	const { char } = ctx
		, arrayValue = value.split('')

	switch (value.length) {
		case 0: {
			const empty = new Array(2).fill(char)
			empty.forEach(curr => arrayValue.push(curr))
		}
			break

		case 1: {
			const hours = value * 10 * 60

			if (hours === 1440) {
				arrayValue.fill('0')
			} else if (hours > 1440) {
				arrayValue.unshift('0')
			} else {
				arrayValue.push(char)
			}
		}
			break

		case 2: {
			const hours = value * 60

			if (hours === 1440) {
				arrayValue.fill('0')
			} else if (hours > 1440) {
				!(value % 10)
					? arrayValue.unshift(...arrayValue.splice(1, 1))
					: arrayValue.splice(0, 1, '0')
			}
		}
	}

	return arrayValue
}

const getValidMinutes = (ctx, value) => {
	const { char } = ctx
		, arrayValue = value.split('').slice(0, 2)

	switch (value.length) {
		case 1: {
			const minutes = value * 10

			if (minutes >= 60) {
				arrayValue.unshift('0')
			} else {
				arrayValue.push(char)
			}
		}
			break

		case 2: {
			const minutes = +value

			if (minutes === 60) {
				arrayValue.fill('0')
			} else if (minutes > 60) {
				!(value % 10)
					? arrayValue.unshift(...arrayValue.splice(1, 1))
					: arrayValue.splice(0, 1, '0')
			}
		}
	}

	return arrayValue
}

const parseString = (ctx, value) => {
	const { mask, char, pos: { start } } = ctx

	if (!value) return mask

	const separator = getSeparator(char, value)
		, timeReg = new RegExp(`[\^${separator}\\d${char}]`, 'g')
		, [h, m] = value.replace(timeReg, '').split(separator)
		, side = arrayFill(allowedCharIndices(char, mask), 2, true)
			.findIndex(curr => curr.includes(start))
	
	const charReg = new RegExp(`${char}`, 'g')
		, hArray = [0, -1].includes(side)
			? getValidHours(ctx, h.replace(charReg, ''))
			: h.split('')
		, mArray = [1, -1].includes(side)
			? getValidMinutes(ctx, m.replace(charReg, ''))
			: m.split('')

	return getMaskedTime(ctx, [...hArray, ...mArray])
}


const parseNumber = (ctx, value) => {
	value = value % 1440

	const parseTime = time => {
		const arrayTime = time.split('')

		if (arrayTime.length === 1) {
			arrayTime.unshift('0')
		}

		return arrayTime
	}
	, h = String(Math.floor(value / 60))
	, m = String(value % 60)

	return getMaskedTime(
		ctx,
		[...parseTime(h), ...parseTime(m)]
	)
}

const parseValue = (ctx, value, isPast = false) => {
	if (isPast) value = ctx.pastValue

	return !value
		? ctx.mask
		: isNumber(value)
			? parseNumber(ctx, value)
			: parseString(ctx, value)
}

const inputValue = (ctx, value) => {
	const { codes: { backspace }, pos: { start, end }, prevValue } = ctx
		, formatedValue = formatMask(ctx, value)

	if (end - start > 1) {
		const spliceValue = prevValue
			.split('')
			.map((curr, i) => {
				return i >= start && i < end && isNumber(curr)
					? ctx.char : curr
			})

		return spliceValue.join('')
	} else {
		return backspace
			? formatedValue
			: parseValue(ctx, formatedValue)
	}
}

const formatTime = (ctx, value) => {
	const { char } = ctx
		, separator = getSeparator(char, value)
		, timeReg = new RegExp(`[\^${separator}\\d${char}]`, 'g')
		, charReg = new RegExp(`${char}`, 'g')
		, [h, m] = value
			.replace(charReg, '0')
			.replace(timeReg, '')
			.split(separator)

	return !h && !m ? 0 : Number(h) * 60 + Number(m)
}

export default ({ ctx, value }) => {
	const {
		node,
		isLoad,
		codes: { past }
	} = ctx

	const maskValue = past || !isLoad
		? parseValue(ctx, value, past)
		: inputValue(ctx, value)
	, modifyValue = formatTime(ctx, maskValue)

	node.value =
	ctx.value = maskValue
	ctx.modified = modifyValue
}