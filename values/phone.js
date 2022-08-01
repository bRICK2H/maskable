import formatMask from '../helpers/mask'
import isNumber from '../helpers/detail/isNumber'

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
	const { pos: { start, end }, prevValue } = ctx

	if (end - start > 1) {
		const spliceValue = prevValue
			.split('')
			.map((curr, i) => {
				return i >= start && i < end && isNumber(curr)
					? ctx.char : curr
			})

		return spliceValue.join('')
	} else {
		return formatMask(ctx, value)
	}
}

const formatPhone = value => {
	return value.replace(/[^\+7\d]/g, '')
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
	,	modifyValue = formatPhone(maskValue)

	node.value =
	ctx.value = maskValue
	ctx.modified = modifyValue
}