import formatMask from '../helpers/mask'
import isNumber from '../helpers/detail/isNumber'
import getSeparator from '../helpers/detail/separator'

const parseValue = (ctx, value) => {
	const {
		mask, char
	} = ctx

	value = value.replace(/\+7|\D/g, '')

	if (value.length >= 11) {
		value = value[0] === '8'
			? value.slice(1)
			: value.slice(0, -1)
	}

	value = value.split('')

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

const inputValue = (ctx, value) => {
	const { pos: { min, start, end }, prevValue } = ctx

	if (end - start > 1) {
		const spliceValue = prevValue
			.split('')
			.map((curr, i) => {
				return i >= min && i >= start && i < end && isNumber(curr)
					? ctx.char : curr
			})

		return spliceValue.join('')
	} else {
		return formatMask(ctx, value)
	}
}

const formatPhone = (ctx, value) => {
	const { char } = ctx
		, separator = getSeparator(char, value)
		, dateReg = new RegExp(`[^\\d${separator}]`, 'g')
		, clearDate = value
			.replace(dateReg, '')
			.replace(separator, '.')
			.split(separator)
		, yearIndex = clearDate.findIndex(curr => curr.length === 4)

	console.log(yearIndex, value, clearDate)
		
	if (yearIndex > 0) clearDate.reverse()

	const date = new Date(clearDate.join(separator))

	return JSON.parse(JSON.stringify(date)) ?? null
}

export default ({ ctx, value }) => {
	const {
		node,
		isLoad,
		codes: { past }
	} = ctx

	const maskValue = past || !isLoad
		? parseValue(ctx, value)
		: inputValue(ctx, value)
		, modifyValue = formatPhone(ctx, maskValue)

	node.value =
		ctx.value = maskValue
	ctx.modified = modifyValue
}