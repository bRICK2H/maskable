const getSeparator = (char, value) => {
	const pattern = new RegExp(`[\\d${char} ]`, 'g')

	return value.replace(pattern, '')
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

const getValueTime = (ctx, value) => {
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
	const { node, mask, char, pos: { start } } = ctx

	value = value
		.replace(/\D/g, '')
		.split('')

	const indexChars = mask
		.split('')
		.reduce((acc, curr, i) => (curr === char ? acc.push(i + 1) : null, acc), [])
	, index = indexChars.findIndex(n => n === start)

	if (index !== -1) {
		console.log(indexChars, index)
	}

	const rValue = getMaskedTime(ctx, value)
		,	mValue = getValueTime(ctx, rValue)
	console.log('init', value)


	node.value =
		ctx.value = rValue
	ctx.modified = mValue
}