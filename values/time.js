export default class Time {

	constructor({ value, ctx }) {

		this.char = ctx.char
		
		const { node,  mask, char } = ctx
		this.isNumber = !isNaN(+value) && !isNaN(parseFloat(value))

		console.log('val', value)
		value = value
			.replace(/\D/g, '')
			.split('')
		const [hr1, hr2, mt1, mt2] = value
		console.warn('value', value)


		switch (value.length) {
			case 1: {
				const hours = hr1 * 10 * 60
				
				if (hours >= 1440) {
					value.splice(0, 1)
				}
			}
				break
				
			case 2: {
				console.warn((hr1 + hr2) * 60)
				const hours = +(hr1 + hr2) * 60

				if (hours >= 1440) {
					value = this.parseToString(hours)
				}
			}
				break
				
			case 3: {
				
			}
				break

			case 4: {

			}
				break
		}
		
		console.warn('afterVal', value)

		const f1 = mask
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

		node.value = ctx.value = f1
		
		return

		const f = mask
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

		// node.value = ctx.value = f
		console.log('F', f)

		const getArrayTime = f => {
			return f
				.replace(/[\D]/g, '')
				.split('')
				.map(n => +n)	
		}
		const arrayTime = getArrayTime(f)
			,	[h1, h2, m1, m2] = arrayTime
		
		const result = []

		console.log('hm', h1, h2, m1, m2, arrayTime)

		switch (arrayTime.length) {
			case 1: result.push(...(h1 * 10 * 60) >= 1440 ? [0, h1] : [h1])
				break
				
			case 2: {
				// const [first, second] = arrayTime
				// 	,	hour = +`${first}${second}` * 60

				// if (hour >= 1440) {
				// 	const [hs, ms] = this.parseToString(hour)

				// 	hArr = hs
				// 	mArr = ms
				// }

				result.push(h2)
			}
				break

			case 3: {
				// const [,, three] = arrayTime

				// if ((three * 10 * 60) >= 1440) {
				// 	console.error('AAA', three)
				// 	// hArr = hArr.reverse().map(val => val === this.char ? 0 : +val)
				// 	hArr.push(...hArr.splice(2, 1, 0))
				// }
			}
				break

			case 4: {
				// const [,, three, four] = arrayTime
				// 	, hour = +`${three}${four}` * 60

				// if (hour >= 1440) {
				// 	const [hs, ms] = this.parseToString(hour)

				// 	// hArr = hs
				// 	mArr = ms
				// }
			}
				break

		}

		console.error('result', result)

		let subValue = result.filter(n => typeof n === 'number')
		console.log('subValue', subValue)

		const f2 = mask
			.split('')
			.map(el => {
				if (el === char) {
					return subValue.length
						? subValue.splice(0, 1)
						: char
				}

				return el
			})
			.join('')

		node.value = ctx.value = f2
		



		// 1. Если приходит число, тогда парсим/модифицируем в строку (но это скорее только инициализация)
		// 2. Почти всегда будет приходить строка которую нужно обработать в правильном соотнощении

		// для 1.
		// 1.1. получить значения часов и минут


		return
		
		const times = this.isNumber
			? this.parseToString(value)
			: this.parseString(value, mask)

		console.error('[RESULT] value', times, this.isNumber)

		const finallyValue = mask
			.split('')
			.map(el => {
				if (el === char) {
					console.log('t', times.length, times)
					return times.length
						? times.splice(0, 1)
						: char
				}

				return el
			})
			.join('')

		console.warn('finallyValue', finallyValue)


		node.value = ctx.value = finallyValue
		this.modified = value
		
		
		return

		this.value = this.isNumber ? value : this.parseNumber(value, ctx)
		console.log('after parse', this.value)
	}

	parseString(value, mask) {
		value = value.replace(/[^:\d]/g, '')
		console.log('parseString', value)
		
		if (!value) {
			console.log('val', value)
			return value
		} else {
			const isSeparator = value.indexOf(':')

			if (isSeparator === -1) {
				console.warn('[Maskable]: не найден разделить ":" в строке значения')
				return mask
			} else {

				const [h, m] = value.split(':')
				
				const numericValue = Number(h) * 60 + Number(m)

				return this.parseToString(numericValue)
			}
		}
	}
	
	parseToString(value) {
		value = +value % 1440
		console.error(value, value % 60)

		const h = String(Math.floor(value / 60))
			, 	m = String(value % 60)
			,	getArrayTime = time => {
					time = String(time)
				
					return time.length === 1
						? [0, +time]
						: time.split('').map(n => +n)
				}

		return [
			...getArrayTime(h),
			...getArrayTime(m)
		]
		// return [
		// 	...this.fillValue(getArrayTime(h)),
		// 	...this.fillValue(getArrayTime(m))
		// ]
	}

	fillValue(values) {
		const fillable = new Array(2).fill(this.char)

		return fillable.reduceRight((acc, val, i) => {
			values.length === 2
				? acc.unshift(+values[i])
				: !values[i]
					? acc.push(val)
					: acc.push(+values[i])

			return acc
		}, [])
	}
	
}