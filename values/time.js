export default class Time {

	constructor({ value, ctx }) {
		this.isNumber = !isNaN(+value) && !isNaN(parseFloat(value))

		console.warn('init Time', value, this.isNumber)

		this.value = this.isNumber ? value : this.parseNumber(value, ctx)
		console.log('after parse', this.value)
	}

	parseNumber(value, ctx) {
		const { mask, char } = ctx
		
		value = value
			.replace(/[^:\d]/g, '')

		const isSeparator = value.indexOf(':')
		const fn = (mask, value) => {
			const time = value.split('')
			console.log(time)

			return mask
				.split('')
				.reduceRight((acc, el) => {
					if (el === char) {
						acc.unshift(
							time.length
								? +time.splice(time.length - 1, 1)[0]
								: 0
						)
					}

					return acc
				}, [])
		}

		if (isSeparator) {
			const [h, m] = value.split(':')
				,	hLen = h.length
				,	mLen = m.length
				,	[hMask, mMask] = mask.split(':')

			// const hRes = hLen > 1 ? h : `$0{h}`
			// 	,	mRes = mRes > 1 ? m : `$0{m}`

			const hRes = fn(hMask, h)
			const mRes = fn(mMask, m)

			console.warn([...hRes, ...mRes])

		} else {

		}
			
		console.error(value)
		// value = value.split('')
		// console.log('v', value)

		
		console.log('value', value)
		const [h, m] = value.split(':')

		return Number(h) * 60 + Number(m)
	}
}