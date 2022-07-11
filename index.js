/**
 * mask type:
 * 1. phone (___)  ___-__-__ (10)
 * 2. date __.__.____ (8)
 * 3. time __:__ (4)
 */
import eventRegister from './event/register'
import Time from './values/time'

export default class Maskable {
	constructor (options = {}) {
		const { el } = options
		
		this.mask = ''
		this.char = '_'
		this.value = ''
		this.modified = ''
		this.type = null
		this.node = null
		this.isModified = false
		this.pos = {
			min: 0,
			max: 0
		}
		this.codes = {
			backspace: false,
		}

		el instanceof Node
			? this.init(options)
			: setTimeout(() => this.init(options))
	}

	get _value() {
		return this.value
	}

	get _modified() {
		return this.modified
	}

	/**
	 * Инициализация плагина
	 * @param { Object } options 
	 */
	init(options) {
		const {
			el = null,
			mask = '',
			char = '_',
			isModified = false,
		} = options

		this.node = this.getInputNode(el)
		this.isModified = isModified

		if (!this.node) {
			console.warn('[Maskable]: Элемент узла не найден.')
		} else {
			this.initProperty({ mask, char })
		}
	}

	/**
	 * Получить/определить узел input 
	 * @param { String } el 
	 * @returns node
	 */

	getInputNode(el) {
		return el instanceof Node ? el : document.querySelector(el)
	}

	/**
	 * Инициализация маски
	 * @param { Ojbect } options
	 */

	initProperty({ mask, char }) {
		char = char.replace(/ /g, '')

		if (!mask) {
			console.warn('[Maskable]: Не указан тип маски.')
		} else {
			this.char = this.getChar(char)
			this.mask = this.getMask({ mask, char: this.char })
			this.type = this.getType()
			this.pos.min = this.mask.indexOf(this.char)
			this.pos.max = this.mask.lastIndexOf(this.char) + 1

			this.setValue(this.node.value)

			// Регистрация собитий
			eventRegister(this)
		}
	}

	/**
	 * Получить/определить символы маски
	 * @param { String } char 
	 * @returns String char
	 */

	getChar(char) {
		if (!char) {
			return this.char
		} else {
			const isSymbol = (/\W/.test(char) || char === this.char)

			return isSymbol ? char : this.char
		}
	}

	getMask({ mask, char }) {
		const symbols = mask
			.replace(/ /g, '')
			.split('')
			.reduce((acc, curr) => {
				if (curr !== '' && /\D/.test(curr)) {
					acc[curr] = acc[curr]
						? [...acc[curr], curr]
						: [curr]
				}

				return acc
			}, {})
		const maxLen = Math.max(
			...Object
				.entries(symbols)
				.map(([_, arr]) => arr.length)
		)
		const charSymbol = Object
			.entries(symbols)
			.reduce((acc, [char, arr]) => {
				if (arr.length === maxLen) {
					acc = char
				}

				return acc
			}, '')
		const isExistChar = charSymbol === char
		const pattern = new RegExp(`${charSymbol}`, 'g')

		return isExistChar
			? mask
			: mask.replace(pattern, char)
	}

	/**
	 * Определить/получить тип маски
	 * @returns Number
	 */

	getType() {
		const {
			mask, char
		} = this

		return mask
			.split('')
			.filter(el => el === char)
			.length
	}

	/**
	 * Установить новое значение для input
	 * @param { String } value 
	 */

	setValue(value) {
		const { 
			type
		} = this

		console.log('setValue', type)

		switch (type) {

			// Phone
			case 10: this.setPhone(value)
				break

			// Time
			// case 4: this.setTime(value)
			case 4: new Time({
				value, ctx: this
			})
		}

	}

	setPhone(value) {
		const {
			mask, char, node
		} = this

		value = value.replace(/\+7|\D/g, '')

		if (value.length >= 11) {
			value = value.slice(0, -1)
		}

		value = value.split('')

		const finallyValue = mask
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

		node.value = this.value = finallyValue

		// Создаем модицикации значений для определенного типа
		this.modified = finallyValue.replace(/[^\+7\d]/g, '')
	}
	
	setTime(value) {
		console.warn('value', value)
		
		const {
			mask, char, node, isModified
		} = this

		console.warn('value', value)
		
		if (isModified) {

			if (!value && value !== 0) {
				this.node.value = this.value = mask
				this.modified = value
			} else {
				const isNumber = !isNaN(+value)
				// Обработываем из строки маски в числовое время
				const parseNumber = value => {
					const [h, m] = value.split(':')
	
					return Number(h) * 60 + Number(m)
				}
	
				const parseString = value => {
					value = value % 1440

					let h = Math.floor(+value / 60)
					,	m = +value % 60
	
					h = String(h).length > 1 ? String(h) : `0${h}`
					m = String(m).length > 1 ? String(m) : `0${m}`
	
					return `${h}${m}`
				}
	
				let res = isNumber
					? parseString(+value)
					: parseNumber(value)
				
				console.log('res', res)
				res = String(res).split('')

				const finallyValue = mask
					.split('')
					.map(el => {
						if (el === char) {
							return res.length
								? res.splice(0, 1)
								: char
						}

						return el
					})
					.join('')

				console.log('finallyValue', finallyValue)

				this.node.value = this.value = finallyValue
				this.modified = +value
	
				// console.log('val', this.value = isNumber ? parseString(+value) : value)
				// this.node.value = this.value = isNumber ? parseString(+value) : value
				// console.log('mod', isNumber ? +value : parseNumber(value))
				// this.modified = isNumber ? +value : parseNumber(value)
				
			}
		} else {
			if (value.length > 4) {
				value = value.slice(0, -1)
			}
			// Обработка по сути не нужна
		}

		// if (typeof +value === 'number') {
		// 	const h = Math.floor(+value / 60)
		// 		,	m = +value % 60

		// 		console.log('setTIme', value, h, m)
		// 	let hh = String(h).length > 1 ? String(h) : `0${h}`
		// 	let mm = String(m).length > 1 ? String(m) : `0${m}`

		// 	console.log(`${hh}:${mm}`)
		// 	node.value = this.value = `${hh}:${mm}`
		// 	this.modified = +value
		// }
	}
}