import formatMask from '../helpers/mask'

const getSeparator = (char, value) => {
	const pattern = new RegExp(`[\\d${char} ]`, 'g')

	return value.replace(pattern, '')
}

const arrayFill = (array, n, isArray = false) => {
	const arr = new Array(n).fill(null)
		,	arrayValue = [...array]

	return arr.map(() => {
		const value = arrayValue.splice(0, n)

		return isArray
			? value : value.join('')
	})
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
		.join('')}

const formatTime = (ctx, value) => {
	const { char } = ctx
		, separator = getSeparator(char, value)
		, fValue = value.replace(/\D/g, '').split('')
		, isEndDay = fValue.length === 4 && fValue.every(n => +n === 0)
		, timeReg = new RegExp(`[\^${separator}\\d]`, 'g')
		, [h, m] = value.replace(timeReg, '').split(separator)

	return isEndDay
		? 1440 : !h && !m ? '' : Number(h) * 60 + Number(m)
}

export default ({ ctx, value }) => {
	const { node } = ctx

	const maskValue = formatMask(ctx, value)
		, 	modifyValue = formatTime(ctx, maskValue)

	node.value =
	ctx.value = maskValue
	ctx.modified = modifyValue
}