import isNumber from '../helpers/detail/isNumber'
import formatMask from '../helpers/mask'
import getSeparator from '../helpers/detail/separator'
import setSound from '../helpers/detail/sound'

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
	const { pos, prevValue } = ctx
		, arrayValue = value.split('')

	ctx.isSystemIndex = false

	if (value.length === 1) {
		if (value > 2) {
			ctx.isSystemIndex = true
			arrayValue.unshift('0')
		}
	} else if (value.length === 2) {
		const hours = value * 60

		if (!+prevValue[0] && hours >= 1440) {
			ctx.isSystemIndex = true
			arrayValue.splice(1, 1, arrayValue.splice(0, 1, '0'))
		} else {
			if (hours >= 1440) {
				const index = pos.start - 1
				
				setSound()
				pos.block = true
				arrayValue.splice(index, 1, prevValue[index])
			}
		}
	}

	return arrayValue
}

const getValidMinutes = (ctx, value) => {
	const { pos, char, prevValue } = ctx
		, arrayValue = value.split('').slice(0, 2)
		, separator = getSeparator(char, prevValue)
		, minutesReg = new RegExp(`[^${separator}\\d${char}]`, 'g')
		, [, prevMinutes] = prevValue.replace(minutesReg, '').split(separator)
		, replaceValue = () => {
			setSound()
			pos.block = true
			arrayValue.splice(0, 1, prevMinutes[0])
		}

	switch (value.length) {
		case 1: {
			if (value >= 6) {
				replaceValue()
			}
		}
			break
	
		case 2: {
			if (value >= 60) {
				replaceValue()
			}
		}
			break
	}

	return arrayValue
}

const parseString = (ctx, value) => {
	const { mask, char, pos: { start } } = ctx

	if (!value) return mask

	const separator = getSeparator(char, value)
		, timeReg = new RegExp(`[^${separator}\\d${char}]`, 'g')
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
	const { codes: { backspace } } = ctx
	, formatValue = formatMask(ctx, value)

	return backspace
		? formatValue
		: parseValue(ctx, formatValue)
}

const formatTime = (ctx, value) => {
	const { char } = ctx
		, separator = getSeparator(char, value)
		, timeReg = new RegExp(`[^${separator}\\d${char}]`, 'g')
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
		// formatMask(ctx, value)
	, modifyValue = formatTime(ctx, maskValue)

	node.value =
	ctx.value = maskValue
	ctx.modified = modifyValue
}