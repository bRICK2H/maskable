const getMaskedDate = (ctx, value) => {
	const {
		mask, char
	} = ctx

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
		,	rValue = getMaskedDate(ctx, value)

	node.value =
	ctx.value = rValue
	// ctx.modified = rValue.replace(/[^\+7\d]/g, '')
}