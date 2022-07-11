export default class Time {

	constructor({ value, ctx }) {

		this.char = ctx.char
		
		const { node,  mask, char } = ctx
		this.isNumber = !isNaN(+value) && !isNaN(parseFloat(value))

		value = value
			.replace(/\D/g, '')
			.split('')
		
		console.log(value)

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
		const [h, m] = f.replace(/[^\d:_]/g, '').split(':')
		let hArr = h.split('')
		const hNumber = hArr.filter(n => !isNaN(+n))
		const mArr = m.split('')

		if (hNumber.length === 1) {
			const [hour] = hNumber
			console.error(hour)

			if ((+`${hour}0` * 60) > 1440) {
				hArr = hArr.reverse().map(val => val === this.char ? 0 : +val)
			} else {
				hArr = hArr.map(val => val === this.char ? this.char : +val)
			}

			console.log(hArr)
		} else {
			console.log('2', hArr)
			hArr = hArr.map(val => val === this.char ? this.char : +val)
		}

		
		console.log('hm: ', { hArr, mArr }, hNumber)

		let subValue = [...hArr, ...mArr].filter(n => typeof n === 'number')
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
		console.error(value)

		const h = Math.floor(value / 60)
			, m = value % 60
			, hArr = String(h).split('')
			, mArr = String(m).split('')

		console.log('__', value, hArr, mArr)

		return [...this.fillValue(hArr), ...this.fillValue(mArr)]
	}

	fillValue(values) {
		console.log('this', values)
		const fillable = new Array(2).fill(this.char)

		return fillable.reduceRight((acc, val, i) => {

			console.log('+values[i]', values[i] , +values[i])
			values.length === 2
				? acc.unshift(+values[i])
				: !values[i]
					? acc.push(val)
					: acc.push(+values[i])

			return acc

		}, [])
	}
	
}