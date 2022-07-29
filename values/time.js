const getSeparator = (char, value) => {
	const pattern = new RegExp(`[\\d${char} ]`, 'g')
	
	return value.replace(pattern, '')
}

const getValidHours = value => {
	value = value.replace(/0/g, '')
	const arrayValue = value.split('')

	switch (value.length) {
		case 1: {
			const hours = value * 10 * 60

			if (hours === 1440) {
				arrayValue.fill('0')
			} else if (hours > 1440) {
				arrayValue.unshift('0')
			} else {
				arrayValue.push('0')
			}
		}
			break
	
		case 2: {
			const hours = value * 60

			if (hours === 1440) {
				arrayValue.fill('0')
			} else if (hours > 1440) {
				arrayValue.splice(0, 1, '0')
			}
		}
	}

	return arrayValue
}

const getValidMinutes = value => {
	const arrayValue = value
		.split('')
		.slice(0, 2)

	switch (value.length) {
		case 1: {
			const minutes = value * 10

			if (minutes >= 60) {
				arrayValue.unshift('0')
			} else {
				arrayValue.push('0')
			}
		}
			break
	
		case 2: {
			const minutes = +value

			if (minutes === 60) {
				arrayValue.fill('0')
			} else if (minutes > 60) {
				arrayValue.splice(0, 1, '0')
			}
		}
	}

	return arrayValue
}

const getValidTime = value => {
	value = value
		.replace(/\D/g, '')
		.split('')

	const [hr1, hr2, mt1] = value

	if (hr1 * 10 * 60 >= 1440) {
		value.splice(0, 0, '0')
	}

	const hours = +(hr1 + hr2) * 60

	if (hours > 1440) {
		value.splice(0, 1, '0')
	} else if (hours === 1440) {
		value.forEach((_, i) => {
			if (i <= 1) value.splice(i, 1, '0')
		})
	}

	if (mt1 * 10 >= 60) {
		value.splice(2, 0, '0')
	}

	return value
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

const getMinuteTime = (ctx, value) => {
	const { char } = ctx
		, 	separator = getSeparator(char, value)
		,	fValue = value.replace(/\D/g, '').split('')
		, 	isEndDay = fValue.length === 4 && fValue.every(n => +n ===0)
		, 	timeReg = new RegExp(`[\^${separator}\\d]`, 'g')
		, 	[h, m] = value.replace(timeReg, '').split(separator)
		
	return isEndDay
		? 1440 : !h && !m ? '' : Number(h) * 60 + Number(m)
}

const parseNumber = (ctx, value) => {
	value = value % 1440

	const h = String(Math.floor(value / 60))
		,	m = String(value % 60)
		, 	parseTime = time => {
				const arrayTime = time.split('')

				if (arrayTime.length === 1) {
					arrayTime.unshift('0')
				}

				return arrayTime
			}

	return getMaskedTime(ctx, [...parseTime(h), ...parseTime(m)])
}

const parseString = (ctx, value) => {
	if (!value) return value

	const { char } = ctx
		,	separator = getSeparator(char, value)
		, 	timeReg = new RegExp(`[\^${separator}\\d]`, 'g')
		, 	[h, m] = value.replace(timeReg, '').split(separator)
	
	return getMaskedTime(ctx, [...getValidHours(h), ...getValidMinutes(m)])
}


export default ({ ctx, value }) => {
	const { node } = ctx
	
	if (!isNaN(+value)
		&& !isNaN(parseFloat(value))) {
		value = !ctx.isLoad
			? parseNumber(ctx, value)
			: ctx.value
	} else {
		if (!ctx.isLoad) {
			value = parseString(ctx, value)
		}
	}

	value = getValidTime(value)

	const rValue = getMaskedTime(ctx, value)
		,	mValue = getMinuteTime(ctx, rValue)

	node.value =
	ctx.value = rValue
	ctx.modified = mValue
}