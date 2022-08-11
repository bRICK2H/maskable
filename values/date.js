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
	const { char, pos: { min, start, end }, prevValue } = ctx

	if (end - start > 1) {
		const spliceValue = prevValue
			.split('')
			.map((curr, i) => {
				return i >= min && i >= start && i < end && isNumber(curr)
					? ctx.char : curr
			})

		return spliceValue.join('')
	} else {
		const formatedValue = formatMask(ctx, value)
			, separator = getSeparator(char, formatedValue)
			, dateReg = new RegExp(`[^${separator}\\d${char}]`, 'g')
			, distDate = distributionDate(formatedValue, separator, dateReg)
			, distPrevDate = distributionDate(ctx.prevValue, separator, dateReg)

		return parseValue(
			ctx,
			validateDate(ctx, distDate, distPrevDate).join(separator)
		)
	}
}

const validateDate = (ctx, date, prevDate) => {
	const { char } = ctx
	, mapDate = {
		0: 'year',
		1: 'month',
		2: 'day'
	}
	, parseNumber = value => !isNaN(parseFloat(value)) ? parseFloat(value) : ''
	, parseString = value => !isNaN(parseFloat(value)) ? value.replace(char, '') : ''
	, dateModify = date.map((curr, i) => {
		return {
			[mapDate[i]]: {
				name: mapDate[i],
				value: parseNumber(curr),
				string: parseString(curr),
				length: parseString(curr).length,
				currLength: String(parseNumber(curr)).length,
				prevString: parseString(prevDate[i]),
			}
		}
	})

	const foo = dt => {
		const {
			name,
			value,
			string,
			length,
			prevString,
			currLength,
		} = dt[Object.keys(dt)]
		, map = {
			year: { min: 1900, max: 3000 },
			month: { min: 1, max: 12 },
			day: { min: 1, max: 31 }
		}
		, {
			min, max
		} = map[name]

		if (string !== prevString && value !== '') {
			switch (length) {
				case 2: {
					switch (currLength) {
						case 1: return string === '00' ? `0${min}` : string

						case 2: {

							if (value >= min && value < 10) {
								// return `0${value}`
							} else if (string === '0') {
								return string
							} else if (value < min) {
								return `0${min}`
							} else if (value > max) {
								return `${max}`
							}

						}
					}
				}
					break

				// case 4: {
				// }
				// 	break
			}

			// return `${value}`
		} else {
			return string
		}

		// if (value === '') {
		// 	// Разобраться в последовательности
		// 	console.log('name', name)
		// 	return string
		// } else {
		// 	switch (length) {
		// 		case 2: {
		// 			console.error('case 2', value)
		// 			if (value >= min && value < 10) {
		// 				console.log('1')
		// 				// return `0${value}`
		// 			} else if (string === '0') {
		// 				console.log('2')
		// 				return string
		// 			} else if (value < min) {
		// 				console.log('3')
		// 				return `0${min}`
		// 			} else if (value > max) {
		// 				console.log('4')
		// 				return `${max}`
		// 			}
		// 		}
		// 			break

		// 		case 4: {
		// 			console.error('case 4', value)
		// 		}
		// 			break
		// 	}

		// 	console.log('here')
		// 	return `${value}`
		// }
	}

	const res = dateModify.map(foo)
	// console.log(res)
	return res.reverse()
	
}

const distributionDate = (value, separator, pattern) => {
	const date = value
		.replace(pattern, '')
		.replace(separator, '.')
		.split(separator)
	, yearIndex = date
		.findIndex(curr => curr.length === 4)

	return yearIndex > 0
		? date.reverse() : date
}

const formatDate = (ctx, value) => {
	const { char } = ctx
		, separator = getSeparator(char, value)
		, dateReg = new RegExp(`[^\\d${separator}]`, 'g')
		, distDate = distributionDate(value, separator, dateReg)
		, date = new Date(distDate.join(separator))

	return JSON.parse(JSON.stringify(date)) ? date : null
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
		, modifyValue = formatDate(ctx, maskValue)

	node.value =
		ctx.value = maskValue
	ctx.modified = modifyValue
}