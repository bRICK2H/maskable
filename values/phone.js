import formatMask from '../helpers/mask'
import isNumber from '../helpers/detail/isNumber'

const parseValue = (ctx, value) => {
	const {
		mask, char
	} = ctx
	, firstNumbers = ['7', '8']

	value = value.replace(/\+7|\D/g, '')

	if (value.length >= 11) {
		value = firstNumbers.includes(value[0])
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

const formatPhone = value => {
	const isPhone = value
		.replace(/\+7/, '')
		.split('')
		.some(curr => isNumber(curr))

	return isPhone
		? value.replace(/[^+7\d]/g, '') : ''
}

export default ({ ctx, value }) => {
	const {
		node,
		isLoad,
		codes: { past, which }
	} = ctx

	const maskValue = past || !isLoad || !which
		? parseValue(ctx, value)
		: formatMask(ctx, value)
	, modifyValue = formatPhone(maskValue)

	node.value =
		ctx.value = maskValue
	ctx.modified = modifyValue
}