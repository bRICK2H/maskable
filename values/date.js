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
			, dateReg = new RegExp(`[\^${separator}\\d${char}]`, 'g')
			, clearDate = formatedValue
				.replace(dateReg, '')
				.replace(separator, '.')
				.split(separator)
			, yearIndex = clearDate.findIndex(curr => curr.length === 4)

		if (yearIndex > 0) clearDate.reverse()

		return parseValue(ctx, validateDate(ctx, clearDate).join(separator))
	}
}

const validateDate = (ctx, date) => {
	const { char } = ctx
	const mapDate = {
		0: 'year',
		1: 'month',
		2: 'day'
	}
	const dateModify = date.map((curr, i) => {
		return {
			[mapDate[i]]: {
				name: mapDate[i],
				length: curr.length,
				string: !isNaN(parseFloat(curr)) ? curr.replace(char, '') : '',
				value: !isNaN(parseFloat(curr)) ? parseFloat(curr): '',
			}
		}
	})
	console.log(dateModify)

	const foo = dt => {
		const {
			name,
			value,
			string,
			length,
		} = dt[Object.keys(dt)]
		, map = {
			year: { min: 1900, max: 3000 },
			month: { min: 1, max: 12 },
			day: { min: 1, max: 31 }
		}
		, {
			min, max
		} = map[name]

		console.warn(dt)

		if (value === '') {
			// Разобраться в последовательности
			console.log('name', name)
			return string
		} else {
			switch (length) {
				case 2: {
					console.error('case 2', value)
					if (value >= min && value < 10) {
						console.log('1')
						// return `0${value}`
					} else if (string === '0') {
						console.log('2')
						return string
					} else if (value < min) {
						console.log('3')
						return `0${min}`
					} else if (value > max) {
						console.log('4')
						return `${max}`
					}
				}
					break

				case 4: {
					console.error('case 4', value)
				}
					break
			}

			console.log('here')
			return `${value}`
		}
	}

	const res = dateModify.map(foo)
	console.log(res)
	return res.reverse()
	
}

const formatDate = (ctx, value) => {
	const { char } = ctx
		, separator = getSeparator(char, value)
		, dateReg = new RegExp(`[\^\\d${separator}]`, 'g')
		, clearDate = value
			.replace(dateReg, '')
			.replace(separator, '.')
			.split(separator)
		, yearIndex = clearDate.findIndex(curr => curr.length === 4)

		
	if (yearIndex > 0) clearDate.reverse()
	const date = new Date(clearDate.join(separator))

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