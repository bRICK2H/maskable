const getMaskedTime = (ctx, value) => {
	const {
		mask, char
	} = ctx

	value = value.replace(/\+7|\D/g, '')

	if (value.length >= 11) {
		value = value.slice(0, -1)
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

export default ({ ctx, value, }) => {
	const { node } = ctx
		,	rValue = getMaskedTime(ctx, value)

	node.value =
	ctx.value = rValue
	ctx.modified = rValue.replace(/[^\+7\d]/g, '')
}